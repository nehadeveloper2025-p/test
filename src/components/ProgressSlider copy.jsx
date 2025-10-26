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
    <aside className={`p-6 ${responsive} ${className}`}>
      <div ref={trackRef} className="mt-10 relative pl-6">

        {/* vertical track */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-300/50" />

        {/* moving dot with smooth motion */}
        <div
          className="absolute left-1 w-4 h-4 rounded-full border-2 shadow-lg transition-[top] duration-500 ease-in-out"
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
                 onClick={() => onStepChange(s.id)}
                    className={`w-4 h-4 rounded-xl border-2 ${
                isActive
                  ? "border-[#10324F] bg-[#10324F]"
                  : "border-white-400 bg-white"
              } transition-all`}
                // className={[
                //   "w-[180px] h-[90px] rounded-[19px] border bg-white/40 backdrop-blur-[35px] mt-8",
                //   "flex text-left px-2 py-2 transition-all duration-300 cursor-pointer",
                //   "shadow-[0_8px_24px_rgba(16,50,79,0.08)]",
                //   isActive
                //     ? "border-[#10324F] bg-[#10324F]/10 ring-2 ring-[#10324F]/40 scale-[1.02]"
                //     : isDone
                //     ? "border-green-400 bg-green-50/40"
                //     : "border-white opacity-100",
                // ].join(" ")}
              >
                <div className="w-2 shrink-0" />
                <div className="ml-3 mb-2">
                  <p
                    className={`mb-0 text-sm font-semibold leading-8 ${
                      isActive
                        ? "text-[#10324F]"
                        : isDone
                        ? "text-green-700"
                        : "text-slate-800"
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="mb-2 text-[11px] leading-[1.3] text-slate-600">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
;