import type { ACFBlock } from "@/lib/wordpress";

export default function Content({ image, headline, subline }: ACFBlock) {
  const hasSubline = subline && subline.length > 8;

  return (
    <section className="text-secondary-contrast body-font pb-16">
      <div
        className={`w-full mx-auto flex ${hasSubline ? "pb-10" : "pb-0"} items-center justify-center flex-col`}
      >
        <div className="w-full h-full">
          {image ? (
            <img
              src={image.sourceUrl}
              alt={image.altText || "hero"}
              className={`object-cover h-full w-full ${headline && headline.length !== 0 ? "mb-10" : "mb-0"}`}
            />
          ) : (
            <img
              className={`object-fit w-full ${headline && headline.length !== 0 ? "mb-10" : "mb-0"}`}
              alt="hero"
              src="https://dummyimage.com/1620x140"
            />
          )}
        </div>
        <div className="text-secondary-contrast text-start lg:w-2/3 w-5/6 m-0">
          {headline && headline.length !== 0 && (
            <h1
              className="font-black sm:text-4xl text-3xl my-6 font-medium text-background-one"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
          )}
          {hasSubline && (
            <div
              className="prose max-w-full text-start [&]:text-[rgba(0,0,0,0.85)] [&_ol>li::before]:text-[rgba(0,0,0,0.85)] [&_ul>li::before]:bg-[rgba(0,0,0,0.85)]"
              dangerouslySetInnerHTML={{ __html: subline }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
