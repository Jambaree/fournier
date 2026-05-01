"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";

export default function AllFieldsTest() {
  const [result, setResult] = useState<string | null>(null);
  const fileInputsRef = useRef<Map<string, FileList | null>>(new Map());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data: Record<string, string>) => {
    const output: Record<string, unknown> = { ...data };

    // Show file info
    for (const [key, files] of fileInputsRef.current.entries()) {
      if (files && files.length > 0) {
        output[key] = Array.from(files).map((f) => `${f.name} (${(f.size / 1024).toFixed(1)}KB, ${f.type})`);
      }
    }

    setResult(JSON.stringify(output, null, 2));
  };

  const inputClasses =
    "relative h-[62px] w-full m-0 bg-transparent border border-[#e5efef] appearance-none rounded-none shadow-none outline-none px-5 py-4 focus:border-primary text-base";
  const labelClasses = "block text-xs uppercase font-bold pb-[7px]";
  const errorClasses = "w-full bg-[#e24141] text-white px-[10px] py-[5px] mt-[10px] text-sm uppercase";
  const sectionClasses = "mb-[25px]";

  return (
    <div className="max-w-3xl mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold mb-2">All Field Types Test</h1>
      <p className="text-gray-500 mb-8 text-sm">
        This form tests every supported field type. Submit to see captured data below.
        {" "}<a href="/test-form/4" className="text-blue-500 hover:underline">Test real Form 4 (file upload)</a>
        {" | "}<a href="/test-form/7" className="text-blue-500 hover:underline">Test real Form 7 (multi file upload)</a>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* --- TEXT --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Text Input</h3>
          <label className={labelClasses}>Full Name *</label>
          <input
            type="text"
            {...register("text_field", { required: "Name is required" })}
            placeholder="John Doe"
            className={inputClasses}
          />
          {errors.text_field && <div className={errorClasses}>{errors.text_field.message as string}</div>}
        </div>

        {/* --- EMAIL --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Email</h3>
          <label className={labelClasses}>Email Address *</label>
          <input
            type="email"
            {...register("email_field", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            })}
            placeholder="john@example.com"
            className={inputClasses}
          />
          {errors.email_field && <div className={errorClasses}>{errors.email_field.message as string}</div>}
          <div className="mt-4">
            <label className={labelClasses}>Confirm Email</label>
            <input
              type="email"
              {...register("email_confirm")}
              placeholder="Confirm email"
              className={inputClasses}
            />
          </div>
        </div>

        {/* --- PHONE --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Phone</h3>
          <label className={labelClasses}>Phone Number</label>
          <input
            type="tel"
            {...register("phone_field")}
            placeholder="778-908-2804"
            className={inputClasses}
            autoComplete="tel"
          />
        </div>

        {/* --- NUMBER --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Number</h3>
          <label className={labelClasses}>Vehicle Year</label>
          <input
            type="number"
            {...register("number_field")}
            placeholder="2024"
            className={inputClasses}
          />
        </div>

        {/* --- TEXTAREA --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Textarea</h3>
          <label className={labelClasses}>Message *</label>
          <textarea
            {...register("textarea_field", { required: "Message is required" })}
            placeholder="Describe your situation..."
            className="relative w-full m-0 bg-transparent border border-[#e5efef] appearance-none rounded-none shadow-none outline-none px-5 py-4 focus:border-primary min-h-[150px] max-w-full text-base"
            rows={4}
          />
          {errors.textarea_field && <div className={errorClasses}>{errors.textarea_field.message as string}</div>}
        </div>

        {/* --- SELECT --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Select / Dropdown</h3>
          <label className={labelClasses}>Vehicle Make</label>
          <div className="relative">
            <select {...register("select_field")} className={inputClasses}>
              <option value="">Select...</option>
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="ford">Ford</option>
              <option value="bmw">BMW</option>
              <option value="other">Other</option>
            </select>
            <div className="absolute right-[30px] top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#ccd7de] pointer-events-none" />
          </div>
        </div>

        {/* --- RADIO --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Radio Buttons</h3>
          <span className={labelClasses}>Were you in a car accident?</span>
          <div className="flex flex-wrap max-w-[500px]">
            {["Yes", "No"].map((choice) => (
              <label key={choice} className="mr-5 mb-2 cursor-pointer">
                <input
                  type="radio"
                  value={choice}
                  {...register("radio_field")}
                  className="peer hidden"
                />
                <span className="flex items-center justify-center min-w-[125px] px-[25px] py-[10px] bg-[#f2f2f2] transition-all duration-300 cursor-pointer hover:bg-[#2c312c] hover:text-white peer-checked:bg-[#00b040] peer-checked:text-white">
                  {choice}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* --- CHECKBOX --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Checkboxes</h3>
          <span className={labelClasses}>Services Needed</span>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {["Vehicle Appraisal", "Depreciation Report", "Write-off Assistance", "Legal Support"].map((choice) => (
              <label key={choice} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value={choice} {...register("checkbox_field")} />
                {choice}
              </label>
            ))}
          </div>
        </div>

        {/* --- NAME (compound) --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Name (Compound Field)</h3>
          <label className={labelClasses}>Your Name</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input type="text" {...register("name_first")} placeholder="First" className={inputClasses} autoComplete="given-name" />
              <span className="text-xs text-gray-500 mt-1 block">First</span>
            </div>
            <div>
              <input type="text" {...register("name_last")} placeholder="Last" className={inputClasses} autoComplete="family-name" />
              <span className="text-xs text-gray-500 mt-1 block">Last</span>
            </div>
          </div>
        </div>

        {/* --- ADDRESS (compound) --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Address (Compound Field)</h3>
          <label className={labelClasses}>Address</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <input type="text" {...register("address_street")} placeholder="Street Address" className={inputClasses} />
              <span className="text-xs text-gray-500 mt-1 block">Street Address</span>
            </div>
            <div>
              <input type="text" {...register("address_city")} placeholder="City" className={inputClasses} />
              <span className="text-xs text-gray-500 mt-1 block">City</span>
            </div>
            <div>
              <input type="text" {...register("address_state")} placeholder="Province / State" className={inputClasses} />
              <span className="text-xs text-gray-500 mt-1 block">Province / State</span>
            </div>
            <div>
              <input type="text" {...register("address_zip")} placeholder="Postal Code" className={inputClasses} />
              <span className="text-xs text-gray-500 mt-1 block">Postal / Zip</span>
            </div>
            <div>
              <input type="text" {...register("address_country")} placeholder="Country" className={inputClasses} />
              <span className="text-xs text-gray-500 mt-1 block">Country</span>
            </div>
          </div>
        </div>

        {/* --- DATE --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Date</h3>
          <label className={labelClasses}>Date of Incident</label>
          <input type="date" {...register("date_field")} className={inputClasses} />
        </div>

        {/* --- TIME --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Time</h3>
          <label className={labelClasses}>Preferred Contact Time</label>
          <input type="time" {...register("time_field")} className={inputClasses} />
        </div>

        {/* --- WEBSITE --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Website / URL</h3>
          <label className={labelClasses}>Website</label>
          <input type="url" {...register("website_field")} placeholder="https://" className={inputClasses} />
        </div>

        {/* --- FILE UPLOAD (single) --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">File Upload (Single)</h3>
          <label className={labelClasses}>Upload Document</label>
          <div className="relative w-full border border-[#e5efef] bg-transparent">
            <input
              type="file"
              onChange={(e) => fileInputsRef.current.set("file_single", e.target.files)}
              className="w-full px-5 py-4 text-base file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-contrast hover:file:opacity-80 cursor-pointer"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Any file type</p>
        </div>

        {/* --- FILE UPLOAD (multiple) --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">File Upload (Multiple)</h3>
          <label className={labelClasses}>Upload Multiple Documents</label>
          <div className="relative w-full border border-[#e5efef] bg-transparent">
            <input
              type="file"
              multiple
              onChange={(e) => fileInputsRef.current.set("file_multiple", e.target.files)}
              className="w-full px-5 py-4 text-base file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-contrast hover:file:opacity-80 cursor-pointer"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Select multiple files</p>
        </div>

        {/* --- FILE UPLOAD (restricted extensions) --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">File Upload (Images Only)</h3>
          <label className={labelClasses}>Upload Photo of Vehicle</label>
          <div className="relative w-full border border-[#e5efef] bg-transparent">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={(e) => fileInputsRef.current.set("file_image", e.target.files)}
              className="w-full px-5 py-4 text-base file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-contrast hover:file:opacity-80 cursor-pointer"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Allowed: jpg, jpeg, png, gif</p>
        </div>

        {/* --- CONSENT --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Consent</h3>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" {...register("consent_field")} className="mt-1" />
            <span className="text-sm">I agree to the terms and conditions and consent to having my data processed.</span>
          </label>
        </div>

        {/* --- HTML (display only) --- */}
        <div className={sectionClasses}>
          <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">HTML (Display Only)</h3>
          <div className="prose max-w-full bg-gray-50 p-4 rounded">
            <p><strong>Important:</strong> Please ensure all documents are legible and complete before uploading. Incomplete submissions may delay processing.</p>
          </div>
        </div>

        {/* --- SECTION BREAK --- */}
        <div className="mb-[25px] border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-900">Section Break Example</h3>
          <p className="text-sm text-gray-500 mt-1">This is a visual divider between form sections</p>
        </div>

        {/* --- SUBMIT --- */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-primary-contrast bg-primary border-0 py-2 px-6 focus:outline-none hover:opacity-80 rounded text-lg disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Test Submit"}
        </button>
      </form>

      {/* --- OUTPUT --- */}
      {result && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">Captured Data:</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
