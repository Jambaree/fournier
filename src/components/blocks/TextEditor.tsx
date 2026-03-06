import type { ACFBlock, TextEditorFlex, WPImage } from "@/lib/wordpress";

export default function TextEditor({ flex }: ACFBlock) {
  const items = flex as TextEditorFlex[] | undefined;

  return (
    <div className="mx-auto w-5/6 m-0 lg:w-2/3">
      {items?.map((block, i) => {
        const id = block.fieldGroupName?.split("_").pop()?.toLowerCase();

        switch (id) {
          case "text":
            return (
              <div key={i} className="prose max-w-full text-start pb-16">
                <div dangerouslySetInnerHTML={{ __html: (block as { text: string }).text }} />
              </div>
            );

          case "textimage": {
            const b = block as { text: string; alignment: string; image: WPImage };
            return (
              <div key={i} className="py-8">
                <div className="grid max-w-screen-lg gap-8 row-gap-5 md:row-gap-8 sm:mx-auto lg:grid-cols-2">
                  <div className={`order-${b.alignment === "left" ? "1" : "3"}`}>
                    {b.image && (
                      <img
                        src={b.image.sourceUrl}
                        alt={b.image.altText || ""}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="order-2">
                    {b.text && (
                      <div
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: b.text }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          }

          case "gallery": {
            const b = block as { columns: number; gallery: WPImage[] };
            return (
              <div key={i} className="py-8">
                <div
                  className={`grid max-w-screen-lg gap-8 row-gap-5 md:row-gap-8 sm:mx-auto lg:grid-cols-${b.columns || 3}`}
                >
                  {b.gallery?.map((img, j) => (
                    <div key={j}>
                      <img
                        src={img.sourceUrl}
                        alt={img.altText || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          case "embed": {
            const b = block as { url: string };
            return (
              <div key={i} className="py-8">
                {b.url && (
                  <iframe
                    src={b.url}
                    className="w-full aspect-video"
                    allowFullScreen
                    title="Embedded content"
                  />
                )}
              </div>
            );
          }

          case "quote": {
            const b = block as { author: string; position: string; text: string };
            return (
              <blockquote key={i} className="py-8 border-l-4 border-gray-300 pl-4">
                {b.text && <p className="text-lg italic">{b.text}</p>}
                {b.author && (
                  <cite className="block mt-2 text-sm text-gray-600 not-italic">
                    — {b.author}
                    {b.position && `, ${b.position}`}
                  </cite>
                )}
              </blockquote>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
