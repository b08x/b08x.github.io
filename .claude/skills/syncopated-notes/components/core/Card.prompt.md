Bordered surface container, border-first with a minimal shadow; use for notes, panels, list items, and grouped content.

```jsx
<Card eyebrow="Recent note" title="The Natural Pacing Protocol" actions={<IconButton title="Copy"><CopyIcon/></IconButton>}>
  Interpersonal scaffolding is essentially relational noise…
</Card>
<Card accent title="Guardrails">Policy engine + approval workflow.</Card>
```

Optional `eyebrow` / `title` / `actions` header, `footer`, `accent` coral left-rule, and `padding` (`none`/`sm`/`md`/`lg`).
