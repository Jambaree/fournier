"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import type { GravityForm, GravityFormField } from "@/lib/gravity-forms";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

type Props = {
  form: GravityForm;
  heading?: string;
};

export default function GravityFormClient({ form, heading }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [error, setError] = useState("");
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const fileInputsRef = useRef<Map<string, FileList | null>>(new Map());
  const recaptchaReady = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Load reCAPTCHA v3 script
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY || recaptchaReady.current) return;
    if (document.querySelector('script[src*="recaptcha/api.js"]')) {
      recaptchaReady.current = true;
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);
    recaptchaReady.current = true;
  }, []);

  const getRecaptchaToken = useCallback((): Promise<string> => {
    if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) return Promise.resolve("");
    return new Promise((resolve) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "form_submit" });
          resolve(token);
        } catch {
          resolve("");
        }
      });
    });
  }, []);

  const hasFileFields = form.fields.some((f) => f.type === "fileupload");

  const onSubmit = async (data: Record<string, string>) => {
    setError("");
    setServerErrors({});

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getRecaptchaToken();

      let result;

      if (hasFileFields && fileInputsRef.current.size > 0) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append("formId", String(form.id));
        if (recaptchaToken) formData.append("recaptchaToken", recaptchaToken);

        // Add regular fields
        for (const [key, value] of Object.entries(data)) {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        }

        // Add file fields
        for (const [fieldName, files] of fileInputsRef.current.entries()) {
          if (files) {
            for (let i = 0; i < files.length; i++) {
              formData.append(fieldName, files[i]);
            }
          }
        }

        const res = await fetch("/api/forms/submit", {
          method: "POST",
          body: formData,
        });
        result = await res.json();
      } else {
        // Regular JSON submission
        const res = await fetch("/api/forms/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formId: form.id, data, recaptchaToken }),
        });
        result = await res.json();
      }

      if (result.is_valid) {
        setSubmitted(true);
        setConfirmationMessage(
          result.confirmation_message || "Thank you for your submission."
        );
      } else {
        if (result.validation_messages) {
          setServerErrors(result.validation_messages);
          const fieldCount = Object.keys(result.validation_messages).length;
          setError(`Please fix ${fieldCount} field${fieldCount > 1 ? "s" : ""} below and try again.`);
        } else {
          setError(result.message || "There was a problem submitting the form. Please try again.");
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError("There was a problem submitting the form. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div
        className="relative mb-4 bg-primary text-sm text-primary-contrast p-7 [&_a]:underline [&_a]:text-primary-contrast"
        dangerouslySetInnerHTML={{ __html: confirmationMessage }}
      />
    );
  }

  const visibleFields = form.fields.filter(
    (f) => f.visibility !== "hidden" && f.type !== "hidden" && f.type !== "captcha"
  );

  return (
    <div className="w-full">
      {heading && (
        <h2 className="mb-6 text-2xl font-bold text-gray-900">{heading}</h2>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {visibleFields.map((field) => {
          const name = `input_${field.id}`;
          const clientError = errors[name]?.message as string;
          const serverError = serverErrors[name];
          return (
            <FormField
              key={field.id}
              field={field}
              register={register}
              error={clientError || serverError}
              errors={errors}
              serverErrors={serverErrors}
              fileInputsRef={fileInputsRef}
            />
          );
        })}

        {error && <div className="w-full bg-[#e24141] text-white px-[10px] py-[5px] text-sm uppercase">{error}</div>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="text-primary-contrast bg-primary border-0 py-2 px-6 focus:outline-none hover:opacity-80 rounded text-lg disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : form.button?.text || "Submit"}
        </button>
      </form>
    </div>
  );
}

const inputClasses = "relative h-[62px] w-full m-0 bg-transparent border border-[#e5efef] appearance-none rounded-none shadow-none outline-none px-5 py-4 focus:border-primary text-base";
const labelClasses = "block text-xs uppercase font-bold pb-[7px]";
const errorClasses = "w-full bg-[#e24141] text-white px-[10px] py-[5px] mt-[10px] text-sm uppercase";

function FormField({
  field,
  register,
  error,
  errors,
  serverErrors,
  fileInputsRef,
}: {
  field: GravityFormField;
  register: ReturnType<typeof useForm>["register"];
  error?: string;
  errors: ReturnType<typeof useForm>["formState"]["errors"];
  serverErrors: Record<string, string>;
  fileInputsRef: React.RefObject<Map<string, FileList | null>>;
}) {
  const name = `input_${field.id}`;
  const validation = field.isRequired ? { required: `${field.label} is required` } : {};

  switch (field.type) {
    // --- Name field (compound: first, last, etc.) ---
    case "name": {
      const visibleInputs = field.inputs?.filter((inp) => !inp.isHidden) || [];
      return (
        <div className="mb-[25px]">
          <label className={labelClasses}>{field.label}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visibleInputs.map((inp) => {
              const subName = `input_${inp.id}`;
              const subError = errors[subName]?.message as string;
              return (
                <div key={inp.id}>
                  <input
                    type="text"
                    {...register(subName, field.isRequired ? { required: `${inp.label} is required` } : {})}
                    placeholder={inp.label}
                    className={inputClasses}
                    autoComplete={inp.autocompleteAttribute}
                  />
                  <span className="text-xs text-gray-500 mt-1 block">{inp.label}</span>
                  {subError && <div className={errorClasses}>{subError}</div>}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // --- File upload ---
    case "fileupload": {
      const accept = field.allowedExtensions
        ? field.allowedExtensions.split(",").map((ext) => `.${ext.trim()}`).join(",")
        : undefined;
      const multiple = field.multipleFiles === true;
      const fieldName = `input_${field.id}`;

      return (
        <div className="mb-[25px]">
          <label className={labelClasses}>{field.label}</label>
          <div className="relative w-full border border-[#e5efef] bg-transparent">
            <input
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={(e) => {
                fileInputsRef.current?.set(fieldName, e.target.files);
              }}
              className="w-full px-5 py-4 text-base file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-contrast hover:file:opacity-80 cursor-pointer"
            />
          </div>
          {field.description && (
            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
          )}
          {field.allowedExtensions && (
            <p className="text-xs text-gray-400 mt-1">
              Allowed: {field.allowedExtensions}
            </p>
          )}
          {field.maxFileSize && (
            <p className="text-xs text-gray-400 mt-1">
              Max size: {field.maxFileSize}MB
            </p>
          )}
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );
    }

    // --- HTML (display only) ---
    case "html":
      return (
        <div className="mb-[25px]">
          {field.content && (
            <div
              className="prose max-w-full"
              dangerouslySetInnerHTML={{ __html: field.content }}
            />
          )}
        </div>
      );

    // --- Textarea ---
    case "textarea":
    case "post_content":
      return (
        <div className="mb-[25px]">
          <label className={labelClasses}>{field.label}</label>
          <textarea
            {...register(name, validation)}
            placeholder={field.placeholder}
            className="relative w-full m-0 bg-transparent border border-[#e5efef] appearance-none rounded-none shadow-none outline-none px-5 py-4 focus:border-primary min-h-[150px] max-w-full text-base"
            rows={4}
          />
          {field.description && (
            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
          )}
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );

    // --- Select / Dropdown ---
    case "select":
      return (
        <div className="mb-[25px]">
          <label className={labelClasses}>{field.label}</label>
          <div className="relative">
            <select
              {...register(name, validation)}
              className={inputClasses}
            >
              <option value="">{field.placeholder || "Select..."}</option>
              {field.choices?.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.text}
                </option>
              ))}
            </select>
            <div className="absolute right-[30px] top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#ccd7de] pointer-events-none" />
          </div>
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );

    // --- Checkbox ---
    case "checkbox":
      return (
        <div className="mb-[25px]">
          <span className={labelClasses}>{field.label}</span>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {field.choices?.map((choice, idx) => (
              <label key={choice.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={choice.value}
                  {...register(`input_${field.id}_${idx + 1}`, validation)}
                />
                {choice.text}
              </label>
            ))}
          </div>
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );

    // --- Radio ---
    case "radio":
      return (
        <div className="mb-[25px]">
          <span className={labelClasses}>{field.label}</span>
          <div className="flex flex-wrap max-w-[500px]">
            {field.choices?.map((choice) => (
              <label key={choice.value} className="mr-5 mb-2 cursor-pointer">
                <input
                  type="radio"
                  value={choice.value}
                  {...register(name, validation)}
                  className="peer hidden"
                />
                <span className="flex items-center justify-center min-w-[125px] px-[25px] py-[10px] bg-[#f2f2f2] transition-all duration-300 cursor-pointer hover:bg-[#2c312c] hover:text-white peer-checked:bg-[#00b040] peer-checked:text-white">
                  {choice.text}
                </span>
              </label>
            ))}
          </div>
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );

    // --- Email (with optional confirm) ---
    case "email": {
      const hasConfirm = field.emailConfirmEnabled && field.inputs && field.inputs.length > 1;
      return (
        <div className="mb-[25px]">
          <label className={labelClasses}>{field.label}</label>
          <input
            type="email"
            {...register(name, {
              ...validation,
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            })}
            placeholder={field.placeholder || field.inputs?.[0]?.label || ""}
            className={inputClasses}
            autoComplete="email"
          />
          {error && <div className={errorClasses}>{error}</div>}
          {hasConfirm && (
            <div className="mt-4">
              <input
                type="email"
                {...register(`input_${field.id}_2`, {
                  required: field.isRequired ? "Please confirm your email" : false,
                })}
                placeholder={field.inputs?.[1]?.label || "Confirm Email"}
                className={inputClasses}
                autoComplete="email"
              />
              <span className="text-xs text-gray-500 mt-1 block">Confirm Email</span>
              {errors[`input_${field.id}_2`]?.message && (
                <div className={errorClasses}>{errors[`input_${field.id}_2`]?.message as string}</div>
              )}
            </div>
          )}
        </div>
      );
    }

    // --- Phone ---
    case "phone":
      return (
        <div className="mb-[25px]">
          <label className={labelClasses}>{field.label}</label>
          <input
            type="tel"
            {...register(name, validation)}
            placeholder={field.placeholder}
            className={inputClasses}
            autoComplete="tel"
          />
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );

    // --- Number ---
    case "number":
      return (
        <div className="mb-[25px]">
          <label className={labelClasses}>{field.label}</label>
          <input
            type="number"
            {...register(name, validation)}
            placeholder={field.placeholder}
            className={inputClasses}
          />
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );

    // --- Date ---
    case "date":
      return (
        <div className="mb-[25px]">
          <label className={labelClasses}>{field.label}</label>
          <input
            type="date"
            {...register(name, validation)}
            className={inputClasses}
          />
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );

    // --- Time ---
    case "time":
      return (
        <div className="mb-[25px]">
          <label className={labelClasses}>{field.label}</label>
          <input
            type="time"
            {...register(name, validation)}
            className={inputClasses}
          />
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );

    // --- Website / URL ---
    case "website":
      return (
        <div className="mb-[25px]">
          <label className={labelClasses}>{field.label}</label>
          <input
            type="url"
            {...register(name, validation)}
            placeholder={field.placeholder || "https://"}
            className={inputClasses}
          />
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );

    // --- Address (compound) ---
    case "address": {
      const addressInputs = field.inputs?.filter((inp) => !inp.isHidden) || [];
      return (
        <div className="mb-[25px]">
          <label className={labelClasses}>{field.label}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addressInputs.map((inp) => {
              const subName = `input_${inp.id}`;
              const subError = errors[subName]?.message as string;
              return (
                <div key={inp.id} className={inp.label.toLowerCase().includes("street") ? "sm:col-span-2" : ""}>
                  <input
                    type="text"
                    {...register(subName, field.isRequired ? { required: `${inp.label} is required` } : {})}
                    placeholder={inp.label}
                    className={inputClasses}
                    autoComplete={inp.autocompleteAttribute}
                  />
                  <span className="text-xs text-gray-500 mt-1 block">{inp.label}</span>
                  {subError && <div className={errorClasses}>{subError}</div>}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // --- Consent ---
    case "consent":
      return (
        <div className="mb-[25px]">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register(name, field.isRequired ? { required: `${field.label} is required` } : {})}
              className="mt-1"
            />
            <span className="text-sm">{field.label}</span>
          </label>
          {field.description && (
            <p className="text-xs text-gray-500 mt-1 ml-6">{field.description}</p>
          )}
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );

    // --- Section break ---
    case "section":
      return (
        <div className="mb-[25px] border-b border-gray-200 pb-4">
          {field.label && <h3 className="text-lg font-semibold text-gray-900">{field.label}</h3>}
          {field.description && <p className="text-sm text-gray-500 mt-1">{field.description}</p>}
        </div>
      );

    // --- Post Image ---
    case "post_image": {
      const accept = field.allowedExtensions
        ? field.allowedExtensions.split(",").map((ext) => `.${ext.trim()}`).join(",")
        : "image/*";
      const fieldName = `input_${field.id}`;
      return (
        <div className="mb-[25px]">
          <label className={labelClasses}>{field.label}</label>
          <div className="relative w-full border border-[#e5efef] bg-transparent">
            <input
              type="file"
              accept={accept}
              onChange={(e) => {
                fileInputsRef.current?.set(fieldName, e.target.files);
              }}
              className="w-full px-5 py-4 text-base file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-contrast hover:file:opacity-80 cursor-pointer"
            />
          </div>
          {field.description && (
            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
          )}
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );
    }

    // --- Default (text, unknown types) ---
    default:
      return (
        <div className="mb-[25px]">
          {field.label && <label className={labelClasses}>{field.label}</label>}
          <input
            type="text"
            {...register(name, validation)}
            placeholder={field.placeholder}
            className={inputClasses}
          />
          {field.description && (
            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
          )}
          {error && <div className={errorClasses}>{error}</div>}
        </div>
      );
  }
}
