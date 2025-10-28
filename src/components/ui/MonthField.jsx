import { useState,useMemo ,useEffect} from "react";

export default function MonthField({ value = "", onChange, color = "#10324F" }) {
  const safeYear = useMemo(() => {
    const y = (value || "").split("-")[0] || "";
    return /^\d{4}$/.test(y) ? +y : new Date().getFullYear(); // ← no more 0
  }, [value]);
  

  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(safeYear);
  useEffect(() => setYear(safeYear), [safeYear]); // keep header in sync

  const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];

  const fmtLabel = useMemo(() => {
    if (!/^\d{4}-\d{2}$/.test(value)) return "Select month";
    const [y, m] = value.split("-");
    const d = new Date(Number(y), Number(m) - 1, 1);
    return d.toLocaleString("en", { month: "short", year: "numeric" }); // e.g. "Aug 2025"
  }, [value]);

  function pick(m) {
    const next = `${year}-${m}`;
    onChange?.(next);
    setOpen(false);
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-9 w-full max-w-[180px] text-sm
                   rounded-[5px] px-2 bg-white/65 backdrop-blur-[3px]
                   border border-[#10324F]/25 text-[#0f2a44]
                   shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]
                   focus:outline-none focus:ring-2 focus:ring-[#10324F]/25
                   flex items-center justify-between"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={`truncate ${fmtLabel === "Select month" ? "text-[#0f2a44]/50" : ""}`}>
          {fmtLabel}
        </span>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M6 8l4 4 4-4" stroke="#0f2a44" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[240px] rounded-lg border border-[#10324F]/25 bg-white/95 backdrop-blur-md shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => setYear((y) => y - 1)} className="px-2 py-1 rounded hover:bg-black/5" aria-label="Previous year">‹</button>
            <div className="font-semibold text-[#0f2a44]">{year}</div>
            <button type="button" onClick={() => setYear((y) => y + 1)} className="px-2 py-1 rounded hover:bg-black/5" aria-label="Next year">›</button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {months.map((m) => {
              const val = `${year}-${m}`;
              const isSel = /^\d{4}-\d{2}$/.test(value) && value === val;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => pick(m)}
                  className={`text-sm rounded-md px-2 py-1 border transition
                    ${isSel ? "text-white" : "text-[#0f2a44] hover:bg-black/5"}`}
                  style={{
                    borderColor: isSel ? color : "rgba(16,50,79,0.25)",
                    background: isSel ? color : "transparent",
                  }}
                >
                  {new Date(0, +m - 1).toLocaleString("en", { month: "short" })}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
