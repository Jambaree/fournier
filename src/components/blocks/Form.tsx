import type { ACFBlock } from "@/lib/wordpress";
import GravityFormBlock from "@/components/gravity-form/GravityFormBlock";

export default function Form({ formid }: ACFBlock) {
  if (!formid) return null;

  return (
    <section className="text-gray-600 pb-16">
      <div className="container px-5 pt-10 mx-auto">
        <div className="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end justify-center">
          <GravityFormBlock formId={formid} />
        </div>
      </div>
    </section>
  );
}
