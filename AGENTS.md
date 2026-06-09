# AGENTS.md — b08x.github.io

## Overview

This is a **GitHub Pages** site for **HindsightAI** — a satirical/fictional AI startup. It is a pure static HTML site with no build system, no package manager, no test framework, and no CI pipeline. Files are served directly by GitHub Pages (Jekyll backend, but no Jekyll source files are present — only flat HTML).

## Project Structure

```
index.html                              # Landing page
research/
  index.html                            # Research listing page
  scraps/
    hindsightai_scraps_acronym.html     # SCRAPS acronym explainer (standalone fragment)
    hindsightai_whitepaper_abstract.html # Paper abstract (standalone fragment)
    hindsightai_latent_manifold.html    # Interactive canvas visualization (standalone fragment)
```

- `index.html` — Full landing page with nav, hero, stats, feature cards, testimonial, footer.
- `research/index.html` — Research hub with paper cards, expandable abstract panel (vanilla JS `toggleAbstract()`).
- `research/scraps/` — Self-contained HTML fragments (no `<html>`/`<body>` wrappers) for individual paper components. These are linked from the research page but are not embedded via any include mechanism.

## How to Edit

- **No build step.** Edit HTML files directly and push. GitHub Pages serves them.
- **No local dev server required.** Open files in a browser or use any static file server.
- **No tests, linting, or formatting tools** are configured.

## Design System

Both pages share a dark theme defined via CSS custom properties. The landing page uses these variables:

```
--bg:       #0D0B09    (near-black background)
--bg2:      #111009    (slightly lighter surface)
--surface:  #141210    (card surface)
--border:   #2A2520    (standard border)
--border2:  #3A2F1A    (amber-tinted border, used on hover)
--amber:    #C8962E    (primary accent)
--amber-hi: #D4A843    (hover accent)
--text:     #EDE8DF    (primary text)
--text2:    #A09890    (secondary text)
--muted:    #6B6460    (muted text)
--dim:      #3A3530    (very dim)
--red:      #B31B1B    (arXiv badge)
```

The scraps pages use CSS variables with different names (e.g. `--color-text-primary`, `--color-border-tertiary`) — these are **not defined** in those files and will fall back to browser defaults. This appears intentional for fragment files meant to be viewed in a context where those variables are inherited, or simply an inconsistency.

### Typography

- **Headings:** `Cormorant Garamond` (landing) / `Crimson Pro` (research) — serif, loaded from Google Fonts
- **Body:** `Outfit` — sans-serif, loaded from Google Fonts
- **Code/labels:** `IBM Plex Mono` — monospace, loaded from Google Fonts

Each page loads its own Google Fonts `<link>` — there is no shared stylesheet.

### Layout Patterns

- Max content width: `1100px` (landing) / `860px` (research)
- Sticky nav with `backdrop-filter: blur(8px)`
- CSS grid for stats (4-col) and feature cards (3-col), collapsing to fewer columns at `768px` breakpoint
- Decorative grid background via `body::before` pseudo-element
- Glow effect via `body::after` pseudo-element (landing page only)

## Conventions

- All CSS is inline in `<style>` blocks — no external stylesheets.
- All JS is inline in `<script>` blocks — no external scripts.
- No CSS framework, no JS framework, no dependencies.
- Class names are semantic/kebab-case (e.g., `.feature-card`, `.paper-card`, `.btn-primary`).
- Responsive breakpoint: `768px`.
- Nav links to `#` are placeholders (Platform, Enterprise, Blog, Get Access).
- The research page links to `/research/scraps/paper.html` which does **not exist** yet — it's a planned page.

## Deployment

Push to `main`. GitHub Pages serves from the root of the repository. No branch configuration files (e.g., `gh-pages`) or GitHub Actions workflows are present.

## Gotchas

- **No shared CSS/JS:** Each HTML file is self-contained. Changing the nav or footer requires editing every file.
- **Scraps use undefined CSS variables:** The scraps pages reference `--color-text-primary`, `--color-border-tertiary`, etc., which are only defined in their local `<style>` blocks with different naming conventions from the main pages. Verify rendering after changes.
- **No 404 page:** GitHub Pages will use its default 404 if a linked resource is missing.
- **Jekyll `.gitignore`:** The `.gitignore` is a Ruby/Jekyll template but no Jekyll source files (`_config.yml`, `_layouts/`, etc.) exist. The site is flat HTML.
