import React from "react";

/** Select — native dropdown styled to match Input. */
export function Select({ value, defaultValue, options = [], size = "md", disabled = false, onChange, style = {}, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const dims = {
    sm: { height: "30px", fontSize: "13px" },
    md: { height: "36px", fontSize: "14px" },
    lg: { height: "44px", fontSize: "15px" },
  }[size];
  return (
    <div style={{
      position: "relative", display: "inline-flex", alignItems: "center",
      background: "var(--popover)",
      border: `1px solid ${focus ? "var(--accent)" : "var(--border-2)"}`,
      borderRadius: "var(--radius-sm)",
      boxShadow: focus ? "0 0 0 3px var(--ring)" : "none",
      opacity: disabled ? 0.5 : 1,
      transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
      ...dims, ...style,
    }}>
      <select
        value={value} defaultValue={defaultValue} disabled={disabled} onChange={onChange}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          appearance: "none", WebkitAppearance: "none", border: "none", outline: "none",
          background: "transparent", color: "var(--foreground)", cursor: disabled ? "not-allowed" : "pointer",
          fontFamily: "var(--font-ui)", fontSize: dims.fontSize, height: "100%",
          padding: "0 30px 0 11px", width: "100%",
        }}
        {...rest}
      >
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
      </select>
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ position: "absolute", right: "10px", pointerEvents: "none" }}>
        <path d="M3 4.5L6 7.5L9 4.5" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
