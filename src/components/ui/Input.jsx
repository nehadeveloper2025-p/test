// components/ui/Input.jsx
import React from "react";

export default function InputEmp({
  label,
  error,
  className = "",
  inputClassName = "",
  variant = "stack",
  labelWidth = "150px",                // <= tweak to taste
  onChange,
  onBlur,
  onFocus,
  value,
  ...props
}) {
  const handleChange = (e) => onChange?.(e?.target?.value ?? "", e);
 const handleFocus = (e) => {
    onFocus?.(e); // <-- correctly call the passed onFocus
  };
  const baseInputClasses = `
    w-full rounded-[5px] h-7 px-2 text-[11px]
    bg-white/65 backdrop-blur-[3px]
    border ${error ? "border-red-500 ring-0 ring-red-500/50" : "border-[#10324F]/25"}
    text-[#0f2a44] placeholder:text-[#0f2a44]/40
    shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]
    focus:outline-none focus:ring-0 ${error ? "focus:ring-red-500/50" : "focus:ring-[#10324F]/25"}
    ${inputClassName}
  `;

  if (variant === "row") {
    return (
      <div
        className={`grid items-center gap-3 ${className}`}
        style={{ gridTemplateColumns: `${labelWidth} 12px minmax(0,1fr)` }}  // <- minmax prevents pill shrinking
      >
        {label ? (
          <div className="text-sm text-[#0f2a44] text-left">{label}</div>
        ) : (
          <div />
        )}
        <div className="text-[#0f2a44]/40 text-center">:</div>

        <div className="min-w-0"> {/* <- lets the input expand */}
          <input
            {...props}
            value={value ?? ""}
            onChange={handleChange}
              onFocus={handleFocus} 
            className={baseInputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.name || props.id}-error` : undefined}
          />
          {error ? (
            <p id={`${props.name || props.id}-error`} className="mt-1 text-xs text-red-600">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  // default stacked
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[#0f2a44] mb-1">{label}</label>
      )}
      <input
        {...props}
        value={value ?? ""}
        onChange={handleChange}
          onFocus={handleFocus} 
        className={baseInputClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.name || props.id}-error` : undefined}

      />
      {error ? (
        <p id={`${props.name || props.id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
