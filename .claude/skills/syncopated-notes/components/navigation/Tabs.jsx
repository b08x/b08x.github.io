import React from "react";

/**
 * Tabs — underline tab bar with a coral active indicator. Controlled
 * (pass value + onChange) or uncontrolled (defaultValue).
 */
export function Tabs({ tabs = [], value, defaultValue, onChange, style = {}, ...rest }) {
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && (tabs[0].value ?? tabs[0])));
  const active = value !== undefined ? value : internal;
  const pick = (v) => { if (value === undefined) setInternal(v); if (onChange) onChange(v); };

  return (
    <div style={{ display: "flex", gap: "2px", borderBottom: "1px solid var(--border)", ...style }} {...rest}>
      {tabs.map((t) => {
        const tab = typeof t === "string" ? { value: t, label: t } : t;
        const on = tab.value === active;
        return (
          <button
            key={tab.value}
            onClick={() => pick(tab.value)}
            style={{
              position: "relative", cursor: "pointer", background: "transparent", border: "none",
              padding: "9px 14px", marginBottom: "-1px",
              fontFamily: "var(--font-ui)", fontSize: "13px", fontWeight: on ? 700 : 500,
              color: on ? "var(--accent)" : "var(--text-2)",
              borderBottom: `2px solid ${on ? "var(--accent)" : "transparent"}`,
              transition: "color var(--transition-fast)",
              display: "inline-flex", alignItems: "center", gap: "7px",
            }}
          >
            {tab.icon ? <span style={{ display: "inline-flex" }}>{tab.icon}</span> : null}
            {tab.label}
            {tab.count != null && (
              <span style={{
                fontSize: "10.5px", fontWeight: 700, color: "var(--muted)",
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-pill)", padding: "0 6px", lineHeight: "16px",
              }}>{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
