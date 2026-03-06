import { getForm } from "@/lib/gravity-forms";
import GravityFormClient from "./GravityFormClient";

type Props = {
  formId: number;
  heading?: string;
  compact?: boolean;
};

export default async function GravityFormBlock({ formId, heading, compact }: Props) {
  const form = await getForm(formId);

  if (compact) {
    return <GravityFormClient form={form} heading={heading} />;
  }

  return (
    <div className="w-full">
      <GravityFormClient form={form} heading={heading} />
    </div>
  );
}
