// components/EmployeePaySummary.jsx
import React from "react";
import Input from "../components/ui/Input";

// Adaptive label width keeps colons aligned but fits the card on smaller screens
const LABEL_W = "clamp(90px, 16vw, 130px)";

const makeId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

const get = (obj, path) =>
  path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);

export default function EmployeePaySummary({
  employee,
  setEmployee,
  errors = {},
  submitted,
   activeStep, setActiveStep, steps
}) {

    const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  const addField = () =>
    setEmployee((prev) => ({
      ...prev,
      extraFields: [
        ...(prev.extraFields || []),
        { id: makeId(), label: "", value: "" },
      ],
    }));

  const updateField = (id, patch) =>
    setEmployee((prev) => ({
      ...prev,
      extraFields: (prev.extraFields || []).map((f) =>
        f.id === id ? { ...f, ...patch } : f
      ),
    }));

  const deleteField = (id) =>
    setEmployee((prev) => ({
      ...prev,
      extraFields: (prev.extraFields || []).filter((f) => f.id !== id),
    }));

  return (
    <section className="rounded-lg border p-4 md:p-5  border-[#10324F]/40 shadow-sm overflow-x-hidden">
      {/* Fixed fields (2 columns) */}
      <div  data-step-section="employee" className="grid grid-cols-2 gap-3">
        <Input
          variant="row"
          labelWidth={LABEL_W}
          label="Employee Name"
          data-error-key="employee.name"
          placeholder="Employee Name"
          value={employee.name || ""}
          onChange={(v) => setEmployee((e) => ({ ...e, name: v }))}
          error={submitted ? get(errors, "employee.name") || "" : ""}
           onFocusStep={() => setActiveStep("employee")}
        />
        <Input
          variant="row"
          labelWidth={LABEL_W}
          label="Employee ID"
          data-error-key="employee.employeeId"
          placeholder="Employee Id"
          value={employee.employeeId || ""}
          onChange={(v) => setEmployee((e) => ({ ...e, employeeId: v }))}
          error={submitted ? get(errors, "employee.employeeId") || "" : ""}
          onFocusStep={() => setActiveStep("employee")}
        />
        <Input
          variant="row"
          labelWidth={LABEL_W}
          label="Employee Email"
          data-error-key="employee.email"
          placeholder="Employee email"
          value={employee.email || ""}
          onChange={(v) => setEmployee((e) => ({ ...e, email: v }))}
          error={submitted ? get(errors, "employee.email") || "" : ""}
          onFocusStep={() => setActiveStep("employee")}
        />
        <Input
          variant="row"
          labelWidth={LABEL_W}
          label="Mobile No"
          data-error-key="employee.phoneno"
          placeholder="Mobile No."
          value={employee.phoneno || ""}
          onChange={(v) => setEmployee((e) => ({ ...e, phoneno: v }))}
          error={submitted ? get(errors, "employee.phoneno") || "" : ""}
          onFocusStep={() => setActiveStep("employee")}
        />
        <Input
          variant="row"
          labelWidth={LABEL_W}
          label="Designation"
          data-error-key="employee.designation"
          placeholder="Designation"
          value={employee.designation || ""}
          onChange={(v) => setEmployee((e) => ({ ...e, designation: v }))}
          error={submitted ? get(errors, "employee.designation") || "" : ""}
          onFocusStep={() => setActiveStep("employee")}
        />
        <Input
          variant="row"
          labelWidth={LABEL_W}
          label="Paid Days"
          data-error-key="employee.paidDays"
          placeholder="Paid Days"
          value={String(employee.paidDays || "")}
          onChange={(v) => setEmployee((e) => ({ ...e, paidDays: v }))}
          error={submitted ? get(errors, "employee.paidDays") || "" : ""}
          onFocusStep={() => setActiveStep("employee")}
        />
        <Input
          variant="row"
          labelWidth={LABEL_W}
          label="Loss of Pay Days"
          data-error-key="employee.lossOfPayDays"
          placeholder="Loss of Pay Days"
          value={String(employee.lossOfPayDays || "")}
          onChange={(v) => setEmployee((e) => ({ ...e, lossOfPayDays: v }))}
          error={submitted ? get(errors, "employee.lossOfPayDays") || "" : ""}
          onFocusStep={() => setActiveStep("employee")}
        />
        <Input
          variant="row"
          labelWidth={LABEL_W}
          label="Pay Date"
          data-error-key="employee.payDate"
          type="date"
          value={employee.payDate || ""}
          onChange={(v) => setEmployee((e) => ({ ...e, payDate: v }))}
          error={submitted ? get(errors, "employee.payDate") || "" : ""}
          onFocusStep={() => setActiveStep("employee")}
        />
      </div>
    </section>
  );
}

