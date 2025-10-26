import React from "react";
import girlImg from "../assets/girl.png";
import menImg from "../assets/men.png";
import playImg from "../assets/play.png";
import timeImg from "../assets/time.png";
import cloudImg from "../assets/cloud.png";
import PillItem from "../components/PillItem";

export default function WhyChooseUs() {
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* === Background gradient === */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 80% 90%, rgba(37,99,235,0.35) 0%, rgba(231,238,246,0.8) 50%, rgba(249,251,255,1) 100%)",
        }}
      />

      {/* === White soft glow behind second pill === */}
      {/* <div className="absolute top-[62%] right-[15%] w-[450px] h-[450px] rounded-full blur-[180px] bg-white/60 -z-10" /> */}

      {/* === Header Section === */}
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-2">
        {/* Left text */}
        <div className="flex-1 text-center lg:text-left">
          <h2
            className="
              font-['Roboto'] font-bold uppercase
              text-[42px] sm:text-[64px] lg:text-[84px]
              leading-[115%] tracking-[0.02em]
              text-[#B9CFE6]
            "
          >
            Why Choose Us
          </h2>
        </div>

        {/* Right image */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            src={girlImg}
            alt="Why Choose Us"
            className="w-60 sm:w-[300px] lg:w-[380px]  object-cover"
          />
        </div>
      </div>

      {/* === Pill items section === */}
      <div className="relative flex flex-col items-center gap-4 pb-24 px-6 sm:px-10">

        {/* 1 - Right aligned */}
        <div className="w-full flex justify-center">
          <div className="translate-x-[100px] sm:translate-x-[140px]">
            <PillItem
              imageSrc={playImg}
              imageAlt="Automation"
              title="End-To-End Payroll Automation"
            />
          </div>
        </div>

        {/* 2 - Right aligned */}
        <div className="w-full flex justify-center">
          <div className="translate-x-20 sm:translate-x-[120px]">
            <PillItem
              imageSrc={cloudImg}
              imageAlt="Security"
              title="Secure Cloud-Based Platform With Data Encryption"
            />
          </div>
        </div>

        {/* 3 - Left aligned */}
        <div className="w-full flex justify-center">
          <div className="-translate-x-20 sm:-translate-x-[120px]">
            <PillItem
              imageSrc={menImg}
              imageAlt="IT Support"
              title="Designed Specifically For IT Companies & CAs"
            />
          </div>
        </div>

        {/* 4 - Left aligned */}
        <div className="w-full flex justify-center">
          <div className="-translate-x-[100px] sm:-translate-x-[140px]">
            <PillItem
              imageSrc={timeImg}
              imageAlt="Support"
              title="24/7 Support & Regular Product Updates"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
