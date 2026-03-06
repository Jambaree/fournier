const GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL!;

type GraphQLResponse<T> = {
  data: T;
  errors?: { message: string }[];
};

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors) {
    console.error("GraphQL errors:", json.errors);
    throw new Error(json.errors.map((e) => e.message).join("\n"));
  }

  return json.data;
}

const BLOCK_FRAGMENTS = `
  ... on DefaultTemplate_Acf_Blocks_Flex_Hero {
    fieldGroupName
    headline
    subline
    alignment
    bgcolor
    image { sourceUrl altText }
    buttons { variant button { title url target } }
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Cards {
    fieldGroupName
    columns
    introduction
    items { headline text link { title url target } }
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Textimage {
    fieldGroupName
    headline
    text
    alignment
    image { sourceUrl altText }
    buttons { variant button { title url target } }
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Texteditor {
    fieldGroupName
    flex {
      __typename
      ... on DefaultTemplate_Acf_Blocks_Flex_Texteditor_Flex_Text { fieldGroupName text }
      ... on DefaultTemplate_Acf_Blocks_Flex_Texteditor_Flex_Textimage { fieldGroupName text alignment image { sourceUrl altText } }
      ... on DefaultTemplate_Acf_Blocks_Flex_Texteditor_Flex_Gallery { fieldGroupName columns gallery { sourceUrl altText } }
      ... on DefaultTemplate_Acf_Blocks_Flex_Texteditor_Flex_Embed { fieldGroupName url }
      ... on DefaultTemplate_Acf_Blocks_Flex_Texteditor_Flex_Quote { fieldGroupName author position text }
    }
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Posts {
    fieldGroupName
    items { fieldGroupName image { sourceUrl altText } subline }
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Postcards {
    fieldGroupName
    bgcolor
    items { headline text image { sourceUrl altText } buttons { variant button { title url target } } }
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Quote {
    fieldGroupName
    headline
    text
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Angledimage {
    fieldGroupName
    headline
    text
    image { sourceUrl altText }
    buttons { variant button { title url target } }
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Contactus {
    fieldGroupName
    headline
    subline
    text
    email
    phone
    address
    link { title url target }
    flex {
      __typename
      ... on DefaultTemplate_Acf_Blocks_Flex_Contactus_Flex_Form { formid }
    }
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Form {
    fieldGroupName
    formid
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Cta {
    fieldGroupName
    headline
    text
    flex {
      __typename
      ... on DefaultTemplate_Acf_Blocks_Flex_Cta_Flex_Form { formid }
    }
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Downloads {
    fieldGroupName
    items { headline text category date link { title url target } }
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Reviews {
    fieldGroupName
    items { person position star text }
    buttons { variant button { title url target } }
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Content {
    fieldGroupName
    headline
    subline
    image { sourceUrl altText }
  }
  ... on DefaultTemplate_Acf_Blocks_Flex_Resources {
    fieldGroupName
    items { headline buttons { variant button { title url target } } }
  }
`;

export async function getPageByUri(uri: string) {
  const data = await fetchGraphQL<{ pageBy: WPPage }>(
    `
    query GetPage($uri: String!) {
      pageBy(uri: $uri) {
        id
        title
        slug
        uri
        content
        template {
          templateName
          ... on DefaultTemplate {
            acf {
              blocks {
                flex {
                  __typename
                  ${BLOCK_FRAGMENTS}
                }
              }
            }
          }
        }
      }
    }
    `,
    { uri }
  );

  return data.pageBy;
}

export async function getAllPages() {
  const data = await fetchGraphQL<{ pages: { nodes: { uri: string }[] } }>(
    `
    query GetAllPages {
      pages(first: 100) {
        nodes {
          uri
        }
      }
    }
    `
  );

  return data.pages.nodes;
}

export async function getSiteSettings() {
  const data = await fetchGraphQL<{
    generalSettings: { title: string; description: string; url: string };
  }>(`
    query GetSettings {
      generalSettings { title description url }
    }
  `);

  return data.generalSettings;
}

// Types

export type WPImage = {
  sourceUrl: string;
  altText: string;
};

export type AcfLink = {
  title: string;
  url: string;
  target: string;
};

export type AcfButton = {
  variant: string;
  button: AcfLink;
};

// TextEditor sub-blocks
export type TextEditorFlex =
  | { __typename: string; fieldGroupName: string; text: string }
  | { __typename: string; fieldGroupName: string; text: string; alignment: string; image: WPImage }
  | { __typename: string; fieldGroupName: string; columns: number; gallery: WPImage[] }
  | { __typename: string; fieldGroupName: string; url: string }
  | { __typename: string; fieldGroupName: string; author: string; position: string; text: string };

// ContactUs / CTA sub-blocks
export type FormFlex = {
  __typename: string;
  formid: number;
};

export type ACFBlock = {
  __typename: string;
  fieldGroupName?: string;
  // Hero
  headline?: string;
  subline?: string;
  alignment?: string;
  bgcolor?: string;
  image?: WPImage;
  buttons?: AcfButton[];
  // Cards
  columns?: number;
  introduction?: string;
  items?: Record<string, unknown>[];
  // Textimage / Content
  text?: string;
  // Texteditor
  flex?: (TextEditorFlex | FormFlex)[];
  // ContactUs
  email?: string;
  phone?: string;
  address?: string;
  link?: AcfLink;
  // Form
  formid?: number;
};

export type WPPage = {
  id: string;
  title: string;
  slug: string;
  uri: string;
  content: string;
  template: {
    templateName: string;
    acf?: {
      blocks?: {
        flex?: ACFBlock[];
      };
    };
  };
};
