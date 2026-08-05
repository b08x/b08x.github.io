Toggle control with a coral "on" track; use for settings and binary options.

```jsx
<Switch checked={dark} onChange={setDark} label="Dark theme" />
<Switch checked={on} onChange={setOn} />
```

`onChange` receives the next boolean. Pass `label` to render an inline caption.
