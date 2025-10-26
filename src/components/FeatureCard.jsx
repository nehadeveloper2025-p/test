import React from "react";

export default function FeatureCard({key, title, description, icon,iconhover }) {
  return (
  <div id={key}
    className="group relative flex flex-col items-center text-center bg-white/5 rounded-lg p-6 transition-transform duration-300 hover:-translate-y-2 w-full max-w-[270px]">

  {/* Image */}
   <div className="relative w-24 h-24 mb-4">
              <img
                src={icon}
                alt={title}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-0"
              />
              <img
                src={iconhover}
                alt={title}
                className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
  {/* Title */}
  <h3
    className="
      font-bold
      text-white
      transition-colors
      duration-300
      group-hover:text-black
    "
  >
    {title}
  </h3>

  {/* Description */}
  <p
    className="
      text-[10px]
      text-white/80
      transition-colors
      duration-300
      group-hover:text-black
    "
  >
    {description}
  </p>
</div>

  );
}
