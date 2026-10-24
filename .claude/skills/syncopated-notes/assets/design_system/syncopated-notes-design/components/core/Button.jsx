import React from "react";

/**
 * Button — Syncopated Notes primary action control.
 * Monospace label, hairline border, minimal radius, coral primary.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = "button",
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: "5px 10px", fontSize: "12px", gap: "6px", height: "28px" },
    md: { padding: "7px 14px", fontSize: "13px", gap: "7px", height: "34px" },
    lg: { padding: "10px 18px", fontSize: "15px", gap: "8px", height: "42px" },
  };

  const variants = {
    primary: {
      background: "var(--accent)",
      color: "#fff",
      border: "1px solid var(--accent)",
    },
    secondary: {
      background: "var(--surface)",
      color: "var(--foreground)",
      border: "1px solid var(--border-2)",
    },
    ghost: {
      background: "transparent",
      color: "var(--foreground)",
      border: "1px solid transparent",
    },
    outline: {
      background: "transparent",
      color: "var(--accent)",
      border: "1px solid var(--accent)",
    },
    danger: {
      background: "var(--status-danger)",
      color: "#fff",
      border: "1px solid var(--status-danger)",
    },
  };

  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const hoverBg = {
    primary: "var(--accent-hi)",
    secondary: "var(--surface-2)",
    ghost: "var(--surface)",
    outline: "var(--accent-soft)",
    danger: "color-mix(in oklab, var(--status-danger) 85%, #000)",
  };

  const base = {
    display: fullWidth ? "flex" : "inline-flex",
    width: fullWidth ? "100%" : "auto",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-ui)",
    fontWeight: 600,
    letterSpacing: "0.01em",
    lineHeight: 1,
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "background var(--transition-fast) var(--ease-out), transform var(--transition-fast) var(--ease-out)",
    transform: active && !disabled ? "scale(0.97)" : "scale(1)",
    whiteSpace: "nowrap",
    userSelect: "none",
    ...sizes[size],
    ...variants[variant],
    ...(hover && !disabled ? { background: hoverBg[variant] } : {}),
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={base}
      {...rest}
    >
      {icon ? <span style={{ display: "inline-flex", flexShrink: 0 }}>{icon}</span> : null}
      {children ? <span>{children}</span> : null}
      {iconRight ? <span style={{ display: "inline-flex", flexShrink: 0 }}>{iconRight}</span> : null}
    </button>
  );
}
