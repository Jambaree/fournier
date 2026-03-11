import type { ACFBlock } from "@/lib/wordpress";
import Hero from "./Hero";
import Cards from "./Cards";
import TextImage from "./TextImage";
import TextEditor from "./TextEditor";
import Postcards from "./Postcards";
import Quote from "./Quote";
import AngledImage from "./AngledImage";
import ContactUs from "./ContactUs";
import Form from "./Form";
import Cta from "./Cta";
import Downloads from "./Downloads";
import Reviews from "./Reviews";
import Content from "./Content";
import Resources from "./Resources";

const BLOCK_MAP: Record<string, React.ComponentType<ACFBlock>> = {
  hero: Hero,
  cards: Cards,
  textimage: TextImage,
  texteditor: TextEditor,
  postcards: Postcards,
  quote: Quote,
  angledimage: AngledImage,
  contactus: ContactUs,
  form: Form,
  cta: Cta,
  downloads: Downloads,
  reviews: Reviews,
  content: Content,
  resources: Resources,
};

type Props = {
  blocks: ACFBlock[];
};

export default function BlockRenderer({ blocks }: Props) {
  return (
    <>
      {blocks.map((block, i) => {
        const Component = BLOCK_MAP[block.__typename];

        if (!Component) {
          console.warn(`Unknown block type: ${block.__typename}`);
          return null;
        }

        return <Component key={i} {...block} />;
      })}
    </>
  );
}
