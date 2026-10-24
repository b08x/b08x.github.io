import React from "react";

/**
 * Badge — small status pill. Uses the editor status palette with a
 * tinted surface for legibility in both themes.
 */
export function Badge({ children, tone = "neutral", solid = false, style = {}, ...rest }) {
  const hue = {
    neutral: "var(--muted)",
    info: "var(--status-info)",
    accent: "var(--status-accent)",
    success: "var(--status-success)",
    question: "var(--status-question)",
    warning: "var(--status-warning)",
    danger: "var(--status-danger)",
    special: "var(--status-special)",
    coral: "var(--accent)",
  }[tone];

  const solidStyle = {
    background: hue,
    color: "#fff",
    border: "1px solid transparent",
  };
  const softStyle = {
    background: `color-mix(in oklab, ${hue} 14%, var(--background))`,
    color: hue,
    border: `1px solid color-mix(in oklab, ${hue} 34%, transparent)`,
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontFamily: "var(--font-ui)",
        fontSize: "10.5px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        lineHeight: 1.4,
        padding: "3px 8px",
        borderRadius: "var(--radius-xs)",
        whiteSpace: "nowrap",
        ...(solid ? solidStyle : softStyle),
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
