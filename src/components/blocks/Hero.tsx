import type { ACFBlock } from "@/lib/wordpress";
import Button from "./Button";

export default function Hero({ image, headline, subline, buttons, alignment, bgcolor }: ACFBlock) {
  return (
    <section className={`bg-${bgcolor || "gray-600"} text-primary-contrast body-font pb-16`}>
      <div className="w-full mx-auto flex items-center justify-center flex-col">
        <div className="w-full mb-[10px] md:mb-[30px]">
          {image ? (
            <img
              src={image.sourceUrl}
              alt={image.altText || "hero"}
              className="object-cover h-full w-full mb-10"
            />
          ) : (
            <img className="object-fit w-full mb-10" alt="hero" src="https://dummyimage.com/1620x550" />
          )}
        </div>
        <div className={`${alignment === "Center" ? "text-center" : "text-start"} lg:w-2/3 w-5/6`}>
          {headline && (
            <h1
              className="font-black sm:text-4xl text-3xl pb-4 text-primary-contrast"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
          )}
          {subline && (
            <div
              className="prose my-[30px] max-w-full text-start [&_p]:text-white [&_h1]:text-[#060606] [&_h1]:font-black [&_h2]:text-white [&_h2]:font-black [&_h2]:text-[2.25em] [&_h3]:text-white [&_h3]:font-bold [&_ol>li::before]:text-white [&_ul>li::before]:bg-white"
              dangerouslySetInnerHTML={{ __html: subline }}
            />
          )}
          <div className={`flex justify-center ${buttons && buttons.length > 0 ? "py-5" : ""} w-full`}>
            {buttons &&
              buttons.length > 0 &&
              buttons.map((obj, i) => (
                <Button key={i} {...obj.button} variant={obj.variant} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
