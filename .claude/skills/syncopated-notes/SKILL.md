---
name: syncopated-notes
description: Edit and design the b08x.github.io Jekyll site — adding posts, notes, projects, or self-contained pages; running/building the site locally; and generating well-branded interfaces, mocks, decks, or components in the "Field Note" design system (cream parchment + dark ink, terracotta accent, Space Mono, light & dark). Use whenever working in this repo on _posts/, _notes/, _projects/, _data/projects.yml, _layouts/, _includes/, _config.yml, or theme-tokens.html, or when asked to add content, add a project, update the Field Note theme, build a mock/deck/prototype in this brand, or diagnose a Jekyll build/Mermaid-rendering issue on this site.
---

# Syncopated Notes — Jekyll Site + Design System

This skill covers **both halves** of working on `b08x.github.io`: the Jekyll site itself (a personal landing + blog at `/`) and the **Field Note** design system that skins it (cream parchment, dark ink, terracotta accent, Space Mono everywhere, light & dark faces). They're combined here because they're one brand, edited by one person, in one repo — keeping them split just meant cross-referencing two skills for what's usually a single task.

The canonical *technical* reference for the site is the project's own `AGENTS.md` — read it for full detail on the Jekyll setup. The canonical *design* reference is `readme.md` in this skill's own root — read it for the full brand guide (voice, visual foundations, iconography). `references/design-system.md` is a condensed cheat sheet that also maps each design-system token to its equivalent CSS variable name in the site's own `_includes/theme-tokens.html` (the site's tokens are a **subset** of the full system, under different names — that mapping isn't in `readme.md` itself, which is why it's worth keeping as a separate quick-lookup file).

## When to Use

**Site editing:**
- "Add a new note to my website" / "Create a blog post" / "Add a new project to /projects/"

- "Run the Jekyll site locally" / "Why isn't my Mermaid diagram showing?"
- "How do I add a card to the home page?" / "Update the Field Note theme tokens"

**Design work:**
- "Mock up a new page in the Syncopated Notes style"
- "Build a slide deck / prototype in this brand"
- "I need a new component (button, badge, callout) that matches the site"

## Prerequisites

- **Ruby 3.4.4** (pinned in `.tool-versions` — bundle install against another Ruby produces native-extension mismatches for `nokogiri`, `ffi`, `sass-embedded`)
- **Bundler**
- Network access at build/view time (Mermaid diagrams are fetched from `mermaid.ink`)
- CI deps installed automatically by `.github/workflows/jekyll.yml`: `imagemagick`, `libvips-dev`, `libopenslide-dev`, `jupyter-core` (apt) + `nbconvert` (pip)
- Optional: Trackboi MCP for task/track management (the project uses it; see `.trackboi/`)

## How to Run

Work in place at the repo root:

- `Read` and `Grep`/`Glob` to inspect layouts/includes/content
- `Edit` and `Write` to make changes
- `Bash` (cwd = repo root) to invoke `bundle exec jekyll serve` / `bundle exec jekyll build`
- Chrome MCP tools (`mcp__claude-in-chrome__navigate`, etc. — load via ToolSearch if deferred) to preview `http://localhost:4000`

## Design system — what's here

- `readme.md` — full brand guide: CONTENT FUNDAMENTALS (voice, casing, tone), VISUAL FOUNDATIONS (color, type, spacing, motion, borders), ICONOGRAPHY. Read this first for any design task.
- `styles.css` — the single CSS entry point (link this; it `@import`s everything).
- `tokens/` — colors, typography, spacing, elevation, fonts (CSS custom properties + `@font-face`). Light is default; `.dark` on `<html>` flips to the night theme.
- `fonts/` — Space Mono (primary, via Google Fonts) + JetBrains Mono, Inter, Hack, Mononoki (shipped alternates).
- `assets/` — logo, icon, favicon, and other brand imagery.
- `guidelines/` — foundation specimen cards (colors, type, spacing, brand).
- `components/` — reusable React primitives (Button, IconButton, Badge, Tag, Card, Input, Select, Switch, Checkbox, Callout, CodePanel, Tabs, NavItem). Each has a `.prompt.md` with a usage snippet.
- `ui_kits/knowledgebase/` — the live note-reader screen, composing the primitives.
- `templates/` — `agentic-infrastructure-deck/` (a 6-slide Cisco-Visio-grammar deck), plus `note/`, `project/`, and `prompts-landing/` templates that map onto this site's own `_notes/` and `_projects/` layouts if you ever want to bring the rendered HTML closer to the design system's own markup.
- `references/design-system.md` — condensed cheat sheet + token-name mapping to the live site's `_includes/theme-tokens.html`.
- `references/jekyll-plugins.md` — what each Gemfile plugin does, its Liquid tags/config keys, and what's actually wired vs. dormant.

**How to work on design tasks:**
- **Visual artifacts** (slides, mocks, throwaway prototypes): copy the assets and fonts you need into your output folder and emit **static HTML** using the tokens and patterns documented in `readme.md`. For decks, start from the `templates/` deck.
- **Production code on the live site**: edit `_includes/theme-tokens.html` directly (see Procedure §6) — the site is plain HTML/CSS, not React, so don't import the `components/` JSX into it; use the components as a naming/behavior reference instead.
- **Standalone React/production tooling elsewhere**: link `styles.css`, import the components from `components/`, and follow the rules in `readme.md` to design natively in the brand.

**Non-negotiables:**
- Space Mono (loaded from Google Fonts) for everything — headings, UI, code, body; the whole brand speaks in one monospace voice. JetBrains Mono / Hack / Mononoki / Inter ship as documented alternates.
- Structure with 1px hairline borders, not shadow. Minimal corners. Soft, rare shadows.
- One warm accent: terracotta (`--accent`) for headings/primary actions; a dusty slate-blue (`--cyan`) for the wordmark/links. Use the earthy `--chart-1…5` palette (blue/ochre/olive/plum/red) for syntax and diagrams, the `--status-*` set for callouts/badges.
- No emoji in prose or chrome (callout glyphs are the only exception). No gradients.
- Voice = engineer's field notebook: precise, dry, structural; lowercase wordmark, kebab-case tags, Claim→Leak rhetorical moves.
- Plum `#8B0A5F` is logo-only — never use it in chrome, badges, or accents.

If invoked for a design task with no other guidance, ask what the user wants to build, ask a few focused questions, then act as an expert Syncopated Notes designer — outputting HTML artifacts or production code as the need dictates.

## Site structure — Quick Reference

**Collections & permalinks** (`_config.yml`):
- `_posts/` → `/YYYY/MM/DD/title/` (standard; **paginated** by `jekyll-paginate-v2`, 5 per page)
- `_notes/` → `/notes/:path/` (`output: true`, sorted by title, NOT paginated)
- `_projects/` → `/:path/` (`output: true`)
- `_data/projects.yml` → canonical project registry

**Layouts** (`_layouts/`, chain root = `default`):
- `default.html` → loads head/header/nav/footer includes
- `notes.html` → `default` + container/grid/pager CSS
- `home.html` → `notes` + paginated posts + filtered notes + projects grid
- `post.html` → `notes` + post header & content
- `project.html` → `notes` (default wrapper for `_projects/`)

- `none.html` → bare `{{ content }}` (self-contained pages; **never use `layout: null`**)

**Design tokens** (`_includes/theme-tokens.html`):
- Palette: `--bg #EDE6D6`, `--bg2 #E3DBC8`, `--amber #B5654A`, `--amber-hi #C97A5E`, `--text #2A2420`, `--text2 #5C5248`, `--muted #8A7F72`, `--dim #B0A492`, `--red #A8453A`
- Components: `.badge` + `.badge-blue / .badge-green / .badge-red / .badge-neutral`, `.field-note`, `.code-panel`, `.post-content`, `.back-link`
- Typography: **Space Mono** (400/700 + italic), loaded from Google Fonts in `_includes/head.html`

**Build / serve / deploy**:
- Local: `bundle exec jekyll serve` → `http://localhost:4000`
- Build only: `bundle exec jekyll build` → `_site/` (gitignored)
- Deploy: `git push origin main` → `.github/workflows/jekyll.yml` builds + uploads Pages artifact (full build, not GH Pages' restricted "safe mode")

## Procedure

### 1. Add a blog post

```yaml
# _posts/YYYY-MM-DD-my-title.md
---
title: "My Title"
tags: [tag1, tag2]
---
```
- Filename date = post date; only `title` / `tags` in front matter (layout is auto-set to `post` by `_config.yml` defaults)
- Renders at `/YYYY/MM/DD/my-title/`
- Auto-included on `/page/:num/` pagination

### 2. Add a note

```yaml
# _notes/my-topic.md
---
layout: post
title: "My Note"
description: "One-line summary shown on the home grid"
tags: [essay, llm]
---
```
- Permalinks to `/notes/my-topic/`
- Sorts by title; **not** paginated
- Home-page card reads `title` + `description` (falls back to `excerpt`) + `tags[]`

### 3. Add a project

1. Edit `_data/projects.yml` — append a YAML entry: `title`, `description`, `url`, `external: true|false`, `badge`, `badge_class`, `year`, `tags[]`, and `card: true` if it should appear on the landing grid.
2. For internal project pages, add a file under `_projects/<subtree>/index.html` (or `.md`) with front matter; set `permalink` to keep URLs stable.
3. **`card: true` lives only in `_data/projects.yml`** — never in `_projects/.../index.html` front matter (that flag is for the landing-page grid only).


### 5. Add a self-contained page (e.g. game)

- Use `layout: none` — **never `layout: null`** (YAML `null` → Ruby `nil` → falls back to the collection default layout)
- Declare an explicit `permalink:` in front matter
- Include `<head>`, inline `<style>`, and `<script>` blocks in the body — no shared wrappers apply
- See `_projects/fun/skiing-smokers-game.html` for the canonical example

### 6. Update the design system on the live site

- Edit `_includes/theme-tokens.html` once — all layouts that chain to `default` inherit via `_includes/head.html`
- For the **canonical** (expanded) token set — chart/status palettes, layout widths, type scale, spacing, radius, elevation, motion, iconography, voice rules, component vocabulary — see `readme.md` and `references/design-system.md`

### 7. Run locally

```bash
bundle install                       # one-time / when Gemfile changes
bundle exec jekyll serve             # serves at http://localhost:4000
```

Then preview at `http://localhost:4000` (Chrome MCP `navigate`, or just open it in a regular browser).

## Pitfalls

- **Pagination only on `_posts`** — `_config.yml`'s pagination block has no `collection:` key, so `jekyll-paginate-v2` paginates `_posts` only. Notes/projects lists grow unbounded on the home page.
- **Mermaid = remote images** — `jekyll-spaceship`'s `mermaid-processor` builds a `mermaid.ink/svg/...` URL at build time and emits `<img class="mermaid">`. Diagrams will NOT render offline; network access is required at build/view.
- **`layout: null` ≠ `layout: none`** — YAML `null` becomes Ruby `nil` and falls back to the collection default layout (e.g. `_config.yml`'s `path: _projects` defaults to `layout: project`). Use `layout: none` + `_layouts/none.html` for self-contained pages.
- **`card: true` is opt-in** — projects without it still build a standalone page but don't appear on the home grid. Set it only in `_data/projects.yml`.
- **`permalink: /:path/` preserves URLs** — renaming files changes URLs because the path comes from the file path; declare explicit `permalink:` if you need a stable URL.
- **Ruby 3.4.4 is pinned** in `.tool-versions` — bundle install against another Ruby produces native-extension mismatches.
- **Excluded files** — `AGENTS.md`, `GEMINI.md`, `README.md`, `LICENSE`, `.trackboi`, `.agents`, `.codemap`, `.tool-versions`, `.mcp.json`, `Gemfile`, `Gemfile.lock` are listed in `_config.yml` `exclude`. Don't expect them in `_site/`.
- **jekyll-spaceship may reformat inline HTML/whitespace** during build — re-check rendered output after big content edits.
- **No 404 page** — GitHub Pages serves its default 404 for missing links.

- **Internal links are root-relative** — `baseurl` is empty in `_config.yml`; never prepend a base path.
- **No CSS/JS frameworks on the live site** — every page embeds its own `<style>` / `<script>`; only shared tokens live in `_includes/theme-tokens.html`. The `components/` React primitives in this skill are for mocks/prototypes/decks, not for importing into the Jekyll build.
- **Plum `#8B0A5F` is logo-only** — never use it in chrome, badges, or accents.

## Verification

After any site edit, run from the repo root:

```bash
bundle exec jekyll build
```

A clean exit with no warnings (beyond `jekyll-spaceship` reformatting) and a populated `_site/` directory proves the change built. Then `bundle exec jekyll serve` and check `http://localhost:4000` to spot-check rendering. For content-only changes, also visually verify the relevant page(s) — especially Mermaid diagrams, which silently fall back to a broken-image icon if `mermaid.ink` is unreachable.
