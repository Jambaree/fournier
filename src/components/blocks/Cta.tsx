import type { ACFBlock, FormFlex } from "@/lib/wordpress";
import GravityFormBlock from "@/components/gravity-form/GravityFormBlock";

export default function Cta({ headline, text, flex }: ACFBlock) {
  const formBlock = flex?.find((f) => "formid" in f) as FormFlex | undefined;

  return (
    <section className="text-gray-600 body-font pb-16">
      <div className="container px-5 pt-10 mx-auto">
        <div className="flex flex-col text-center w-full mb-12 justify-center">
          {headline && (
            <h1
              className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
          )}
          {text && (
            <p
              className="lg:w-2/3 mx-auto leading-relaxed text-base"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </div>
        <div className="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end justify-center">
          {formBlock?.formid && <GravityFormBlock formId={formBlock.formid} compact />}
        </div>
      </div>
    </section>
  );
}
