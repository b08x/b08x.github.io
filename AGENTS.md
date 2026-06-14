# AGENTS.md — b08x.github.io

## Overview

This is a **Jekyll** site for **Syncopated Notes** (the landing page) and **HindsightAI** — a satirical/fictional AI startup whose research is hosted under `/hindsightai/`. It is built with Jekyll and deployed via GitHub Pages.

## Project Structure

```
_config.yml                             # Site config (title, url, collections, pagination, defaults, exclude list, plugins)
Gemfile / Gemfile.lock                  # Ruby dependencies (Jekyll + plugins)
_layouts/
  notes.html                            # Light-theme base layout (head/CSS) for the root landing page and anything that chains to it
  home.html                             # Landing page body (layout: notes) — header, rhythm mark, paginated _notes list, footer
  post.html                             # Blog post body (layout: notes) — back link, post header (title/date/tags), post content
  hindsight.html                        # Dark-theme base layout for all HindsightAI pages
_includes/
  theme-tokens.html                     # Shared "Field Note" CSS tokens/components (palette, badges, cards, post/code/blockquote/mermaid typography)
  hindsight-nav.html                    # Shared nav bar (Platform/Research/Enterprise/Blog)
  hindsight-breadcrumb.html             # Shared breadcrumb trail (driven by front matter)
  hindsight-footer.html                 # Shared footer (driven by front matter)
_notes/                                  # Collection (output: false) — entries shown in the paginated home page list
  *.md                                   # Front matter: order, title, link, badge, badge_class, description, year, arxiv, offset, stub, links[]
_posts/                                  # Standard Jekyll posts collection — layout: post via _config.yml defaults
  YYYY-MM-DD-*.md                        # Front matter: title, tags[] (date comes from filename)
index.md                                # Landing page (layout: home)
hindsightai/
  index.html                            # HindsightAI platform page (layout: hindsight)
  research/
    index.html                          # Research listing page (layout: hindsight)
    scraps/
      scraps-acronym.html               # SCRAPS acronym explainer (layout: hindsight)
      whitepaper-abstract.html          # Paper abstract (layout: hindsight)
      latent-manifold.html              # Interactive canvas visualization (layout: hindsight)
pages/
  skiing-smokers-game.html               # Self-contained canvas game (layout: null), themed; permalink pinned to /skiing-smokers-game.html via _config.yml defaults
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

The root landing page (`index.md`) uses `layout: home`, which itself declares `layout: notes` — `notes.html` provides the shared `<head>`/CSS/`.container` shell (it does not share anything with the `hindsight` layout), and `home.html` renders into `{{ content }}` with the header, rhythm mark, paginated `_notes` list, and footer.

### Home page and the `_notes` collection

- `_notes/*.md` are entries in the `notes` collection (`output: false` in `_config.yml`, so no standalone `/notes/*.html` pages are generated — they only feed the home page list).
- Front matter fields: `order` (sort key), `title`, `link` (the entry's target URL — **must** be named `link`, not `url`, because `url` is a reserved/computed attribute on Jekyll `Document` objects and would silently override it), `badge` / `badge_class` (`badge-blue|green|red|neutral`), `description`, `year`, `arxiv` (optional), `offset` (optional indent), `stub` (renders an italic non-link title with no description/meta), and `links` (array of `{label, url}` shown in the meta row).
- `_config.yml` configures `jekyll-paginate-v2` for this collection: `collection: notes`, `per_page: 3`, `permalink: '/page/:num/'`, sorted by `order` ascending.
- `_layouts/home.html` iterates `paginator.posts` (the `jekyll-paginate-v2` Liquid accessor — **not** `paginator.documents`) and renders the pagination nav (`.pagination`, styles in `_layouts/notes.html`) when `paginator.total_pages > 1`.
- `index.md` must carry `pagination:\n  enabled: true` in its front matter — `jekyll-paginate-v2` only paginates pages that opt in.

### Blog posts (`_posts/`)

- Standard Jekyll posts collection, filenames `YYYY-MM-DD-title.md`. A `defaults` scope in `_config.yml` for `path: "_posts"` sets `layout: post`, so post front matter only needs `title` and optionally `tags: [...]`.
- `_layouts/post.html` (chains to `layout: notes`) renders a "← back to notes" link, a `.post-header` (title + date + `tags` as `.badge-neutral` pills), and wraps `{{ content }}` in `.post-content`.
- `.post-content` typography (headings, lists, links, tables, blockquotes, inline `code`, Rouge `.highlight` code blocks, and `.mermaid` images) is defined in `_includes/theme-tokens.html` so it's themed consistently with the rest of the "Field Note" palette — see Design System below.
- Mermaid diagrams use plain ```` ```mermaid ```` fenced code blocks. `jekyll-spaceship`'s `mermaid-processor` (configured in `_config.yml`) renders them via `mermaid.ink` as `<img class="mermaid">` tags, with `themeVariables` set to match the site's cream/terracotta palette — requires network access at build/view time to load the diagram image.

`pages/skiing-smokers-game.html` uses `layout: null` — front matter is parsed (so Liquid still runs) but no layout wraps the content, keeping the page fully self-contained. It still applies the shared "Field Note" palette/typography via `{% include theme-tokens.html %}`. A `defaults` entry in `_config.yml` scoped to `path: "pages"` sets `permalink: "/:basename:output_ext"`, so this page (and any future ones added under `pages/`) builds to the site root (e.g. `/skiing-smokers-game.html`) rather than `/pages/skiing-smokers-game.html`.

### Adding a new HindsightAI page

1. Add front matter: `layout: hindsight`, `title`, `description`, `nav_active` (`"platform"` or `"research"`), and optionally `breadcrumbs` / `breadcrumb_current` / `footer_left` / `footer_right`.
2. Write page-specific CSS in a `<style>` block and markup in the page body — both go into `{{ content }}`.
3. To change the nav, breadcrumb, or footer across **all** HindsightAI pages, edit the relevant file in `_includes/` once.

## Design System

The site uses a shared "Field Note" theme — a cream/parchment palette with dark ink text and Space Mono typography everywhere. Tokens live in `_includes/theme-tokens.html`, a raw-CSS partial included inside the `<style>` block of every layout (`_layouts/notes.html` and `_layouts/hindsight.html`):

```
--bg:        #EDE6D6   (cream paper background)
--bg2:       #E3DBC8   (panel / code surface)
--surface:   #E3DBC8   (card surface)
--border:    #D2C7B4   (standard border)
--border2:   #C9B8A0   (stronger/hover border)
--amber:     #B5654A   (primary accent — terracotta)
--amber-hi:  #C97A5E   (hover accent)
--text:      #2A2420   (primary ink)
--text2:     #5C5248   (secondary text)
--muted:     #8A7F72   (muted text)
--dim:       #B0A492   (very dim)
--red:       #A8453A   (arXiv badge)

--badge-blue:    #5C7C99
--badge-green:   #6B7F52
--badge-red:     #A8453A
--badge-neutral: #8A7F72
--badge-text:    #F4EFE3
```

`theme-tokens.html` also defines the reusable components:

- `.badge-row` / `.badge` + `.badge-blue` / `.badge-red` / `.badge-green` / `.badge-neutral` — small colored pill labels (used for the landing page's note tags and post tags)
- `.field-note`, `.field-note-meta`, `.field-note-title`, `.field-note-body` — bordered "index card" component
- `.code-panel`, `.code-cmd`, `.code-output` — muted inset panel for command/output snippets
- `.back-link`, `.post-header`, `.post-title`, `.post-meta` — blog post header (used by `_layouts/post.html`)
- `.post-content` — typography for rendered Markdown: headings, lists, tables, `blockquote` (terracotta left border, `--bg2` background), inline `code`, Rouge `.highlight` code blocks (syntax token colors mapped onto the palette — keywords in `--amber`, strings in `--badge-green` (#6B7F52), comments muted/italic, numbers in `--badge-blue`), and `.mermaid img` (framed in a `--bg2` panel to match code blocks)

The `research/scraps/*.html` pages alias `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`, `--color-border-tertiary`, and `--border-radius-lg` in their own `:root` blocks directly onto `var(--text)`, `var(--text2)`, `var(--dim)`, `var(--border)` — changing the shared tokens re-skins these pages automatically. `latent-manifold.html`'s canvas/dark-panel widget intentionally keeps its own hardcoded dark colors as a contrasting "viewport" inset.

### Typography

- **Everything:** `Space Mono` (400/700, regular + italic) — monospace, loaded from Google Fonts in each layout's `<head>`.

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

Push to `main`. `.github/workflows/jekyll.yml` builds the site with `bundle exec jekyll build` (full build, not GitHub Pages' restricted "safe mode") and deploys via GitHub Pages — so plugins outside the GH Pages whitelist (`jekyll-paginate-v2`, `jekyll-spaceship`, etc.) work fine.

## Gotchas

- **`AGENTS.md` and other root dotfiles/configs are excluded** in `_config.yml`'s `exclude` list — `jekyll-optional-front-matter` would otherwise render `AGENTS.md` as a page.
- **No 404 page:** GitHub Pages will use its default 404 if a linked resource is missing.
- **jekyll-spaceship** is enabled and may lightly reformat inline HTML/whitespace during build (harmless, but check rendered output after big content edits).
- **Mermaid diagrams render as remote images:** `jekyll-spaceship`'s mermaid-processor builds a `mermaid.ink` URL at build time and emits `<img class="mermaid" src="https://mermaid.ink/svg/...">` — the diagram itself isn't rendered locally, so it won't display in offline/sandboxed previews, but works once the page is served with network access.

<trackboi>
## trackboi Skill

When trackboi MCP tools are available, agents can load `.agents/skills/trackboi/SKILL.md` for details, then call `orient_agent` to catch up before updating cards, tracks, boards, or handoff notes. If `.trackboi`, `.etc/.trackboi`, or `.etc/trackboi` files are present but MCP tools are not available, agents may read those files to catch up on local context. Do not manually create, update, or delete trackboi records in the filesystem; use MCP tools for mutations.
</trackboi>
