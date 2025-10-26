import { useState,useRef ,useEffect} from "react";
import { NetPayableCard } from "./NetPayableCard";
 import {
  validatePayslip,
hasAnyError,          // optional
findFirstErrorPath,
keepOnlyFirstError,
 EMPTY_ERRORS_SHAPE,
} from "../utils/validatePayslip"; 
import { createPayslip } from "../services/payslips";
import EmployeePaySummary from "./EmployeePaySummary";

export default function PayslipCompanyCard() {
      const [m, setM] = useState({ month: "" });
      const [payMonth, setPayMonth] = useState(""); // "YYYY-MM"
 const [errors, setErrors] = useState({ m:{}, company:{}, employee:{}, earnings:[], deductions:[] });
 const [submitted, setSubmitted] = useState(false);
 const firstErrorRef = useRef(null);
  const fileRef = useRef(null);

  const [logoFile, setLogoFile] = useState("");
  const [logoError, setLogoError] = useState("");  // <-- new
  const [logoPreview, setLogoPreview] = useState(null); // preview URL
     const [company, setCompany] = useState({ name: "", email: "", address: "" });
    const [employee, setEmployee] = useState({
      name: "",
      employeeId: "",
      email:"",
      phoneno:"",
      designation: "",
      paidDays: 0,
      lossOfPayDays:0,
      payDate:"",
      extraFields: [],
    });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(""); // top-level non-field error

  useEffect(() => {
  return () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
  };
}, [logoPreview]);
 
   const [earnings, setEarnings] = useState([
    { label: "Basic", amount: 0 },
    { label: "HRA", amount: 0 },
    { label: "Travel Allowance", amount: 0 },
  ]);

  const [deductions, setDeductions] = useState([
    { label: "TDS", amount: 0 },
    { label: "PF", amount: 0 },
  ]);

   const [activeStep, setActiveStep] = useState("company");
// ========================
  // Dynamic Fields Management
  // ========================
  const updateEarning = (i, key, value) => {
    const copy = [...earnings];
    copy[i][key] = key === "amount" ? Number(value || 0) : value;
    setEarnings(copy);
  };
  const addEarning = () => setEarnings([...earnings, { label: "", amount: 0 }]);
  const removeEarning = (i) =>
    setEarnings(earnings.filter((_, idx) => idx !== i));

  const updateDeduction = (i, key, value) => {
    const copy = [...deductions];
    copy[i][key] = key === "amount" ? Number(value || 0) : value;
    setDeductions(copy);
  };
  const addDeduction = () =>
    setDeductions([...deductions, { label: "", amount: 0 }]);
  const removeDeduction = (i) =>
    setDeductions(deductions.filter((_, idx) => idx !== i));

  const totalEarnings = earnings.reduce(
    (s, e) => s + (Number(e.amount) || 0),
    0
  );
  const totalDeductions = deductions.reduce(
    (s, d) => s + (Number(d.amount) || 0),
    0
  );
  const netPay = totalEarnings - totalDeductions;

   const resetForm = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setCompany(company);
    setEmployee(employee);
    setEarnings(earnings);
    setDeductions(deductions);
    setPayMonth("");
    setLogoFile(null);
    setErrors({});
    if (fileRef.current) fileRef.current.value = ""; // clear file input
  };

function validateOne(path) {
  const p = normalizePath(path);
  if (!p) return;

  const state = { m, company, employee, earnings, deductions };
  const msg = validateField(p, state);        // "" or the error string
  setErrors(prev => setAtPath(prev, p, msg)); // update ONLY that field's error
}
  const getImageSize = (file) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { resolve({ w: img.naturalWidth, h: img.naturalHeight }); URL.revokeObjectURL(url); };
      img.onerror = (e) => { reject(e); URL.revokeObjectURL(url); };
      img.src = url;
    });

const onLogoChange = async (e) => {
  const file = e.target.files?.[0] || null;
  setLogoError("");
  setLogoFile(null);

  // Clear old preview (and revoke)
  if (logoPreview) {
    URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
  }
  if (!file) return; // optional field

  // Type
  const okTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!okTypes.includes(file.type)) {
    setLogoError("Please upload a PNG, JPG, or WebP image.");
    return;
  }
  // Size
  if (file.size > 1024 * 1024) {
    setLogoError("File is too large. Max 1 MB allowed.");
    return;
  }
  // Dimensions
  try {
    const { w, h } = await getImageSize(file);
    if (w < 300 || h < 300) {
      setLogoError(`Image is ${w}×${h}. Minimum is 300×300 px.`);
      return;
    }
  } catch {
    setLogoError("Could not read image. Try another file.");
    return;
  }

  // Valid → set preview + file
  const nextPreview = URL.createObjectURL(file);
  setLogoPreview(nextPreview);
  setLogoFile(file);
};
 async function submitToServer(e) {
  e?.preventDefault?.();
  if (submitting) return;

  setSubmitted(true);
  setFormError("");
  setSubmitting(true);

  // 1) Validate ONLY core fields on submit
  const all = validatePayslip(
    { m, company, employee, earnings, deductions },
    { validateEarnings: false, validateDeductions: false, validateEmployeeExtra: false }
  );

  const first = findFirstErrorPath(all);
  if (first) {
    setErrors(keepOnlyFirstError(all, first));
    queueMicrotask(() => {
      const el = document.querySelector(`[data-error-key="${first.path}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus?.();
    });
    setSubmitting(false);
    return; // 🔒 Block submit until the first error is fixed
  }

  // 2) Optional logo: if present + invalid, block
  if (logoFile && logoError) {
    setFormError(logoError);
    setSubmitting(false);
    return;
  }

  // 3) Build payload (normalize numbers)
  const toNum = (v) => (v === "" || v == null ? 0 : Number(v) || 0);
  const normalized = {
    company,
    employee,
    // dynamic sections are allowed but not validated here
    earnings: (earnings ?? []).map(r => ({ ...r, amount: toNum(r.amount) })),
    deductions: (deductions ?? []).map(r => ({ ...r, amount: toNum(r.amount) })),
    payMonth: m?.month || "", // single source of truth
  };


  const fd = new FormData();
fd.append("company", JSON.stringify(company));
fd.append("employee", JSON.stringify(employee));
fd.append("earnings", JSON.stringify(earnings ?? []));
fd.append("deductions", JSON.stringify(deductions ?? []));
fd.append("payMonth", String(m.month ?? ""));
if (logoFile) fd.append("logo", logoFile);

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 20000); // 20s

  try {
    // NOTE: your `createPayslip` should NOT set Content-Type; let the browser set boundary.
    const data = await createPayslip(fd, { signal: ac.signal });
    clearTimeout(timer);

    alert(data?.message || "Uploaded successfully!");
    // Optional: soft reset UI here if you want
    // setErrors(EMPTY_ERRORS_SHAPE); setSubmitted(false); setFormError("");
  } catch (err) {
    clearTimeout(timer);

    if (err.name === "AbortError") {
      setFormError("Request timed out. Please try again.");
    } else {
      // If server returns per-field errors in { errors: { ... } } shape, surface them:
      if (err.data?.errors) setErrors(err.data.errors);
      setFormError(err.friendlyMessage || err.message || "Something went wrong.");
      console.error("Submit failed:", err);
    }
  } finally {
    setSubmitting(false);
  }
}


  return (
    <div className="w-full max-w-[960px] mx-auto">
      {/* Card */}
      <form onSubmit={submitToServer}>
        <div className="relative overflow-hidden rounded-[20px] border border-[#10324F]/40">
        {/* Header */}
        {formError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </div>)}
        <header className="relative z-10 flex items-center justify-between px-6 sm:px-8 pt-5 pb-4">
          <h2 className="text-[22px] font-semibold text-[#0f2a44]">
            Payslip for Month
          </h2>
        
           <div className="space-y-2">
               
          <input
  data-error-key="m.month"
  type="month"
  value={m.month || ""}
  onChange={(e) => setM({ month: e.target.value })}
/>
{submitted && errors.m?.month && (
  <p className="text-xs text-red-600">{errors.m.month}</p>
)}
                </div>
        </header>
          <div className="w-full h-0 border-t border-[#10324F] mb-10" />


        {/* Body */}
        <div className="relative z-10 px-6 sm:px-8 pb-8">
  <div className="grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] gap-4 sm:gap-6"> 
  <div className="w-fit">
  <label
    className={`group relative flex flex-col items-center justify-center
      rounded-[10px] border
      ${logoError ? "border-red-500 ring-2 ring-red-500/40" : "border-[#10324F]/35"}
      bg-white/45 backdrop-blur-[6px]
      aspect-square h-28 sm:h-32 p-2 cursor-pointer transition`}
    aria-invalid={!!logoError}
    aria-describedby={logoError ? "logo-error" : undefined}
  >
    {(logoPreview || company.logo) ? (
      <img
        src={logoPreview || company.logo}
        alt="Company logo"
        className="h-full w-full object-contain rounded-md"
      />
    ) : (
      <>
        <CloudIcon className="w-8 h-8 opacity-70 mb-1.5" />
        <div className="text-center">
          <p className="text-[12px] leading-none text-[#0f2a44]">Upload Logo</p>
          <p className="text-[10px] leading-tight text-[#0f2a44]/60 mt-1">
            300×300 · Max 1 MB
          </p>
        </div>
      </>
    )}

    <input
      type="file"
      accept="image/png,image/jpeg,image/jpg,image/webp"
      className="absolute inset-0 opacity-0 cursor-pointer"
      onChange={onLogoChange}
    />

    {(logoPreview || company.logo) && (
      <span className="absolute bottom-1.5 right-1.5 text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-white">
        Change
      </span>
    )}
  </label>

  {logoError ? (
    <p id="logo-error" className="mt-1 text-[11px] text-red-600">{logoError}</p>
  ) : (
    <>
      {logoFile && (
        <p className="mt-1 text-[11px] text-[#0f2a44] truncate">Selected: {logoFile.name}</p>
      )}
      {/* {!logoFile && !company.logo && (
       
         <div className="text-center">
          <p className="text-[12px] leading-none text-[#0f2a44]">Upload Logo</p>
          <p className="text-[10px] leading-tight text-[#0f2a44]/60 mt-1">
            300×300 · Max 1 MB
          </p>
        </div>
      )} */}
    </>
  )}
</div>


    <div className="space-y-3">
     <Input
  data-error-key="company.name"
  placeholder="Company name"
  value={company.name || ""}
  onChange={(v) => setCompany((c) => ({ ...c, name: v }))}
  error={submitted ? (errors.company?.name || "") : ""}
/>

      <Input
      data-error-key="company.address"
        placeholder="Company Address"
        value={company.address || ""}
        onChange={(v) => setCompany((c) => ({ ...c, address: v }))}
        error={submitted ? (errors.company?.address || "") : ""}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
  <Input
    data-error-key="company.city"
    placeholder="City"
    value={company.city || ""}
    onChange={(v) => setCompany((c) => ({ ...c, city: v }))}
    error={submitted ? (errors.company?.city || "") : ""}
  />
  <Input
    data-error-key="company.state"
    placeholder="State"
    value={company.state || ""}
    onChange={(v) => setCompany((c) => ({ ...c, state: v }))}
    error={submitted ? (errors.company?.state || "") : ""}
  />
  <Input
    data-error-key="company.country"
    placeholder="Country"
    value={company.country || ""}
    onChange={(v) => setCompany((c) => ({ ...c, country: v }))}
    error={submitted ? (errors.company?.country || "") : ""}
  />
  <Input
    data-error-key="company.zip"
    placeholder="Zip"
    value={company.zip || ""}
    onChange={(v) => setCompany((c) => ({ ...c, zip: v }))}
    error={submitted ? (errors.company?.zip || "") : ""}
  />
  <Input
    data-error-key="company.email"
    placeholder="Email"
    value={company.email || ""}
    onChange={(v) => setCompany((c) => ({ ...c, email: v }))}
    error={submitted ? (errors.company?.email || "") : ""}
  />
  <Input
    data-error-key="company.phone"
    placeholder="Phone"
    value={company.phone || ""}
    onChange={(v) => setCompany((c) => ({ ...c, phone: v }))}
    error={submitted ? (errors.company?.phone || "") : ""}
  />
</div>

    </div>
  </div>
</div>

   <div className="w-full h-0 border-t border-[#10324F] mb-6"></div>
        <div className="max-w-4xl mx-auto">
     <div className="relative z-10 px-6 sm:px-8 pb-8">
            <h2 className="text-center font-semibold mb-3">
                Employee Details Summary <span className="text-red-600" aria-hidden>*</span>
                <span className="sr-only">required</span>
                </h2>
{/* <EmployeePaySummary
        employee={employee}
        setEmployee={setEmployee}
        errors={errors}
        submitted={submitted}
      /> */}

          <div className="rounded-xl border p-4 md:p-5 text-[#0f2a44] shadow-sm">
            
            <div className="grid md:grid-cols-2 gap-3">
             <Input
              label="Employee Name"
             data-error-key="employee.name"
                placeholder="Employee Name"
                value={employee.name}
                onChange={(v) => setEmployee((e) => ({ ...e, name: v }))}
                 error={submitted ? (errors.employee?.name || "") : ""}
              />
               <Input 
                label="Employee ID" 
                data-error-key="employee.employeeId"
                placeholder="Employee ID"
                value={employee.employeeId}
                onChange={(v) => setEmployee((e) => ({ ...e, employeeId: v }))}
                 error={submitted ? (errors.employee?.employeeId || "") : ""}
              />
          
              <Input
               label="Employee Email"
               data-error-key="employee.email"
                placeholder="Email"
                value={employee.email}
                onChange={(v) =>setEmployee((e) => ({ ...e, email: v }))}
                onFocus={() => setActiveStep("employee")}
                 error={submitted ? (errors.employee?.email || "") : ""}
              />
              <Input
               label="Phone No"
               data-error-key="employee.phoneno"
               type="Number"
                placeholder="Phone Number"
                value={employee.phoneno}
                onChange={(v) =>setEmployee((e) => ({ ...e, phoneno: v }))}
                onFocus={() => setActiveStep("employee")}
                 error={submitted ? (errors.employee?.phoneno || "") : ""}
              />
              <Input
              label="Designation"
               data-error-key="employee.designation"
                placeholder="Designation"
                value={employee.designation}
                onChange={(v) =>setEmployee((e) => ({ ...e, designation: v }))}                
                onFocus={() => setActiveStep("employee")}
                error={submitted ? (errors.employee?.designation || "") : ""}
              />
              <Input
              label="Pay Date"
               data-error-key="employee.payDate"
                type="date"
                placeholder="Pay Date"
                value={employee.payDate ||""}
                onChange={(v) =>setEmployee((e) => ({ ...e, payDate: v }))}
                onFocus={() => setActiveStep("employee")}
                error={submitted ? (errors.employee?.payDate || "") : ""}
              />
              <Input
              label="Paid Days"
               data-error-key="employee.paidDays"
                placeholder="Paid Days"
                type="Number"
                value={employee.paidDays}
                onChange={(v) =>setEmployee((e) => ({ ...e, paidDays: v }))}
                onFocus={() => setActiveStep("employee")}
                error={submitted ? (errors.employee?.paidDays || "") : ""}
              />
              <Input
               label="Loss of Pay Days"
               data-error-key="employee.lossOfPayDays"
                placeholder="Loss of Pay Days"
                value={employee.lossOfPayDays}
                onChange={(v) =>setEmployee((e) => ({ ...e, lossOfPayDays: v }))}
                onFocus={() => setActiveStep("employee")}
                error={submitted ? (errors.employee?.lossOfPayDays || "") : ""}
              />
             
            </div>
{/* 
         <div className="mt-4 text-left">  
  
{employee.extraFields.map((field, idx) => (
  <div
    key={idx}
    className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 items-start gap-2 sm:gap-3 mb-3"
  >
    <div className="sm:col-span-3 md:col-span-7 flex sm:flex-row flex-col gap-2">
   
    <input
      className="p-2 border w-full min-w-0 sm:col-span-3 md:col-span-5      
          rounded-[10px] h-10 px-3
          bg-white/65 backdrop-blur-[6px]
          border border-[#10324F]/25
          text-[#0f2a44] placeholder:text-[#0f2a44]/40
          shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]
          focus:outline-none focus:ring-2 focus:ring-[#10324F]/25
      "
      placeholder="Field Label (e.g. Department)"
      value={field.label}
      onChange={(e) => {
        const fields = [...employee.extraFields];
        fields[idx].label = e.target.value;
        setEmployee({ ...employee, extraFields: fields });
      }}
      onFocus={() => setActiveStep("employee")}
    />

   
    <input
      className="p-2 border w-full min-w-0 sm:col-span-3 md:col-span-5      
          rounded-[10px] h-10 px-3
          bg-white/65 backdrop-blur-[6px]
          border border-[#10324F]/25
          text-[#0f2a44] placeholder:text-[#0f2a44]/40
          shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]
          focus:outline-none focus:ring-2 focus:ring-[#10324F]/25"
      placeholder="Field Value (e.g. IT)"
      value={field.value}
      onChange={(e) => {
        const fields = [...employee.extraFields];
        fields[idx].value = e.target.value;
        setEmployee({ ...employee, extraFields: fields });
      }}
      onFocus={() => setActiveStep("employee")}
    />

   
    <button
      type="button"
      onClick={() =>
        setEmployee((prev) => ({
          ...prev,
          extraFields: prev.extraFields.filter((_, i) => i !== idx),
        }))
      }
      className="text-red-500 font-bold"
      aria-label="Remove field"
      title="Remove"
    >
      ×
    </button>
    </div>
  </div>
))}


              <button
              onClick={() =>
                setEmployee((e) => ({
                  ...e,
                  extraFields: [...e.extraFields, { label: "", value: "" }],
                }))
              }
              className="inline-flex items-center gap-2 font-semibold text-[#0f2a44] hover:opacity-90"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0f2a44] text-left">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="text-[15px]">Add Fields</span>
            </button>

            </div> */}
            </div>
        </div>
    </div>
         <div className="relative z-10 px-6 sm:px-8 pb-8">
            <h2 className="text-center font-semibold mb-3">
                Income Details <span className="text-red-600" aria-hidden>*</span>
                <span className="sr-only">required</span>
                </h2>
        
<div className="rounded-xl border p-4 md:p-5 text-[#0f2a44] shadow-sm">
  {/* Two-column area with a separator */}
  <div className="grid md:grid-cols-2 gap-4">
    {/* Earnings (left) */}
    <div>
      <h4 className="font-semibold mb-2">Earnings</h4>
      {earnings.map((e, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <InlineInput
            value={e.label}
            onChange={(v) => updateEarning(i, "label", v)}
            onFocus={() => setActiveStep("earnings")}
            placeholder="Label"
          />
          <InlineInput
            type="number"
            value={e.amount}
            onChange={(v) => updateEarning(i, "amount", v)}
            onFocus={() => setActiveStep("earnings")}
            placeholder="0"
            inputClassName="w-24 text-right"
          />
          <button
            onClick={() => removeEarning(i)}
            className="text-red-500 font-bold"
            aria-label="Remove earning row"
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={addEarning}
        className="inline-flex items-center gap-2 font-semibold text-[#0f2a44] hover:opacity-90"
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0f2a44]">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-[15px]">Add Earnings</span>
      </button>
    </div>

    {/* Deductions (right) with vertical separator */}
    <div className="md:border-l md:pl-4 border-[#10324F]/80">
      <h4 className="font-semibold mb-2">Deductions</h4>
      {deductions.map((d, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <InlineInput
            value={d.label}
            onChange={(v) => updateDeduction(i, "label", v)}
            onFocus={() => setActiveStep("deductions")}
            placeholder="Label"
          />
          <InlineInput
            type="number"
            value={d.amount}
            onChange={(v) => updateDeduction(i, "amount", v)}
            onFocus={() => setActiveStep("deductions")}
            placeholder="0"
            inputClassName="w-24 text-right"
          />
          <button
            onClick={() => removeDeduction(i)}
            className="text-red-500 font-bold"
            aria-label="Remove deduction row"
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={addDeduction}
        className="inline-flex items-center gap-2 font-semibold text-[#0f2a44] hover:opacity-90"
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0f2a44]">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-[15px]">Add Deduction</span>
      </button>
    </div>
  </div>

  {/* Totals row */}
  <div className="mt-6 grid md:grid-cols-2 gap-4">
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <span className="text-sm font-semibold text-slate-700">Total Earnings</span>
      <span className="text-sm tabular-nums font-semibold">₹{totalEarnings.toFixed(2)}</span>
    </div>
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <span className="text-sm font-semibold text-slate-700">Total Deductions</span>
      <span className="text-sm tabular-nums font-semibold">₹{totalDeductions.toFixed(2)}</span>
    </div>
  </div>
</div>

             <NetPayableCard earnings={earnings} deductions={deductions} />
  <div className="mt-6 grid grid-flow-col auto-cols-max justify-center gap-4">
  <button type="submit"
    className="px-6 py-2 rounded bg-[#10324F] text-white font-bold"
  >
    Generate Payslip
  </button>

  <button
    onClick={resetForm}
    className="px-6 py-2 rounded border hover:bg-gray-100 font-bold"
  >
    Reset
  </button>
</div>

          </div>
       </div>
</form>
    </div>
  );
}

/* ---------- Small atoms ---------- */
 // components/Input.jsx
// components/Input.jsx
 function Input({ label, error, className = "", onChange, onBlur, value, ...props }) {
  const handleChange = (e) => onChange?.(e?.target?.value ?? "", e);

  return (
    <div>
      {label && <label className="text-left block text-sm font-medium text-[#0f2a44] mb-1">{label}</label>}
      <input
        {...props}
        value={value ?? ""}
        onChange={handleChange}
        className={`w-full rounded-[10px] h-10 px-3
          bg-white/65 backdrop-blur-[6px]
          border ${error ? "border-red-500 ring-2 ring-red-500/50" : "border-[#10324F]/25"}
          text-[#0f2a44] placeholder:text-[#0f2a44]/40
          shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]
          focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500/50" : "focus:ring-[#10324F]/25"}
          ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.name || props.id}-error` : undefined}
      />
      {error && <p id={`${props.name || props.id}-error`} className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// components/InlineInput.jsx
function InlineInput({ error, inputClassName = "", onChange, onBlur, value, ...props }) {
  const handleChange = (e) => onChange?.(e?.target?.value ?? "", e);

  return (
    <div className="min-w-0">
      <input
        {...props}
        value={value ?? ""}
        onChange={handleChange}
        className={`w-full rounded-[10px] h-10 px-3 border
          ${error ? "border-red-500 ring-2 ring-red-500/50" : "border-[#10324F]/25"}
          bg-white/65 text-[#0f2a44] placeholder:text-[#0f2a44]/40
          focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500/50" : "focus:ring-[#10324F]/25"}
          ${inputClassName}`}
        aria-invalid={!!error}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}



// components/InlineInput.jsx
// export function InlineInput({ error, inputClassName = "", ...props }) {
//   return (
//     <div className="min-w-0">
//       <input
//         {...props}
//         className={`rounded-[10px] h-10 px-3 border
//           ${error ? "border-red-500 ring-2 ring-red-500/50" : "border-[#10324F]/25"}
//           bg-white/65 text-[#0f2a44] placeholder:text-[#0f2a44]/40
//           focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500/50" : "focus:ring-[#10324F]/25"}
//           ${inputClassName}`}
//         aria-invalid={!!error}
//       />
//       {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
//     </div>
//   );
// }

// function Input({ label, value, onChange, placeholder }) {
//   return (
//     <label className="block">
//       <div className="mb-1 text-[13px] font-medium text-[#0f2a44]/85 text-left">{label}</div>
//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full h-8 px-3 rounded-lg
//        bg-white/70 backdrop-blur-sm
//        border border-slate-800/25
//        text-slate-900 placeholder:text-slate-500
//        shadow-inner
//        focus:outline-none focus:ring-2 focus:ring-slate-800/25"
//       />
//     </label>
//   );
// }

/* --- reuse your Input look inline --- */
// function InlineInput({
//   value,
//   onChange,
//   placeholder,
//   type = "text",
//   inputClassName = "",
//   onFocus,
// }) {
//   return (
//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       onFocus={onFocus}
//       placeholder={placeholder}
//       className={`w-full h-8 px-3 rounded-lg
//        bg-white/70 backdrop-blur-sm
//        border border-slate-800/25
//        text-slate-900 placeholder:text-slate-500
//        shadow-inner
//        focus:outline-none focus:ring-2 focus:ring-slate-800/25 ${inputClassName}
//       `}
//     />
//   );
// }

// function Input({
//   label,                 // optional
//   value,
//   onChange,
//   placeholder,
//   required = false,
//   labelWidth = "160px",  // used only when label is shown
// }) {
//   const showLabel = Boolean(label);

//   return (
//     <label className={`w-full ${showLabel ? "flex items-center gap-2" : "block"}`}>
//       {showLabel && (
//         <>
//           <span
//             className="text-[13px] font-medium text-[#0f2a44]/85 shrink-0"
//             style={{ width: labelWidth }}
//           >
//             {label}{required && <span className="text-red-600"> *</span>}
//           </span>
//           <span className="opacity-60">:</span>
//         </>
//       )}

//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className={`
//           ${showLabel ? "flex-1" : "w-full"}
//           rounded-[10px] h-10 px-3
//           bg-white/65 backdrop-blur-[6px]
//           border border-[#10324F]/25
//           text-[#0f2a44] placeholder:text-[#0f2a44]/40
//           shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]
//           focus:outline-none focus:ring-2 focus:ring-[#10324F]/25
//         `}
//         aria-required={required || undefined}
//         aria-label={!showLabel ? (placeholder || "input") : undefined}  /* a11y when no label */
//       />
//     </label>
//   );
// }



function CloudIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 18h10a4 4 0 0 0 .7-7.95A6 6 0 0 0 7.2 7.3 4.5 4.5 0 0 0 7 16.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12v6m0 0-2-2m2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
