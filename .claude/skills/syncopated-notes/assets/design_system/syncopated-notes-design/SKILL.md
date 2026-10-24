---
name: syncopated-notes-design
description: Use this skill to generate well-branded interfaces and assets for Syncopated Notes — a monospace-forward "Field Note" knowledge base (cream parchment + dark ink, terracotta accent, Space Mono everywhere, light & dark). Use for production UI or throwaway prototypes, mocks, decks, and note layouts. Contains design guidelines, color/type tokens, webfonts, brand assets, reusable React components, a knowledgebase UI kit, and a slide template.
user-invocable: true
---

# Syncopated Notes Design System

Read **`readme.md`** first — it carries the full brand guide: CONTENT FUNDAMENTALS
(voice, casing, tone), VISUAL FOUNDATIONS (color, type, spacing, motion, borders),
and ICONOGRAPHY. The brand is the **Field Note** theme: cream parchment, dark ink,
terracotta accent, Space Mono. Then explore the other files.

## What's here
- `styles.css` — the single CSS entry point (link this; it `@import`s everything).
- `tokens/` — colors, typography, spacing, elevation, fonts (CSS custom properties +
  `@font-face`). Light is default; `.dark` on `<html>` flips to the terminal theme.
- `fonts/` — Space Mono (primary, via Google Fonts) + JetBrains Mono, Inter, Hack,
  Mononoki (shipped alternates).
- `assets/brand/` — logo, icon, favicon.
- `guidelines/` — foundation specimen cards.
- `components/` — reusable React primitives (Button, IconButton, Badge, Tag, Card,
  Input, Select, Switch, Checkbox, Callout, CodePanel, Tabs, NavItem). Each has a
  `.prompt.md` with a usage snippet.
- `ui_kits/knowledgebase/` — the live note-reader screen, composing the primitives.
- `templates/agentic-infrastructure-deck/` — a 6-slide Cisco-Visio-grammar deck.

## How to work
- **Visual artifacts** (slides, mocks, throwaway prototypes): copy the assets and fonts
  you need into your output folder and emit **static HTML** using the tokens and the
  patterns documented in `readme.md`. For decks, start from the `templates/` deck.
- **Production code**: link `styles.css`, import the components, and follow the rules
  here to design natively in the brand.

## Non-negotiables
- Space Mono (loaded from Google Fonts) for everything — headings, UI, code, body; the
  whole brand speaks in one monospace voice. JetBrains Mono / Hack / Mononoki / Inter
  ship as documented alternates.
- Structure with 1px hairline borders, not shadow. Minimal corners. Soft, rare shadows.
- One warm accent: terracotta (`--accent`) for headings/primary actions; a dusty
  slate-blue (`--cyan`) for the wordmark/links. Use the earthy `--chart-1…5` palette
  (blue/ochre/olive/plum/red) for syntax and diagrams, the `--status-*` set for
  callouts/badges.
- No emoji in prose or chrome (callout glyphs are the only exception). No gradients.
- Voice = engineer's field notebook: precise, dry, structural; lowercase wordmark,
  kebab-case tags, Claim→Leak rhetorical moves.

If invoked with no other guidance, ask what the user wants to build, ask a few focused
questions, then act as an expert Syncopated Notes designer — outputting HTML artifacts
or production code as the need dictates.
