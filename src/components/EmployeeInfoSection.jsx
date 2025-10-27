import InputEmp from "./ui/InputEmp";

export default function EmployeeInfoSection({
  employee,
  setEmployee,
  errors,
  submitted,
  setActiveStep,
  LABEL_W = "90px", // default label width
}) {
  const leftFields = [
    { key: "name", label: "Employee Name", placeholder: "Employee Name" },
    { key: "employeeId", label: "Employee ID", placeholder: "Employee ID" },
    { key: "email", label: "Employee Email", placeholder: "Employee Email" },
    { key: "phoneno", label: "Mobile No", placeholder: "Mobile No." },
  ];

  const rightFields = [
    { key: "designation", label: "Designation", placeholder: "Designation" },
    { key: "paidDays", label: "Paid Days", placeholder: "Paid Days" },
    {
      key: "lossOfPayDays",
      label: "Loss of Pay Days",
      placeholder: "Loss of Pay Days",
    },
    { key: "payDate", label: "Pay Date", placeholder: "Select Date", type: "date" },
  ];

  const renderField = ({ key, label, placeholder, type }) => (
    <div className="flex flex-wrap items-center gap-1 md:gap-2" key={key}>
      <label
        htmlFor={`employee-${key}`}
        className={`flex-shrink-0 w-[${LABEL_W}] text-xs md:text-sm font-semibold text-[#0f2a44] break-words`}
        title={label}
      >
        {label}
      </label>
      <span className="hidden md:inline text-[#0f2a44] text-xs md:text-sm select-none">:</span>
      <div className="flex-1 min-w-0">
        <InputEmp
          id={`employee-${key}`}
          variant="stack"
          inputClassName={`text-xs md:text-sm h-8 px-2 w-full ${
            type === "date" ? "max-w-[160px]" : ""
          }`}
          placeholder={placeholder}
          type={type || "text"}
          value={employee?.[key] ?? ""}
          onChange={(v) => setEmployee((e) => ({ ...e, [key]: v }))}
          onFocus={() => setActiveStep("employee")}
          error={submitted ? errors.employee?.[key] || "" : ""}
        />
      </div>
    </div>
  );

  return (
    <section className="rounded-lg border border-[#10324F]/40 shadow-sm overflow-x-hidden p-4 md:p-5 max-w-full">
      <h4 className="text-sm font-semibold text-[#0f2a44] mb-4">
        Employee Details Summary <span className="text-red-500">*</span>
      </h4>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {/* LEFT COLUMN */}
        <div className="flex flex-col flex-1 space-y-3 min-w-0">
          {leftFields.map(renderField)}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col flex-1 space-y-3 min-w-0">
          {rightFields.map(renderField)}
        </div>
      </div>
    </section>
  );
}
