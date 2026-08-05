import React from "react";

/**
 * Card — bordered surface container. Border-first, minimal shadow.
 * Optional header (eyebrow + title) and footer regions.
 */
export function Card({
  children,
  title,
  eyebrow,
  actions,
  footer,
  accent = false,
  padding = "md",
  style = {},
  ...rest
}) {
  const pad = { none: "0", sm: "12px 14px", md: "18px 20px", lg: "24px 28px" }[padding];
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: accent ? "3px solid var(--accent)" : "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      {(title || eyebrow || actions) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--background)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            {eyebrow && (
              <div style={{
                fontFamily: "var(--font-ui)", fontSize: "10.5px", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)",
                marginBottom: title ? "3px" : 0,
              }}>{eyebrow}</div>
            )}
            {title && (
              <div style={{
                fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700,
                color: "var(--foreground)", lineHeight: 1.3,
              }}>{title}</div>
            )}
          </div>
          {actions && <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>{actions}</div>}
        </div>
      )}
      <div style={{ padding: pad, fontFamily: "var(--font-body)", color: "var(--foreground)", fontSize: "14px", lineHeight: 1.6 }}>
        {children}
      </div>
      {footer && (
        <div style={{
          padding: "10px 16px", borderTop: "1px solid var(--border)",
          background: "var(--background)", fontFamily: "var(--font-ui)",
          fontSize: "12px", color: "var(--muted)",
        }}>{footer}</div>
      )}
    </div>
  );
}
