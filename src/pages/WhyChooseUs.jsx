import React from "react";
import girlImg from "../assets/girl.png";
import menImg from "../assets/men.png";
import playImg from "../assets/play.png";
import timeImg from "../assets/time.png";
import cloudImg from "../assets/cloud.png";
import PillItem from "../components/PillItem";

export default function WhyChooseUs() {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#E4EEF8] to-[#D1DFEA] overflow-hidden">
      {/* Circle Behind Image */}
      {/* <div className="absolute top-[15%] w-[420px] h-[420px] bg-linear-to-b from-[#1E3A8A] to-[#1E40AF] rounded-full z-0"></div> */}

      {/* Image */}
      <img
        src={girlImg}
        alt="woman"
        className="relative z-10 w-[250px] object-contain"
      />

      {/* Oval Shadow at Bottom */}
       <div class="oval"></div>
    </div>
    </>
  )};
    {/* // <div className="relative overflow-hidden min-h-screen flex flex-col justify-center"> */}
      {/* === Background gradient === */}
      {/* <div
      /> */}
    {/* <h3 className="with-icon">Hello React</h3> */}
      {/* === White soft glow behind second pill === */}
      {/* <div className="absolute top-[62%] right-[15%] w-[450px] h-[450px] rounded-full blur-[180px] bg-white/60 -z-10" /> */}
{/* <div className="glassy-wrapper">
  <img src={girlImg} alt="woman with laptop" />
</div> */}
      {/* === Header Section === */}
      // <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-2">
        {/* Left text */}
        {/* <div className="flex-1 text-center lg:text-left">
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
        </div> */}

        {/* Right image */}
        {/* <div className="flex-1 flex justify-center lg:justify-end"> */}
          {/* <img
            src={girlImg}
            alt="Why Choose Us"
            className="w-60 sm:w-[300px] lg:w-[380px]  object-cover"
          /> */}
        {/* </div>
      </div>

    </div> */}
//   );
// }
