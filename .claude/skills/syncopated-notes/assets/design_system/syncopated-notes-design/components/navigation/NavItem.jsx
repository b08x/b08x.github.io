import React from "react";

/**
 * NavItem — sidebar / TOC link. Active state uses a coral left-rule
 * and tinted surface, matching the knowledgebase navigation.
 */
export function NavItem({ children, active = false, depth = 0, icon = null, href, onClick, style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href || undefined}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "6px 12px",
        paddingLeft: `${12 + depth * 14}px`,
        fontFamily: "var(--font-ui)", fontSize: "13px",
        fontWeight: active ? 600 : 400,
        color: active ? "var(--accent)" : hover ? "var(--foreground)" : "var(--text-2)",
        background: active ? "var(--surface)" : hover ? "var(--surface)" : "transparent",
        borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
        textDecoration: "none", cursor: "pointer", lineHeight: 1.4,
        transition: "color var(--transition-fast), background var(--transition-fast)",
        ...style,
      }}
      {...rest}
    >
      {icon ? <span style={{ display: "inline-flex", flexShrink: 0, color: active ? "var(--accent)" : "var(--muted)" }}>{icon}</span> : null}
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{children}</span>
    </a>
  );
}
