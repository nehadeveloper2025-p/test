import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PayApp() {
  const [company, setCompany] = useState({
    name: "",
    address1: "",
    address2: "",
    phone: "",
    email: "",
  });

  const [employee, setEmployee] = useState({
    name: "",
    designation: "",
    employeeId: "",
    joiningDate: "",
    pan: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [salaryMonth, setSalaryMonth] = useState("");

  const [earnings, setEarnings] = useState([
    { label: "Basic", amount: 0 },
    { label: "HRA", amount: 0 },
    { label: "Transport Allowance", amount: 0 },
  ]);
  const [deductions, setDeductions] = useState([
    { label: "TDS", amount: 0 },
    { label: "PF", amount: 0 },
  ]);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  function updateEarning(idx, field, value) {
    const copy = [...earnings];
    copy[idx][field] = field === "amount" ? Number(value || 0) : value;
    setEarnings(copy);
  }

  function addEarning() {
    setEarnings([...earnings, { label: "New Earning", amount: 0 }]);
  }

  function removeEarning(idx) {
    setEarnings(earnings.filter((_, i) => i !== idx));
  }

  function updateDeduction(idx, field, value) {
    const copy = [...deductions];
    copy[idx][field] = field === "amount" ? Number(value || 0) : value;
    setDeductions(copy);
  }

  function addDeduction() {
    setDeductions([...deductions, { label: "New Deduction", amount: 0 }]);
  }

  function removeDeduction(idx) {
    setDeductions(deductions.filter((_, i) => i !== idx));
  }

  const totalEarnings = earnings.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalDeductions = deductions.reduce((s, d) => s + Number(d.amount || 0), 0);
  const netPay = totalEarnings - totalDeductions;

  async function generatePdfAndDownload() {
    const container = document.getElementById("payroll-container");
    if (!container) return;

    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = 210;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${employee.name || "payslip"}.pdf`);
  }

  async function submitToServer() {
    const form = new FormData();
    form.append("company", JSON.stringify(company));
    form.append("employee", JSON.stringify(employee));
    form.append("earnings", JSON.stringify(earnings));
    form.append("deductions", JSON.stringify(deductions));
    if (imagePreview) {
      const res = await fetch(imagePreview);
      const blob = await res.blob();
      form.append("photo", blob, "photo.png");
    }

    const resp = await fetch("/api/payroll/upload", {
      method: "POST",
      body: form,
    });

    const data = await resp.json();
    alert(data.message || "Uploaded");
  }

  return (
    <div id="payroll-container" className="p-6 max-w-5xl mx-auto border rounded bg-white shadow">
      <h1 className="text-2xl font-semibold mb-4">Payroll Form</h1>

      {/* Upload image + Salary Month */}
      <div className="flex flex-col sm:flex-row justify-between text-left gap-6 mb-4">
  {/* Image Upload Section */}
  <div className="sm:w-1/2">
    {/* Hidden file input */}
    <input
      type="file"
      accept="image/*"
      id="imageUpload"
      onChange={handleImageUpload}
      className="hidden"
    />

    {/* Upload button when no image */}
    {!imagePreview && (
      <button
        onClick={() => document.getElementById("imageUpload").click()}
        className="px-4 py-2 mt-5 bg-blue-400 text-white rounded text-sm"
      >
        Upload Image
      </button>
    )}

    {/* Image preview when uploaded */}
    {imagePreview && (
      <div>
        <img
          src={imagePreview}
          onClick={() => document.getElementById("imageUpload").click()}
          className="w-24 h-24 mt-2 rounded object-cover border cursor-pointer hover:opacity-80 transition"
          alt="Click to change"
          title="Click to change"
        />
        <p className="text-sm text-gray-500 mt-1">Click to change</p>
      </div>
    )}
  </div>

  {/* Salary Month Section */}
  <div className="w-full sm:w-1/2 text-left sm:text-right">
    <label className="block font-semibold">Salary Month</label>
    <input
      type="text"
      value={salaryMonth}
      onChange={(e) => setSalaryMonth(e.target.value)}
      placeholder="e.g. September 2025"
      className="w-full sm:w-1/2 p-2 border rounded mt-1"
    />
  </div>
</div>



      {/* Company */}
      <div className="mb-4  mt-20 w-full md:w-1/2 text-left">
        <label className="block font-semibold">Company Name</label>
        <input
          className="w-full p-2 border rounded"
          value={company.name}
          onChange={(e) => setCompany({ ...company, name: e.target.value })}
        />
        <label className="block font-semibold mt-2">Address Line 1</label>
        <input
          className="w-full p-2 border rounded"
          value={company.address1}
          onChange={(e) => setCompany({ ...company, address1: e.target.value })}
        />
         <label className="block font-semibold mt-2">Address Line 2</label>
        <input
          className="w-full p-2 border rounded"
          value={company.address2}
          onChange={(e) => setCompany({ ...company, address2: e.target.value })}
        />
      </div>

      {/* Employee */}
      <div className="mb-4 border p-4 rounded mt-10 text-left">
        <h2 className="font-semibold mb-2  ">Employee Details</h2>
        <label className="block font-semibold">Employee ID</label>
        <input
          className="w-full p-2 border rounded"
          value={employee.employeeId}
          onChange={(e) => setEmployee({ ...employee, employeeId: e.target.value })}
        />
        <label className="block font-semibold mt-2">Employee Name</label>
        <input
          className="w-full p-2 border rounded"
          value={employee.name}
          onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
        />
        <label className="block font-semibold mt-2">Designation</label>
        <input
          className="w-full p-2 border rounded"
          value={employee.designation}
          onChange={(e) => setEmployee({ ...employee, designation: e.target.value })}
        />
      </div>
<div className="mb-6 border p-4 rounded text-left">
  <h2 className="font-semibold mb-4">Earnings & Deductions</h2>

  {/* Grid layout starts here */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

    {/* Earnings */}
    <div className="border p-3 rounded w-full">
      <h3 className="font-semibold mb-2 text-center">Earnings</h3>
      {earnings.map((e, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 mb-2 w-full"
        >
          {/* Label */}
          <input
            className="flex-1 min-w-0 p-2 border rounded text-sm"
            value={e.label}
            onChange={(ev) => updateEarning(idx, "label", ev.target.value)}
          />
          {/* Amount */}
          <input
            className="w-20 p-2 border rounded text-sm text-right"
            type="number"
            value={e.amount}
            onChange={(ev) => updateEarning(idx, "amount", ev.target.value)}
          />
          {/* Remove Button */}
          <button
            onClick={() => removeEarning(idx)}
            className="text-red-500 text-lg px-2 hover:text-red-700"
            title="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={addEarning}
        className="mt-2 text-sm text-blue-600 hover:underline bg-transparent p-0"
      >
        Add Earning
      </button>
    </div>

    {/* Deductions */}
    <div className="border p-3 rounded w-full">
      <h3 className="font-semibold mb-2 text-center">Deductions</h3>
      {deductions.map((d, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 mb-2 w-full"
        >
          {/* Label */}
          <input
            className="flex-1 min-w-0 p-2 border rounded text-sm"
            value={d.label}
            onChange={(ev) => updateDeduction(idx, "label", ev.target.value)}
          />
          {/* Amount */}
          <input
            className="w-20 p-2 border rounded text-sm text-right"
            type="number"
            value={d.amount}
            onChange={(ev) => updateDeduction(idx, "amount", ev.target.value)}
          />
          {/* Remove Button */}
          <button
            onClick={() => removeDeduction(idx)}
            className="text-red-500 text-lg px-2 hover:text-red-700"
            title="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={addDeduction}
        className="mt-2 text-sm text-blue-600 hover:underline bg-transparent p-0"
      >
        Add Deduction
      </button>
    </div>

  </div>
</div>


      {/* Totals Section */}
      <div className="mb-6 border p-4 rounded bg-gray-50 text-left">
        <h2 className="font-semibold mb-2">Totals</h2>
        <p>Total Earnings: ₹{totalEarnings}</p>
        <p>Total Deductions: ₹{totalDeductions}</p>
        <p className="font-bold">Net Pay: ₹{netPay}</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={generatePdfAndDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Generate PDF
        </button>
        <button
          onClick={submitToServer}
          className="px-4 py-2 border rounded"
        >
          Save to Server
        </button>
      </div>
    </div>
  );
}
