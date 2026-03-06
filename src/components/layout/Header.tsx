"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { title: "Home", url: "/" },
  {
    title: "Vehicle Valuations",
    url: "/vehicle-valuations/",
    children: [
      { title: "PST Vehicle Appraisals", url: "/vehicle-valuations/pst-vehicle-appraisals/" },
    ],
  },
  { title: "Vehicle Write Off", url: "/vehicle-write-off/" },
  { title: "Accelerated Depreciation", url: "/accelerated-depreciation/" },
  {
    title: "Law Firm Resources",
    url: "/law-firm-resources/",
    children: [
      { title: "Preparing a Preliminary Accelerated Depreciation Report", url: "/law-firm-resources/preparing-a-preliminary-accelerated-depreciation-report/" },
      { title: "Full Accelerated Depreciation Reports", url: "/law-firm-resources/full-accelerated-depreciation-reports/" },
      { title: "Preparing for a Preliminary Vehicle Appraisal", url: "/law-firm-resources/preparing-for-a-preliminary-vehicle-appraisal/" },
    ],
  },
  { title: "Reviews", url: "/reviews/" },
  { title: "About", url: "/about/" },
  { title: "Contact", url: "/contact/" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <div className="w-full">
        <div className="relative w-full flex items-center justify-between pr-6">
          <Link href="/" className="inline-flex items-center p-4">
            <span className="text-xl font-bold text-gray-900">Fournier Auto Group</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:block">
            <ul className="flex items-center space-x-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.url} className="relative group">
                  <Link
                    href={item.url}
                    className="font-medium tracking-wide text-gray-800 transition-colors duration-200 hover:text-gray-500 py-2 inline-flex items-center"
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
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
            className="xl:hidden p-2 transition duration-200 rounded focus:outline-none"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Menu"
          >
            <svg className="w-5 text-gray-800" viewBox="0 0 24 24">
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
                <span className="text-xl font-bold text-gray-900">Fournier Auto Group</span>
              </Link>
              <button
                className="p-2 transition duration-200 rounded hover:bg-gray-200 focus:outline-none"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close Menu"
              >
                <svg className="w-5 text-gray-800" viewBox="0 0 24 24">
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
                      className="font-medium tracking-wide text-gray-800"
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
                              className="text-sm text-gray-600"
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
