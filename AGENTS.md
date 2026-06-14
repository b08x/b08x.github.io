# AGENTS.md — b08x.github.io

## Overview

This is a **Jekyll** site for **Syncopated Notes** (the landing page) and **HindsightAI** — a satirical/fictional AI startup whose research is hosted under `/hindsightai/`. It is built with Jekyll and deployed via GitHub Pages.

## Project Structure

```
_config.yml                             # Site config (title, url, exclude list, plugins)
Gemfile / Gemfile.lock                  # Ruby dependencies (Jekyll + plugins)
_layouts/
  notes.html                            # Light-theme layout for the root landing page
  hindsight.html                        # Dark-theme base layout for all HindsightAI pages
_includes/
  hindsight-nav.html                    # Shared nav bar (Platform/Research/Enterprise/Blog)
  hindsight-breadcrumb.html             # Shared breadcrumb trail (driven by front matter)
  hindsight-footer.html                 # Shared footer (driven by front matter)
index.html                              # Landing page (layout: notes)
hindsightai/
  index.html                            # HindsightAI platform page (layout: hindsight)
  research/
    index.html                          # Research listing page (layout: hindsight)
    scraps/
      scraps-acronym.html               # SCRAPS acronym explainer (layout: hindsight)
      whitepaper-abstract.html          # Paper abstract (layout: hindsight)
      latent-manifold.html              # Interactive canvas visualization (layout: hindsight)
skiing-smokers-game.html                # Self-contained canvas game (layout: null, passed through as-is)
```

## How to Edit

- **Local dev server:** `bundle exec jekyll serve` — rebuilds on change and serves at `http://localhost:4000`.
- **Build only:** `bundle exec jekyll build` — outputs to `_site/` (gitignored).
- **Install/update deps:** `bundle install`.
- **No tests, linting (beyond rubocop in the `:development` group), or CI pipeline** are configured.

## Shared Layout / Include Pattern

All HindsightAI-family pages (`hindsightai/index.html`, `hindsightai/research/index.html`, and the three `research/scraps/*.html` pages) use `layout: hindsight`, which provides:

- The shared `<head>` (fonts, reset, `:root` CSS variables, nav/breadcrumb/footer/grid-background CSS).
- `{% include hindsight-nav.html %}` — the nav bar. Highlights "Research" when `page.nav_active == "research"`.
- `{% include hindsight-breadcrumb.html %}` — rendered only if `page.breadcrumbs` is set in front matter; iterates `page.breadcrumbs` (each with `label`/`url`) and ends with `page.breadcrumb_current`.
- `{{ content }}` — the page's own markup and page-specific `<style>`/`<script>` blocks.
- `{% include hindsight-footer.html %}` — text falls back to defaults via `page.footer_left` / `page.footer_right` (`| default: ...`), overridable per page.

The root landing page (`index.html`) uses `layout: notes`, a separate light-theme layout with its own `<head>`/CSS — it does not share anything with the `hindsight` layout.

`skiing-smokers-game.html` uses `layout: null` — front matter is parsed (so Liquid still runs) but no layout wraps the content, keeping the page fully self-contained.

### Adding a new HindsightAI page

1. Add front matter: `layout: hindsight`, `title`, `description`, `nav_active` (`"platform"` or `"research"`), and optionally `breadcrumbs` / `breadcrumb_current` / `footer_left` / `footer_right`.
2. Write page-specific CSS in a `<style>` block and markup in the page body — both go into `{{ content }}`.
3. To change the nav, breadcrumb, or footer across **all** HindsightAI pages, edit the relevant file in `_includes/` once.

## Design System

The HindsightAI dark theme is defined via CSS custom properties in `_layouts/hindsight.html`:

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

The `research/scraps/*.html` pages additionally alias `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`, `--color-border-tertiary`, and `--border-radius-lg` in their own `:root` blocks (mapping onto the variables above) for fragments originally authored with different naming conventions.

### Typography

- **Headings:** `Cormorant Garamond` (landing/platform) / `Crimson Pro` (research) — serif, loaded from Google Fonts
- **Body:** `Outfit` — sans-serif, loaded from Google Fonts
- **Code/labels:** `IBM Plex Mono` — monospace, loaded from Google Fonts

The combined Google Fonts `<link>` covering all of these families lives once in `_layouts/hindsight.html`.

### Layout Patterns

- Max content width: `1100px` (platform) / `860px` (research) / `740px` (scraps)
- Sticky nav with `backdrop-filter: blur(8px)`
- CSS grid for stats (4-col) and feature cards (3-col), collapsing to fewer columns at `768px` breakpoint
- Decorative grid background via `body::before` pseudo-element
- Glow effect via `body::after` pseudo-element (platform page only)

## Conventions

- Page-specific CSS stays inline in `<style>` blocks within each page; shared CSS lives in `_layouts/hindsight.html`.
- All JS is inline in `<script>` blocks — no external scripts.
- No CSS framework, no JS framework.
- Class names are semantic/kebab-case (e.g., `.feature-card`, `.paper-card`, `.btn-primary`).
- Responsive breakpoint: `768px`.
- Nav links to `#` are placeholders (Enterprise, Blog, Get Access).
- All internal links are root-relative (`baseurl` is empty).

## Deployment

Push to `main`. GitHub Pages builds the Jekyll site from the root of the repository. No GitHub Actions workflows are present.

## Gotchas

- **`AGENTS.md` and other root dotfiles/configs are excluded** in `_config.yml`'s `exclude` list — `jekyll-optional-front-matter` would otherwise render `AGENTS.md` as a page.
- **No 404 page:** GitHub Pages will use its default 404 if a linked resource is missing.
- **jekyll-spaceship** is enabled and may lightly reformat inline HTML/whitespace during build (harmless, but check rendered output after big content edits).

<trackboi>
## trackboi Skill

When trackboi MCP tools are available, agents can load `.agents/skills/trackboi/SKILL.md` for details, then call `orient_agent` to catch up before updating cards, tracks, boards, or handoff notes. If `.trackboi`, `.etc/.trackboi`, or `.etc/trackboi` files are present but MCP tools are not available, agents may read those files to catch up on local context. Do not manually create, update, or delete trackboi records in the filesystem; use MCP tools for mutations.
</trackboi>
