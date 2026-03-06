import type { ACFBlock } from "@/lib/wordpress";
import Button from "./Button";

export default function Hero({ image, headline, subline, buttons, alignment, bgcolor }: ACFBlock) {
  const bgClass = bgcolor ? `bg-${bgcolor}` : "bg-background-one";

  return (
    <section className={`${bgClass} text-primary-contrast pb-16`}>
      <div className="w-full mx-auto flex items-center justify-center flex-col">
        <div className="w-full mb-2 md:mb-8">
          {image ? (
            <img
              src={image.sourceUrl}
              alt={image.altText || ""}
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
              className="prose prose-invert max-w-none my-8 text-start [&_p]:text-white [&_h2]:text-white [&_h2]:font-black [&_h2]:text-4xl [&_h3]:text-white [&_h3]:font-bold [&_ol>li::before]:text-white [&_ul>li::before]:bg-white"
              dangerouslySetInnerHTML={{ __html: subline }}
            />
          )}
          {buttons && buttons.length > 0 && (
            <div className={`flex justify-center py-5 w-full gap-4`}>
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
