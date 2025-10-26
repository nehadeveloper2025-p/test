import { useEffect, useRef, useState } from "react";

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

  // Scroll listener to auto-update active step
  useEffect(() => {
    function handleScroll() {
      for (let i = steps.length - 1; i >= 0; i--) {
        const el = document.querySelector(`[data-step-section="${steps[i].id}"]`);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 100) {
          if (activeStep !== steps[i].id) onStepChange(steps[i].id);
          break;
        }
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps, activeStep, onStepChange]);

  const responsive = hideOnMobile ? "hidden md:block" : "";


  return (
    <aside className={`p-6 ${responsive} ${className}`}>
      <div ref={trackRef} className="mt-10 relative pl-12"> {/* more space from slider */}
        {/* vertical track */}
        <div className="absolute top-0 bottom-0 w-0.5 left-6 bg-[#10324F]/50" />

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
        <div className="flex flex-col gap-6 mt-10">
          {steps.map((s, i) => {
            const isActive = activeStep === s.id;

            return (
              <div
                key={s.id}
                 ref={(el) => (itemRefs.current[i] = el)}
                onClick={() => {
                  onStepChange(s.id); // update active step
                  const el = document.querySelector(`[data-step-section="${s.id}"]`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`w-44 h-[90px] rounded-xl transition-all duration-300 cursor-pointer
                  flex flex-col justify-center px-5 py-4
                  shadow-[0_8px_24px_rgba(16,50,79,0.08)]
                  ${isActive ? "shadow-[0_0_20px 5px rgba(16,50,79,0.25)]" : ""}
                  bg-white
                `}
              >
                <div className="text-left"> {/* ensures text stays left-aligned */}
                  <p
                    className={`mb-1 text-sm font-semibold ${
                      isActive ? "text-[#10324F]" : "text-gray-700"
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="text-[11px] text-gray-500">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
