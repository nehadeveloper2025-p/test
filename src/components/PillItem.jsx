import React from "react";

export default function PillItem({ imageSrc, imageAlt, title }) {
  return (
    <div
      className="
        flex items-center gap-4 px-6 py-5 rounded-[20px]
        border border-white/20
        transition-all duration-300 ease-in-out
        hover:bg-white/25 hover:shadow-[0_8px_28px_rgba(16,50,79,0.15)]
        w-[520px]
      "
    >
      <img src={imageSrc} alt={imageAlt} className="w-10 h-10 object-contain" />
      <p className="text-base sm:text-lg font-medium text-[#10324F] m-0">
        {title}
      </p>
    </div>
  );
}
