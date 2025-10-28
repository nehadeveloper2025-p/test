import React from "react";

export default function HeroSection() {
  return (
    <section className="relative bg-[#c9d9e7] min-h-screen flex flex-col">
{/*       
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-20">
        <div className="text-3xl font-bold text-[#152c44]">Waggex</div>
        <nav className="flex gap-8 text-[#152c44] font-semibold">
          <a href="#home" className="hover:underline">Home</a>
          <a href="#features" className="hover:underline">Features</a>
          <a href="#pricing" className="hover:underline">Pricing</a>
        </nav>
        <div className="flex gap-4">
          <button className="border border-[#152c44] rounded-full px-5 py-2 font-semibold text-[#152c44] hover:bg-[#152c44] hover:text-white transition">
            Sign Up
          </button>
          <button className="bg-[#152c44] rounded-full px-5 py-2 font-semibold text-white hover:bg-[#0f1f33] transition">
            Login
          </button>
        </div>
      </header>
       */}
      {/* Hero Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto w-full px-8 pt-10">
        {/* Large background text */}
        <h1
          className="absolute top-20 left-8 text-7xl font-extrabold text-[#152c44] opacity-10 select-none pointer-events-none"
          style={{ userSelect: "none" }}
        >
          Payslip
        </h1>

        {/* Center Image */}
        <img
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80"
          alt="Woman with clipboard"
          className="relative z-10 max-w-sm mx-auto rounded-lg shadow-lg"
        />

        {/* Left bottom text with emphasis */}
        <p className="absolute bottom-20 left-8 max-w-xs text-sm text-[#152c44] font-light z-10">
          <span className="font-bold">Waggex</span> Makes Payroll Simple — Generate{" "}
          <span className="font-bold">Accurate, Secure Payslips Instantly.</span>{" "}
          <a href="#" className="underline text-blue-600">
            Save Time, Reduce Errors, Ensure Compliance
          </a>
          , And Access Records Anytime, Anywhere.
        </p>

        {/* Badge on right side */}
        <div className="absolute bottom-28 right-8 z-10 bg-[#152c44] text-white px-4 py-2 rounded-full shadow-lg font-semibold">
          200+ Payslips Generated
        </div>
      </div>

      {/* Bottom dark section */}
      {/* <div className="bg-[#152c44] h-40 rounded-t-[80px] flex items-center justify-center text-white text-xl font-bold relative">
        FREE PAYSLIP GENERATOR
        <span className="ml-4 animate-bounce text-3xl">&#x2193;</span>
      </div> */}
    </section>
  );
}
