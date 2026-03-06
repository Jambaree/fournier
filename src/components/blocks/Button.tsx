import Link from "next/link";
import type { AcfLink } from "@/lib/wordpress";

type Props = AcfLink & {
  variant?: string;
};

export default function Button({ url, title, target, variant }: Props) {
  if (!url || !title) return null;

  const isExternal = url.startsWith("http");

  let className = "";
  if (variant === "filled") {
    className =
      "inline-flex items-center justify-center h-12 px-10 py-2 font-medium tracking-wide text-background-one transition duration-200 rounded shadow-md bg-primary-contrast text-primary-contrast hover:opacity-50 focus:shadow-outline focus:outline-none";
  } else if (variant === "text") {
    className =
      "inline-flex items-center font-semibold border-background-one border-2 px-10 py-2 rounded duration-200 text-secondary-contrast";
  }

  if (isExternal) {
    return (
      <a
        href={url}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={title}
      >
        {title}
      </a>
    );
  }

  return (
    <Link href={url} className={className}>
      {title}
    </Link>
  );
}
