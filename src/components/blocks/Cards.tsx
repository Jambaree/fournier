import type { ACFBlock, AcfLink } from "@/lib/wordpress";
import Button from "./Button";

type CardItem = {
  headline: string;
  text: string;
  link: AcfLink;
};

export default function Cards({ introduction, columns, items }: ACFBlock) {
  const cardItems = items as unknown as CardItem[] | undefined;
  const cols = columns || 3;

  return (
    <div className="bg-gray-50">
      <div className="px-4 py-10 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        {introduction && (
          <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
            <div
              className="prose lg:prose-xl"
              dangerouslySetInnerHTML={{ __html: introduction }}
            />
          </div>
        )}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${Math.min(cols, 4)}, minmax(0, 1fr))` }}
        >
          {cardItems?.map((o, i) => (
            <div key={i} className="flex flex-col justify-between p-5 border rounded shadow-sm bg-white">
              <div>
                {o.headline && <h6 className="mb-3 text-xl font-bold leading-5">{o.headline}</h6>}
                {o.text && <p className="mb-3 text-sm text-gray-900">{o.text}</p>}
                {o.link && <Button {...o.link} variant="text" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
