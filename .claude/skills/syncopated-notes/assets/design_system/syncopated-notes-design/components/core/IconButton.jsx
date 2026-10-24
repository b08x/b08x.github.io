import React from "react";

/**
 * IconButton — square, icon-only control. Matches the theme-toggle
 * affordance: surface fill, hairline border, subtle scale on press.
 */
export function IconButton({
  children,
  size = "md",
  variant = "secondary",
  disabled = false,
  active = false,
  title,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const dim = { sm: 28, md: 34, lg: 42 }[size];

  const variants = {
    secondary: { background: "var(--surface)", border: "1px solid var(--border)" },
    ghost: { background: "transparent", border: "1px solid transparent" },
    solid: { background: "var(--accent)", border: "1px solid var(--accent)", color: "#fff" },
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim + "px",
        height: dim + "px",
        borderRadius: "var(--radius-md)",
        color: variant === "solid" ? "#fff" : active ? "var(--accent)" : "var(--text-2)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background var(--transition-fast), transform var(--transition-fast), color var(--transition-fast)",
        transform: press && !disabled ? "scale(0.92)" : hover && !disabled ? "scale(1.05)" : "scale(1)",
        ...variants[variant],
        ...(hover && !disabled && variant !== "solid" ? { background: "var(--popover)" } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
