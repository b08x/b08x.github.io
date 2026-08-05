Obsidian-style admonition block — the signature Syncopated Notes content component. Mono title bar with a glyph, italic prose body, 12 semantic types mapped to the status palette.

```jsx
<Callout type="abstract" title="The Leak">
  Networks accumulated DNS, NAT, ACLs… until "just routing packets" described only a fraction of reality.
</Callout>
<Callout type="warning">Approval gate required before execution.</Callout>
<Callout type="example">OSPF flooding ≈ planner fan-out.</Callout>
```

Types: note/info/todo (blue) · abstract/tldr (cyan) · tip/important/success/done (green) · question/faq (amber) · warning/caution (orange) · failure/error/bug (red) · example (purple) · quote (muted). Title defaults to the type label.
