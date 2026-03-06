import type { ACFBlock } from "@/lib/wordpress";
import Button from "./Button";

export default function AngledImage({ headline, image, text, buttons }: ACFBlock) {
  return (
    <div className="relative flex flex-col-reverse py-10 lg:pt-0 lg:flex-col lg:pb-0">
      <div className="inset-y-0 top-0 right-0 z-0 w-full max-w-xl px-4 mx-auto md:px-0 lg:pr-0 lg:mb-0 lg:mx-0 lg:w-7/12 lg:max-w-full lg:absolute xl:px-0">
        <svg
          className="absolute left-0 hidden h-full text-white transform -translate-x-1/2 lg:block z-10"
          viewBox="0 0 100 100"
          fill="currentColor"
          preserveAspectRatio="none slice"
        >
          <path d="M50 0H100L50 100H0L50 0Z" />
        </svg>
        {image ? (
          <img
            src={image.sourceUrl}
            alt={image.altText || ""}
            className="object-cover w-full h-56 rounded shadow-lg lg:rounded-none lg:shadow-none md:h-96 lg:h-full"
          />
        ) : (
          <div className="w-full h-56 md:h-96 lg:h-full bg-gray-300 rounded shadow-lg lg:rounded-none lg:shadow-none" />
        )}
      </div>
      <div className="relative flex flex-col items-start w-full max-w-xl px-4 mx-auto md:px-0 lg:px-8 lg:max-w-screen-xl">
        <div className="mb-16 lg:my-40 lg:max-w-lg lg:pr-5">
          {headline && (
            <h2
              className="mb-5 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
          )}
          {text && (
            <p
              className="pr-5 mb-5 text-base text-gray-700 md:text-lg"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
          {buttons && buttons.length > 0 && (
            <div className="flex items-center gap-4">
              {buttons.map((o, i) => (
                <Button key={i} {...o.button} variant={o.variant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
