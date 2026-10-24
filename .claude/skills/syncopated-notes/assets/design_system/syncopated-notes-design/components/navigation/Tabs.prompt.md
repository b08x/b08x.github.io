Underline tab bar with a coral active indicator; controlled or uncontrolled.

```jsx
<Tabs tabs={["Field", "Tenor", "Mode"]} onChange={setTab} />
<Tabs value={tab} onChange={setTab}
  tabs={[{value:"notes",label:"Notes",count:14},{value:"graph",label:"Graph"}]} />
```

Tab items accept `icon` and `count`. Omit `value` for uncontrolled mode with `defaultValue`.
