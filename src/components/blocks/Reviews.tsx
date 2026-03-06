import type { ACFBlock, AcfButton } from "@/lib/wordpress";
import Button from "./Button";

type ReviewItem = {
  person: string;
  position: string | null;
  star: number;
  text: string;
};

export default function Reviews({ items, buttons }: ACFBlock) {
  const reviewItems = items as unknown as ReviewItem[] | undefined;

  return (
    <section className="text-gray-600 pb-16">
      <div className="container px-5 py-10 mx-auto">
        <div className="flex flex-wrap flex-col sm:flex-row -m-4">
          {reviewItems?.map((o, idx) => (
            <div
              key={idx}
              className={`w-full md:w-1/2 ${
                (reviewItems?.length ?? 0) > 2 ? "lg:w-1/3" : (reviewItems?.length ?? 0) > 1 ? "lg:w-1/2" : "lg:w-full"
              } lg:mb-0 mb-6 p-4`}
            >
              <div className="h-full text-center">
                {o.star && Number.isInteger(o.star) && (
                  <div className="mb-8">
                    {[...Array(o.star)].map((_, i) => (
                      <svg
                        key={i}
                        className="inline-block"
                        width="31"
                        height="30"
                        viewBox="0 0 31 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M31.0002 11.4322H19.4116L15.823 0.123779L12.2344 11.4322H0.645874L10.0173 18.4472L6.45158 29.7557L15.823 22.7642L25.1944 29.7557L21.6287 18.4472L31.0002 11.4322Z"
                          fill="#F5B306"
                        />
                      </svg>
                    ))}
                  </div>
                )}
                {o.text && (
                  <p
                    className="leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: o.text }}
                  />
                )}
                <span className="inline-block h-1 w-10 rounded bg-indigo-500 mt-6 mb-4" />
                {o.person && (
                  <h2 className="text-gray-900 font-medium tracking-wider text-sm">
                    {o.person}
                  </h2>
                )}
                {o.position && <p className="text-gray-500">{o.position}</p>}
              </div>
            </div>
          ))}
          {buttons && buttons.length > 0 && (
            <div className="flex justify-center pt-16 w-full gap-4">
              {buttons.map((obj, i) => (
                <Button key={i} {...obj.button} variant={obj.variant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
