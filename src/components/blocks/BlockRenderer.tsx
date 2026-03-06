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
  DefaultTemplate_Acf_Blocks_Flex_Hero: Hero,
  DefaultTemplate_Acf_Blocks_Flex_Cards: Cards,
  DefaultTemplate_Acf_Blocks_Flex_Textimage: TextImage,
  DefaultTemplate_Acf_Blocks_Flex_Texteditor: TextEditor,
  DefaultTemplate_Acf_Blocks_Flex_Postcards: Postcards,
  DefaultTemplate_Acf_Blocks_Flex_Quote: Quote,
  DefaultTemplate_Acf_Blocks_Flex_Angledimage: AngledImage,
  DefaultTemplate_Acf_Blocks_Flex_Contactus: ContactUs,
  DefaultTemplate_Acf_Blocks_Flex_Form: Form,
  DefaultTemplate_Acf_Blocks_Flex_Cta: Cta,
  DefaultTemplate_Acf_Blocks_Flex_Downloads: Downloads,
  DefaultTemplate_Acf_Blocks_Flex_Reviews: Reviews,
  DefaultTemplate_Acf_Blocks_Flex_Content: Content,
  DefaultTemplate_Acf_Blocks_Flex_Resources: Resources,
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
