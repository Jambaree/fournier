import type { ACFBlock, AcfButton, WPImage } from "@/lib/wordpress";
import Button from "./Button";

type PostcardItem = {
  headline: string;
  text: string;
  image: WPImage;
  buttons: AcfButton[];
};

export default function Postcards({ items, bgcolor }: ACFBlock) {
  const postcardItems = items as unknown as PostcardItem[] | undefined;

  return (
    <section className={`bg-${bgcolor || "gray-600"} text-primary-contrast body-font pb-16`}>
      <div className="container px-5 py-10 mx-auto">
        <div className="flex flex-wrap -mx-4 -mb-10 text-center">
          {postcardItems?.map((o, idx) => (
            <div key={idx} className="sm:w-1/2 mb-10 px-4">
              <div className="h-80 overflow-hidden">
                {o.image ? (
                  <img
                    src={o.image.sourceUrl}
                    alt={o.image.altText || "content"}
                    className="object-cover object-center h-full w-full"
                  />
                ) : (
                  <img
                    alt="content"
                    className="object-cover object-center h-full w-full"
                    src="https://dummyimage.com/1201x501"
                  />
                )}
              </div>
              {o.headline && (
                <h2
                  className="text-2xl font-black text-white mt-6 mb-3"
                  dangerouslySetInnerHTML={{ __html: o.headline }}
                />
              )}
              {o.text && (
                <p
                  className="leading-relaxed text-base"
                  dangerouslySetInnerHTML={{ __html: o.text }}
                />
              )}
              <div
                className={`flex items-center ${o.buttons && o.buttons.length > 0 ? "pt-5" : ""} justify-center align-middle`}
              >
                {o.buttons &&
                  o.buttons.length > 0 &&
                  o.buttons.map((obj, i) => (
                    <Button key={i} {...obj.button} variant={obj.variant} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
