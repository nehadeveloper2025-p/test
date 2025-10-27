import InputEmp from "../ui/InputEmp";

export default function EmployeeInfoSection({
  employee,
  setEmployee,
  errors,
  submitted,
  setActiveStep,
}) {
  const fields = [
    { key: "name", label: "Employee Name", placeholder: "Employee Name" },
    { key: "employeeId", label: "Employee ID", placeholder: "Employee ID" },
    { key: "email", label: "Employee Email", placeholder: "Employee Email" },
    { key: "phoneno", label: "Mobile No", placeholder: "Mobile No." },
    { key: "designation", label: "Designation", placeholder: "Designation" },
    { key: "paidDays", label: "Paid Days", placeholder: "Paid Days" },
    {
      key: "lossOfPayDays",
      label: "Loss of Pay Days",
      placeholder: "Loss of Pay Days",
    },
    { key: "payDate", label: "Pay Date", type: "date" },
  ];

  return (
    <section
      className="rounded-lg border border-[#10324F]/40 shadow-sm p-4 md:p-5 max-w-full"
      style={{
        "--amt": "clamp(4rem, 22vw, 6rem)",
        "--gap": "0.5rem",
      }}
    >
      <h4 className="text-sm font-semibold text-[#0f2a44] mb-4">
        Employee Details Summary <span className="text-red-500">*</span>
      </h4>

      <div
        className="
          grid gap-[var(--gap)] 
          grid-cols-2 min-[361px]:grid-cols-[minmax(0,1fr)_auto_var(--amt)] 
          md:grid-cols-[minmax(0,1fr)_auto_auto_var(--amt)] 
          md:gap-3
        "
      >
        {fields.map(({ key, label, placeholder, type }, i) => {
          // For the desktop two-column layout, split fields into two columns:
          // Left column fields: indexes 0-3
          // Right column fields: indexes 4-7
          // We'll insert a blank grid cell for spacing on mobile for second column fields

          const isSecondCol = i >= 4;

          return (
            <div className="contents" key={key}>
              {/* Label */}
              <label
                htmlFor={`employee-${key}`}
                className="text-xs md:text-sm font-semibold text-[#0f2a44] break-words whitespace-normal"
                title={label}
                style={{ gridColumn: "span 1" }}
              >
                {label}
              </label>

              {/* Colon - visible only on md */}
              <span className="hidden md:block text-sm text-[#0f2a44]/70 text-center px-1">:</span>

              {/* Input */}
              <div className="min-w-0">
                <InputEmp
                  id={`employee-${key}`}
                  variant="stack"
                  inputClassName={`text-xs md:text-sm h-8 px-2 w-full ${
                    type === "date" ? "max-w-[160px]" : ""
                  }`}
                  placeholder={placeholder}
                  type={type || "text"}
                  value={employee?.[key] ? String(employee[key]) : ""}
                  onChange={(v) => setEmployee((e) => ({ ...e, [key]: v }))}
                  onFocus={() => setActiveStep("employee")}
                  error={submitted ? errors.employee?.[key] || "" : ""}
                  className="!mb-0"
                />
              </div>

              {/* Add an empty cell after first column fields for spacing in mobile */}
              {i === 3 && (
                <div className="hidden md:block" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
