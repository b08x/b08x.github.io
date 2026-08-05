# Knowledgebase UI Kit

A faithful recreation of the live **Syncopated Notes** note-reader — the
product surface from `127.0.0.1:4000/notes/*`. It composes the design-system
primitives rather than re-implementing them.

## Layout
- **Header** — cyan lowercase wordmark, right-aligned nav (`Notes / Projects / Wikis / About`), theme toggle `IconButton`. Sticky, `backdrop-filter: blur(8px)`.
- **Left nav rail** (`--sidebar-w` 232px) — `eyebrow` labels + `NavItem` list of recent notes, coral active rule.
- **Article** (`--width-article` 860px) — coral monospace `h1`/`h2`/`h3`, Inter prose body, `Tag` row, `Callout` admonitions, `CodePanel` prompt/output blocks, action `Button`s.
- **Right TOC rail** (`--toc-w` 220px) — nested `NavItem`s.

## Interactions
- Theme toggle flips `.dark` on `<html>` (the real product's mechanism).
- Nav items and TOC links are clickable/anchored.

## Files
- `index.html` — mounts `<KnowledgebaseApp/>`.
- `app.jsx` — Header, NavRail, Toc, Article + shell; exports `window.KnowledgebaseApp`.

Components used: `Button`, `IconButton`, `Tag`, `Callout`, `CodePanel`, `NavItem`, `Tabs`.
