Monospace topic tag as used on notes; use for filterable keywords and taxonomy chips.

```jsx
<Tag>prompt-engineering</Tag>
<Tag active onClick={filter}>agentic</Tag>
<Tag hash={false}>v3.0</Tag>
```

Shows a muted `#` by default. Pass `active` for the selected cyan state and `onClick` to make it interactive.
