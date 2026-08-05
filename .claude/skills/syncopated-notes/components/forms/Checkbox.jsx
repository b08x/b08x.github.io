import React from "react";

/** Checkbox — square check with coral fill when set. */
export function Checkbox({ checked = false, disabled = false, indeterminate = false, onChange, label, style = {}, ...rest }) {
  const toggle = () => { if (!disabled && onChange) onChange(!checked); };
  const box = (
    <span
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      onClick={toggle}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        width: "18px", height: "18px", borderRadius: "var(--radius-xs)",
        background: (checked || indeterminate) ? "var(--accent)" : "var(--popover)",
        border: "1px solid", borderColor: (checked || indeterminate) ? "var(--accent)" : "var(--border-2)",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        transition: "background var(--transition-fast), border-color var(--transition-fast)",
      }}
    >
      {indeterminate ? (
        <span style={{ width: "9px", height: "2px", background: "#fff", borderRadius: "1px" }} />
      ) : checked ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2L5 8.6L9.6 3.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : null}
    </span>
  );
  if (!label) return React.cloneElement(box, { style: { ...box.props.style, ...style }, ...rest });
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "9px", cursor: disabled ? "not-allowed" : "pointer", ...style }} {...rest}>
      {box}
      <span style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--foreground)" }}>{label}</span>
    </label>
  );
}
