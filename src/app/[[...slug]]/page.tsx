import { notFound } from "next/navigation";
import { getPageByUri, getAllPages } from "@/lib/wordpress";
import BlockRenderer from "@/components/blocks/BlockRenderer";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams() {
  const pages = await getAllPages();

  return pages.map((page) => ({
    slug: page.uri === "/" ? undefined : page.uri.replace(/^\/|\/$/g, "").split("/"),
  }));
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
  );
}
