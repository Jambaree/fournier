import type { ACFBlock, AcfButton } from "@/lib/wordpress";
import Button from "./Button";

type ResourceItem = {
  headline: string;
  buttons: AcfButton[];
};

export default function Resources({ items }: ACFBlock) {
  const resourceItems = items as unknown as ResourceItem[] | undefined;

  return (
    <section className="text-gray-600 body-font pb-16">
      {resourceItems?.map((o, idx) => (
        <div key={idx} className="container px-5 py-10 mx-auto">
          <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
            {o.headline && (
              <h1
                className="flex-grow mb-6 md:mb-0 sm:pr-16 text-2xl font-medium title-font text-gray-900"
                dangerouslySetInnerHTML={{ __html: o.headline }}
              />
            )}
            {o.buttons &&
              o.buttons.length > 0 &&
              o.buttons.map((obj, i) => (
                <Button
                  key={i}
                  {...obj.button}
                  variant={obj.variant}
                />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
