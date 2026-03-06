"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { GravityForm, GravityFormField } from "@/lib/gravity-forms";

type Props = {
  form: GravityForm;
  heading?: string;
};

export default function GravityFormClient({ form, heading }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: Record<string, string>) => {
    setError("");

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: form.id, data }),
      });

      const result = await res.json();

      if (result.is_valid) {
        setSubmitted(true);
        setConfirmationMessage(
          result.confirmation_message || "Thank you for your submission."
        );
      } else {
        setError("There was a problem submitting the form. Please try again.");
      }
    } catch {
      setError("There was a problem submitting the form. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div
        className="rounded-lg bg-green-50 p-6 text-green-800"
        dangerouslySetInnerHTML={{ __html: confirmationMessage }}
      />
    );
  }

  const visibleFields = form.fields.filter(
    (f) => f.visibility !== "hidden" && f.type !== "hidden"
  );

  return (
    <div className="w-full">
      {heading && (
        <h2 className="mb-6 text-2xl font-bold">{heading}</h2>
      )}
      {form.title && !heading && (
        <h2 className="mb-6 text-2xl font-bold">{form.title}</h2>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {visibleFields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            register={register}
            error={errors[`input_${field.id}`]?.message as string}
          />
        ))}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : form.button?.text || "Submit"}
        </button>
      </form>
    </div>
  );
}

function FormField({
  field,
  register,
  error,
}: {
  field: GravityFormField;
  register: ReturnType<typeof useForm>["register"];
  error?: string;
}) {
  const name = `input_${field.id}`;
  const validation = field.isRequired ? { required: `${field.label} is required` } : {};

  switch (field.type) {
    case "textarea":
      return (
        <div>
          <label className="mb-1 block text-sm font-medium">{field.label}</label>
          <textarea
            {...register(name, validation)}
            placeholder={field.placeholder}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
            rows={4}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );

    case "select":
      return (
        <div>
          <label className="mb-1 block text-sm font-medium">{field.label}</label>
          <select
            {...register(name, validation)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
          >
            <option value="">{field.placeholder || "Select..."}</option>
            {field.choices?.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.text}
              </option>
            ))}
          </select>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );

    case "checkbox":
      return (
        <div>
          <span className="mb-1 block text-sm font-medium">{field.label}</span>
          {field.choices?.map((choice) => (
            <label key={choice.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={choice.value}
                {...register(name, validation)}
              />
              {choice.text}
            </label>
          ))}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );

    case "radio":
      return (
        <div>
          <span className="mb-1 block text-sm font-medium">{field.label}</span>
          {field.choices?.map((choice) => (
            <label key={choice.value} className="flex items-center gap-2">
              <input
                type="radio"
                value={choice.value}
                {...register(name, validation)}
              />
              {choice.text}
            </label>
          ))}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );

    case "email":
      return (
        <div>
          <label className="mb-1 block text-sm font-medium">{field.label}</label>
          <input
            type="email"
            {...register(name, {
              ...validation,
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            })}
            placeholder={field.placeholder}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );

    case "phone":
      return (
        <div>
          <label className="mb-1 block text-sm font-medium">{field.label}</label>
          <input
            type="tel"
            {...register(name, validation)}
            placeholder={field.placeholder}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );

    default:
      return (
        <div>
          <label className="mb-1 block text-sm font-medium">{field.label}</label>
          <input
            type="text"
            {...register(name, validation)}
            placeholder={field.placeholder}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );
  }
}
