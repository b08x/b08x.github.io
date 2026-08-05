import React from "react";

/**
 * Callout — Obsidian-style admonition block, the signature
 * Syncopated Notes content component. Mono title bar + glyph,
 * italic prose body. 12 semantic types map to the status palette.
 */
const TYPES = {
  note:     { hue: "var(--status-info)",    glyph: "✎", label: "Note" },
  info:     { hue: "var(--status-info)",    glyph: "ℹ", label: "Info" },
  todo:     { hue: "var(--status-info)",    glyph: "☐", label: "Todo" },
  abstract: { hue: "var(--status-accent)",  glyph: "⚡", label: "Abstract" },
  tldr:     { hue: "var(--status-accent)",  glyph: "⚡", label: "TL;DR" },
  tip:      { hue: "var(--status-success)", glyph: "🔥", label: "Tip" },
  important:{ hue: "var(--status-success)", glyph: "🔥", label: "Important" },
  success:  { hue: "var(--status-success)", glyph: "✓", label: "Success" },
  done:     { hue: "var(--status-success)", glyph: "✓", label: "Done" },
  question: { hue: "var(--status-question)",glyph: "?", label: "Question" },
  faq:      { hue: "var(--status-question)",glyph: "?", label: "FAQ" },
  warning:  { hue: "var(--status-warning)", glyph: "⚠", label: "Warning" },
  caution:  { hue: "var(--status-warning)", glyph: "⚠", label: "Caution" },
  failure:  { hue: "var(--status-danger)",  glyph: "✗", label: "Failure" },
  error:    { hue: "var(--status-danger)",  glyph: "✗", label: "Error" },
  bug:      { hue: "var(--status-danger)",  glyph: "✗", label: "Bug" },
  example:  { hue: "var(--status-special)", glyph: "◈", label: "Example" },
  quote:    { hue: "var(--muted)",          glyph: "“", label: "Quote" },
};

export function Callout({ type = "note", title, children, style = {}, ...rest }) {
  const t = TYPES[type] || TYPES.note;
  return (
    <div
      style={{
        margin: "1.25rem 0",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        ...style,
      }}
      {...rest}
    >
      <div style={{
        display: "flex", alignItems: "center", gap: "9px",
        padding: "9px 14px",
        background: "var(--background)",
        borderBottom: "1px solid var(--border)",
        fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "13px",
        letterSpacing: "0.02em", color: t.hue,
      }}>
        <span style={{ fontSize: "16px", lineHeight: 1, fontStyle: "normal" }} aria-hidden>{t.glyph}</span>
        <span>{title || t.label}</span>
      </div>
      <div style={{
        padding: "12px 16px",
        fontFamily: "var(--font-body)",
        fontStyle: "italic",
        color: "var(--foreground)",
        fontSize: "14px", lineHeight: 1.6,
      }}>
        {children}
      </div>
    </div>
  );
}
