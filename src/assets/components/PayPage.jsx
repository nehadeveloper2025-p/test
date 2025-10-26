import {useRef, useState, useEffect } from "react";
import GlassCard from "./GlassCard.jsx";
import ProgressSlider from "./ProgressSlider.jsx";
import PayslipCompanyCard from "./PayslipCompanyCard.jsx";
import { ErrorBoundary } from "./ErrorBoundary.jsx";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

export default function PayPage() {
  
  const [company, setCompany] = useState({
    name: "", email: "", phoneno: "", address: "",
    city: "", state: "", country: "", zip: "", logo: ""
  });

  const [employee, setEmployee] = useState({
    name: "", employeeId: "", email: "", phoneno: "",
    designation: "", payPeriod: "", paidDays: "", lossOfPayDays: "", payDate: "", extraFields: []
  });

  const [earnings, setEarnings] = useState([{label:"Basic", amount:0},{label:"HRA",amount:0}]);
  const [deductions, setDeductions] = useState([{label:"PF", amount:0},{label:"TDS",amount:0}]);

  const totalE = earnings.reduce((s,e)=>s+Number(e.amount||0),0);
  const totalD = deductions.reduce((s,d)=>s+Number(d.amount||0),0);
  const net = totalE - totalD;

const steps = [
    { id: "company",   title: "Company Details",   desc: "Company Name, logo, address, contact info." },
    { id: "employee",  title: "Employee Details",  desc: "Personal details like Name/ID, Designation, and Department" },
    { id: "earnings",  title: "Earning Breakdown", desc: "Base salary, allowances, and other earnings." },
    { id: "deductions",title: "Deductions",        desc: "Mandatory deductions like PF & TDS." },
    { id: "summary",   title: "Par Period Details",desc: "Time frame of salary with dates." },
  ];

  const [activeStep, setActiveStep] = useState("company");

  // auto-highlight first incomplete
  useEffect(() => {
    if (!company.name) setActiveStep("company");
    else if (!employee.name || !employee.employeeId) setActiveStep("employee");
    else if (!earnings.every(e=>e.label.trim()!=="" )) setActiveStep("earnings");
    else if (!deductions.every(d=>d.label.trim()!=="")) setActiveStep("deductions");
    else setActiveStep("summary");
  }, [company, employee, earnings, deductions]);

//   async function generatePdf() {
//     const node = document.getElementById("payslip-card");
//     if (!node) return;
//     const canvas = await html2canvas(node, { scale: 2 });
//     const img = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const w = 210;
//     const h = (canvas.height * w) / canvas.width;
//     pdf.addImage(img, "PNG", 0, 0, w, h);
//     pdf.save(`${employee.name || "Payslip"}.pdf`);
//   }

  async function saveToServer() {
    const payload = { company, employee, earnings, deductions };
    const res = await fetch("/api/payslips", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(()=>({}));
    alert(data?.message || "Saved successfully!");
  }
    

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* 3 columns at md+: [form | divider | sidebar] */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_0px] gap-8 items-start">
        {/* LEFT: payslip form */}
        <div id="payslip-card">
          <ErrorBoundary><PayslipCompanyCard/> </ErrorBoundary>
                     
        </div>

        {/* MIDDLE: vertical divider (md+) */}
        {/* <div className="hidden md:block w-px bg-slate-300/40 h-full mx-auto" /> */}

        {/* RIGHT: slider */}
        <aside className="sticky top-6">
         <ProgressSlider
        steps={steps}
        activeStep={activeStep}
        onStepChange={setActiveStep}
      />

        </aside>
      </div>
    </div>
  );
}
