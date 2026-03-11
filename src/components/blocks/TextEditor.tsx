import type { ACFBlock, TextEditorFlex, WPImage } from "@/lib/wordpress";

export default function TextEditor({ flex }: ACFBlock) {
  const items = flex as TextEditorFlex[] | undefined;

  return (
    <div className="mx-auto w-5/6 m-0 lg:w-2/3">
      {items?.map((block, i) => {
        const raw = block as Record<string, unknown>;
        const id = (raw.acf_fc_layout as string) || ((raw.fieldGroupName as string) || "").split("_").pop()?.toLowerCase();

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
                <div className="grid max-w-screen-lg gap-8 gap-y-5 md:gap-y-8 sm:mx-auto lg:grid-cols-2">
                  <div className={b.alignment === "left" ? "order-1" : "order-3"}>
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
                  className={`grid max-w-screen-lg gap-8 gap-y-5 md:gap-y-8 sm:mx-auto ${b.columns === 2 ? "lg:grid-cols-2" : b.columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
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
              <div key={i} className="container py-10 mx-auto">
                <div className="w-full mx-auto text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="inline-block w-8 h-8 text-gray-400 mb-8"
                    viewBox="0 0 975.036 975.036"
                  >
                    <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z" />
                  </svg>
                  {b.text && (
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{ __html: b.text }}
                    />
                  )}
                  <span className="inline-block h-1 w-10 rounded bg-secondary mt-8 mb-6" />
                  {b.author && (
                    <h2 className="text-gray-900 font-medium title-font tracking-wider text-sm">{b.author}</h2>
                  )}
                  {b.position && <p className="text-gray-500">{b.position}</p>}
                </div>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
