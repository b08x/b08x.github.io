import React from "react";

/**
 * CodePanel — inset command/output panel, the "code-panel" pattern from
 * the notes theme. Renders a terminal-flavored block with optional
 * filename/lang chip and a copy affordance.
 */
export function CodePanel({ children, lang, filename, copy = true, style = {}, ...rest }) {
  const [copied, setCopied] = React.useState(false);
  const ref = React.useRef(null);
  const doCopy = () => {
    const text = ref.current ? ref.current.innerText : "";
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div style={{
      background: "var(--bg-code)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      fontFamily: "var(--font-code)",
      ...style,
    }} {...rest}>
      {(lang || filename || copy) && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "6px 10px 6px 12px",
          borderBottom: "1px solid var(--border)",
          background: "var(--background)",
        }}>
          {filename && <span style={{ fontSize: "11.5px", color: "var(--text-2)" }}>{filename}</span>}
          {lang && <span style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            color: "var(--cyan)", padding: "2px 6px", border: "1px solid var(--border)",
            borderRadius: "var(--radius-xs)", background: "var(--surface)",
          }}>{lang}</span>}
          {copy && (
            <button onClick={doCopy} style={{
              marginLeft: "auto", cursor: "pointer", background: "transparent",
              border: "1px solid var(--border)", borderRadius: "var(--radius-xs)",
              color: copied ? "var(--status-success)" : "var(--muted)",
              fontFamily: "var(--font-ui)", fontSize: "11px", padding: "3px 8px",
            }}>{copied ? "copied ✓" : "copy"}</button>
          )}
        </div>
      )}
      <pre ref={ref} style={{
        margin: 0, padding: "12px 14px", fontSize: "12.5px", lineHeight: 1.7,
        color: "var(--foreground)", overflowX: "auto", whiteSpace: "pre",
      }}>{children}</pre>
    </div>
  );
}
