import React from "react";

/** Switch — toggle control with coral "on" track. */
export function Switch({ checked = false, disabled = false, onChange, label, style = {}, ...rest }) {
  const toggle = () => { if (!disabled && onChange) onChange(!checked); };
  const sw = (
    <span
      role="switch"
      aria-checked={checked}
      onClick={toggle}
      style={{
        position: "relative", display: "inline-flex", flexShrink: 0,
        width: "38px", height: "22px", borderRadius: "var(--radius-pill)",
        background: checked ? "var(--accent)" : "var(--border-2)",
        border: "1px solid", borderColor: checked ? "var(--accent)" : "var(--border-2)",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        transition: "background var(--transition-base) var(--ease-out)",
      }}
    >
      <span style={{
        position: "absolute", top: "2px", left: checked ? "18px" : "2px",
        width: "16px", height: "16px", borderRadius: "50%", background: "#fff",
        boxShadow: "var(--shadow-sm)", transition: "left var(--transition-base) var(--ease-out)",
      }} />
    </span>
  );
  if (!label) return React.cloneElement(sw, { style: { ...sw.props.style, ...style }, ...rest });
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "9px", cursor: disabled ? "not-allowed" : "pointer", ...style }} {...rest}>
      {sw}
      <span style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--foreground)" }}>{label}</span>
    </label>
  );
}
