"use client";

import { useState } from "react";
import Link from "next/link";

const LOGO_URL = "https://fournierwp.wpenginepowered.com/wp-content/uploads/2023/07/Screen-Shot-2021-06-24-at-11.00.10-AM.png";

const NAV_ITEMS = [
  { title: "WHAT WE DO", url: "/about/" },
  { title: "REVIEWS", url: "/reviews/" },
  {
    title: "RESOURCES",
    url: "/law-firm-resources/",
    children: [
      { title: "LAW FIRM RESOURCES", url: "/law-firm-resources/" },
      { title: "ACCELERATED DEPRECIATION PRECEDENT JUDGEMENTS", url: "/accelerated-depreciation-precedent-judgements/" },
    ],
  },
  { title: "CONTACT", url: "/contact/" },
  { title: "FAQ", url: "/faq/" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <div className="w-full">
        <div className="relative w-full flex items-center justify-between pr-6">
          <Link href="/" className="inline-flex items-center">
            <img
              src={LOGO_URL}
              alt="Fournier Auto Group"
              className="h-10 w-auto object-contain object-left"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:block" style={{ minWidth: 0 }}>
            <ul className="flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.url} className="relative group">
                  <Link
                    href={item.url}
                    className="font-medium tracking-wide text-secondary-contrast transition-colors duration-200 hover:text-primary py-2 inline-flex items-center text-sm"
                  >
                    {item.title}
                    {item.children && (
                      <svg className="fill-current h-4 w-4 ml-1" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    )}
                  </Link>
                  {item.children && (
                    <ul className="absolute hidden group-hover:block bg-white border rounded shadow-lg pt-1 w-72 z-20">
                      {item.children.map((child) => (
                        <li key={child.url}>
                          <Link
                            href={child.url}
                            className="block px-4 py-2 text-sm text-secondary-contrast hover:bg-gray-100"
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 transition duration-200 rounded focus:outline-none"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Menu"
          >
            <svg className="w-5 text-secondary-contrast" viewBox="0 0 24 24">
              <path fill="currentColor" d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z" />
              <path fill="currentColor" d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z" />
              <path fill="currentColor" d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full z-30">
          <div className="p-5 bg-white border rounded shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="inline-flex items-center">
                <img src={LOGO_URL} alt="Fournier Auto Group" className="h-10 w-auto" />
              </Link>
              <button
                className="p-2 transition duration-200 rounded hover:bg-gray-200 focus:outline-none"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close Menu"
              >
                <svg className="w-5 text-secondary-contrast" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z"
                  />
                </svg>
              </button>
            </div>
            <nav>
              <ul className="space-y-4">
                {NAV_ITEMS.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={item.url}
                      className="font-medium tracking-wide text-secondary-contrast"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                    {item.children && (
                      <ul className="ml-4 mt-2 space-y-2">
                        {item.children.map((child) => (
                          <li key={child.url}>
                            <Link
                              href={child.url}
                              className="text-sm text-secondary-contrast"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
