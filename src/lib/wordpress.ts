const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL!;
const WP_API = `${WP_URL}/wp-json/wp/v2`;

// --- Image resolution ---

export type WPImage = {
  sourceUrl: string;
  altText: string;
};

const imageCache = new Map<number, WPImage>();

async function resolveImage(id: number): Promise<WPImage | null> {
  if (!id) return null;
  if (imageCache.has(id)) return imageCache.get(id)!;

  try {
    const res = await fetch(`${WP_API}/media/${id}?_fields=id,source_url,alt_text`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const media = await res.json();
    const img: WPImage = {
      sourceUrl: media.source_url,
      altText: media.alt_text || "",
    };
    imageCache.set(id, img);
    return img;
  } catch {
    return null;
  }
}

async function resolveImages(ids: number[]): Promise<Map<number, WPImage>> {
  const unique = [...new Set(ids.filter(Boolean))];
  const uncached = unique.filter((id) => !imageCache.has(id));

  if (uncached.length > 0) {
    // Batch fetch in groups of 100 (WP REST API limit)
    for (let i = 0; i < uncached.length; i += 100) {
      const batch = uncached.slice(i, i + 100);
      try {
        const res = await fetch(
          `${WP_API}/media?include=${batch.join(",")}&per_page=100&_fields=id,source_url,alt_text`,
          { next: { revalidate: 300 } }
        );
        if (res.ok) {
          const items = await res.json();
          for (const m of items) {
            const img: WPImage = { sourceUrl: m.source_url, altText: m.alt_text || "" };
            imageCache.set(m.id, img);
          }
        }
      } catch {
        // Fall back to individual fetches
        await Promise.all(batch.map(resolveImage));
      }
    }
  }

  const result = new Map<number, WPImage>();
  for (const id of unique) {
    const img = imageCache.get(id);
    if (img) result.set(id, img);
  }
  return result;
}

// --- Collect all image IDs from blocks ---

function collectImageIds(blocks: RawACFBlock[]): number[] {
  const ids: number[] = [];

  for (const block of blocks) {
    if (typeof block.image === "number") ids.push(block.image);

    // Items with images (postcards, etc.)
    if (Array.isArray(block.items)) {
      for (const item of block.items) {
        if (typeof item === "object" && item !== null && typeof (item as Record<string, unknown>).image === "number") {
          ids.push((item as Record<string, unknown>).image as number);
        }
      }
    }

    // Nested flex (texteditor, contactus, cta)
    if (Array.isArray(block.flex)) {
      for (const sub of block.flex) {
        if (typeof sub === "object" && sub !== null) {
          const s = sub as Record<string, unknown>;
          if (typeof s.image === "number") ids.push(s.image);
          if (Array.isArray(s.gallery)) {
            for (const g of s.gallery) {
              if (typeof g === "number") ids.push(g);
            }
          }
        }
      }
    }
  }

  return ids;
}

// --- Transform raw REST blocks to normalized format ---

type RawACFBlock = {
  acf_fc_layout: string;
  [key: string]: unknown;
};

function mapLayoutToTypename(layout: string): string {
  return layout;
}

async function normalizeBlocks(rawBlocks: RawACFBlock[]): Promise<ACFBlock[]> {
  // Collect and batch-resolve all image IDs
  const imageIds = collectImageIds(rawBlocks);
  const images = await resolveImages(imageIds);

  const blocks: ACFBlock[] = [];

  for (const raw of rawBlocks) {
    const block: ACFBlock = {
      __typename: mapLayoutToTypename(raw.acf_fc_layout),
    };

    // Copy known fields
    if (raw.headline !== undefined) block.headline = raw.headline as string;
    if (raw.subline !== undefined) block.subline = raw.subline as string;
    if (raw.alignment !== undefined) block.alignment = raw.alignment as string;
    if (raw.bgcolor !== undefined) block.bgcolor = raw.bgcolor as string;
    if (raw.text !== undefined) block.text = raw.text as string;
    if (raw.email !== undefined) block.email = raw.email as string;
    if (raw.phone !== undefined) block.phone = raw.phone as string;
    if (raw.address !== undefined) block.address = raw.address as string;
    if (raw.introduction !== undefined) block.introduction = raw.introduction as string;
    if (raw.columns !== undefined) block.columns = raw.columns as number;
    if (raw.formid !== undefined) block.formid = raw.formid as number;

    // Resolve image
    if (typeof raw.image === "number") {
      block.image = images.get(raw.image) || null;
    }

    // Resolve link
    if (raw.link && typeof raw.link === "object") {
      block.link = raw.link as AcfLink;
    }

    // Resolve buttons
    if (Array.isArray(raw.buttons)) {
      block.buttons = raw.buttons as AcfButton[];
    }

    // Resolve items (postcards, reviews, cards, downloads, resources)
    if (Array.isArray(raw.items)) {
      block.items = await Promise.all(
        raw.items.map(async (item: Record<string, unknown>) => {
          const normalized = { ...item };
          if (typeof item.image === "number") {
            normalized.image = images.get(item.image) || null;
          }
          return normalized;
        })
      );
    }

    // Resolve nested flex (texteditor, contactus, cta)
    if (Array.isArray(raw.flex)) {
      block.flex = await Promise.all(
        raw.flex.map(async (sub: Record<string, unknown>) => {
          const normalized: Record<string, unknown> = { ...sub };

          // Map acf_fc_layout to a recognizable identifier
          if (sub.acf_fc_layout) {
            normalized.acf_fc_layout = sub.acf_fc_layout;
          }

          // Resolve image in sub-blocks
          if (typeof sub.image === "number") {
            normalized.image = images.get(sub.image) || null;
          }

          // Resolve gallery images
          if (Array.isArray(sub.gallery)) {
            normalized.gallery = sub.gallery.map((g: unknown) => {
              if (typeof g === "number") return images.get(g) || null;
              return g;
            }).filter(Boolean);
          }

          return normalized;
        })
      );
    }

    blocks.push(block);
  }

  return blocks;
}

// --- Page fetching ---

export async function getPageByUri(uri: string): Promise<WPPage | null> {
  // Determine slug from URI
  let slug: string;
  const cleanUri = uri.replace(/^\/|\/$/g, "");

  if (!cleanUri || cleanUri === "") {
    // Home page — look up the front page ID from settings
    try {
      const settingsRes = await fetch(`${WP_URL}/wp-json`, { next: { revalidate: 60 } });
      const settings = await settingsRes.json();
      const frontPageId = settings.page_on_front;

      if (frontPageId) {
        const res = await fetch(
          `${WP_API}/pages/${frontPageId}?_fields=id,title,slug,link,content,acf,yoast_head_json`,
          { next: { revalidate: 60 } }
        );
        if (!res.ok) return null;
        const page = await res.json();
        return await transformPage(page, "/");
      }
    } catch {
      return null;
    }
    return null;
  }

  // For nested slugs like "vehicle-valuations/pst-vehicle-appraisals", take last segment
  const segments = cleanUri.split("/");
  slug = segments[segments.length - 1];

  const res = await fetch(
    `${WP_API}/pages?slug=${encodeURIComponent(slug)}&_fields=id,title,slug,link,content,acf,yoast_head_json`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;
  const pages = await res.json();
  if (!pages || pages.length === 0) return null;

  // If multiple results, find the one matching the full URI
  let page = pages[0];
  if (pages.length > 1) {
    const match = pages.find((p: { link: string }) => {
      const pageUri = new URL(p.link).pathname;
      return pageUri === uri || pageUri === `/${cleanUri}/`;
    });
    if (match) page = match;
  }

  return await transformPage(page, uri);
}

async function transformPage(raw: Record<string, unknown>, uri: string): Promise<WPPage> {
  const title = (raw.title as { rendered: string })?.rendered || "";
  const content = (raw.content as { rendered: string })?.rendered || "";
  const slug = raw.slug as string || "";
  const yoast = raw.yoast_head_json as Record<string, unknown> | undefined;

  // Transform ACF blocks
  let blocks: ACFBlock[] | undefined;
  const acf = raw.acf as { blocks?: { flex?: RawACFBlock[] } } | undefined;
  if (acf?.blocks?.flex && Array.isArray(acf.blocks.flex) && acf.blocks.flex.length > 0) {
    blocks = await normalizeBlocks(acf.blocks.flex);
  }

  // Transform Yoast SEO
  let seo: YoastSEO | undefined;
  if (yoast) {
    seo = {
      title: (yoast.title as string) || title,
      metaDesc: (yoast.og_description as string) || "",
      canonical: (yoast.canonical as string) || "",
      opengraphTitle: (yoast.og_title as string) || "",
      opengraphDescription: (yoast.og_description as string) || "",
      opengraphImage: yoast.og_image
        ? { sourceUrl: ((yoast.og_image as Record<string, string>[])?.[0]?.url) || "", altText: "" }
        : null,
      opengraphSiteName: (yoast.og_site_name as string) || "",
      opengraphType: (yoast.og_type as string) || "website",
      schema: yoast.schema ? { raw: JSON.stringify(yoast.schema) } : { raw: "" },
    };
  }

  return {
    id: String(raw.id || ""),
    title,
    slug,
    uri,
    content,
    seo,
    blocks,
  };
}

export async function getAllPages(): Promise<{ uri: string }[]> {
  const allPages: { uri: string }[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `${WP_API}/pages?per_page=100&page=${page}&_fields=id,link`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) break;
    const pages = await res.json();
    if (!pages || pages.length === 0) break;

    const wpUrl = new URL(WP_URL);

    for (const p of pages) {
      const link = p.link as string;
      const url = new URL(link);
      // Convert WP link to relative URI
      let uri = url.pathname;
      // Skip if it's the WP domain and just strip the path
      if (url.hostname === wpUrl.hostname) {
        uri = url.pathname;
      }
      allPages.push({ uri });
    }

    // Check if there are more pages
    const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1");
    if (page >= totalPages) break;
    page++;
  }

  return allPages;
}

export async function getSiteSettings() {
  const res = await fetch(`${WP_URL}/wp-json`, { next: { revalidate: 60 } });
  const data = await res.json();

  return {
    title: data.name || "",
    description: data.description || "",
    url: data.url || WP_URL,
  };
}

// --- Types ---

export type AcfLink = {
  title: string;
  url: string;
  target: string | boolean;
};

export type AcfButton = {
  variant: string;
  button: AcfLink;
};

export type TextEditorFlex =
  | { acf_fc_layout: string; text: string; [key: string]: unknown }
  | { acf_fc_layout: string; text: string; alignment: string; image: WPImage; [key: string]: unknown }
  | { acf_fc_layout: string; columns: number; gallery: WPImage[]; [key: string]: unknown }
  | { acf_fc_layout: string; url: string; [key: string]: unknown }
  | { acf_fc_layout: string; author: string; position: string; text: string; [key: string]: unknown };

export type FormFlex = {
  acf_fc_layout: string;
  formid: number;
};

export type ACFBlock = {
  __typename: string;
  fieldGroupName?: string;
  headline?: string;
  subline?: string;
  alignment?: string;
  bgcolor?: string;
  image?: WPImage | null;
  buttons?: AcfButton[];
  columns?: number;
  introduction?: string;
  items?: Record<string, unknown>[];
  text?: string;
  flex?: (TextEditorFlex | FormFlex | Record<string, unknown>)[];
  email?: string;
  phone?: string;
  address?: string;
  link?: AcfLink;
  formid?: number;
};

export type YoastSEO = {
  title: string;
  metaDesc: string;
  canonical: string;
  opengraphTitle: string;
  opengraphDescription: string;
  opengraphImage: WPImage | null;
  opengraphSiteName: string;
  opengraphType: string;
  schema: { raw: string };
};

export type WPPage = {
  id: string;
  title: string;
  slug: string;
  uri: string;
  content: string;
  seo?: YoastSEO;
  blocks?: ACFBlock[];
};
