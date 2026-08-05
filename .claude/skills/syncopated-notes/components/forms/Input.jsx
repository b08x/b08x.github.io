import React from "react";

/**
 * Input — text field with hairline border and coral focus ring.
 */
export function Input({
  value,
  defaultValue,
  placeholder,
  type = "text",
  size = "md",
  disabled = false,
  invalid = false,
  prefix = null,
  onChange,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const dims = {
    sm: { height: "30px", fontSize: "13px", padding: "0 9px" },
    md: { height: "36px", fontSize: "14px", padding: "0 11px" },
    lg: { height: "44px", fontSize: "15px", padding: "0 13px" },
  }[size];
  const borderColor = invalid
    ? "var(--status-danger)"
    : focus ? "var(--accent)" : "var(--border-2)";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      background: "var(--popover)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-sm)",
      boxShadow: focus ? "0 0 0 3px var(--ring)" : "none",
      transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
      opacity: disabled ? 0.5 : 1,
      ...dims, padding: undefined,
      paddingInline: dims.padding.split(" ")[1],
      ...style,
    }}>
      {prefix && <span style={{ display: "inline-flex", color: "var(--muted)", flexShrink: 0 }}>{prefix}</span>}
      <input
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          flex: 1, minWidth: 0, height: "100%", border: "none", outline: "none",
          background: "transparent", color: "var(--foreground)",
          fontFamily: "var(--font-code)", fontSize: dims.fontSize, letterSpacing: "0.01em",
        }}
        {...rest}
      />
    </div>
  );
}
