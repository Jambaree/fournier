import type { ACFBlock } from "@/lib/wordpress";

export default function Content({ image, headline, subline }: ACFBlock) {
  const hasSubline = subline && subline.length > 8;

  return (
    <section className="text-gray-800 pb-16">
      <div
        className={`w-full mx-auto flex ${hasSubline ? "pb-10" : "pb-0"} items-center justify-center flex-col`}
      >
        <div className="w-full">
          {image ? (
            <img
              src={image.sourceUrl}
              alt={image.altText || ""}
              className={`object-cover h-full w-full ${headline ? "mb-10" : "mb-0"}`}
            />
          ) : (
            <div className={`w-full h-36 bg-gray-200 ${headline ? "mb-10" : "mb-0"}`} />
          )}
        </div>
        <div className="text-start lg:w-2/3 w-5/6">
          {headline && (
            <h1
              className="font-black sm:text-4xl text-3xl my-6"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
          )}
          {hasSubline && (
            <div
              className="prose max-w-none text-start"
              dangerouslySetInnerHTML={{ __html: subline }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
