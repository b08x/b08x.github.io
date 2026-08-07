# Syncopated Notes — Design System (condensed reference)

Source: this skill's own `readme.md` and `tokens/*.css`, synced from the
`claude.ai/design` project. That is the canonical **Field Note** design
system. The Jekyll site's own `_includes/theme-tokens.html` is a
**subset** of these tokens — the same brand, not a different one. When
editing the site, treat `../readme.md` and `../tokens/*.css` (siblings of
this file, one level up) as the reference and the in-repo
`theme-tokens.html` as the live file to modify.

> Read `../readme.md` first for the full brand guide (voice, visual
> foundations, iconography, index of components/guidelines). The summary
> below is the procedure-relevant slice, plus the light-mode token table
> and its mapping to the site's own CSS variable names (not covered in
> `readme.md`). The Jekyll site itself only ships light mode — see "Night
> theme" below for the design system's dark-mode tokens in case that's
> ever wired up.

## Voice — how Syncopated Notes writes

The voice is a **working engineer's field notebook**: precise, dry, a
little wry, never marketing-slick. Notes are observations, not
announcements.

- **Person & stance.** Mostly impersonal and declarative ("Networks
  accumulated DNS, DHCP, NAT…"). Second person appears as instruction
  inside prompts/protocols. First person is rare and informal. Reader is
  a peer.
- **Casing.** Wordmark and most chrome are **lowercase** ("syncopated
  notes"). Section headers are **Title Case** or terse phrases ("The
  Claim vs. The Leak"). **Tags are kebab-case** (`prompt-engineering`,
  `natural-pacing`). Code, IDs, addresses stay verbatim
  (`10.1.20.0/24`, `OSPF / BGP`).
- **Tone.** Analytical and structural. Loves a clean analogy carried all
  the way through. Comfortable with jargon; defines it only when the
  point depends on it. Favors a **Claim → The Leak** rhetorical pivot.
- **Brevity.** Anti-verbosity protocol: avoid "essay mode", boilerplate
  openers ("I hope this helps"), and restating the question. Prefer
  sentence fragments in conversational copy; prefer dense, scannable
  structure (bullets, tables, callouts) in reference copy.
- **Emoji.** Not used in prose or UI chrome. **Callout glyphs** are the
  only exception (see below) — treat them as an icon set, not
  decoration. Unicode symbols (→, ☁, ◐, │) are used structurally in
  diagrams. Don't sprinkle emoji anywhere else.

### Callout glyph set (re-use, don't invent)

Obsidian-style: ✎ note · ℹ info · ☐ todo · ⚡ abstract · 🔥 tip ·
✓ success · ? question · ⚠ warning · ✗ error · ◈ example · " quote.
The `Callout` component owns these — match glyph + status hue.

## Visual foundations — the two faces

The brand has two faces:

1. **Field Note** (default — what the Jekyll site uses) — cream
   parchment + Space Mono + terracotta. This is the documented house
   style.
2. **IDE knowledgebase** — paper/ink + JetBrains Mono + cyan (the live
   product app, not the Jekyll site). Ships as alternates in the DS repo
   but **not used by the Jekyll site**.

### Color (Field Note / light — default)

Hex values match the Jekyll site's `--bg/--amber/--text` etc. verbatim
when given the DS's `--background/--accent/--foreground` aliases.

| Token | Hex | Site alias |
|---|---|---|
| `--background` | `#EDE6D6` | `--bg` |
| `--surface` | `#E3DBC8` | `--bg2` |
| `--surface-2` | `#DACFB8` | (new — nested/hover) |
| `--popover` | `#F4EFE3` | (new — raised) |
| `--bg-code` | `#E3DBC8` | `--bg2` |
| `--foreground` | `#2A2420` | `--text` |
| `--text-2` | `#5C5248` | `--text2` |
| `--muted` | `#8A7F72` | `--muted` |
| `--dim` | `#B0A492` | `--dim` |
| `--border` | `#D2C7B4` | `--border` |
| `--border-2` | `#C9B8A0` | `--border2` |
| `--accent` | `#B5654A` | `--amber` |
| `--accent-hi` | `#C97A5E` | `--amber-hi` |
| `--accent-soft` | `#E7D7C6` | (new — tinted wash) |
| `--cyan` | `#5C7C99` | `--badge-blue` |
| `--cyan-hi` | `#4E6E8A` | (new — link hover) |
| `--brand-mark` | `#8B0A5F` | (logo only — **never** in chrome) |

**Chart palette (5-stop — use for syntax + diagrams):**

| Token | Hex | Maps to in site |
|---|---|---|
| `--chart-1` | `#5C7C99` | `--badge-blue` (blue) |
| `--chart-2` | `#B08833` | (new — ochre) |
| `--chart-3` | `#6B7F52` | `--badge-green` (olive) |
| `--chart-4` | `#8A5A6F` | (new — plum) |
| `--chart-5` | `#A8453A` | `--red` (brick) |

**Status palette (use for callouts + badges):**

| Token | Hex | Admonition |
|---|---|---|
| `--status-info` | `#5C7C99` | note / info |
| `--status-accent` | `#4E6E8A` | abstract / tldr |
| `--status-success` | `#6B7F52` | tip / done |
| `--status-question` | `#B08833` | question / faq |
| `--status-warning` | `#BC6B3F` | warning / caution |
| `--status-danger` | `#A8453A` | error / bug |
| `--status-special` | `#7E5C73` | example |

**Night theme (`.dark` on `<html>` in the design-system project — not currently
wired up on the Jekyll site, which is light-mode only; use this table if a
dark mode is ever added):**

| Token | Light | Dark ("warm lamp-lit night") |
|---|---|---|
| `--background` | `#EDE6D6` | `#211C17` |
| `--surface` | `#E3DBC8` | `#2A241D` |
| `--surface-2` | `#DACFB8` | `#342D24` |
| `--popover` | `#F4EFE3` | `#2E2820` |
| `--bg-code` | `#E3DBC8` | `#1B1712` |
| `--foreground` | `#2A2420` | `#ECE3D2` |
| `--text-2` | `#5C5248` | `#C7BBA6` |
| `--muted` | `#8A7F72` | `#968A78` |
| `--dim` | `#B0A492` | `#5E5546` |
| `--border` | `#D2C7B4` | `#3A3228` |
| `--border-2` | `#C9B8A0` | `#4B4135` |
| `--accent` | `#B5654A` | `#C97A5E` |
| `--accent-hi` | `#C97A5E` | `#DB8E72` |
| `--accent-soft` | `#E7D7C6` | `#3A2A22` |
| `--cyan` | `#5C7C99` | `#84A4C0` |
| `--cyan-hi` | `#4E6E8A` | `#9DB8CE` |
| `--chart-1…5` | blue/ochre/olive/plum/red (light) | `#84A4C0` `#D2A653` `#97AC78` `#B488A0` `#D2715F` |
| `--status-*` | see table above | same hues, lightened for night (see `tokens/colors.css`) |

Note: never a cold IDE black — the night mode stays warm/paper-toned. This is
a **warm lamp-lit night**, distinct from the "IDE knowledgebase" alternate
face (paper/ink + JetBrains Mono + cyan) that the design system also ships
but which the Jekyll site does not use.

### Type

**Space Mono carries the entire identity** — chrome, headings, body, and
code are all the same monospace voice. Loaded from Google Fonts exactly
as the live site does (`_includes/head.html`).

| Alias | Value |
|---|---|
| `--font-mono` | `"Space Mono", "JetBrains Mono", "Hack", "Mononoki", ui-monospace, "SFMono-Regular", Menlo, monospace` |
| `--font-prose` | `"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` |
| `--font-display / --font-ui / --font-body / --font-code` | all → `--font-mono` |

Weights: 300 / 400 / 500 / 600 / 700. The site currently only uses 400 +
700.

**Type scale (rem):** `--text-2xs` 0.6875 (11) · `--text-xs` 0.75 (12) ·
`--text-sm` 0.8125 (13) · `--text-base` 0.9375 (15) · `--text-md`
1.0625 (17) · `--text-lg` 1.25 (20) · `--text-xl` 1.5 (24) ·
`--text-2xl` 1.875 (30) · `--text-3xl` 2.375 (38) · `--text-4xl` 3 (48)
· `--text-5xl` 3.75 (60).

**Line heights:** `--leading-tight` 1.15 · `--leading-snug` 1.3 ·
`--leading-normal` 1.5 · `--leading-relaxed` 1.7 (prose body).

**Tracking:** `--tracking-tighter` -0.02em · `--tracking-tight` -0.01em
· `--tracking-normal` 0 · `--tracking-wide` 0.04em · `--tracking-wider`
0.08em (eyebrows / uppercase meta) · `--tracking-widest` 0.14em.

### Spacing & layout

8px rhythm with a 4px sub-step. `--space-0` … `--space-12` (0, 1px, 4,
8, 12, 16, 24, 32, 40, 48, 64, 96).

**Layout widths (the site already uses some of these):**

| Token | Value | Used on site |
|---|---|---|
| `--width-content` | 1100px |  |
| `--width-article` | 860px |  |
| `--width-narrow` | 740px |  |
| `--measure-prose` | 65ch | (not used — site prose is `.post` at 680px) |
| `--sidebar-w` | 232px | (not used — site has no left rail) |
| `--toc-w` | 220px | (not used — site has no TOC rail) |
| `--header-h` | 56px |  |

The site's `.post` column is **680px** — between `--width-narrow` and
`--width-article`. Consider normalizing.

**Z-index scale:** `--z-base` 0 · `--z-raised` 10 · `--z-sticky` 30 ·
`--z-overlay` 40 · `--z-modal` 50 · `--z-toast` 70 · `--z-tooltip` 100.

### Radius, borders & elevation

Border-first. Structure comes from **1px hairlines**, not shadow.
Corners are minimal; shadows are soft and rare.

- Radius: `--radius-xs` 3px (badges, tokens, inline code) ·
  `--radius-sm` 4px (inputs, small buttons, field-notes) ·
  `--radius-md` 8px (cards, callouts, panels) · `--radius-lg` 12px ·
  `--radius-xl` 20px (hero cards / canvas nodes) ·
  `--radius-pill` 999px.
- Border widths: `--border-width` 1px · `--border-width-2` 2px (active /
  focus) · `--border-accent` 3px (left-rule on quotes / active nav).
- Elevation: `--shadow-xs / --shadow-sm / --shadow-md / --shadow-lg` —
  soft, neutral; use sparingly to lift popovers/cards. `--shadow-glow`
  is the coral ring for active canvas/focus states. Site currently uses
  **no shadows** — adds must be subtle.

### Motion

`--transition-fast` 120ms · `--transition-base` 200ms ·
`--transition-slow` 320ms. `--ease-out` `cubic-bezier(0, 0, 0.2, 1)` ·
`--ease-in-out` `cubic-bezier(0.4, 0, 0.2, 1)`. Site currently uses
`.15s` ease for color transitions and `.2s` ease for borders — close
enough but not tokenized.

### Backgrounds

Mostly flat paper. **Signature decorative motif is a faint blueprint
grid** (48px, hairline) on hero/diagram surfaces — never gradients. No
photographic hero imagery in chrome; imagery appears as embedded note
media (diagrams, canvas maps).
## Iconography

The product is **deliberately light on iconography** — its "icons" are
mostly **typographic**:

- **Callout glyphs** — see the 12-entry set above.
- **Structural Unicode** — diagrams use →, ☁, ◐, │, ┌┴┐-style rules
  drawn as 1–2px divs.
- **Line SVG** — UI affordances (theme sun/moon, copy, search, chevron,
  calendar, hash) are tiny inline **stroke SVGs at 1.4–1.5 weight**,
  `currentColor`. There is no packaged icon font; if you need more,
  match that stroke weight.
- **Brand mark** — `assets/brand/icon.svg` / `logo.svg` — a plum
  (`#8B0A5F`) rounded square with white circle/quarter-disc "node"
  motifs (a syncopated-rhythm graph). Favicon & touch-icon in
  `assets/brand/`. The mark's plum is **never** used outside the mark.
- **Emoji** are not used as UI icons.

The Jekyll site has zero inline SVG icons today — only the `↩`, `↗`, `→`
Unicode arrows and `← back to notes` text. New icon affordances should
match the line-SVG register.

## Component vocabulary

DS components that map onto patterns already in the Jekyll site. Names
are the agent vocabulary; actual markup stays plain HTML + CSS classes.

| DS component | What it is | Jekyll-site analog |
|---|---|---|
| `Badge` | small colored pill label | `.badge` + `.badge-blue / .badge-red / .badge-green / .badge-neutral` in `_includes/theme-tokens.html` |
| `Card` | surface container | `.card` / `.field-note` |
| `Button` / `IconButton` | coral primary, IDE styling | `.btn-primary`, `.btn-ghost`, `.btn-abstract`, `.btn-secondary` (per-page inline) |
| `Tag` | kebab-case keyword chip | `.badge badge-neutral` row |
| `Callout` | admonition block | not yet implemented — would slot into `.post-content` |
| `CodePanel` | command + output panel | `.code-panel` / `.code-cmd` / `.code-output` |
| `Input` / `Select` / `Switch` / `Checkbox` | form primitives | none — site has no forms |
| `NavItem` / `Tabs` | nav rail + tabs | `.filter-btn` on `/projects/` |
| `IconButton` | square icon action | not yet implemented |

Namespace in the DS bundle: `window.SyncopatedNotesDesignSystem_f2adea_*`
(see `_ds_manifest.json`). Don't import these into the Jekyll site —
they're React/JSX and the site is plain HTML. Use them as a vocabulary
reference for naming CSS classes / files instead.

## Adding a new component to the Jekyll site (procedure)

1. Pick the matching class name from the table above (kebab-case).
2. Add the styles to `_includes/theme-tokens.html` so every layout that
   chains to `default` inherits them.
3. If it's a feedback/typography component (callout, code panel), prefer
   extending `.post-content` selectors — that's where the prose styles
   live today.
4. If it needs interaction, keep the JS inline `<script>` per the
   project's no-framework convention. See the `skiing-smokers-game.html`
   and `projects.html` filter bar for the style.
5. Re-build with `bundle exec jekyll build` and preview at
   `http://localhost:4000`.