import { React, useState, useRef, useEffect } from "react";
import { NetPayableCard } from "./NetPayableCard";
import InputEmp from "./ui/InputEmp";
import {
  validatePayslip,
  hasAnyError, // optional
  findFirstErrorPath,
  keepOnlyFirstError,
  EMPTY_ERRORS_SHAPE,
} from "../utils/validatePayslip";
import { createPayslip } from "../services/payslips";
import EmployeeInfoSection from "./EmployeeInfoSection";
import MonthField from "./ui/MonthField";
import uploadImg from "../assets/upload.png";
import FieldList from "./ui/FieldSet";

export default function PayslipCompanyCard({
  activeStep,
  setActiveStep,
  steps,
}) {
  const [m, setM] = useState({ month: "" });
  const [payMonth, setPayMonth] = useState(""); // "YYYY-MM"
  const [errors, setErrors] = useState({
    m: {},
    company: {},
    employee: {},
    earnings: [],
    deductions: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const ref = useRef();
  const [logoFile, setLogoFile] = useState("");
  const [logoError, setLogoError] = useState(""); // <-- new
  const [logoPreview, setLogoPreview] = useState(null); // preview URL
  const [company, setCompany] = useState({ name: "", email: "", address: "" });
  const [employee, setEmployee] = useState({
    name: "",
    employeeId: "",
    email: "",
    phoneno: "",
    designation: "",
    paidDays: "",
    lossOfPayDays: "",
    payDate: "",
    extraFields: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(""); // top-level non-field error
  const inr = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

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
    { label: "ESI", amount: 0 },
  ]);
  // const LABEL_W = "clamp(90px, 16vw, 130px)";
  const LABEL_W = "clamp(68px, 25vw, 130px)";

  const addEarning = () => setEarnings([...earnings, { label: "", amount: 0 }]);
  const addDeduction = () =>
    setDeductions([...deductions, { label: "", amount: 0 }]);
  // const removeDeduction = (i) =>
  //   setDeductions(deductions.filter((_, idx) => idx !== i));
  const isLockedRow = (i) => i < 3;

  function updateDeduction(index, field, value) {
    setDeductions((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        // prevent editing label for the first 3 rows
        if (field === "label" && isLockedRow(i)) return row;
        return {
          ...row,
          [field]: field === "amount" ? Number(value || 0) : value,
        };
      })
    );
  }

  function removeDeduction(index) {
    setDeductions((prev) => prev.filter((_, i) => i !== index));
  }
  const isLockedEarning = (i) => i < 3;

  function updateEarning(index, field, value) {
    setEarnings((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        if (field === "label" && isLockedEarning(i)) return row; // lock first 3 labels
        return {
          ...row,
          [field]: field === "amount" ? Number(value || 0) : value,
        };
      })
    );
  }

  function removeEarning(index) {
    setEarnings((prev) => prev.filter((_, i) => i !== index));
  }

  const totalEarnings = earnings.reduce(
    (s, e) => s + (Number(e.amount) || 0),
    0
  );
  const totalDeductions = deductions.reduce(
    (s, d) => s + (Number(d.amount) || 0),
    0
  );
  const netPay = totalEarnings - totalDeductions;
  const handleClose = () => {
    setShowModal(false);
    setPdfUrl(null);
  };

  const resetForm = () => {
    // setPdfUrl(data.pdfUrl);

    // Open the modal
    // setShowModal(true);
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
    const msg = validateField(p, state); // "" or the error string
    setErrors((prev) => setAtPath(prev, p, msg)); // update ONLY that field's error
  }
  const getImageSize = (file) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        resolve({ w: img.naturalWidth, h: img.naturalHeight });
        URL.revokeObjectURL(url);
      };
      img.onerror = (e) => {
        reject(e);
        URL.revokeObjectURL(url);
      };
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
  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "payslip.pdf";
      link.click();
    }
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
      {
        validateEarnings: false,
        validateDeductions: false,
        validateEmployeeExtra: false,
      }
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
      earnings: (earnings ?? []).map((r) => ({
        ...r,
        amount: toNum(r.amount),
      })),
      deductions: (deductions ?? []).map((r) => ({
        ...r,
        amount: toNum(r.amount),
      })),
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

      alert(data?.message || "Saved successfully!");
      // Optional: soft reset UI here if you want
      // setErrors(EMPTY_ERRORS_SHAPE); setSubmitted(false); setFormError("");
    } catch (err) {
      clearTimeout(timer);

      if (err.name === "AbortError") {
        setFormError("Request timed out. Please try again.");
      } else {
        // If server returns per-field errors in { errors: { ... } } shape, surface them:
        if (err.data?.errors) setErrors(err.data.errors);
        setFormError(
          err.friendlyMessage || err.message || "Something went wrong."
        );
        console.error("Submit failed:", err);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="w-full mx-auto mt-10">
        {/* Card */}
        <form onSubmit={submitToServer}>
          <div className="relative overflow-hidden rounded-[10px] border border-[#10324F]">
            {/* Header */}
            {formError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            )}
            {/* <header className="relative z-10 flex items-center justify-between px-6 sm:px-8 pt-5 pb-4"> */}
            <header className="flex items-center justify-between gap-3 px-3 pt-3 pb-2">
              <h2 className="text-sm font-semibold text-[#0f2a44]">
                Payslip for Month
              </h2>

              <div className="flex items-center gap-2">
                {/*   <MonthField
          value={m.month}                         // "2025-10"
          onChange={(val) => setM({ month: val })}
          color="#10324f"                         // your custom selected color
        />              */}
                <input
                  id="monthfield"
                  data-error-key="m.month"
                  type="month"
                  value={m.month || ""}
                  onChange={(e) => setM({ month: e.target.value })}
                  onFocus={() => setActiveStep("month")}
                  className="h-9 w-full max-w-[150px] text-sm"
                />

                {submitted && errors.m?.month && (
                  <p className="text-xs text-red-600">{errors.m.month}</p>
                )}
              </div>
            </header>
            <div className="w-full h-0 border-t border-[#10324F] mb-3" />

            {/* Body */}
            <div className="px-4 pb-4">
              <div className="grid grid-cols-[110px_minmax(0,1fr)] sm:grid-cols-[140px_minmax(0,1fr)] gap-3 sm:gap-6">
                {/* <div className="w-[110px] sm:w-[140px] h-[110px]">
            <label
              className={`group relative flex flex-col items-center justify-center
                rounded-lg border
                ${logoError ? "border-red-500 ring-2 ring-red-500/40" : "border-[#10324F]/35"}
                bg-white/45 backdrop-blur-[6px] sm:h-24 p-2 cursor-pointer transition`}
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
                <img
                          src={uploadImg}
                          alt=""
                          className="w-8 h-8 mb-1.5 object-contain pointer-events-none select-none"
                          aria-hidden="true"
                        />
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
              </>
            )}
          </div> */}
                <div className="w-[110px] sm:w-[140px] h-[110px]">
                  <label
                    className={`group relative flex h-full w-full flex-col items-center justify-center
      rounded-lg border
      ${
        logoError
          ? "border-red-500 ring-2 ring-red-500/40"
          : "border-[#10324F]/35"
      }
      bg-white/45 backdrop-blur-[6px] p-2 cursor-pointer transition`}
                    aria-invalid={!!logoError}
                    aria-describedby={logoError ? "logo-error" : undefined}
                  >
                    {logoPreview || company.logo ? (
                      <img
                        src={logoPreview || company.logo}
                        alt="Company logo"
                        className="h-full w-full object-contain rounded-md"
                      />
                    ) : (
                      <>
                        <img
                          src={uploadImg}
                          alt=""
                          className="w-8 h-8 mb-1.5 object-contain pointer-events-none select-none"
                          aria-hidden="true"
                        />
                        <div className="text-center">
                          <p className="text-[12px] leading-none text-[#0f2a44]">
                            Upload Logo
                          </p>
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
                    <p
                      id="logo-error"
                      className="mt-1 text-[11px] text-red-600"
                    >
                      {logoError}
                    </p>
                  ) : (
                    logoFile && (
                      <p className="mt-1 text-[11px] text-[#0f2a44] truncate">
                        Selected: {logoFile.name}
                      </p>
                    )
                  )}
                </div>

                <div data-step-section="company" className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="col-span-2 md:col-span-3 grid grid-cols-2 gap-3">
                      <Input
                        data-error-key="company.name"
                        placeholder="Company name"
                        value={company.name || ""}
                        onChange={(v) => setCompany((c) => ({ ...c, name: v }))}
                        error={submitted ? errors.company?.name || "" : ""}
                        onFocus={() => setActiveStep("company")}
                      />

                      <Input
                        data-error-key="company.address"
                        placeholder="Company Address"
                        value={company.address || ""}
                        onChange={(v) =>
                          setCompany((c) => ({ ...c, address: v }))
                        }
                        error={submitted ? errors.company?.address || "" : ""}
                        onFocus={() => setActiveStep("company")}
                      />
                    </div>
                    <Input
                      data-error-key="company.city"
                      placeholder="City"
                      value={company.city || ""}
                      onChange={(v) => setCompany((c) => ({ ...c, city: v }))}
                      error={submitted ? errors.company?.city || "" : ""}
                      onFocus={() => setActiveStep("company")}
                    />
                    <Input
                      data-error-key="company.state"
                      placeholder="State"
                      value={company.state || ""}
                      onChange={(v) => setCompany((c) => ({ ...c, state: v }))}
                      error={submitted ? errors.company?.state || "" : ""}
                      onFocus={() => setActiveStep("company")}
                    />
                    <Input
                      data-error-key="company.country"
                      placeholder="Country"
                      value={company.country || ""}
                      onChange={(v) =>
                        setCompany((c) => ({ ...c, country: v }))
                      }
                      error={submitted ? errors.company?.country || "" : ""}
                      onFocus={() => setActiveStep("company")}
                    />
                    <Input
                      data-error-key="company.zip"
                      placeholder="Zip"
                      value={company.zip || ""}
                      onChange={(v) => setCompany((c) => ({ ...c, zip: v }))}
                      error={submitted ? errors.company?.zip || "" : ""}
                      onFocus={() => setActiveStep("company")}
                    />
                    <Input
                      data-error-key="company.email"
                      placeholder="Email"
                      value={company.email || ""}
                      onChange={(v) => setCompany((c) => ({ ...c, email: v }))}
                      error={submitted ? errors.company?.email || "" : ""}
                      onFocus={() => setActiveStep("company")}
                    />
                    <Input
                      data-error-key="company.phone"
                      placeholder="Phone"
                      value={company.phone || ""}
                      onChange={(v) => setCompany((c) => ({ ...c, phone: v }))}
                      error={submitted ? errors.company?.phone || "" : ""}
                      onFocus={() => setActiveStep("company")}
                    />
                  </div>
                </div>
              </div>
            </div>



            <div className="w-full h-0 border-t border-[#10324F]/40 mb-2"></div>
            <div className="mx-auto">
              <div
                data-step-section="employee"
                className="relative z-10 px-4 sm:px-4 pb-2"
              >
                <h2 className="text-left text-sm font-semibold mb-2">
                  Employee Details Summary{" "}
                  <span className="text-red-600" aria-hidden>
                    *
                  </span>
                  <span className="sr-only">required</span>
                </h2>
 <EmployeeInfoSection
  employee={employee || {}} // <-- fallback to empty object
  setEmployee={setEmployee}
  errors={errors}
  submitted={submitted}
  setActiveStep={setActiveStep}
  LABEL_W="60px"
/>
                {/* <section className="rounded-lg border p-4 md:p-5  border-[#10324F]/40 shadow-sm overflow-x-hidden">
                 
                  <div className="grid grid-cols-2 gap-3">
                    <InputEmp
                      variant="row"
                      labelWidth={LABEL_W}
                      label="Employee Name"
                      data-error-key="employee.name"
                      placeholder="Employee Name"
                      value={employee.name || ""}
                      onChange={(v) => setEmployee((e) => ({ ...e, name: v }))}
                      error={submitted ? errors.employee?.name || "" : ""}
                      onFocus={() => setActiveStep("employee")}
                    />
                    <InputEmp
                      variant="row"
                      labelWidth={LABEL_W}
                      label="Employee ID"
                      data-error-key="employee.employeeId"
                      placeholder="Employee Id"
                      value={employee.employeeId || ""}
                      onChange={(v) =>
                        setEmployee((e) => ({ ...e, employeeId: v }))
                      }
                      error={submitted ? errors.employee?.employeeId || "" : ""}
                      onFocus={() => setActiveStep("employee")}
                    />
                    <InputEmp
                      variant="row"
                      labelWidth={LABEL_W}
                      label="Employee Email"
                      data-error-key="employee.email"
                      placeholder="Employee email"
                      value={employee.email || ""}
                      onChange={(v) => setEmployee((e) => ({ ...e, email: v }))}
                      error={submitted ? errors.employee?.email || "" : ""}
                      onFocus={() => setActiveStep("employee")}
                    />
                    <InputEmp
                      variant="row"
                      labelWidth={LABEL_W}
                      label="Mobile No"
                      data-error-key="employee.phoneno"
                      placeholder="Mobile No."
                      value={employee.phoneno || ""}
                      onChange={(v) =>
                        setEmployee((e) => ({ ...e, phoneno: v }))
                      }
                      error={submitted ? errors.employee?.phoneno || "" : ""}
                      onFocus={() => setActiveStep("employee")}
                    />
                    <InputEmp
                      variant="row"
                      labelWidth={LABEL_W}
                      label="Designation"
                      data-error-key="employee.designation"
                      placeholder="Designation"
                      value={employee.designation || ""}
                      onChange={(v) =>
                        setEmployee((e) => ({ ...e, designation: v }))
                      }
                      error={
                        submitted ? errors.employee?.designation || "" : ""
                      }
                      onFocus={() => setActiveStep("employee")}
                    />
                    <InputEmp
                      variant="row"
                      labelWidth={LABEL_W}
                      label="Paid Days"
                      data-error-key="employee.paidDays"
                      placeholder="Paid Days"
                      value={String(employee.paidDays || "")}
                      onChange={(v) =>
                        setEmployee((e) => ({ ...e, paidDays: v }))
                      }
                      error={submitted ? errors.employee?.paidDays || "" : ""}
                      onFocus={() => setActiveStep("employee")}
                    />
                    <InputEmp
                      variant="row"
                      labelWidth={LABEL_W}
                      label="Loss of Pay Days"
                      data-error-key="employee.lossOfPayDays"
                      placeholder="Loss of Pay Days"
                      value={String(employee.lossOfPayDays || "")}
                      onChange={(v) =>
                        setEmployee((e) => ({ ...e, lossOfPayDays: v }))
                      }
                      error={
                        submitted ? errors.employee?.lossOfPayDays || "" : ""
                      }
                      onFocus={() => setActiveStep("employee")}
                    />
                    <InputEmp
                      variant="row"
                      labelWidth={LABEL_W}
                      label="Pay Date"
                      data-error-key="employee.payDate"
                      type="date"
                      value={employee.payDate || ""}
                      onChange={(v) =>
                        setEmployee((e) => ({ ...e, payDate: v }))
                      }
                      error={submitted ? errors.employee?.payDate || "" : ""}
                      onFocus={() => setActiveStep("employee")}
                    />
                  </div>
                </section> */}
              </div>
            </div>
            <div className="relative z-10 px-4 sm:px-4 pb-2">
              <h2 className="text-left text-sm font-semibold">
                Income Details{" "}
                <span className="text-red-600" aria-hidden>
                  *
                </span>
                <span className="sr-only">required</span>
              </h2>
          <div className="rounded-lg border px-4 md:p-5 border-[#10324F]/40 shadow-sm mt-2">     
<div className="grid grid-cols-2 md:grid-cols-[1fr_1fr] gap-x-0 md:gap-x-4 gap-y-2 md:items-start relative">
  {/* Middle divider for mobile */}
  <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-slate-200/60 md:hidden" />

  <FieldList
    title="Earnings"
    list={earnings}
    isLocked={isLockedEarning}
    updateItem={updateEarning}
    removeItem={removeEarning}
    addItem={addEarning}
  />

  <div className="md:border-l md:pl-4 border-[#10324F]/40">
    <FieldList
      title="Deductions"
      list={deductions}
      isLocked={isLockedRow}
      updateItem={updateDeduction}
      removeItem={removeDeduction}
      addItem={addDeduction}
    />
  </div>
</div></div>
              <div className="rounded-lg border px-4 md:p-5 border-[#10324F]/40 shadow-sm mt-2">
                {/* --- Mobile: 4-column grid --- */}
                {/* MOBILE ONLY — two-column structure */}
                <div
                  className="md:hidden"
                  style={{
                    // 52–80px for >=361px; on tiny screens we’ll use 50/50 columns
                    "--amt": "clamp(3.25rem, 22vw, 5rem)",
                    "--gap": "0.25rem",
                  }}
                >
                  {/* Header row (two columns) */}
                  <div className="relative grid grid-cols-2 px-2 py-2">
                    <div className="flex items-center justify-between pr-1">
                      <h4 className="text-[11px] font-semibold text-[#0f2a44]">
                        Earnings
                      </h4>
                      {/* equal at tiny screens, fixed width from 361px+ */}
                      <h4 className="text-[11px] font-semibold text-[#0f2a44] text-right w-auto min-[361px]:w-(--amt)">
                        Amount
                      </h4>
                    </div>
                    <div className="flex items-center justify-between pl-1">
                      <h4 className="text-[11px] font-semibold text-[#0f2a44]">
                        Deductions
                      </h4>
                      <h4 className="text-[11px] font-semibold text-[#0f2a44] text-right w-auto min-[361px]:w-(--amt)">
                        Amount
                      </h4>
                    </div>
                    {/* middle divider */}
                    <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-slate-300/60" />
                  </div>

                  {/* Rows (two columns, each side = Label | Amount) */}
                  <div className="relative grid grid-cols-2 gap-x-(--gap) gap-y-1 px-2 pb-2">
                    <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-slate-200/60" />

                    {Array.from({
                      length: Math.max(earnings.length, deductions.length),
                    }).map((_, i) => {
                      const e = earnings[i];
                      const d = deductions[i];

                      return (
                        <div className="contents" key={i}>
                          {/* Earnings side */}
                          <div
                            className="
              grid items-start gap-(--gap) pr-1
              grid-cols-2
              min-[361px]:grid-cols-[minmax(0,1fr)_var(--amt)]
            "
                          >
                            <div className="min-w-0 pr-0.5">
                              {e ? (
                                isLockedEarning(i) ? (
                                  <span
                                    className="
                      block text-[11px] leading-tight text-[#0f2a44]
                      whitespace-normal wrap-break-word hyphens-auto
                      line-clamp-2
                    "
                                  >
                                    {e.label}
                                  </span>
                                ) : (
                                  <InlineInput
                                    value={e.label}
                                    onChange={(v) =>
                                      updateEarning(i, "label", v)
                                    }
                                    placeholder="Label"
                                    inputClassName="text-[11px]"
                                    className="min-w-0"
                                  />
                                )
                              ) : null}
                            </div>

                            <div className="flex items-center justify-end gap-1 shrink-0">
                              {e && (
                                <>
                                  <InlineInput
                                    type="number"
                                    value={e.amount}
                                    onChange={(v) =>
                                      updateEarning(i, "amount", v)
                                    }
                                    placeholder="0"
                                    className="shrink-0"
                                    inputClassName="
                      text-right !mr-0 text-[11px]
                      w-full min-[361px]:w-[var(--amt)]
                    "
                                  />
                                  {i >= 3 && (
                                    <button
                                      type="button"
                                      onClick={() => removeEarning(i)}
                                      className="text-red-500 font-bold leading-none"
                                      aria-label="Remove earning row"
                                    >
                                      ×
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Deductions side */}
                          <div
                            className="
              grid items-start gap-(--gap) pl-1
              grid-cols-2
              min-[361px]:grid-cols-[minmax(0,1fr)_var(--amt)]
            "
                          >
                            <div className="min-w-0 pr-0.5">
                              {d ? (
                                isLockedRow(i) ? (
                                  <span
                                    className="
                      block text-[11px] leading-tight text-[#0f2a44]
                      whitespace-normal wrap-break-word hyphens-auto
                      line-clamp-2
                    "
                                  >
                                    {d.label}
                                  </span>
                                ) : (
                                  <InlineInput
                                    value={d.label}
                                    onChange={(v) =>
                                      updateDeduction(i, "label", v)
                                    }
                                    placeholder="Label"
                                    inputClassName="text-[11px]"
                                    className="min-w-0"
                                  />
                                )
                              ) : null}
                            </div>

                            <div className="flex items-center justify-end gap-1 shrink-0">
                              {d && (
                                <>
                                  <InlineInput
                                    type="number"
                                    value={d.amount}
                                    onChange={(v) =>
                                      updateDeduction(i, "amount", v)
                                    }
                                    placeholder="0"
                                    className="shrink-0"
                                    inputClassName="
                      text-right !mr-0 text-[11px]
                      w-full min-[361px]:w-[var(--amt)]
                    "
                                  />
                                  {i >= 3 && (
                                    <button
                                      type="button"
                                      onClick={() => removeDeduction(i)}
                                      className="text-red-500 font-bold leading-none"
                                      aria-label="Remove deduction row"
                                    >
                                      ×
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add buttons */}
                    <div className="pr-1">
                      <button
                        type="button"
                        onClick={addEarning}
                        className="inline-flex items-center gap-1.5 font-semibold text-[#0f2a44] hover:opacity-90"
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#0f2a44]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 5v14M5 12h14"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                        <span className="text-[11px]">Add Earnings</span>
                      </button>
                    </div>
                    <div className="pl-1">
                      <button
                        type="button"
                        onClick={addDeduction}
                        className="inline-flex items-center gap-1.5 font-semibold text-[#0f2a44] hover:opacity-90"
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#0f2a44]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 5v14M5 12h14"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                        <span className="text-[11px]">Add Deduction</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* <div className="md:hidden grid grid-cols-4 gap-3">
                  <h4 className="col-span-2 text-left text-xs font-semibold">
                    Earnings
                  </h4>
                  <h4 className="col-span-2 text-left text-xs font-semibold">
                    Deductions
                  </h4>

                  {Array.from({
                    length: Math.max(earnings.length, deductions.length),
                  }).map((_, i) => {
                    const e = earnings[i];
                    const d = deductions[i];
                    return (
                      <div className="contents" key={i}>
                        //  Earning label 
                        <div className="min-w-0">
                          {e ? (
                            isLockedEarning(i) ? (
                              <span className="text-left text-xs text-[#0f2a44] truncate">
                                {e.label}
                              </span>
                            ) : (
                              <InlineInput
                                value={e.label}
                                onChange={(v) => updateEarning(i, "label", v)}
                                placeholder="Label"
                              />
                            )
                          ) : null}
                        </div>

                        // Earning amount + remove 
                        <div className="flex items-center justify-end gap-1">
                          {e ? (
                            <>
                              <InlineInput
                                type="number"
                                value={e.amount}
                                onChange={(v) => updateEarning(i, "amount", v)}
                                placeholder="0"
                                inputClassName="w-20 text-right !mr-0"
                                className="justify-self-end"
                              />
                              {i >= 3 && (
                                <button
                                  type="button"
                                  onClick={() => removeEarning(i)}
                                  className="text-red-500 font-bold leading-none"
                                  aria-label="Remove earning row"
                                >
                                  ×
                                </button>
                              )}
                            </>
                          ) : null}
                        </div>

                        // Deduction label 
                        <div className="min-w-0">
                          {d ? (
                            isLockedRow(i) ? (
                              <span className="text-left text-xs text-[#0f2a44] truncate">
                                {d.label}
                              </span>
                            ) : (
                              <InlineInput
                                value={d.label}
                                onChange={(v) => updateDeduction(i, "label", v)}
                                placeholder="Label"
                              />
                            )
                          ) : null}
                        </div>

                        //Deduction amount + remove 
                        <div className="flex items-center justify-end gap-1">
                          {d ? (
                            <>
                              <InlineInput
                                type="number"
                                value={d.amount}
                                onChange={(v) =>
                                  updateDeduction(i, "amount", v)
                                }
                                placeholder="0"
                                inputClassName="w-20 text-right !mr-0"
                                className="justify-self-end"
                              />
                              {i >= 3 && (
                                <button
                                  type="button"
                                  onClick={() => removeDeduction(i)}
                                  className="text-red-500 font-bold leading-none"
                                  aria-label="Remove deduction row"
                                >
                                  ×
                                </button>
                              )}
                            </>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}

                  // Add buttons (mobile) 
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={addEarning}
                      className="inline-flex items-center gap-2 font-semibold text-[#0f2a44] hover:opacity-90"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#0f2a44]">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 5v14M5 12h14"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span className="text-xs">Add Earnings</span>
                    </button>
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={addDeduction}
                      className="inline-flex items-center gap-2 font-semibold text-[#0f2a44] hover:opacity-90"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#0f2a44]">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 5v14M5 12h14"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span className="text-xs">Add Deduction</span>
                    </button>
                  </div>
                </div> */}
                {/* --- Desktop/Tablet: original 2-panel layout --- */}
                <div className="hidden md:grid md:grid-cols-2 md:gap-4 md:items-start">
                  {/* Earnings (left) */}
                  <div>
                    {/* Header row */}
                    <div
                      data-step-section="earnings"
                      className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 mb-2"
                    >
                      <h4 className="text-left text-sm font-semibold">
                        Earnings
                      </h4>
                      <span /> {/* empty cell where the colon sits in rows */}
                      <h4 className="justify-self-end w-24 text-right text-sm font-semibold">
                        Amount
                      </h4>
                    </div>

                    {earnings.map((e, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 mb-2"
                      >
                        {/* Label */}
                        {isLockedEarning(i) ? (
                          <span className="text-left text-sm text-[#0f2a44] truncate">
                            {e.label}
                          </span>
                        ) : (
                          <InlineInput
                            value={e.label}
                            onChange={(v) => updateEarning(i, "label", v)}
                            onFocus={() => setActiveStep("earnings")}
                            placeholder="Label"
                          />
                        )}

                        {/* Colon (centered) */}
                        <span className="text-sm text-[#0f2a44]/70 text-center px-1">
                          :
                        </span>

                        {/* Amount (+ remove) */}
                        <div className="flex items-center justify-end gap-1">
                          <InlineInput
                            type="number"
                            value={e.amount}
                            onChange={(v) => updateEarning(i, "amount", v)}
                            onFocus={() => setActiveStep("earnings")}
                            placeholder="0"
                            inputClassName="w-24 text-right !mr-0"
                          />
                          {i >= 3 && (
                            <button
                              type="button"
                              onClick={() => removeEarning(i)}
                              className="text-red-500 font-bold leading-none"
                              aria-label="Remove earning row"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-start">
                      <button
                        type="button"
                        onClick={addEarning}
                        className="inline-flex items-center gap-2 font-semibold text-[#0f2a44] hover:opacity-90"
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#0f2a44]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 5v14M5 12h14"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                        <span className="text-sm">Add Earnings</span>
                      </button>
                    </div>
                  </div>

                  {/* Deductions (right) */}
                  <div className="md:border-l md:pl-4 border-[#10324F]/40">
                    {/* Header row */}
                    <div
                      data-step-section="deductions"
                      className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 mb-2"
                    >
                      <h4 className="text-left text-sm font-semibold">
                        Deductions
                      </h4>
                      <span /> {/* empty cell where the colon sits in rows */}
                      <h4 className="justify-self-end w-24 text-right text-sm font-semibold">
                        Amount
                      </h4>
                    </div>
                    {deductions.map((d, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 mb-2"
                      >
                        {/* Label */}
                        {isLockedRow(i) ? (
                          <span className="text-left text-sm text-[#0f2a44] truncate">
                            {d.label}
                          </span>
                        ) : (
                          <InlineInput
                            value={d.label}
                            onChange={(v) => updateDeduction(i, "label", v)}
                            onFocus={() => setActiveStep("deductions")}
                            placeholder="Label"
                          />
                        )}

                        {/* Colon (centered) */}
                        <span className="text-sm text-[#0f2a44]/70 text-center px-1">
                          :
                        </span>

                        {/* Amount (+ remove) */}
                        <div className="flex items-center justify-end gap-1">
                          <InlineInput
                            type="number"
                            value={d.amount}
                            onChange={(v) => updateDeduction(i, "amount", v)}
                            onFocus={() => setActiveStep("deductions")}
                            placeholder="0"
                            inputClassName="w-24 text-right !mr-0"
                          />
                          {i >= 3 && (
                            <button
                              type="button"
                              onClick={() => removeDeduction(i)}
                              className="text-red-500 font-bold leading-none"
                              aria-label="Remove deduction row"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-start">
                      <button
                        type="button"
                        onClick={addDeduction}
                        className="inline-flex items-center gap-2 font-semibold text-[#0f2a44] hover:opacity-90"
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#0f2a44]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 5v14M5 12h14"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                        <span className="text-sm">Add Deduction</span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Totals (unchanged) */}
                <div className="mt-2 rounded-md border border-[#10324F]/40 px-3 py-3 m-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-700 truncate">
                        Gross Earnings
                      </span>
                      <span className="text-[13px] sm:text-sm tabular-nums font-semibold text-right shrink-0 whitespace-nowrap">
                        {inr.format(totalEarnings)}
                      </span>
                    </div>

                    <div className="min-w-0 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-700 truncate">
                        Total Deductions
                      </span>
                      <span className="text-[13px] sm:text-sm tabular-nums font-semibold text-right shrink-0 whitespace-nowrap">
                        {inr.format(totalDeductions)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div ref={ref} data-step-section="summary">
                <NetPayableCard earnings={earnings} deductions={deductions} />
              </div>
              <div className="mt-2 grid grid-flow-col auto-cols-max justify-center gap-4">
                <button
                  type="submit"
                  className="w-30 text-xs h-8 px-2 rounded bg-[#10324F] text-white font-bold"
                >
                  Generate Payslip
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-30 text-xs h-8 px-2  rounded border hover:bg-gray-100 font-bold"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </form>
        {/* <button
        onClick={resetForm}
        className="px-4 py-2 bg-[#10324F] text-white rounded hover:bg-[#0d2a40] transition"
      >
        Submit & View PDF
      </button>*/}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          {/* Popup Container */}
          <div
            className="relative bg-white rounded-lg shadow-2xl 
              border border-gray-300 w-[90%] max-w-4xl h-[80%]
              flex flex-col overflow-hidden animate-fadeIn"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3 bg-[#10324F] text-white">
              <h2 className="text-lg font-semibold">Payslip PDF Preview</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 text-sm bg-white text-[#10324F] rounded hover:bg-gray-200"
                >
                  ⬇️ Download
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white text-2xl leading-none font-bold hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>

            {/* PDF Body */}
            <div className="flex-1 bg-gray-50 p-4">
              <div className="w-full h-full rounded-lg border border-gray-300 shadow-inner overflow-hidden">
                <iframe
                  src="/pdf/sample.pdf"
                  title="PDF Viewer"
                  width="100%"
                  height="100%"
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Footer (optional, for popup look) */}
            <div className="bg-gray-100 px-5 py-3 text-right border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 text-sm bg-[#10324F] text-white rounded hover:bg-[#0d2a40] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function Input({
  label,
  error,
  className = "",
  onChange,
  onBlur,
  value,
  ...props
}) {
  const handleChange = (e) => onChange?.(e?.target?.value ?? "", e);

  return (
    <div>
      {label && (
        <label className="text-left block text-sm text-[#0f2a44] mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        value={value ?? ""}
        onChange={handleChange}
        className={`w-full rounded-[5px] h-7 px-2 text-[11px]
          bg-white/65 backdrop-blur-[3px]
          border ${error ? "border-red-500 ring-0" : "border-[#10324F]/25"}
          text-[#0f2a44] placeholder:text-[#0f2a44]/40
          shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]
          focus:outline-none focus:ring-0
          ${
            error
              ? "focus:ring-red-500/50 focus:border-red-500"
              : "focus:ring-(--color-cta) focus:border-(--color-cta)"
          }
          ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.name || props.id}-error` : undefined}
      />
      {error && (
        <p
          id={`${props.name || props.id}-error`}
          className="mt-1 text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function InlineInput({
  error,
  className = "",
  onChange,

  onBlur,
  value,
  ...props
}) {
  const handleChange = (e) => onChange?.(e?.target?.value ?? "", e);

  return (
    <div className="min-w-0">
      <input
        {...props}
        value={value ?? ""}
        onChange={handleChange}
        className={`w-full rounded-[5px] h-7 px-2 text-[11px] text-right
          bg-white/65 backdrop-blur-[3px]
          border ${error ? "border-red-500 ring-0" : "border-[#10324F]/25"}
          text-[#0f2a44] placeholder:text-[#0f2a44]/40
          shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]
          focus:outline-none focus:ring-0
          ${
            error
              ? "focus:ring-red-500/50 focus:border-red-500"
              : "focus:ring-(--color-cta) focus:border-(--color-cta)"
          }
          ${className}`}
        aria-invalid={!!error}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
