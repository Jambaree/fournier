import { NextRequest, NextResponse } from "next/server";
import { submitFormEntry, submitFormWithFiles } from "@/lib/gravity-forms";

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || "";

const RECAPTCHA_SCORE_THRESHOLD = 0.5;

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET || !token) return false;

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: RECAPTCHA_SECRET,
      response: token,
    }),
  });

  const data = await res.json();
  // v3 returns a score (0.0 = bot, 1.0 = human)
  if (data.score !== undefined) {
    return data.success === true && data.score >= RECAPTCHA_SCORE_THRESHOLD;
  }
  // v2 fallback
  return data.success === true;
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  try {
    if (contentType.includes("multipart/form-data")) {
      // Handle file uploads via FormData
      const incomingFormData = await request.formData();
      const formId = incomingFormData.get("formId");
      const recaptchaToken = incomingFormData.get("recaptchaToken") as string | null;

      if (!formId) {
        return NextResponse.json({ is_valid: false, message: "Missing form ID" }, { status: 400 });
      }

      // Verify reCAPTCHA (required)
      if (!recaptchaToken || !(await verifyRecaptcha(recaptchaToken))) {
        return NextResponse.json({ is_valid: false, message: "reCAPTCHA verification failed. Please try again." }, { status: 403 });
      }

      // Build a new FormData to forward to GF API (exclude our custom fields)
      const gfFormData = new FormData();

      for (const [key, value] of incomingFormData.entries()) {
        if (key === "formId" || key === "recaptchaToken") continue;
        gfFormData.append(key, value);
      }

      const result = await submitFormWithFiles(Number(formId), gfFormData);
      return NextResponse.json(result);
    } else {
      // Handle regular JSON submissions
      const { formId, data, recaptchaToken } = await request.json();

      if (!formId || !data) {
        return NextResponse.json({ is_valid: false, message: "Missing form data" }, { status: 400 });
      }

      // Verify reCAPTCHA (required)
      if (!recaptchaToken || !(await verifyRecaptcha(recaptchaToken))) {
        return NextResponse.json({ is_valid: false, message: "reCAPTCHA verification failed. Please try again." }, { status: 403 });
      }

      const result = await submitFormEntry(formId, data);
      return NextResponse.json(result);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit form";
    console.error("Form submission error:", message);
    return NextResponse.json(
      { is_valid: false, message },
      { status: 500 }
    );
  }
}
