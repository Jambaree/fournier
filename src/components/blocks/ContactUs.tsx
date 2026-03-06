import type { ACFBlock, FormFlex } from "@/lib/wordpress";
import GravityFormBlock from "@/components/gravity-form/GravityFormBlock";

export default function ContactUs({ headline, subline, text, email, phone, address, link, flex }: ACFBlock) {
  const formBlock = flex?.find((f) => "formid" in f) as FormFlex | undefined;

  return (
    <section className="text-gray-600 relative pb-16">
      <div className="container px-5 pt-10 mx-auto flex sm:flex-nowrap flex-wrap">
        <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
          {link?.url && (
            <iframe
              width="100%"
              height="100%"
              className="absolute inset-0"
              title="map"
              scrolling="no"
              src={link.url}
              style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
            />
          )}
          <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md w-full">
            <div className="lg:w-1/2 px-2 md:px-6 mt-4 lg:mt-0 break-all">
              <h2 className="font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
              {address && (
                <p
                  className="mt-1 text-xs md:text-base"
                  dangerouslySetInnerHTML={{ __html: address }}
                />
              )}
            </div>
            <div className="lg:w-1/2 px-2 md:px-6 mt-4 lg:mt-0 break-all">
              <h2 className="font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
              {email && (
                <a
                  href={`mailto:${email.trim()}`}
                  className="text-indigo-500 leading-relaxed text-xs md:text-base"
                >
                  {email.trim()}
                </a>
              )}
              <h2 className="font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="text-indigo-500 leading-relaxed text-xs md:text-base"
                >
                  {phone}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
          {headline && (
            <h2
              className="text-gray-900 text-lg mb-1 font-medium"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
          )}
          {text && (
            <p
              className="leading-relaxed mb-5 text-gray-600"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
          {formBlock?.formid && (
            <div className="relative mb-4">
              <GravityFormBlock formId={formBlock.formid} compact />
            </div>
          )}
          {subline && (
            <p
              className="text-xs text-gray-500 mt-3"
              dangerouslySetInnerHTML={{ __html: subline }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
