import type { ACFBlock, AcfLink } from "@/lib/wordpress";

type DownloadItem = {
  headline: string;
  text: string;
  category: string;
  date: string;
  link: AcfLink;
};

export default function Downloads({ items }: ACFBlock) {
  const downloadItems = items as unknown as DownloadItem[] | undefined;

  return (
    <section className="text-gray-600 overflow-hidden">
      <div className="container px-5 py-10 mx-auto">
        <div className="-my-8 divide-y-2 divide-gray-100">
          {downloadItems?.map((o, idx) => (
            <div
              key={idx}
              className="grid mx-auto w-5/6 py-4 lg:w-2/3 gap-0 sm:mx-auto lg:grid-cols-2 xl:grid-cols-3"
            >
              <div className="lg:row-start-1 lg:col-start-1 md:w-64 lg:mb-0 mb-6 flex-shrink-0 flex flex-col break-all">
                {o.category && (
                  <span className="font-semibold text-gray-700">{o.category}</span>
                )}
                {o.date && (
                  <span className="mt-1 text-gray-500 text-sm">
                    {new Date(o.date).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="lg:row-start-1 lg:col-start-2 col-span-2 break-all">
                {o.headline && (
                  <h2 className="text-2xl font-medium text-gray-900 mb-2">{o.headline}</h2>
                )}
                {o.text && <p className="leading-relaxed">{o.text}</p>}
                {o.link && (
                  <a
                    href={o.link.url}
                    className="text-indigo-500 inline-flex items-center mt-4"
                    target={o.link.target || undefined}
                    rel={o.link.target === "_blank" ? "noopener noreferrer" : undefined}
                  >
                    {o.link.title}
                    <svg
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
