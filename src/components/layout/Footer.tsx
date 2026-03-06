import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-white bg-gray-900">
      <div className="px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <Link href="/" className="font-medium md:justify-start justify-center">
          <span className="text-lg font-bold text-white">Fournier Auto Group</span>
        </Link>

        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start gap-3">
          {/* Social links — update hrefs when client provides real URLs */}
          <a className="text-gray-400 hover:text-white" href="#" aria-label="Facebook">
            <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </a>
          <a className="text-gray-400 hover:text-white" href="#" aria-label="Instagram">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
            </svg>
          </a>
          <a className="text-gray-400 hover:text-white" href="#" aria-label="LinkedIn">
            <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
              <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" stroke="none" />
            </svg>
          </a>
        </span>
      </div>
    </footer>
  );
}
