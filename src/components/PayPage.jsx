import {useRef, useState, useEffect } from "react";
import GlassCard from "./GlassCard.jsx";
import ProgressSlider from "./ProgressSlider.jsx";
import PayslipCompanyCard from "./PayslipCompanyCard.jsx";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

export default function PayPage() {
  

const steps = [
    { id: "company",   title: "Company Details",   desc: "Company Name, logo, address, contact info." },
    { id: "employee",  title: "Employee Details",  desc: "Personal details like Name/ID, Designation, and Department" },
    { id: "earnings",  title: "Earning", desc: "Base salary, allowances, and other earnings." },
    { id: "deductions",title: "Deductions",        desc: "Mandatory deductions like PF & TDS." },
    { id: "summary",   title: "Par Period Details",desc: "Time frame of salary with dates." },
  ];

  const [activeStep, setActiveStep] = useState("company");

  return (

    <div className="mx-auto max-w-7xl px-4 py-10 pt-24">
  <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
    <div id="payslip-card">
      <PayslipCompanyCard
      activeStep={activeStep}
          setActiveStep={setActiveStep}
          steps={steps} />
           
    </div>
    <aside className="hidden md:block">
      <ProgressSlider
        steps={steps}
        activeStep={activeStep}
        onStepChange={(stepId) => setActiveStep(stepId)}
      />
    </aside>
  </div>
</div>
  
  );
}
