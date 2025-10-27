// FieldList.jsx
import React from "react";
// import InlineInput from "./InlineInput"; // adjust import path

export default function FieldList({
  title,
  list,
  isLocked,
  updateItem,
  removeItem,
  addItem,
}) {
  return (
    <div
      className="relative px-2 py-2 md:px-0"
      style={{
        "--amt": "clamp(3.25rem, 22vw, 5rem)",
        "--gap": "0.25rem",
      }}
    >
      {/* Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] md:gap-2 mb-2">
        <h4 className="text-[9px] md:text-sm font-semibold text-[#0f2a44]">
          {title}
        </h4>
        <h4 className="text-[9px] md:text-sm font-semibold text-[#0f2a44] text-right w-auto min-[361px]:w-[var(--amt)] md:w-24">
          Amount
        </h4>
      </div>

      {/* Rows */}
      {list.map((item, i) => (
        <div
          key={i}
          className="
            grid items-start gap-[var(--gap)] mb-1
            grid-cols-2 min-[361px]:grid-cols-[minmax(0,1fr)_var(--amt)]
            md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-2
          "
        >
          {/* Label */}
          <div className="min-w-0">
            {isLocked(i) ? (
              <span className="block text-[9px] md:text-sm text-[#0f2a44] line-clamp-2">
                {item.label}
              </span>
            ) : (
              <InlineInput
                value={item.label}
                onChange={(v) => updateItem(i, "label", v)}
                placeholder="Label"
                inputClassName="text-[9px] md:text-sm"
              />
            )}
          </div>

          {/* Colon (desktop only) */}
          <span className="hidden md:block text-sm text-[#0f2a44]/70 text-center px-1">
            :
          </span>

          {/* Amount + Remove */}
          <div className="flex items-center justify-end gap-1">
            <InlineInput
              type="number"
              value={item.amount}
              onChange={(v) => updateItem(i, "amount", v)}
              placeholder="0"
              inputClassName="
                text-right text-[9px] md:text-sm
                w-full min-[361px]:w-[var(--amt)] md:w-24
              "
            />
            {i >= 3 && (
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-red-300 font-bold leading-none"
                aria-label={`Remove ${title.toLowerCase()} row`}
              >
                ×
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1.5 md:gap-2 font-semibold text-[#0f2a44] hover:opacity-90"
      >
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#0f2a44]">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="text-[11px] md:text-sm">Add {title}</span>
      </button>
    </div>
  );
}


function InlineInput({
  error,
  className = "",
  onChange,

  onBlur,
  value,
  ...props
}) {
  const handleChange = (e) => onChange?.(e?.target?.value ?? "", e);

  return (
    <div className="min-w-0">
      <input
        {...props}
        value={value ?? ""}
        onChange={handleChange}
        className={`w-full rounded-[5px] h-7 px-2 text-[11px] text-right
          bg-white/65 backdrop-blur-[3px]
          border ${error ? "border-red-500 ring-0" : "border-[#10324F]/25"}
          text-[#0f2a44] placeholder:text-[#0f2a44]/40
          shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]
          focus:outline-none focus:ring-0
          ${
            error
              ? "focus:ring-red-500/50 focus:border-red-500"
              : "focus:ring-(--color-cta) focus:border-(--color-cta)"
          }
          ${className}`}
        aria-invalid={!!error}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}