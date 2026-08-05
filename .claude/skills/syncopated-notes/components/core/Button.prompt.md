Primary action control with the Syncopated Notes IDE look — monospace label, hairline border, minimal radius, coral primary; use for any clickable action.

```jsx
<Button variant="primary" size="md" onClick={save}>Save note</Button>
<Button variant="secondary" icon={<PlusIcon />}>New</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button variant="outline">Copy prompt</Button>
<Button variant="danger" size="sm">Delete</Button>
```

Variants: `primary` (coral filled) · `secondary` (surface + border) · `ghost` (transparent) · `outline` (coral hairline) · `danger` (red). Sizes `sm` / `md` / `lg`. Pass `icon` / `iconRight` for SVG affordances, `fullWidth` to stretch. Hover darkens; press scales to 0.97.
