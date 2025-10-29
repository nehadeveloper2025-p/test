import { useEffect, useRef, useState } from "react";
import bgImg from "../assets/bluecircle.png";
import bgImgSmall from "../assets/blurcirclesmall.png";


export default function ProgressSlider({
  steps,
  activeStep,
  onStepChange,
  className = "",
  hideOnMobile = true,
}) {
 const trackRef = useRef(null);
  const itemRefs = useRef([]);
  const [dotTop, setDotTop] = useState(0);

  const currentIndex = Math.max(0, steps.findIndex((s) => s.id === activeStep));

  // Update dot position
  useEffect(() => {
    function updateDot() {
      const container = trackRef.current;
      const el = itemRefs.current[currentIndex];
      if (!container || !el) return;
      const c = container.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setDotTop(r.top + r.height / 2 - c.top);
    }

    updateDot();
    const t = setTimeout(updateDot, 0);
    window.addEventListener("resize", updateDot);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateDot);
    };
  }, [currentIndex, steps, activeStep]);

  const responsive = hideOnMobile ? "hidden md:block" : "";


  return (
      <div ref={trackRef} className="relative pl-16 pt-12"> {/* more space from slider */}
        {/* vertical track */}
        <div className="absolute h-[830px] top-10  pt-12 bottom-0 w-0.5 left-6 bg-[#10324F]/50" />

        {/* moving dot */}
        <div
          className="absolute left-4 w-4 h-4 rounded-full border-2 shadow-lg transition-[top] duration-500 ease-in-out"
          style={{
            top: dotTop,
            backgroundColor: "#10324F",
            borderColor: "#10324F",
          }}
          aria-hidden="true"
        />

        {/* steps */}
        <div className="flex flex-col gap-12">
          {steps.map((s, i) => {
            const isActive = activeStep === s.id;

            return (
         <div key={s.id} className="relative">
      {/* Decorative blob BEHIND the card (sibling, lower z) */}
      {(i === 2 || i === 4) && (
        <img
          src={bgImg}
          alt=""
          aria-hidden="true"
          className={[
            "pointer-events-none select-none",
            "absolute z-0",                // behind the card
            i === 2
              ? "-top-3 right-14 w-16 h-16" // 2nd: bigger, top-right
              : "-top-3 -left-4 w-10 h-10", // 4th: smaller, top-left
            "object-contain opacity-90",
            "drop-shadow-[0_12px_30px_rgba(16,50,79,0.35)]",
          ].join(" ")}
        />
      )}

      {/* The card itself (above the blob) */}
      <div
        ref={(el) => (itemRefs.current[i] = el)}
        onClick={() => {
          onStepChange(s.id);
          const sec = document.querySelector(`[data-step-section="${s.id}"]`);
          if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className={`relative z-10 w-[220px] h-[90px] rounded-2xl
          transition-all duration-300 cursor-pointer text-left
          flex flex-col justify-center px-5 py-4
          bg-white/70 backdrop-blur-md        /* glassy so the blob peeks around edges */
          shadow-[0_8px_24px_rgba(16,50,79,0.10)]
          border ${isActive ? "border-(--color-cta)" : "border-white/60"}
        `}
      >
        <p className={`mb-1 text-sm font-semibold ${isActive ? "text-(--color-dark)" : "text-(--color-dark"}`}>
          {s.title}
        </p>
        <p className="text-[11px] text-[#0f2a44]/70">{s.desc}</p>
      </div>
    </div>
            );
          })}
        </div>
      </div>
  );
}
