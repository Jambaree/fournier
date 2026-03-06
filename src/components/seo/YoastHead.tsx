import Script from "next/script";

type Props = {
  schema: string;
};

export default function YoastHead({ schema }: Props) {
  return (
    <Script
      id="yoast-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema }}
      strategy="beforeInteractive"
    />
  );
}
