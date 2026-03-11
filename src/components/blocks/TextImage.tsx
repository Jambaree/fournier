import type { ACFBlock } from "@/lib/wordpress";
import Button from "./Button";

export default function TextImage({ image, headline, text, buttons, alignment }: ACFBlock) {
  const imageFirst = alignment === "left";

  return (
    <div className="py-8">
      <div className="grid mx-auto w-5/6 m-0 lg:w-2/3 gap-0 gap-y-5 md:gap-y-8 sm:mx-auto lg:grid-cols-2 xl:grid-cols-3">
        <div
          className={`w-full ${imageFirst ? "lg:col-start-1 xl:col-start-1" : "lg:col-start-2 xl:col-start-3"} lg:row-start-1`}
        >
          {image && (
            <img
              src={image.sourceUrl}
              alt={image.altText || ""}
              className="object-cover object-center rounded w-full h-full"
            />
          )}
        </div>
        <div
          className={`w-full pt-10 lg:p-[30px] ${imageFirst ? "lg:col-start-2 lg:col-end-3 xl:col-start-2 xl:col-end-4" : "lg:col-start-1 lg:col-end-2 xl:col-start-1 xl:col-end-3"} xl:row-start-1`}
        >
          {headline && (
            <h2
              className="title-font sm:text-l text-2xl mb-4 font-medium text-gray-900"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
          )}
          {text && (
            <div
              className="prose max-w-full text-start [&]:text-[rgba(0,0,0,0.85)] [&_ol>li::before]:text-[rgba(0,0,0,0.85)] [&_ul>li::before]:bg-[rgba(0,0,0,0.85)]"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
          {buttons && buttons.length > 0 && (
            <div className="flex justify-left mt-8">
              {buttons.map((obj, i) => (
                <Button key={i} {...obj.button} variant={obj.variant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
