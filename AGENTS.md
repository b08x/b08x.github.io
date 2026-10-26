# AGENTS.md — b08x.github.io

## Overview

This is a **Jekyll** site for **Syncopated Notes** (the landing page). It is built with Jekyll and deployed via GitHub Pages.

## Project Structure

```
_config.yml                             # Site config (title, url, pagination, defaults, exclude list, plugins)
Gemfile / Gemfile.lock                  # Ruby dependencies (Jekyll + plugins)
_layouts/
  default.html                          # Base HTML shell — loads head.html, header.html (which includes nav.html), footer.html
  notes.html                            # Light-theme base (chains to default) — container grid + card / pager styles
  home.html                             # Landing page body (layout: notes) — two-column grid, sr-only h1, entry lists + project rail
  post.html                             # Blog post body (layout: notes) — back link, post header (title/date/tags), post content
  about.html                            # About page body (layout: notes) — split header, prose + sticky career rail (chains to layout: notes)
  project.html                          # Default for _projects/ entries (chains to layout: notes) — applies when a project file doesn't override
  prompt.html                           # Prompt-library entry shell (chains to notes) — crumbs (parent "Prompts") + detail rail + prompt-bench engine (_includes/prompt-bench.html); its front-matter body_class is inert (layout.* never reaches page.*)
  doc.html                              # Docs page (chains to default) — sidebar / content / on-this-page three-column shell
  persona.html                          # Agent profile (chains to notes) — banner + spec grid + annotated prompt sections
  taxonomy.html                         # Tag/category pages (chains to notes) — entry mode (grouped rows) + index mode (chip cloud)
  deck.html                             # Standalone slide deck — does NOT chain to default; own <head>/<body>, theme-tokens.html included directly, class="dark" hardcoded; no header/footer, no theme toggle
  none.html                             # Pass-through ({{ content }} only) for self-contained pages (e.g. _projects/fun/skiing-smokers-game.html)
_includes/
  head.html / header.html / nav.html / footer.html   # Default layout's shell includes (most files are layout-conditional)
  theme-tokens.html                     # Shared "Field Note" CSS tokens/components (palette, badges, cards, post/code/blockquote/mermaid typography)
  home/entries.html                     # Home section: kicker head + <ol class="entries"> entry rows + optional pager (params: kicker, items, kind, all_url, paginate)
  home/projects.html                    # Home side rail: _data/projects.yml entries where card: true, rendered as .pc cards
  projects/item.html                    # /projects/ entry row (params: project): title + dot-separated metadata strip / description / repo+demo links
  about/side.html / career.html / cta.html  # About layout partials; side.html passes rows=page.career / cta=page.cta / links=page.links

_posts/                                  # Standard Jekyll posts collection — layout: post via _config.yml defaults
  YYYY-MM-DD-*.md                        # Front matter: title, tags[] (date comes from filename)
_drafts/                                 # Jekyll drafts — excluded from the build unless served/built with --drafts; parked unpublished notes live here
_notes/                                  # Custom `notes` collection — output: true, permalink: /notes/:path/
  *.md / *.html                          # Front matter: layout, title, description, tags[]; rendered at /notes/<filename-stem>/
_projects/                               # Custom `projects` collection — output: true, permalink: /:path/
  fun/                                   # Standalone games and interactive entertainment
    skiing-smokers-game.html             #   Self-contained canvas game (layout: none), card: true → home-page card, tag: humor
_personas/                               # Custom `personas` collection — output: true, permalink: /about/personas/:path/
  _template.md                           #   UNPUBLISHED copy-template (leading _ = excluded from build) — cp to <slug>.md
  *.md                                  # Agent profiles: front-matter specs/blocks/sections (no body content)
_prompts/                                # Custom `prompts` collection — output: true, permalink: /projects/prompt-library/:path/ (layout: prompt via _config.yml defaults)
  *.md                                  # Prompt-bench entries (15) — front matter (title, tag, category, source, instructions, example, sfl) drives the bench (see `_layouts/prompt.html`)
_plugins/
  taxonomy.rb                            # Generates /tags/, /categories/ index + per-key pages from front matter
personas.md                              # /about/personas/ index (layout: about) — card list of every persona
prompts.html                             # /projects/prompt-library/ bench index (layout: notes; page-level body_class: prompts-bench — the one that lands on <body>)
about.md                                 # /about/ page — front matter drives the career timeline, CTA and links rail (see About page)
_docs/                                   # Custom `docs` collection — output: true, permalink: /docs/:path/
  <doc-set>/*.md                         # GENERATED by scripts/sync-docs.sh — do not hand-edit
_data/docs_nav.yml                       # Sidebar + landing-card definitions, keyed by `doc_set`
scripts/
  sync-docs.sh                           # Compiles a sibling repo's docs/ into _docs/<doc-set>/
  docs-manifests/<doc-set>.tsv           # Per-set reading order, titles, fallback descriptions
docs.html                                # /docs/ landing page, generated from _data/docs_nav.yml
Justfile                                 # Task runner — sync/serve/build recipes
index.md                                # Landing page (layout: home)
```

## How to Edit

- **Local dev server:** `bundle exec jekyll serve` — rebuilds on change and serves at `http://localhost:4000`.
- **Build only:** `bundle exec jekyll build` — outputs to `_site/` (gitignored).
- **Install/update deps:** `bundle install` (Ruby version pinned to `3.4.4` in `.tool-versions`).
- **No tests, linting (beyond `rubocop`/`rubocop-jekyll`/`solargraph` in the `:development` group), or CI pipeline** other than the Pages deploy workflow.

## Shared Layout / Include Pattern

`default.html` is the actual base. Only `notes.html` and `doc.html` declare `layout: default` and render directly into its `{{ content }}` slot between the `header.html` and `footer.html` includes — `home.html`, `about.html`, `post.html`, `project.html`, `persona.html`, `prompt.html` and `taxonomy.html` all declare `layout: notes` and reach `default` transitively through it. Two layouts stand outside the chain: `deck.html` is a complete standalone `<!DOCTYPE html>` document (no front matter, `class="dark"` hardcoded on `<html>`, includes `theme-tokens.html` directly — see Design System; no header/footer, no theme toggle, always dark), and `none.html` is the single-line `{{ content }}` pass-through for self-contained pages. `prompt.html` is the entry shell for the `_prompts` collection — `_config.yml` sets `layout: prompt` for it in the `defaults` block and `/projects/prompt-library/:path/` in the `collections` block (15 entries); the bench index itself is the root page `prompts.html`.

It also emits the page-wide accessibility frame: a `.skip-link` anchor ("Skip to content") *before* the header, and a `<main id="main" tabindex="-1">` wrapper around `{{ content }}` that the skip link targets — except for `layout: doc`, which renders its own `<main class="doc-main" id="main" tabindex="-1">` inside its shell grid, so wrapping would nest two mains. The opt-out is a `page.layout == 'doc'` Liquid conditional in `default.html` — a future layout that renders its own `<main>` must be added to that conditional and give its main `id="main" tabindex="-1"` (the `tabindex` is what lets the skip target receive focus), as `doc.html` does. `.skip-link` and `.sr-only` are defined in `theme-tokens.html`; the latter is the site's hidden-but-announced utility. Before this change `theme-tokens.html` defined no `.sr-only` at all (verified against git history), so the `sr-only` spans on the `/projects/` rows and the project pages rendered visibly; `home.html` and `detail-frame.html` still carry their own duplicate definitions, missing the global rule's `clip-path: inset(50%)` hardening. `default.html` also wires two front-matter hooks: `page.body_class` lands on `<body class="{{ page.body_class }}">` (the `_docs` defaults set `body_class: docs`), and `page.extra_css` inlines as a `<style>` block in `<head>`. The hook reads **page** front matter only — layout front matter reaches Liquid as `layout.*`, never `page.*` — so the `body_class: prompts-bench` in `_layouts/prompt.html`'s front matter is inert. The class on the prompt bench comes from the root page `prompts.html` (`permalink: /projects/prompt-library/`, page-level `body_class: prompts-bench`); the 15 `_prompts/` entries render `<body class="">` and take their bench scope from `prompt.html`'s `div.detail.pb` wrapper instead.

The shell includes are unconditional — `default.html` pulls in `head.html`, `header.html` and `footer.html` on every chained page; the conditionality lives in the content includes each layout adds:

- `header.html` renders the sticky 56px `<header>` — brand icon + wordmark, `nav.html`, and the `[data-theme-toggle]` button. It is included once by `default.html` and spans the full viewport width, outside `.container`.
- `footer.html` renders the uniform default `<footer>` (site title, source link, update status, and "Built with Jekyll"). It is included once by `default.html`, so it appears on every page in the chain — `deck.html` and `layout: none` pages carry no footer.

Include use otherwise splits by layout: five collection-entry layouts include both `crumbs.html` (params `parent_label` / `parent_url` for the trail) and `page-scripts.html` (copy-link buttons + TOC scroll-spy) — `post.html`, `project.html`, `persona.html`, `prompt.html` and `taxonomy.html`; the header comments inside `crumbs.html` / `page-scripts.html` still say "post and project layouts" only, but the include sites are the authority. `notes.html`, `home.html`, `about.html` and `doc.html` include neither. `doc.html` builds its own inline `.doc-breadcrumb`, and its three-column shell CSS comes from `_includes/detail-shell.html` — a CSS partial pulled into its `<style>` block, docs-only; the project/prompt counterpart is `detail-frame.html` (`detail-shell.html`'s own header comment naming `project.html` is stale).

The root landing page (`index.md`) uses `layout: home`, which itself declares `layout: notes` — `notes.html` provides the shared `.container` shell and the `.pager` / `.crumbs` / `.post*` styles, and `home.html` renders into `{{ content }}` with the sr-only `h1`, the two-column entry grid, and the paginated `_posts` list.

### Home page (`_layouts/home.html` + `_includes/home/`)

Structure (a port of an external site's homepage layout, restyled with Field Note tokens — layout only):

- **sr-only `h1`** from `page.title` — no visible page heading.
- **`.home-grid`** — one column until **900px** (the breakpoint `.post-layout` and `.about-grid` already use), then `minmax(0, 2fr) minmax(300px, 1fr)` with a `--space-8` gap. Main column = `Writing` over `Notes`; side rail = `Projects` only.
- **Section heads** — `.home-kicker` (`h2`, uppercase mono in `--status-question`, the ported orange) with an optional right-aligned "all →" link (`all_url`/`all_label` params). Only Projects passes one (`/projects/`); there is no `/writing/` or `/notes/` archive, so don't invent those links.
- **Entry rows** — `_includes/home/entries.html` renders an `<ol class="entries">` of `.entry` rows: meta column (`<time>`, `.tag-row` chips, reading time) beside `h3` title + `.entry-blurb`. `kind: "post"` computes reading time (`number_of_words` ceiled to minutes); `kind: "note"` prints a `note` label. `paginate: true` appends the `.pager` nav after the list.
- **Container query** — `.entries` is `container-type: inline-size` and the meta column stacks below **600px of container width** (not the source's 720px: the main column is ~667px wide, so 720 would never fire). Base rules come first in the stylesheet, the `@container` block second, so equal-specificity ties go to the container overrides.
- **Project cards** — `_includes/home/projects.html` reads `_data/projects.yml` `where: "card", true` and renders `.pc` cards (name · badge/year spec line in `--rust` · description · destination, url pushed to the card floor with `margin-top: auto`).
- **Lede guard** — `index.md` is front-matter-only, so the layout strips content and only emits `.home-lede` when body copy actually exists: `{% assign home_body = content | strip %}{% if home_body != '' %}…{% endif %}`. `{% unless content == blank %}` does **not** work — `blank` resolves as a variable, and an empty div leaks through.
- All page CSS is inline in the layout's `<style>` block, scoped under `.home`.

### About page (`_layouts/about.html` + `_includes/about/`)

- `about.md` at the root drives it (`layout: about`, `permalink: /about/`). Front-matter keys: `kicker`, `lede`, `career[]` (`years`/`role`/`detail` rows), `cta{}`, `links[]` (`label`/`url`/`external`).
- Layout renders a split header (kicker + `title` + lede), then `.about-grid`: **`minmax(0, 2fr) minmax(260px, 1fr)` at ≥900px**, prose left, `.about-side` rail right. The rail is sticky at `top: calc(var(--header-h) + var(--space-4))`.
- `about-cycle` is the ported 7.2s six-stop `@keyframes` on the kicker — gated behind `@media (hover: hover)` and disabled under `prefers-reduced-motion: reduce`.
- Kicker falls back to `"About"`: `{{ page.kicker | default: "About" }}`.
- Partials: `_includes/about/side.html` wraps `career.html` + `cta.html` and passes `page.career` / `page.cta` / `page.links` into them.

### Notes (`_notes/` collection)

- Files under `_notes/`. Defined in `_config.yml` with `output: true` and `permalink: /notes/:path/` (each note renders at `/notes/<filename-stem>/`).
- Front matter: `layout`, `title`, `description`, `tags[]`. The home-page card renderer reads `title` + `description` (falls back to `excerpt`) + `tags[]`. No `link` / `order` / `badge_class` fields — those are vestigial from the old `type: note` page-based scheme.
- `_config.yml` defaults `_notes/` to `layout: post` — every note gets the post header / `.post-content` treatment plus the `crumbs.html` back-link (`crumbs.html` renders the parent anchor; `post.html` has no back-link of its own) at a notes URL, unless the note's front matter overrides `layout:`. `_notes/image-embeddings-ruby.md` (a republished former post) restates both defaults explicitly: its `layout: post` repeats the config default and its `permalink: /notes/image-embeddings-ruby/` repeats the collection default (`/notes/:path/`) — both keys can be dropped with no change to the rendered page.
- `_layouts/home.html` delegates the notes list to `_includes/home/entries.html` (`site.notes | sort: "title"`), rendering each note as an entry row. Notes are **not** paginated.

### Projects (`_projects/` collection & `_data/projects.yml`)

- **Data File (`_data/projects.yml`):** The canonical registry of projects (both internal and external). Each entry specifies `title`, `description`, `url`, `external: true/false`, `badge`, `tags[]`, `card: true` (if featured on the landing page), plus three optional keys:
  - `repo:` — the repository web URL (`https://…`). Adds a `repo ↗` link on the `/projects/` row for internal entries (external entries already link to their `url`). On a project page, an explicit `repo:` wins; otherwise the page falls back to the first external `links:` entry.
  - `fork_of: {name: "owner/repo", url: "https://github.com/…"}` — **presence of the key marks the entry as a fork.** Renders a `fork` badge + upstream link on the project page rail, a `fork of … ↗` chip in the `/projects/` metadata strip, and a `· fork` marker in the home card meta line. Omit for standalone work — no entry declares it yet; the capability exists without live data.
  - `archived: true` — files the entry under the **Past projects** section on `/projects/` instead of **Active projects**. Anything without the flag is active (`where_exp: "p", "p.archived != true"`), and the Past section only renders once at least one entry sets it. Same story: no entry declares it yet. Not to be confused with the `status:` front-matter key some `_projects/` pages carry ("Active"/"Alpha") — that one is page copy, not registry grouping.
- **Projects Page (`projects.html`):** Renders at `/projects/` (`permalink: /projects/`) using `layout: notes`, laid out as a **single-column centered document** (`max-width: var(--width-narrow)`, 740px) rather than a grid: a hero block (`.page-title` h1 + `.page-lede` + a mono `N active` count line — the `· N past` half only prints when past entries exist), then one `<section>` per lifecycle state whose `h2` (`.p-section-title`) sits on a 2px rust rule. Rows come from `_includes/projects/item.html` with a strict three-tier anatomy: (1) `h3` title beside a dot-separated `.p-meta` strip (badge · year · `#tag` links · optional fork), (2) `.p-item-desc` full-width summary, (3) `.p-item-actions` with `repo ↗` for external entries or optional `repo ↗` + `demo →` for internal ones. **Separators are CSS-generated** (`.p-meta > * + *::before`, `.p-tags a + a::before`), so an optional strip part that doesn't render never leaves a stray `·` behind — don't hand-write separators in the Liquid. Rows are hairline-divided (`.p-item`), no images, no filtering JS.
- **Projects Collection (`_projects/`):** Files under `_projects/` are defined in `_config.yml` with `output: true` and `permalink: /:path/`, providing standalone content pages for internal projects like Skiing Smokers (`_projects/fun/skiing-smokers-game.html`).
- `_includes/home/projects.html` (rendered into the home rail by `_layouts/home.html`) iterates `site.data.projects | where: "card", true` for the projects list on the landing page, rendering appropriate external link badges and targets (`target="_blank" rel="noopener noreferrer"`). Cards are single anchors, so the fork marker is text in `.pc-meta`, not a nested link.
- `_layouts/project.html` is the default wrapper (chains to `notes`) for any project file that doesn't override with `layout:` — keeps the field notes theme on any project that wants it. Its rail renders the clickable `repository ↗` row and the copyable repo field from `repo_url` (= `page.repo | default: first external link`), skipping whichever `links:` entry it covers so the URL never appears twice.
- Skiing Smokers is tagged `[humor, satire, project]`.
- Add a new project by adding its metadata to `_data/projects.yml`, setting `external: true` for remote repositories or `external: false` for internal pages in `_projects/`.

### Taxonomy — tags & categories (`_plugins/taxonomy.rb` + `_layouts/taxonomy.html`)

- The generator runs over all four content collections (posts, notes, projects, personas) and creates four kinds of page: `/tags/<slug>/`, `/categories/<slug>/`, plus index pages at `/tags/` and `/categories/` (chip cloud with counts). Slugs come from `Jekyll::Utils.slugify` — the same function the Liquid `slugify` filter runs, so `href="/tags/{{ tag | slugify }}/"` built in any layout always matches the generated dir.
- Categories are **Jekyll native front matter** (`categories: [agents]` on a post/note/persona) — not a custom data file. Tags are plain `tags: [...]`. The generator reads both keys.
- Layout `_layouts/taxonomy.html` has two modes: **entry mode** (a `taxonomy_key` page — grouped rows by collection: Writing → Notes → Projects → Personas, each entry a title/blurb/meta row with tag links) and **index mode** (`taxonomy_index: true` — a chip cloud of every key with counts).
- **Links into these pages:** tag chips (`a.tag`) link to `/tags/<slug>/` from posts, notes, home entries, project pages and taxonomy rows; `/projects/` rows use their own inline `.p-meta-tag` links (same slugified href); category pills (`a.cat`, from `_includes/theme-tokens.html`) link to `/categories/<slug>/` from the post header. `a.tag` / `a.cat` hover styles are in `theme-tokens.html`.
- **Generated pages must null `last_modified_at`** (done in `new_page`): `jekyll-last-modified-at` attaches a `Determinator` at `:pages, :post_init` that stats `page.path` when the sitemap template evaluates it — a `PageWithoutAFile` has no file on disk, so sitemap generation raised `Errno::ENOENT` until the value was cleared.
- To add a new grouping (e.g. a `series`), extend `Taxonomy::GROUPS`/`generate` — everything else (slugs, links, layout) follows the same pattern.

### Personas (`_personas/` collection & `personas.md`)

- The **`personas` collection** (`_config.yml`): `output: true`, `permalink: /about/personas/:path/`, default layout `persona`. Profiles live at `/about/personas/<filename-stem>/`; the index is a root page `personas.md` with `permalink: /about/personas/` (it uses `layout: about` for the split shell, with persona cards in the prose column).
- Personas are treated as **technical specs, not characters**: system prompt, tools and subagents are presented as configuration artifacts. `_layouts/persona.html` renders a banner (monogram/kicker/title/role), then a spec-card grid, then the system prompt **excerpted into sections, each annotated**.
- Front-matter contract (all content is front matter — the body is empty):
  - `monogram`, `role`, `description`, `tags[]`, `categories[]`
  - `specs: [{label, value}]` — rows in the "Spec" card
  - `blocks: [{title, items}]` — additional grid cards (Tools, Skills, Subagents…); each item is a string or `{name, note}`. A note **with** a space stacks under the name; a note **without** a space right-aligns (used for tool permissions like `always` / `ask`).
  - `sections: [{title, prompt, note}]` — `prompt` is a verbatim source excerpt (escaped into `<pre class="ppsec-prompt">`), `note` is the annotation (markdownified, under an "annotates" label).
- Two complete profiles exist: `ruth.md` (R.U.T.H, the mistral-vibe documentation agent — sources `~/.vibe/agents/ruth.toml` + `~/.vibe/prompts/ruth.md`) and `other-steve-arch.md` (the `other-steve-arch` skill — source `~/.syncopated/skills/other-steve-arch/SKILL.md`). Excerpts were verified line-by-line against those sources.
- `_personas/steve.md` is an **unfinished stub**: front matter only (title/role/description/tags/categories), no `specs` / `blocks` / `sections` yet. Unlike `_template.md` it has no leading underscore, so it still builds and publishes at `/about/personas/steve/` — and contributes its `tags` / `categories` to the taxonomy pages — while incomplete. If it should stay hidden until finished, either finish it or rename it with a leading underscore.
- **New profile:** copy the template — `cp _personas/_template.md _personas/<slug>.md` — and replace every `PLACEHOLDER`. The template's leading underscore makes Jekyll exclude it from the collection entirely (verified: it never renders, never appears on the index, contributes no tags/categories). Don't rename it to drop the underscore unless you want it published.
- **Attribution:** `_layouts/post.html` resolves `author: <slug>` in post front matter to `/about/personas/<slug>/` and renders a `by <title>` byline link. Wiring is in place; no post claims an `author` yet — add `author: ruth` to a post's front matter to activate it.
- `about.md`'s links rail includes a `personas` entry pointing at the index.


### Docs (`_docs/` collection, synced from other repos)

Project documentation is **not written here**. It lives in each project's own repo and is compiled into `_docs/<doc-set>/` by `scripts/sync-docs.sh`. Everything under `_docs/` is generated output.

**Resyncing after the source repo changes:**

```bash
just sync-docs sfl-engine            # one doc set (source defaults to ../sfl-engine)
just sync-docs-dry sfl-engine        # preview: prints source -> permalink, writes nothing
just sync-all-docs                   # every manifest that has a sibling checkout
just sync-docs sfl-engine ~/src/sfl  # explicit source path
```

The script reads the source **working tree**, not git — uncommitted edits in the source repo sync fine.

**Adding a new doc set** takes three steps, and the slug must match in all of them:

1. `scripts/docs-manifests/<slug>.tsv` — tab-separated `source`, `out`, `title`, `fallback`. Line order *is* the reading order: it drives `nav_order` and the prev/next pager. `out: index` publishes at `/docs/<slug>/`.
2. `_data/docs_nav.yml` — add a `<slug>:` key with `title`, `subtitle`, `description`, `edit_base`, optional `project_url`, and `groups[].items[]` matching the manifest order.
3. `just sync-docs <slug>` — the source repo defaults to `../<slug>`, so the sibling directory name should match the slug.

**What the script does to each page:**

- Injects front matter: `title`, `description`, `permalink`, `doc_set`, `source_path`, `nav_order`, `toc`, `generated_by`, and `nav_prev`/`nav_next`.
- Strips the leading `# H1` — `doc.html` renders `page.title` itself, so leaving it would print the title twice.
- Promotes the lede paragraph to `description`, **unless** that paragraph contains markdown links or opens with a bolded label (`**Status:** …`). Those stay in the body and the manifest's `fallback` column is used instead — a promoted lede moves into front matter, where the link rewriter can't reach it and the layout would print raw `[text](target)`.
- Rewrites relative links: targets listed in the manifest become site permalinks (`./x.md`, `x.md` and `x.md#anchor` all match); every other relative `.md` link becomes a `blob/<current-branch>` URL on the source repo's `origin`.
- Strips markdown markup from `description`, which is plain text in both YAML and the rendered lede.

**Safety:** every generated page carries `generated_by: sync-docs.sh`. The script wipes `_docs/<slug>/` before writing and refuses to run if that directory holds any `.md` without the marker, so a hand-written set can't be destroyed by a mistyped slug.

**Gotchas:**

- Pager keys are `nav_prev` / `nav_next`, **not** `prev` / `next`. Jekyll defines `next` as a built-in `Document` attribute, so a front-matter `next:` is silently ignored and the pager links to the alphabetically-next file.
- Sources must live under the source repo's docs subdir (`--docs-subdir`, default `docs`). A file at the repo root (`ROADMAP.md`) can't be listed in a manifest as-is.
- The GitHub link base follows the source repo's **currently checked-out branch**, so syncing from a feature branch bakes that branch into the links.
- `_docs/` pages use the site theme like every other page. Do not reintroduce per-doc-set palettes — an earlier version overrode only the legacy token aliases, which left the header and headings on the site accent over a themed body.

### Blog posts (`_posts/`)

- Standard Jekyll posts collection, filenames `YYYY-MM-DD-title.md`. A `defaults` scope in `_config.yml` for `path: "_posts"` sets `layout: post`, so post front matter only needs `title` and optionally `tags: [...]`, `categories: [...]`, `author: <persona-slug>`.
- **Post permalink is explicit: `/:year/:month/:day/:title/`** (in `_config.yml`). It used to be `pretty`, which expands to `/:categories/:year/:month/:day/:title/` — the moment a category is filed, `:categories` becomes a path segment and every categorized post would move URL. Categories *group* (via `_plugins/taxonomy.rb`), they don't *address*. The new pattern is byte-identical to `pretty`'s output for uncategorized posts, so existing URLs didn't move.
- `_layouts/post.html` (chains to `layout: notes`) renders a "← back to notes" link, a `.post-header` (title + date + category pills linking to `/categories/<slug>/` + tag chips linking to `/tags/<slug>/` + optional `by <title>` author byline), and wraps `{{ content }}` in `.post-content`.
- `.post-content` typography (headings, lists, links, tables, blockquotes, inline `code`, Rouge `.highlight` code blocks, and `.mermaid` images) is defined in `_includes/theme-tokens.html` so it's themed consistently with the rest of the "Field Note" palette — see Design System below.
- Mermaid diagrams use plain ```` ```mermaid ```` fenced code blocks. `jekyll-spaceship`'s `mermaid-processor` (configured in `_config.yml`) renders them via `mermaid.ink` as `<img class="mermaid">` tags, with `themeVariables` set to match the site's cream/violet palette — requires network access at build/view time to load the diagram image.

### Pagination (posts only)

- `_config.yml` configures `jekyll-paginate-v2` for the **posts** list: `per_page: 5`, `permalink: '/page/:num/'`, sorted by `date` descending (`sort_field: 'date'`, `sort_reverse: true`), `trail.before/after: 1`. No `collection:` key — the posts list is paginated by default.
- The home page's Writing section calls `_includes/home/entries.html` with `paginate=true`, which renders `paginator.posts` (the `jekyll-paginate-v2` Liquid accessor — **not** `paginator.documents`) and emits the `.pager` nav when `paginator.total_pages > 1`. All home CSS lives in `_layouts/home.html`'s `<style>` block, not `notes.html`.
- `index.md` must carry `pagination:\n  enabled: true` in its front matter — `jekyll-paginate-v2` only paginates pages that opt in.
- Notes and Projects are **not** paginated; the home page grows as those collections grow.

### Standalone `layout: none` pages

`_projects/fun/skiing-smokers-game.html` uses `layout: none` (which resolves to the pass-through `_layouts/none.html` containing only `{{ content }}`) — front matter is parsed (so Liquid still runs) but no decorative site layout wraps the content, keeping the page fully self-contained with its own `<head>`/`<body>`, inline `<style>`/`<script>`, and internal navigation links back to Home and Projects. Note: Do NOT use `layout: null` in YAML front matter when a collection default layout exists in `_config.yml`, because YAML evaluates `null` to Ruby `nil`, causing Jekyll to fall back to the default wrapper layout. The file declares `permalink: /fun/skiing-smokers-game.html` in front matter.


## Design System

The site uses a shared theme imported from the Claude Design project `511342be-de7c-4c55-833c-393d459dfcb2`: violet primary / rust secondary on cream parchment in light mode, on a cool `#1F1F24` neutral stack in dark mode, with Space Mono typography everywhere. Tokens live in `_includes/theme-tokens.html`, a raw-CSS partial included from `_includes/head.html` and therefore applied to every layout that chains to `default`.

Canonical token names are the design-system names. The short legacy names (`--bg`, `--amber`, `--text`…) are kept as `var()` aliases so `_layouts/doc.html`, `projects.html`, `prompts.html` and the self-contained pages under `_projects/` keep working and inherit dark mode for free.

`_layouts/deck.html` is a standalone document (it does not chain to `default`), so it includes `theme-tokens.html` directly and hardcodes `class="dark"` on `<html>`: a deck always presents on the dark face, with no toggle and no pre-paint flash. Its own `--deck-bg` / `--deck-fg` / `--deck-accent` names are a second alias layer over the canonical tokens, kept so authored slide CSS keeps resolving.

Dark mode is a `dark` class on `<html>`, applied before first paint by an inline snippet in `_includes/head.html` and toggled by `assets/js/theme.js` (persisted in `localStorage` under `syncopated-theme`, defaulting to `prefers-color-scheme`). Any `[data-theme-toggle]` element acts as the switch.

```
                     light        dark       legacy alias
--background:        #EDE6D6      #1F1F24    --bg
--surface:           #E3DBC8      #26262E    --bg2
--surface-2:         #DACFB8      #2F2F39
--bg-code:           #E3DBC8      #17171B
--foreground:        #2A2420      #ECEAF2    --text
--text-2:            #5C5248      #B6B2C4    --text2
--muted:             #8A7F72      #8A8698
--dim:               #B0A492      #5A5668
--border:            #D2C7B4      #33333D
--border-2:          #C9B8A0      #45454F    --border2
--accent:            #7C3AED      #A855F7    --amber      (violet — headings, primary)
--accent-hi:         #4C1D95      #C08BFA    --amber-hi
--accent-soft:       #E6DBF5      #2A1D3D
--cyan:              #B7410E      #F0913F                 (rust / ember — links)
--cyan-hi:           #8F320B      #F7AE69
--badge-text:        #F7F4FA      #17171B

--status-success:    #1E8F4E      #33E666    --badge-green
--status-info:       #7C3AED      #A855F7    --badge-blue
--status-danger:     #95260A      #E2563A    --badge-red / --red
--status-warning:    #B7410E      #D9662A
--status-question:   #B8690F      #F0913F
--chart-1 … --chart-5                        (syntax + diagram palette)
```

Non-color scales are also defined: `--text-2xs … --text-5xl`, `--weight-*`, `--leading-*`,
`--tracking-*`, `--space-0 … --space-12`, `--width-content` / `--width-article`,
`--radius-xs … --radius-pill`, `--shadow-xs … --shadow-lg`, `--transition-*`, `--ease-*`,
`--header-h` (56px) and the `--z-*` scale.

`theme-tokens.html` also defines the reusable components:

- `.badge-row` / `.badge` + `.badge-blue` / `.badge-red` / `.badge-green` / `.badge-neutral` — small colored pill labels (used for the landing page's note tags and post tags)
- `.field-note`, `.field-note-meta`, `.field-note-title`, `.field-note-body` — bordered "index card" component
- `.code-panel`, `.code-cmd`, `.code-output` — muted inset panel for command/output snippets
- `.back-link`, `.post-header`, `.post-title`, `.post-meta` — blog post header (used by `_layouts/post.html`)
- `.site-header` / `.site-brand` / `.site-nav` / `.theme-toggle` — the sticky 56px chrome
- `.tag` / `.tag-row` — `#tag` chips (mono, hairline border, `--surface-2` fill)
- `.link-label` — the trailing `repo ↗` / date affordance, in `--cyan`
- `.skip-link` / `.sr-only` — the accessibility frame: the skip-to-content anchor (emitted once by `default.html`, styled on `:focus`) and the hidden-but-announced text utility
- `.post-content` — typography for rendered Markdown: headings (in `--accent`), lists, tables, `blockquote` (accent left border, `--surface` background), inline `code`, Rouge `.highlight` code blocks (syntax token colors mapped onto `--chart-1 … --chart-5`), and `.mermaid img` (framed in a `--surface` panel; forced onto a light ground in dark mode, since the diagrams are remote images rendered light)



### Typography

- **Everything:** `Space Mono` (400/700, regular + italic) — monospace, loaded from Google Fonts in `_includes/head.html`.

### Layout Patterns

- Max content width: `1100px`
- Two-column content pages at `900px`: `.home-grid` (`2fr / 1fr`), `.about-grid` (`2fr / 1fr`), `.post-layout` (text + TOC rail)
- `.container` padding/card collapse at `760px` (notes layout)

## Conventions

- Page-specific CSS stays inline in `<style>` blocks within each page; shared CSS lives in `_layouts/*.html` and `_includes/theme-tokens.html`.
- All JS is inline in `<script>` blocks — no external scripts.
- No CSS framework, no JS framework.
- Class names are semantic/kebab-case (e.g., `.entry-blurb`, `.home-sec-hd`, `.btn-primary`); page-scoped prefixes for a layout's own blocks (`.home-*`, `.about-*`, `.pc`).
- Responsive breakpoints: `900px` (two-column layouts — home, about, post), `760px` (container padding / card collapse).
- All internal links are root-relative (`baseurl` is empty in `_config.yml`).

## Deployment

Push to `main`. `.github/workflows/jekyll.yml` builds the site with `bundle exec jekyll build` (full build, not GitHub Pages' restricted "safe mode") and deploys via GitHub Pages — so plugins outside the GH Pages whitelist (`jekyll-paginate-v2`, `jekyll-spaceship`, etc.) work fine. The workflow installs `imagemagick`, `libvips-dev`, `libopenslide-dev`, `jupyter-core`, and `nbconvert` via apt/pip before `bundle install` (needed by `jekyll-jupyter-notebook`, `ruby-vips`, and `image_processing`).

## Gotchas

- **`permalink: pretty` includes `:categories`** — never set it back on posts. A post with `categories: [...]` would resolve to `/:categories/:year/…`, silently changing its URL (and leaving the old one 404). The posts permalink is explicitly `/:year/:month/:day/:title/`.
- **Generated pages must clear `last_modified_at`** — `jekyll-last-modified-at` registers a `:pages, :post_init` hook that stores a `Determinator` over `page.path`; when `sitemap.xml` evaluates it, a `PageWithoutAFile` (no file on disk) raises `Errno::ENOENT`. `_plugins/taxonomy.rb`'s `new_page` sets `page.data["last_modified_at"] = nil` for exactly this reason; do the same for any other plugin that synthesizes pages.
- **Tag/category hrefs must be built with the `slugify` filter** (`{{ tag | slugify }}`), not hand-rolled lowercasing — the generator slugs with `Jekyll::Utils.slugify`, and only that filter guarantees the href matches the generated dir.
- **Prompt excerpts on persona pages are verbatim source text** — escaped into `<pre>` via `| strip | escape`, never `markdownify`'d (markdown in the prompt would re-render as page typography). Annotations go in `note` and *are* markdownified. When editing `_personas/*.md`, re-verify excerpts against `~/.vibe/prompts/ruth.md` / the skill's `SKILL.md` rather than paraphrasing.

- **`AGENTS.md` and other root dotfiles/configs are excluded** in `_config.yml`'s `exclude` list (`AGENTS.md`, `GEMINI.md`, `LICENSE`, `.trackboi`, `.agents`, `.codemap`, `.tool-versions`, `.mcp.json`, `Gemfile`, `Gemfile.lock`, `README.md`) — `jekyll-optional-front-matter` would otherwise render them as pages.
- **No 404 page:** GitHub Pages will use its default 404 if a linked resource is missing.
- **`_config.yml`'s pagination block has no `collection:` key** — it paginates `_posts` only (the default for `jekyll-paginate-v2`). The notes and projects lists are **not** paginated; if you add many, the home page just gets longer.
- **jekyll-spaceship** is enabled and may lightly reformat inline HTML/whitespace during build (harmless, but check rendered output after big content edits).
- **Mermaid diagrams render as remote images:** `jekyll-spaceship`'s mermaid-processor builds a `mermaid.ink` URL at build time and emits `<img class="mermaid" src="https://mermaid.ink/svg/...">` — the diagram itself isn't rendered locally, so it won't display in offline/sandboxed previews, but works once the page is served with network access.
- **Collection permalinks:** `_projects` is configured with `permalink: /:path/`. Files that need an explicit extension (like `skiing-smokers-game.html`) declare an explicit `permalink:` in front matter.
- **YAML `layout: null` vs `layout: none`:** In YAML front matter, writing `layout: null` sets the Ruby variable to `nil`, which triggers Jekyll's fallback to `_config.yml` collection default layouts. To create self-contained pages without wrappers, set `layout: none` and use `_layouts/none.html`.
- **`card: true` is the opt-in for the home-page Projects section.** Without it, a project file still builds its standalone page but doesn't appear on the landing grid.
- **`.tool-versions` pins Ruby 3.4.4** — `bundle install` against a different Ruby will produce native-extension mismatches for `nokogiri`, `ffi`, `sass-embedded`, etc.
- **Liquid `blank` is not a literal in `{% unless content == blank %}`** — it resolves as an undefined variable, so the comparison is false and an empty wrapper div leaks into the page. Guard optional layout slots with `{% assign x = content | strip %}{% if x != '' %}` instead (see `_layouts/home.html`'s lede).
- **The home entry meta column's container query is tuned to the grid, not the viewport:** `.entries` uses `container-type: inline-size` and switches at `600px` of *container* width because the main column measures ~667px at the 900px two-column layout. If you widen the grid, raise that threshold — and keep the base `.entry-meta` rule *before* the `@container` block, or equal-specificity ties go to the base rule and the overrides half-apply.

<trackboi>
## trackboi Skill

When trackboi MCP tools are available, agents can load `.agents/skills/trackboi/SKILL.md` for details, then call `orient_agent` to catch up before updating cards, tracks, boards, or handoff notes. If `.trackboi`, `.etc/.trackboi`, or `.etc/trackboi` files are present but MCP tools are not available, agents may read those files to catch up on local context. Do not manually create, update, or delete trackboi records in the filesystem; use MCP tools for mutations.
</trackboi>
