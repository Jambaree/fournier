import type { ACFBlock } from "@/lib/wordpress";
import Button from "./Button";

export default function TextImage({ image, headline, text, buttons, alignment }: ACFBlock) {
  const imageFirst = alignment === "left";

  return (
    <div className="py-8">
      <div className="grid mx-auto w-5/6 lg:w-2/3 gap-0 sm:mx-auto lg:grid-cols-2 xl:grid-cols-3">
        <div
          className="w-full"
          style={{
            gridColumnStart: imageFirst ? 1 : undefined,
            gridRowStart: 1,
          }}
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
          className="w-full pt-10 lg:p-8 xl:col-span-2"
          style={{ gridRowStart: 1 }}
        >
          {headline && (
            <h2
              className="text-2xl mb-4 font-medium text-gray-900"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
          )}
          {text && (
            <div
              className="prose max-w-none text-start"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
          {buttons && buttons.length > 0 && (
            <div className="flex justify-start mt-8 gap-4">
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
