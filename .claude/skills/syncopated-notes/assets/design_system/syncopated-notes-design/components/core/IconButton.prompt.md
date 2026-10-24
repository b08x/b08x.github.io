Square, icon-only control matching the theme-toggle / copy affordances; use in toolbars, headers, and note actions. Always pass `title` for accessibility.

```jsx
<IconButton title="Toggle theme"><SunIcon /></IconButton>
<IconButton variant="ghost" size="sm" title="Copy"><CopyIcon /></IconButton>
<IconButton variant="solid" title="Add"><PlusIcon /></IconButton>
```

Hover scales up 1.05; press to 0.92. Variants: `secondary` (surface+border), `ghost`, `solid` (coral).
