import { useEffect, useRef, useState } from "react";

/** steps = [{id, title, desc}] */
export default function ProgressSlider({ steps, activeStep, onStepChange, className = "" }) {
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
    return () => { clearTimeout(t); window.removeEventListener("resize", updateDot); };
  }, [currentIndex, steps, activeStep]);

  return (
    <aside className={`p-6 ${className}`}>

      <div ref={trackRef} className="relative pl-6">
        {/* vertical track */}
        <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-slate-300/50" />

        {/* SINGLE moving dot (deep navy) */}
        <div
          className="absolute left-1 w-4 h-4 rounded-full border-2 shadow-lg transition-all duration-300"
          style={{ top: dotTop, backgroundColor: "#10324F", borderColor: "#10324F" }}
          aria-hidden="true"
        />

        {/* Step cards with exact sizing & glass style */}
        <div className="flex flex-col gap-6">
          {steps.map((s, i) => {
            const isActive = i === currentIndex;
            const isDone = i < currentIndex;
            return (
              <div
                key={s.id}
                ref={(el) => (itemRefs.current[i] = el)}
                className={[
                  // exact design tokens:
                  "w-[255px] h-[95px] rounded-[19px] border bg-white/40 backdrop-blur-[35px]",
                  "border-white opacity-100",
                  // layout & spacing:
                  "flex items-center px-4 py-3",
                  // elevation:
                  "shadow-[0_8px_24px_rgba(16,50,79,0.08)]",
                  // state:
                  isActive ? "border-[#10324F]" : "",
                ].join(" ")}
              >
                {/* spacer for the track/dot alignment */}
                <div className="w-4 shrink-0" />
                <div className="ml-3">
                  <p className={`text-sm font-semibold leading-5 ${
                    isActive ? "text-[#10324F]" : isDone ? "text-green-700" : "text-slate-800"
                  }`}>
                    {s.title}
                  </p>
                  <p className="text-[11px] leading-4 text-slate-600">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
