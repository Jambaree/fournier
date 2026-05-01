import GravityFormBlock from "@/components/gravity-form/GravityFormBlock";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TestFormPage({ params }: Props) {
  const { id } = await params;
  const formId = parseInt(id, 10);

  if (isNaN(formId) || formId < 1) {
    return <div className="p-10 text-red-600">Invalid form ID</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold mb-2">Form Test: ID {formId}</h1>
      <p className="text-gray-500 mb-8 text-sm">
        All forms: {[1,2,3,4,5,6,7].map(i => (
          <a key={i} href={`/test-form/${i}`} className={`mr-3 ${i === formId ? 'font-bold text-primary underline' : 'text-blue-500 hover:underline'}`}>
            Form {i}
          </a>
        ))}
      </p>
      <GravityFormBlock formId={formId} />
    </div>
  );
}
