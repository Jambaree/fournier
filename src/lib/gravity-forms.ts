const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL!;
const GF_KEY = process.env.GRAVITY_FORMS_API_KEY!;
const GF_SECRET = process.env.GRAVITY_FORMS_API_SECRET!;
const WP_USERNAME = process.env.WP_USERNAME!;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD!;

export type GravityFormFieldInput = {
  id: string;
  label: string;
  name?: string;
  isHidden?: boolean;
  inputType?: string;
  choices?: { text: string; value: string }[];
  autocompleteAttribute?: string;
};

export type GravityFormField = {
  id: number;
  type: string;
  label: string;
  isRequired: boolean;
  placeholder: string;
  choices?: { text: string; value: string; isSelected?: boolean }[];
  inputs?: GravityFormFieldInput[];
  inputType?: string;
  cssClass?: string;
  visibility?: string;
  defaultValue?: string;
  size?: string;
  maxLength?: string;
  description?: string;
  content?: string;
  // File upload
  multipleFiles?: boolean;
  maxFiles?: string;
  maxFileSize?: string;
  allowedExtensions?: string;
  // Name field
  nameFormat?: string;
  // Email
  emailConfirmEnabled?: boolean;
  // Layout
  layoutGridColumnSpan?: number;
};

export type GravityForm = {
  id: number;
  title: string;
  description: string;
  fields: GravityFormField[];
  button: { text: string };
  confirmations: Record<string, { message?: string; url?: string }>;
};

export type GFSubmissionResult = {
  is_valid: boolean;
  confirmation_message?: string;
  confirmation_redirect?: string;
  validation_messages?: Record<string, string>;
};

function parseSubmissionResult(result: Record<string, unknown>): GFSubmissionResult {
  const output: GFSubmissionResult = {
    is_valid: result.is_valid === true,
    confirmation_message: result.confirmation_message as string | undefined,
  };

  // Extract per-field validation messages from the GF response
  if (!output.is_valid && result.form) {
    const form = result.form as { fields?: Array<{ id: number; label: string; type: string; failed_validation: boolean; validation_message: string }> };
    const messages: Record<string, string> = {};
    for (const field of form.fields || []) {
      if (field.failed_validation) {
        messages[`input_${field.id}`] = field.validation_message || `${field.label} is not valid.`;
      }
    }
    if (Object.keys(messages).length > 0) {
      output.validation_messages = messages;
    }
  }

  return output;
}

function getApiKeyAuth() {
  return "Basic " + btoa(`${GF_KEY}:${GF_SECRET}`);
}

function getWpAuth() {
  return "Basic " + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`);
}

export async function getForm(formId: number): Promise<GravityForm> {
  const res = await fetch(`${WP_URL}/wp-json/gf/v2/forms/${formId}`, {
    headers: { Authorization: getApiKeyAuth() },
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
): Promise<GFSubmissionResult> {
  const url = `${WP_URL}/wp-json/gf/v2/forms/${formId}/submissions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getWpAuth(),
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();

  // 400 = validation failure (is_valid: false with field errors) — not a hard error
  if (!res.ok && res.status !== 400) {
    throw new Error(`GF API error ${res.status}: ${text}`);
  }

  const result = JSON.parse(text);
  return parseSubmissionResult(result);
}

export async function submitFormWithFiles(
  formId: number,
  formData: FormData
): Promise<GFSubmissionResult> {
  const url = `${WP_URL}/wp-json/gf/v2/forms/${formId}/submissions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: getWpAuth(),
    },
    body: formData,
  });

  const text = await res.text();

  if (!res.ok && res.status !== 400) {
    throw new Error(`GF API error ${res.status}: ${text}`);
  }

  const result = JSON.parse(text);
  return parseSubmissionResult(result);
}
