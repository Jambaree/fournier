import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/wordpress";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rfautogroup.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getAllPages();

  return pages.map((page) => ({
    url: `${SITE_URL}${page.uri}`,
    lastModified: new Date(),
    changeFrequency: page.uri === "/" ? "weekly" : "monthly",
    priority: page.uri === "/" ? 1 : 0.8,
  }));
}
