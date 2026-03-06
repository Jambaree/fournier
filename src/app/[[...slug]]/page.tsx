import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageByUri, getAllPages } from "@/lib/wordpress";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import YoastHead from "@/components/seo/YoastHead";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams() {
  const pages = await getAllPages();

  return pages.map((page) => ({
    slug: page.uri === "/" ? undefined : page.uri.replace(/^\/|\/$/g, "").split("/"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const uri = slug ? `/${slug.join("/")}/` : "/";
  const page = await getPageByUri(uri);

  if (!page) return {};

  const seo = page.seo;

  return {
    title: seo?.title || page.title,
    description: seo?.metaDesc || undefined,
    ...(seo?.canonical && { alternates: { canonical: seo.canonical } }),
    openGraph: {
      title: seo?.opengraphTitle || seo?.title || page.title,
      description: seo?.opengraphDescription || seo?.metaDesc || undefined,
      siteName: seo?.opengraphSiteName || "Fournier Auto Group",
      type: (seo?.opengraphType as "website" | "article") || "website",
      ...(seo?.opengraphImage?.sourceUrl && {
        images: [{ url: seo.opengraphImage.sourceUrl }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.opengraphTitle || seo?.title || page.title,
      description: seo?.opengraphDescription || seo?.metaDesc || undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const uri = slug ? `/${slug.join("/")}/` : "/";
  const page = await getPageByUri(uri);

  if (!page) {
    notFound();
  }

  const blocks = page.template?.acf?.blocks?.flex;

  return (
    <>
      {page.seo?.schema?.raw && <YoastHead schema={page.seo.schema.raw} />}
      <main>
        {blocks && blocks.length > 0 ? (
          <BlockRenderer blocks={blocks} />
        ) : (
          <section className="py-12">
            <div className="container mx-auto max-w-4xl px-5">
              <h1 className="mb-8 text-4xl font-bold">{page.title}</h1>
              {page.content && (
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
