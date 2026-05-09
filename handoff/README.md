# SRL → b08x.github.io Integration

Drop-in package for converting the Syncopated Research Ledger design
into the live Jekyll/React repository.

---

## Files in this package

| File | Destination in repo |
|---|---|
| `SRLLeftSidebar.tsx` | `src/components/SRLLeftSidebar.tsx` |
| `SRLCenterStage.tsx` | `src/components/SRLCenterStage.tsx` |
| `SRLRightPane.tsx`   | `src/components/SRLRightPane.tsx` |
| `SRLLayout.tsx`      | `src/components/SRLLayout.tsx` |
| `HermesDSPYDeck.tsx` | `src/components/HermesDSPYDeck.tsx` |
| `srl-layout.html`    | `_layouts/srl-layout.html` |
| `note.html`          | `_layouts/note.html` (replaces existing) |

---

## 1 — Register components in `src/main.tsx`

Add two lazy imports and two entries to the `components` record:

```ts
// After the existing lazy imports (around line 52):
const SRLLayout      = React.lazy(() => import('./components/SRLLayout'));
const HermesDSPYDeck = React.lazy(() => import('./components/HermesDSPYDeck'));

// Inside the components record (around line 68):
SRLLayout,
HermesDSPYDeck,
```

---

## 2 — Add SRL CSS custom properties

Add to `_sass/_theme-variables.scss` inside `:root { }` (after the last variable):

```scss
// ── SRL accent tokens ──────────────────────────────────────────────
--srl-cyan:      #38bdf8;
--srl-rose:      #fb7185;
--srl-emerald:   #34d399;
--srl-bg-deep:   #0d0d0d;
--srl-border2:   #161616;
--srl-rose-muted: rgba(251, 113, 133, 0.12);
```

If you'd rather not touch the SCSS, the `SRLLayout` component injects
these at runtime via a `<style>` tag — so they work without this step,
but adding them to SCSS means they're available for use in other
components too.

---

## 3 — Add `bg-liminal-bg` to Tailwind safelist (if purged)

`tailwind.config.js` already defines `'liminal-bg': '#0A0A0A'`.
If you see the class being purged in production, add to `content:`:

```js
content: [
  // existing entries...
  './_layouts/srl-layout.html',
],
```

---

## 4 — Usage in note front matter

Any `_notes/*.md` using `layout: note` automatically gets the SRL.
Front-matter keys you can set per-note:

```yaml
---
layout: note
title: "My Note Title"
tags: [neuro-symbolic, dspy]
video_url: "https://youtu.be/..."
feature: video          # 'search' | 'video' | 'prose'
tenor_level: 65         # 0–100
active_domain: "Neuro-Symbolic Integration"
active_mode: screencast
expand_graph: false
---
```

### Presentation / deck mode

To render a note as a full-screen Hermes×DSPY deck instead:

```yaml
---
layout: note
title: "Hermes × DSPY"
show_deck: true
author: B08X_SYSTEMS
---
```

---

## 5 — Entangled nodes (right pane)

Currently the layout pulls the 5 most-recently-modified notes as
placeholder entangled nodes with static similarity scores.

To wire real semantic scores, replace the `related_json` block in
`srl-layout.html` with output from your `bidirectional_links_generator`
plugin — it already generates backlink data that can be sorted by
co-occurrence frequency.

---

## 6 — Build and test

```bash
bundle exec jekyll serve
# Visit any _notes page — it will render the SRL island
```

Check the browser console for `[Garden] Successfully rendered island: SRLLayout`.

---

## Notes

- `SRLCenterStage` renders Jekyll `{{ content }}` via
  `dangerouslySetInnerHTML` inside a `prose` article — all your
  existing markdown/callout/code-block styling applies as-is.
- The tenor slider in the left sidebar is purely client-side state.
  If you want it persisted per-note, store in `localStorage` keyed
  by `noteId`.
- `HermesDSPYDeck` slides are hardcoded defaults. Pass a `slides`
  prop (array of `{ tag, title, subtitle, body? }`) via the Jekyll
  island props to make them data-driven from front matter.
