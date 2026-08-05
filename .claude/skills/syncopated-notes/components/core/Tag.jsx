import React from "react";

/**
 * Tag — monospace topic tag, as used on notes (e.g. `prompt-engineering`).
 * Optional leading "#" and click affordance.
 */
export function Tag({ children, hash = true, active = false, onClick, style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const interactive = !!onClick;
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "1px",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-code)",
        fontSize: "12px",
        fontWeight: 500,
        lineHeight: 1.4,
        padding: "2px 8px",
        borderRadius: "var(--radius-xs)",
        cursor: interactive ? "pointer" : "default",
        color: active ? "var(--cyan)" : "var(--text-2)",
        background: active
          ? "color-mix(in oklab, var(--cyan) 12%, var(--background))"
          : hover && interactive ? "var(--surface)" : "var(--surface)",
        border: `1px solid ${active ? "color-mix(in oklab, var(--cyan) 36%, transparent)" : "var(--border)"}`,
        transition: "color var(--transition-fast), border-color var(--transition-fast)",
        ...style,
      }}
      {...rest}
    >
      {hash ? <span style={{ color: "var(--muted)" }}>#</span> : null}
      {children}
    </span>
  );
}
