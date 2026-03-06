const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL!;
const GF_KEY = process.env.GRAVITY_FORMS_API_KEY!;
const GF_SECRET = process.env.GRAVITY_FORMS_API_SECRET!;

export type GravityFormField = {
  id: number;
  type: string;
  label: string;
  isRequired: boolean;
  placeholder: string;
  choices?: { text: string; value: string; isSelected: boolean }[];
  inputType?: string;
  cssClass?: string;
  visibility?: string;
  defaultValue?: string;
  size?: string;
  maxLength?: string;
};

export type GravityForm = {
  id: number;
  title: string;
  description: string;
  fields: GravityFormField[];
  button: { text: string };
  confirmations: Record<string, { message?: string; url?: string }>;
};

function getAuthHeader() {
  return "Basic " + btoa(`${GF_KEY}:${GF_SECRET}`);
}

export async function getForm(formId: number): Promise<GravityForm> {
  const res = await fetch(`${WP_URL}/wp-json/gf/v2/forms/${formId}`, {
    headers: { Authorization: getAuthHeader() },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Gravity Form ${formId}: ${res.statusText}`);
  }

  return res.json();
}

export async function submitFormEntry(
  formId: number,
  data: Record<string, string>
): Promise<{ is_valid: boolean; confirmation_message?: string; confirmation_redirect?: string }> {
  const res = await fetch(`${WP_URL}/wp-json/gf/v2/forms/${formId}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  return res.json();
}
