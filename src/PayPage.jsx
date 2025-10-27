import {useRef, useState, useEffect } from "react";
import GlassCard from "./GlassCard.jsx";
import ProgressSlider from "./ProgressSlider.jsx";
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
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* 3 columns at md+: [form | divider | sidebar] */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_320px] gap-8 items-start">
        {/* LEFT: payslip form */}
        <div id="payslip-card" className="glass p-8">
          <h2 className="text-xl font-semibold text-[var(--ink)] mb-6">Payslip for Month</h2>

          {/* Company */}
          <section className="mb-6">
            <h3 className="font-semibold text-[var(--ink)] mb-2">Company Details</h3>
            <div className="space-y-2">
              <input className="input-style" placeholder="Company Name"
                value={company.name} onChange={e=>setCompany({...company,name:e.target.value})}/>
              <input className="input-style" placeholder="Company Address"
                value={company.address} onChange={e=>setCompany({...company,address:e.target.value})}/>
              <input className="input-style" placeholder="City"
                value={company.city} onChange={e=>setCompany({...company,city:e.target.value})}/>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input className="input-style" placeholder="State"
                  value={company.state} onChange={e=>setCompany({...company,state:e.target.value})}/>
                <input className="input-style" placeholder="Country"
                  value={company.country} onChange={e=>setCompany({...company,country:e.target.value})}/>
                <input className="input-style" placeholder="ZIP"
                  value={company.zip} onChange={e=>setCompany({...company,zip:e.target.value})}/>
              </div>
              <input className="input-style" type="file"
                onChange={(e)=> e.target.files?.[0] && setCompany({...company, logo: URL.createObjectURL(e.target.files[0])})}/>
            </div>
          </section>

          {/* Employee */}
          <GlassCard title="Employee Pay Summary" className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input className="input-style" placeholder="Employee Name"
                value={employee.name} onChange={e=>setEmployee({...employee,name:e.target.value})}/>
              <input className="input-style" placeholder="Employee ID"
                value={employee.employeeId} onChange={e=>setEmployee({...employee,employeeId:e.target.value})}/>
              <input className="input-style" placeholder="Pay Period (e.g., Sep 2025)"
                value={employee.payPeriod} onChange={e=>setEmployee({...employee,payPeriod:e.target.value})}/>
              <input className="input-style" type="date" placeholder="Pay Date"
                value={employee.payDate} onChange={e=>setEmployee({...employee,payDate:e.target.value})}/>
              <input className="input-style" placeholder="Paid Days"
                value={employee.paidDays} onChange={e=>setEmployee({...employee,paidDays:e.target.value})}/>
              <input className="input-style" placeholder="Loss of Pay Days"
                value={employee.lossOfPayDays} onChange={e=>setEmployee({...employee,lossOfPayDays:e.target.value})}/>
            </div>
          </GlassCard>

          {/* Earnings + Deductions */}
          <GlassCard title="Income Details" className="mb-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Earnings */}
              <div>
                <p className="text-sm text-slate-600 mb-2">Earnings</p>
                {earnings.map((row,i)=>(
                  <div key={i} className="flex gap-2 mb-2">
                    <input className="input-style flex-1" value={row.label}
                      onChange={e=>{const c=[...earnings]; c[i].label=e.target.value; setEarnings(c);}}/>
                    <input className="input-style w-24 text-right" type="number" value={row.amount}
                      onChange={e=>{const c=[...earnings]; c[i].amount=e.target.value; setEarnings(c);}}/>
                  </div>
                ))}
                <button className="text-[var(--cta)] text-sm hover:underline"
                  onClick={()=>setEarnings([...earnings,{label:"",amount:0}])}>+ Add Earning</button>
              </div>
              {/* Deductions */}
              <div>
                <p className="text-sm text-slate-600 mb-2">Deductions</p>
                {deductions.map((row,i)=>(
                  <div key={i} className="flex gap-2 mb-2">
                    <input className="input-style flex-1" value={row.label}
                      onChange={e=>{const c=[...deductions]; c[i].label=e.target.value; setDeductions(c);}}/>
                    <input className="input-style w-24 text-right" type="number" value={row.amount}
                      onChange={e=>{const c=[...deductions]; c[i].amount=e.target.value; setDeductions(c);}}/>
                  </div>
                ))}
                <button className="text-[var(--cta)] text-sm hover:underline"
                  onClick={()=>setDeductions([...deductions,{label:"",amount:0}])}>+ Add Deduction</button>
              </div>
            </div>
          </GlassCard>

          {/* Summary */}
          <div className="glass-strong p-4 inner-glow">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[var(--ink)]">
              <div>
                <p>Gross Earnings: <b>₹{totalE}</b></p>
                <p>Total Deductions: <b>₹{totalD}</b></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Net Pay</p>
                <p className="text-2xl font-semibold text-green-700">₹{net}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3 justify-center">
              {/* <button onClick={generatePdf} className="btn-cta">Generate PDF</button> */}
              <button onClick={saveToServer} className="btn-ghost">Save to Server</button>
            </div>
          </div>
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
