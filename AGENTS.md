# AGENTS.md — b08x.github.io

## Overview

This is a **Jekyll** site for **Syncopated Notes** (the landing page) and **HindsightAI** — a satirical/fictional AI startup whose research is hosted under `/hindsightai/`. It is built with Jekyll and deployed via GitHub Pages.

## Project Structure

```
_config.yml                             # Site config (title, url, pagination, defaults, exclude list, plugins)
Gemfile / Gemfile.lock                  # Ruby dependencies (Jekyll + plugins)
_layouts/
  default.html                          # Base HTML shell — loads head.html, header.html, nav.html, footer.html
  notes.html                            # Light-theme base (chains to default) — container grid + card / pager styles
  home.html                             # Landing page body (layout: notes) — rhythm mark, posts+notes grid, projects grid, footer
  post.html                             # Blog post body (layout: notes) — back link, post header (title/date/tags), post content
  hindsight.html                        # Dark-theme base (chains to default) — nav, breadcrumb slot, footer slot, grid bg
  project.html                          # Default for _projects/ entries (chains to layout: notes) — applies when a project file doesn't override
_includes/
  head.html / header.html / nav.html / footer.html   # Default layout's shell includes (most files are layout-conditional)
  theme-tokens.html                     # Shared "Field Note" CSS tokens/components (palette, badges, cards, post/code/blockquote/mermaid typography)
  hindsight-nav.html                    # Shared HindsightAI nav bar (Platform / Research / "Request Access")
  hindsight-breadcrumb.html             # Shared breadcrumb trail (driven by front matter)
  hindsight-footer.html                 # Shared footer (driven by front matter)
_posts/                                  # Standard Jekyll posts collection — layout: post via _config.yml defaults
  YYYY-MM-DD-*.md                        # Front matter: title, tags[] (date comes from filename)
_notes/                                  # Custom `notes` collection — output: true, permalink: /notes/:path/
  *.md / *.html                          # Front matter: layout, title, description, tags[]; rendered at /notes/<filename-stem>/
_projects/                               # Custom `projects` collection — output: true, permalink: /:path/ (so the HindsightAI subtree keeps /hindsightai/...)
  hindsightai/                           # HindsightAI platform subtree (satirical/humor project)
    index.html                           #   Platform landing (layout: hindsight, card: true → home-page card, tag: humor)
    research/                            #   Research subtree — internal pages, no `card:` → not on home page
      index.html                         #     Research listing (layout: hindsight, permalink: /hindsightai/research/)
      scraps-acronym.html                #     SCRAPS acronym explainer (layout: hindsight)
      whitepaper-abstract.html           #     Paper abstract (layout: hindsight)
      latent-manifold.html               #     Interactive canvas visualization (layout: hindsight)
  skiing-smokers-game.html               # Self-contained canvas game (layout: null), card: true → home-page card, tag: humor
index.md                                # Landing page (layout: home)
```

## How to Edit

- **Local dev server:** `bundle exec jekyll serve` — rebuilds on change and serves at `http://localhost:4000`.
- **Build only:** `bundle exec jekyll build` — outputs to `_site/` (gitignored).
- **Install/update deps:** `bundle install` (Ruby version pinned to `3.4.4` in `.tool-versions`).
- **No tests, linting (beyond `rubocop`/`rubocop-jekyll`/`solargraph` in the `:development` group), or CI pipeline** other than the Pages deploy workflow.

## Shared Layout / Include Pattern

`default.html` is the actual base. Every other layout declares `layout: default` and is rendered into the `{{ content }}` slot between the header/nav and footer includes. The shell includes themselves are layout-conditional:

- `header.html` renders the `<header>` only for `notes` / `home` / `post`; for `hindsight` it includes `hindsight-nav.html` instead.
- `footer.html` includes `hindsight-footer.html` for `hindsight`; otherwise renders the default `<footer>` with site title + "Built with Jekyll".

The root landing page (`index.md`) uses `layout: home`, which itself declares `layout: notes` — `notes.html` provides the shared `.container` shell, `.grid-2` card layout, and `.pager` pagination styles (it does not share anything with the `hindsight` layout), and `home.html` renders into `{{ content }}` with the rhythm mark, the filtered `type: note` page list, and the paginated `_posts` list.

### Notes (`_notes/` collection)

- Files under `_notes/`. Defined in `_config.yml` with `output: true` and `permalink: /notes/:path/` (each note renders at `/notes/<filename-stem>/`).
- Front matter: `layout`, `title`, `description`, `tags[]`. The home-page card renderer reads `title` + `description` (falls back to `excerpt`) + `tags[]`. No `link` / `order` / `badge_class` fields — those are vestigial from the old `type: note` page-based scheme.
- `_layouts/home.html` iterates `site.notes | sort: "title"` for the notes list. Notes are **not** paginated.

### Projects (`_projects/` collection)

- Files under `_projects/`. Defined in `_config.yml` with `output: true` and `permalink: /:path/` (so `_projects/hindsightai/index.html` still lands at `/hindsightai/` and the research subtree preserves `/hindsightai/research/...`).
- Front matter: `layout`, `title`, `description`, `tags[]`, `badge` / `badge_class` (optional — used by the home-page card), and `card: true` to opt the file into the home-page **Projects** section. Files **without** `card: true` are still generated as standalone pages but don't appear on the home grid — that's how `_projects/hindsightai/research/` and the scraps fragments stay out of the landing page.
- `_layouts/home.html` iterates `site.projects | where: "card", true | sort: "title"` for the projects list.
- `_layouts/project.html` is the default wrapper (chains to `notes`) for any project file that doesn't override with `layout:` — keeps the field notes theme on any project that wants it.
- HindsightAI and Skiing Smokers are tagged `[humor, satire, project]` (HindsightAI is the placeholder/satirical piece; Skiing Smokers is its companion game).
- Add a new project by dropping a file under `_projects/`, giving it `permalink:` if you don't want the default `/:path/`, and adding `card: true` if it should appear on the home page.

### Blog posts (`_posts/`)

- Standard Jekyll posts collection, filenames `YYYY-MM-DD-title.md`. A `defaults` scope in `_config.yml` for `path: "_posts"` sets `layout: post`, so post front matter only needs `title` and optionally `tags: [...]`.
- `_layouts/post.html` (chains to `layout: notes`) renders a "← back to notes" link, a `.post-header` (title + date + `tags` as `.badge-neutral` pills), and wraps `{{ content }}` in `.post-content`.
- `.post-content` typography (headings, lists, links, tables, blockquotes, inline `code`, Rouge `.highlight` code blocks, and `.mermaid` images) is defined in `_includes/theme-tokens.html` so it's themed consistently with the rest of the "Field Note" palette — see Design System below.
- Mermaid diagrams use plain ```` ```mermaid ```` fenced code blocks. `jekyll-spaceship`'s `mermaid-processor` (configured in `_config.yml`) renders them via `mermaid.ink` as `<img class="mermaid">` tags, with `themeVariables` set to match the site's cream/terracotta palette — requires network access at build/view time to load the diagram image.

### Pagination (posts only)

- `_config.yml` configures `jekyll-paginate-v2` for the **posts** list: `per_page: 5`, `permalink: '/page/:num/'`, sorted by `date` descending (`sort_field: 'date'`, `sort_reverse: true`), `trail.before/after: 1`. No `collection:` key — the posts list is paginated by default.
- `_layouts/home.html` iterates `paginator.posts` (the `jekyll-paginate-v2` Liquid accessor — **not** `paginator.documents`) and renders the `.pager` nav when `paginator.total_pages > 1`.
- `index.md` must carry `pagination:\n  enabled: true` in its front matter — `jekyll-paginate-v2` only paginates pages that opt in.
- Notes and Projects are **not** paginated; the home page grows as those collections grow.

### Standalone `layout: null` pages

`_projects/skiing-smokers-game.html` uses `layout: null` — front matter is parsed (so Liquid still runs) but no layout wraps the content, keeping the page fully self-contained with its own `<head>`/`<body>` and inline `<style>`/`<script>`. The file declares its own `permalink: /skiing-smokers-game.html` in front matter (the `_projects` collection's default `permalink: /:path/` would otherwise map it to `/skiing-smokers-game`).

### Adding a new HindsightAI page

1. Drop the file under `_projects/hindsightai/...`, e.g. `_projects/hindsightai/research/foo.md`.
2. Add front matter: `layout: hindsight`, `title`, `description`, an explicit `permalink: /hindsightai/...` (or rely on the `/:path/` default), `nav_active` (`"platform"` or `"research"`), and optionally `breadcrumbs` / `breadcrumb_current` / `footer_left` / `footer_right`. **Do not** add `card: true` — internal research pages shouldn't show on the home grid.
3. Write page-specific CSS in a `<style>` block and markup in the page body — both go into `{{ content }}`.
4. To change the nav, breadcrumb, or footer across **all** HindsightAI pages, edit the relevant file in `_includes/` once.

## Design System

The site uses a shared "Field Note" theme — a cream/parchment palette with dark ink text and Space Mono typography everywhere. Tokens live in `_includes/theme-tokens.html`, a raw-CSS partial included from `_includes/head.html` and therefore applied to every layout that chains to `default`:

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

The `pages/hindsightai/research/*.html` pages alias `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`, `--color-border-tertiary`, and `--border-radius-lg` in their own `:root` blocks directly onto `var(--text)`, `var(--text2)`, `var(--dim)`, `var(--border)` — changing the shared tokens re-skins these pages automatically. `latent-manifold.html`'s canvas/dark-panel widget intentionally keeps its own hardcoded dark colors as a contrasting "viewport" inset.

### Typography

- **Everything:** `Space Mono` (400/700, regular + italic) — monospace, loaded from Google Fonts in `_includes/head.html`.

### Layout Patterns

- Max content width: `1100px` (platform) / `860px` (research listing) / `740px` (research/scraps fragment pages)
- Sticky nav with `backdrop-filter: blur(8px)` (defined in `_layouts/hindsight.html`)
- CSS grid for stats (4-col on platform) and feature cards (3-col), collapsing to fewer columns at the `768px` breakpoint (hindsight) / `760px` (notes)
- Decorative grid background via `body::before` pseudo-element (hindsight layout)
- Glow effect via `body::after` pseudo-element (platform page only)

## Conventions

- Page-specific CSS stays inline in `<style>` blocks within each page; shared CSS lives in `_layouts/*.html` and `_includes/theme-tokens.html`.
- All JS is inline in `<script>` blocks — no external scripts.
- No CSS framework, no JS framework.
- Class names are semantic/kebab-case (e.g., `.feature-card`, `.paper-card`, `.btn-primary`).
- Responsive breakpoints: `768px` (hindsight layout), `760px` (notes layout) — pick the one matching the layout you're editing.
- HindsightAI nav links to `#` are placeholders (e.g. the "Request Access" CTA points at `/hindsightai/`).
- All internal links are root-relative (`baseurl` is empty in `_config.yml`).

## Deployment

Push to `main`. `.github/workflows/jekyll.yml` builds the site with `bundle exec jekyll build` (full build, not GitHub Pages' restricted "safe mode") and deploys via GitHub Pages — so plugins outside the GH Pages whitelist (`jekyll-paginate-v2`, `jekyll-spaceship`, etc.) work fine. The workflow installs `imagemagick`, `libvips-dev`, `libopenslide-dev`, `jupyter-core`, and `nbconvert` via apt/pip before `bundle install` (needed by `jekyll-jupyter-notebook`, `ruby-vips`, and `image_processing`).

## Gotchas

- **`AGENTS.md` and other root dotfiles/configs are excluded** in `_config.yml`'s `exclude` list (`AGENTS.md`, `GEMINI.md`, `LICENSE`, `.trackboi`, `.agents`, `.codemap`, `.tool-versions`, `.mcp.json`, `Gemfile`, `Gemfile.lock`, `README.md`) — `jekyll-optional-front-matter` would otherwise render them as pages.
- **No 404 page:** GitHub Pages will use its default 404 if a linked resource is missing.
- **`_config.yml`'s pagination block has no `collection:` key** — it paginates `_posts` only (the default for `jekyll-paginate-v2`). The notes and projects lists are **not** paginated; if you add many, the home page just gets longer.
- **jekyll-spaceship** is enabled and may lightly reformat inline HTML/whitespace during build (harmless, but check rendered output after big content edits).
- **Mermaid diagrams render as remote images:** `jekyll-spaceship`'s mermaid-processor builds a `mermaid.ink` URL at build time and emits `<img class="mermaid" src="https://mermaid.ink/svg/...">` — the diagram itself isn't rendered locally, so it won't display in offline/sandboxed previews, but works once the page is served with network access.
- **Collection permalinks and the HindsightAI subtree:** `_projects` is configured with `permalink: /:path/` so `_projects/hindsightai/index.html` keeps `/hindsightai/`, `_projects/hindsightai/research/index.html` keeps `/hindsightai/research/`, etc. If you rename or move files in that subtree, the permalinks follow the new `:path` automatically. Files that need a URL not matching their on-disk path (like `skiing-smokers-game.html`) declare an explicit `permalink:` in front matter.
- **`card: true` is the opt-in for the home-page Projects section.** Without it, a project file still builds its standalone page but doesn't appear on the landing grid — that's why the internal `research/` pages don't pollute the home page.
- **`.tool-versions` pins Ruby 3.4.4** — `bundle install` against a different Ruby will produce native-extension mismatches for `nokogiri`, `ffi`, `sass-embedded`, etc.

<trackboi>
## trackboi Skill

When trackboi MCP tools are available, agents can load `.agents/skills/trackboi/SKILL.md` for details, then call `orient_agent` to catch up before updating cards, tracks, boards, or handoff notes. If `.trackboi`, `.etc/.trackboi`, or `.etc/trackboi` files are present but MCP tools are not available, agents may read those files to catch up on local context. Do not manually create, update, or delete trackboi records in the filesystem; use MCP tools for mutations.
</trackboi>
