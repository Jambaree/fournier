"use client";

import { useState } from "react";
import Link from "next/link";

const LOGO_URL =
  "https://fournierwp.wpenginepowered.com/wp-content/uploads/2023/07/Screen-Shot-2021-06-24-at-11.00.10-AM.png";

const NAV_ITEMS = [
  { title: "WHAT WE DO", url: "/about/", children: [] },
  { title: "REVIEWS", url: "/reviews/", children: [] },
  {
    title: "RESOURCES",
    url: "/law-firm-resources/",
    children: [
      { title: "LAW FIRM RESOURCES", url: "/law-firm-resources/" },
      { title: "ACCELERATED DEPRECIATION PRECEDENT JUDGEMENTS", url: "/accelerated-depreciation-precedent-judgements/" },
    ],
  },
  { title: "CONTACT", url: "/contact/", children: [] },
  { title: "FAQ", url: "/faq/", children: [] },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      <div className=" w-full  ">
        <div className="relative w-full flex items-center justify-between px-6 py-4">
          <a href="/" aria-label="Company" title="Company" className="inline-flex items-center">
            <img
              src={LOGO_URL}
              alt="Fournier Auto Group"
              className="h-10 w-auto object-contain object-left"
            />
          </a>

          {/* Desktop nav */}
          <div id="desktop-nav">
            <ul className="flex items-center  space-x-8 lg:flex">
              {NAV_ITEMS.map((o) => (
                <li key={o.url} className="relative">
                  {o.children.length > 0 ? (
                    <div className="group relative z-10">
                      <div className="dropdown inline-block relative">
                        <Link
                          href={o.url}
                          className="bg-white text-secondary-contrast py-2 rounded inline-flex items-center font-medium tracking-wide"
                        >
                          <span className="mr-1">{o.title}</span>
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </Link>
                        <ul className="dropdown-menu absolute hidden group-hover:block text-secondary-contrast pt-1 w-60 border rounded">
                          {o.children.map((ch) => (
                            <li key={ch.url}>
                              <Link
                                className="bg-white hover:bg-gray-400 py-2 px-4 block"
                                href={ch.url}
                              >
                                {ch.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={o.url}
                      aria-label={o.title}
                      title={o.title}
                      className="font-medium tracking-wide text-secondary-contrast transition-colors duration-200 hover:text-teal-accent-400"
                    >
                      {o.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile hamburger */}
          <div id="mobile-toggle">
            <button
              aria-label="Open Menu"
              title="Open Menu"
              className="p-2 -mr-1 transition duration-200 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setIsMenuOpen(true)}
            >
              <svg className="w-5 text-secondary-contrast" viewBox="0 0 24 24">
                <path fill="currentColor" d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z" />
                <path fill="currentColor" d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z" />
                <path fill="currentColor" d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z" />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="absolute top-0 left-0 w-full z-10">
                <div className="p-5 bg-white border rounded shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <a href="/" aria-label="Company" title="Company" className="inline-flex items-center">
                        <img
                          src={LOGO_URL}
                          alt="Fournier Auto Group"
                          className="h-10 w-auto object-contain object-left"
                        />
                      </a>
                    </div>
                    <div>
                      <button
                        aria-label="Close Menu"
                        title="Close Menu"
                        className="p-2 -mt-2 -mr-2 transition duration-200 rounded hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 text-secondary-contrast" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <nav>
                    <ul className="space-y-4">
                      {NAV_ITEMS.map((o) => (
                        <li key={o.url}>
                          {o.children.length > 0 ? (
                            <div className="group relative z-10">
                              <div className="dropdown inline-block relative">
                                <Link
                                  href={o.url}
                                  className="text-secondary-contrast  py-2  rounded inline-flex items-center"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span className="mr-1">{o.title}</span>
                                  <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </Link>
                                <ul className="dropdown-menu absolute hidden group-hover:block text-secondary-contrast pt-1 w-60 border rounded">
                                  {o.children.map((ch) => (
                                    <li key={ch.url}>
                                      <Link
                                        className="bg-white hover:bg-gray-400 py-2 px-4 block"
                                        href={ch.url}
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        {ch.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <Link
                              href={o.url}
                              aria-label={o.title}
                              title={o.title}
                              className="font-medium tracking-wide text-secondary-contrast transition-colors duration-200 hover:text-teal-accent-400"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {o.title}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Match old site 1140px breakpoint */}
      <style dangerouslySetInnerHTML={{ __html: `
        #desktop-nav { display: none; }
        #mobile-toggle { display: block; }
        @media screen and (min-width: 1140px) {
          #desktop-nav { display: block; }
          #mobile-toggle { display: none; }
        }
      `}} />
    </div>
  );
}
