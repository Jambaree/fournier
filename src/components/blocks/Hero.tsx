import type { ACFBlock } from "@/lib/wordpress";
import Button from "./Button";

export default function Hero({ image, headline, subline, buttons, alignment, bgcolor }: ACFBlock) {
  return (
    <section className={`bg-gray-800 text-white pb-16`}>
      <div className="w-full mx-auto flex items-center justify-center flex-col">
        <div className="w-full mb-4 md:mb-8">
          {image ? (
            <img
              src={image.sourceUrl}
              alt={image.altText || ""}
              className="object-cover h-full w-full mb-10"
            />
          ) : (
            <div className="w-full h-64 bg-gray-300 mb-10" />
          )}
        </div>
        <div className={`${alignment === "Center" ? "text-center" : "text-start"} lg:w-2/3 w-5/6`}>
          {headline && (
            <h1
              className="font-black sm:text-4xl text-3xl pb-4 text-white"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
          )}
          {subline && (
            <div
              className="prose prose-invert max-w-none my-8"
              dangerouslySetInnerHTML={{ __html: subline }}
            />
          )}
          {buttons && buttons.length > 0 && (
            <div className="flex justify-center py-5 w-full gap-4">
              {buttons.map((obj, i) => (
                <Button key={i} {...obj.button} variant={obj.variant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
