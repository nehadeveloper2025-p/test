import React from "react";
import heroImg from "../assets/hero-woman.png"; // replace with your image
import leftImg from "../assets/hero-left.png"; // replace with your left-side image

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-b from-[#f4f6f8] to-[#dfe7ee] pt-24 flex flex-col lg:flex-row justify-center items-center px-6 lg:px-16">
      
      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col items-start gap-6 text-[var(--color-dark)] max-w-md z-10">
        <h1 className="text-6xl sm:text-7xl font-extrabold text-[var(--color-dark)]/10">
          EPAYSLIP
        </h1>
        <div className="flex gap-4 items-start">
          <img
            src={leftImg}
            alt="illustration"
            className="w-20 h-20 rounded-full object-cover shadow-lg"
          />
          <p className="text-sm text-[var(--color-dark)]/80 leading-relaxed">
            <span className="text-[var(--color-cta)] font-semibold">EPayslip</span> makes payroll simple—generate accurate, secure payslips instantly,
            <span className="text-[var(--color-cta)]"> save time</span>,
            <span className="text-[var(--color-cta)]"> reduce errors</span>,
            ensure compliance, and access records anytime, anywhere.
          </p>
        </div>
        <button className="px-6 py-3 rounded-full bg-[var(--color-cta)] text-white font-semibold shadow-lg hover:bg-[#1e50b3] transition">
          Get Started →
        </button>
      </div>

      {/* RIGHT SIDE (MAIN IMAGE + TAGLINE) */}
      <div className="flex-1 flex flex-col items-center lg:items-end mt-10 lg:mt-0 relative">
        <img
          src={heroImg}
          alt="woman"
          className="w-[280px] sm:w-[340px] lg:w-[400px] drop-shadow-lg"
        />
        <div
          className="absolute bottom-[-50px] bg-white/60 backdrop-blur-md border border-white/30 rounded-t-[3rem] py-6 px-10 text-center shadow-lg"
          style={{ clipPath: "polygon(0 100%, 0 50%, 50% 0, 100% 50%, 100% 100%)" }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-dark)]">
            SMART PAYSLIPS,
            <br /> EVERY TIME
          </h2>
        </div>
      </div>

      {/* BACKGROUND BLUR SHAPE */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#10324f]/5 via-transparent to-transparent blur-3xl"></div>
    </section>
  );
}
