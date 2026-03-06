import { NextRequest, NextResponse } from "next/server";
import { submitFormEntry } from "@/lib/gravity-forms";

export async function POST(request: NextRequest) {
  const { formId, data } = await request.json();

  if (!formId || !data) {
    return NextResponse.json({ is_valid: false, message: "Missing form data" }, { status: 400 });
  }

  try {
    const result = await submitFormEntry(formId, data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { is_valid: false, message: "Failed to submit form" },
      { status: 500 }
    );
  }
}
