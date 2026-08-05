# Jekyll Plugins — Reference

Authoritative usage notes for every plugin installed in
`~/WorkspaceV3/b08x.github.io`. Each entry covers **what it does**,
**the Liquid tags/filters it adds**, **the `_config.yml` keys it
consumes**, and a **concrete usage example** from the site or the
plugin's own README.

> **Heads-up on context7.** The context7 MCP tool isn't available in
> this session, so this reference was built by fetching the canonical
> GitHub READMEs and RubyGems pages directly via `web_extract`. Where
> repo URLs have moved (e.g. `penibelst/jekyll_picture_tag` →
> `rbuchberger/jekyll_picture_tag`, `jekyll/jekyll-link-attributes`
> org'd → `twinsunllc/jekyll-link-attributes`), the **current
> canonical repo** is linked.

## Plugin inventory — what's actually wired

The project's `_config.yml:plugins` block (and the `picture:` /
`sass:` config blocks) activate **13 plugins**:

| # | Plugin | Activation | Role |
|---|---|---|---|
| 1 | `jekyll-last-modified-at` | `plugins:` | Git `last_modified_at` on each doc |
| 2 | `jekyll-feed` | `plugins:` | Atom feed at `/feed.xml` |
| 3 | `jekyll-jupyter-notebook` | `plugins:` | Embed `.ipynb` as HTML |
| 4 | `jekyll-link-attributes` | `plugins:` + `external_links:` block | Auto-`rel`/`target` on external links |
| 5 | `jekyll-paginate-v2` | `plugins:` + top-level `pagination:` block | Posts pagination |
| 6 | `jekyll-pandoc` | `plugins:` (but `markdown: kramdown` — **not selected**) | Pandoc converter (installed, dormant) |
| 7 | `jekyll-sass-converter` | `plugins:` + `sass:` block | Compiles `_sass/*.scss` → CSS |
| 8 | `jekyll-sitemap` | `plugins:` | `/sitemap.xml` |
| 9 | `jekyll-spaceship` | `plugins:` + `jekyll-spaceship:` block | Tables, mermaid, mathjax, plantuml, emoji, hybrid MD↔HTML, mod-elements |
| 10 | `jekyll-tabs` | `plugins:` | `{% tabs %}` / `{% tab %}` blocks |
| 11 | `jekyll-toc` | `plugins:` | `{% toc %}` filter + `inject_anchors` filter |
| 12 | `jekyll-optional-front-matter` | `plugins:` | Lets `_config.yml`'s `exclude` list stop dotfiles rendering as pages |
| 13 | `jekyll_picture_tag` | `picture:` config block (no `plugins:` entry needed) | Responsive `<picture>` |

Plus 5 build-time standalones (`jekyll`, `nokogiri`, `ruby-vips`,
`webrick`, `rouge`) — see "Build-time standalones" below.

Plus 6 dormant Gemfile entries not activated in `_config.yml`:
`jekyll-asciinema`, `jekyll-compose`, `jekyll-postcss-v2`,
`jekyll-seo-tag`, `jekyll-tagging-related_posts`, `jekyll-typogrify` —
briefly noted under "Dormant plugins" so the agent doesn't mistake them
for active.

---

## 1. `jekyll-last-modified-at`

- **Repo:** <https://github.com/maximevaillancourt/jekyll-last-modified-at>
- **Gemfile entry:** `gem 'jekyll-last-modified-at', git: 'https://github.com/maximevaillancourt/jekyll-last-modified-at', branch: 'add-support-for-files-in-git-submodules'`
  *(pinned to a fork branch that supports Git submodules — see Pitfalls)*
- **Liquid tags/filters:** none directly; adds a `last_modified_at`
  field to every Page/Document via Git commit time (falls back to
  file `mtime` when Git is unavailable).
- **Usage:**
  ```liquid
  {{ page.last_modified_at | date: "%B %-d, %Y" }}
  ```
  Or the `{% last_modified_at %}` tag in a layout (default format
  `"%d-%b-%y"`).

## 2. `jekyll-feed`

- **Repo:** <https://github.com/jekyll/jekyll-feed>
- **Output:** `/feed.xml` (Atom 1.0). Reads `site.title`, `site.description`,
  `site.url`, `site.author`. Honors post front matter `image` /
  `image.path`, `author`, `description`.
- **Limit:** 10 posts by default (`feed.posts.limit` to override).
- **Tags:** place `{% feed_meta %}` in `<head>` for discovery tags.
- **This site:** default config; no `feed_meta` tag emitted (no `<head>`
  include currently uses it).

## 3. `jekyll-jupyter-notebook`

- **Repo:** <https://github.com/red-data-tools/jekyll-jupyter-notebook>
- **Tag:** `{% jupyter_notebook filename.ipynb %}` (sibling file).
- **Config (this site uses none):** `jupyter_notebook.prompt: true|false`,
  `jupyter_notebook.input: true|false`.
- **Note:** wraps in `{::nomarkdown}` … `{:/nomarkdown}` if kramdown
  mangles it. **Requires** `nbconvert` installed at build time — the
  CI workflow installs it via `pip3 install --upgrade nbconvert`.

## 4. `jekyll-link-attributes`

- **Repo:** <https://github.com/twinsunllc/jekyll-link-attributes>
  *(formerly under the `jekyll` org)*
- **Behavior:** rewrites external `<a>` tags to add configured `rel`
  and `target`. Honors a per-link exclude (a link with its own `rel`
  or `target` is left alone).
- **This site config** (in `_config.yml`):
  ```yaml
  external_links:
    enabled: true
    rel: noopener noreferrer
    target: _blank
  ```
  Uses the **legacy v1 flat config**, not the newer per-attribute
  `external_links.rel.value` / `external_links.target.value` shape.
- **Order note:** load *after* any plugin that mutates `<a>` tags in
  posts (e.g. `jekyll-spaceship` mod-elements), so the attrs stick.

## 5. `jekyll-paginate-v2`

- **Repo:** <https://github.com/sverrirs/jekyll-paginate-v2>
- **Liquid accessors:**
  - `paginator.posts` (use this — **`paginator.documents` is for
    collections**)
  - `paginator.page`, `paginator.total_pages`,
    `paginator.previous_page`, `paginator.previous_page_path`,
    `paginator.next_page`, `paginator.next_page_path`
- **This site config:**
  ```yaml
  pagination:
    enabled: true
    per_page: 5
    permalink: '/page/:num/'
    sort_field: 'date'
    sort_reverse: true
    trail:
      before: 1
      after: 1
  ```
  No `collection:` key → paginates `_posts` only. Notes and Projects
  are **not** paginated.
- **Per-page opt-in:** `index.md` carries
  `pagination:\n  enabled: true` in front matter — required for the
  page to be paginated.
- **Home layout usage** (`_layouts/home.html`):
  ```liquid
  {% assign posts = paginator.posts | default: site.posts %}
  ```
  …then iterates `posts` in the `.grid-2`.

## 6. `jekyll-pandoc` — installed, not selected

- **Repo:** <https://github.com/mfenner/jekyll-pandoc>
- **Activation:** add to `plugins:` AND set `markdown: Pandoc` at
  top-level of `_config.yml` (this site uses `markdown: kramdown` →
  pandoc is a no-op at build time).
- **Options (when active):** `pandoc.extensions: [normalize, smart,
  mathjax, ...]` plus arbitrary `--foo bar` flags.
- **Requirements:** Pandoc ≥ 1.15 binary on the build machine.

## 7. `jekyll-sass-converter`

- **Repo:** <https://github.com/jekyll/jekyll-sass-converter>
- **Bundled with Jekyll** since 2.0 — the gemfile entry is just for
  pinning.
- **Backend:** `sass-embedded` (Dart Sass) since v3.0. The site
  doesn't use Sass right now (no `_sass/` directory present); the
  config block is parked for future use.
- **This site config:**
  ```yaml
  sass:
    sass_dir: _sass
    style: compressed
  ```
  `style: compressed` ships minified CSS. Source maps: default
  `always`; set `sourcemap: never` to disable.

## 8. `jekyll-sitemap`

- **Repo:** <https://github.com/jekyll/jekyll-sitemap>
- **Output:** `/sitemap.xml` (sitemaps.org protocol).
- **No config required.** Honors front matter `sitemap: false` to
  exclude a page; honors `_config.yml` exclude list for files; honors
  `jekyll-last-modified-at`'s `last_modified_at:` field for `<lastmod>`.
- **Load-order note:** load **after** content-generating plugins so
  generated pages are picked up.

## 9. `jekyll-spaceship` — the heavy lifter

- **Repo:** <https://github.com/jeffreytse/jekyll-spaceship>
- **Capabilities added to Markdown:**
  - **Tables:** `^^` cell-merge with cell above; backslash-join for
    multi-line cells; `{.cls #id key=val}` cell IALs;
    `:headerless:`, alignment, headerless tables.
  - **MathJax:** wrap in `$...$` — auto-injects the script when a
    math expression is detected (performance optimization).
  - **PlantUML:** ```` ```plantuml ```` or ```` ```plantuml! ````
    fenced blocks render diagrams.
  - **Mermaid:** ```` ```mermaid ```` or ```` ```mermaid! ```` —
    **what the site uses**. Emits `<img class="mermaid"
    src="https://mermaid.ink/svg/...">` at build time → needs
    network at view time.
  - **Media:** image-block link extraction for YouTube / Vimeo /
    DailyMotion / Spotify / SoundCloud / general video+audio URLs;
    append query strings for `width`/`height`.
  - **Hybrid HTML:** Markdown inside raw HTML works seamlessly.
  - **Polyfill:** `\1.` escapes ordered lists.
  - **Emoji:** `:emoji_name:` → GitHub-flavored emoji image from
    `github.githubassets.com` (overridable).
  - **Modifying elements via CSS selectors:** auto-adds
    `target="_blank" rel="noopener noreferrer"` to external links,
    `loading="lazy"` to `<img>` / `<iframe>` (override per-element
    with `loading="eager"`).
- **This site config:**
  ```yaml
  jekyll-spaceship:
    mermaid-processor:
      mode: default
      syntax:
        code: 'mermaid'
        custom: ['@startmermaid', '@endmermaid']
      css:
        class: mermaid
      config:
        theme: base
        themeVariables:
          primaryColor: '#E3DBC8'
          primaryTextColor: '#2A2420'
          primaryBorderColor: '#B5654A'
          lineColor: '#8A7F72'
          secondaryColor: '#EDE6D6'
          tertiaryColor: '#EDE6D6'
          fontFamily: 'Space Mono, monospace'
      src: https://mermaid.ink/svg/
  ```
- **Site usage:** a single fenced ```` ```mermaid ```` block in
  `_posts/2026-02-28-image-embeddings-ruby.md`. Styled in
  `_includes/theme-tokens.html` under `.post-content .mermaid` —
  framed in `--bg2` to match the code-block register.
- **Pitfall:** Spaceship also adds `target="_blank"` to external
  links — that overlaps with `jekyll-link-attributes`. The
  `jekyll-link-attributes` plugin should be loaded **after**
  `jekyll-spaceship` so the latter's attrs aren't overwritten.

## 10. `jekyll-tabs`

- **Repo:** <https://github.com/Ovski4/jekyll-tabs>
- **Tags:** `{% tabs group_name %} … {% endtabs %}` wraps a group;
  `{% tab group_name label %}` … `{% endtab %}` for each panel.
- **JS dependency:** ship `docs/tabs.js` into `assets/js/` and
  include it (e.g. `<script src="/assets/js/tabs.js"></script>`).
  Init with `jekyllTabs({...})` — options: `syncTabsWithSameLabels`,
  `activateTabFromUrl`, `addCopyToClipboardButtons`,
  `copyToClipboardSettings`, `showToastMessageOnCopy`.
- **CSS dependency:** copy `docs/tabs.css` (or roll your own) into
  `assets/css/` and link it.
- **This site:** plugin installed but **not used** in any current
  post (no `{% tabs %}` blocks in the repo).

## 11. `jekyll-toc`

- **Repo:** <https://github.com/toshimaru/jekyll-toc>
- **Three pieces:**
  - **Filter** `{{ content | toc }}` — emits the TOC directly above
    the content. Drop into `_layouts/post.html` (replacing
    `{{ content }}`).
  - **Tag** `{% toc %}` — emits the TOC standalone (only works for
    Posts and Collections, not arbitrary pages — use `toc_only`
    filter as a workaround).
  - **Filter** `{{ content | inject_anchors }}` — adds `<a
    id="..."></a>` to each heading without emitting a TOC; pair with
    `toc_only` to position the TOC separately.
- **Skip a heading:** add `class="no_toc"` to the heading element.
- **Skip a section:** wrap in `class="no_toc_section"`.
- **Config:** per-page `toc: true` in front matter to opt-in (the
  default behavior is to require explicit opt-in).
- **This site:** installed but **not used** in any current post.

## 12. `jekyll-optional-front-matter`

- **Repo:** <https://github.com/benbalter/jekyll-optional-front-matter>
- **Behavior:** renders Markdown files **without YAML front matter**
  as Pages. Crucial for this site because it stops dotfiles from
  rendering: without this plugin, `jekyll build` would try to
  process `AGENTS.md`, `README.md`, `GEMINI.md`, `LICENSE`, etc. as
  pages (unless explicitly excluded). The site's `_config.yml`
  excludes those names **and** also enables this plugin for
  belt-and-braces safety.
- **Config (this site uses defaults):** `optional_front_matter.remove_originals: true`
  drops the raw `.md` from output; `optional_front_matter.enabled: false`
  disables without removing from the Gemfile.
- **Gotcha:** does **not** recognize a short list of meta files
  (`README.md`, `LICENSE`, etc. by name) — those still need explicit
  front matter or to be listed under `_config.yml:include` /
  `_config.yml:exclude`.

## 13. `jekyll_picture_tag`

- **Repo:** <https://github.com/rbuchberger/jekyll_picture_tag>
  *(formerly `penibelst/jekyll_picture_tag`; the canonical project
  moved)*
- **Liquid tag:** `{% picture <preset> img.jpg alt="..." %}`
  — generates a `<picture>` with multiple `<source>` for responsive
  sizes/formats.
- **Backend:** ImageMagick (`magick` / `convert`) or `ruby-vips`.
  This site installs both `ruby-vips` and `image_processing`, and
  uses `libvips-dev` in CI (apt install).
- **This site config:**
  ```yaml
  picture:
    source: "assets/img"
    output: "assets/img/generated"
    suppress_warnings: true
    nomarkdown: false
  ```
- **This site:** config present but the `assets/img/` directory is
  empty → **no `{% picture %}` usage in any current post**. Dormant
  but wired.

---

## Build-time standalones (not Jekyll plugins, but part of the build)

These don't add Liquid tags; they support the build pipeline.

| Gem | Used by | Notes |
|---|---|---|
| `jekyll` | the build itself | Pinned by Bundler; not in `_config.yml:plugins`. |
| `nokogiri` | `jekyll` core + many plugins | Required for HTML/XML parsing; native extension. |
| `ruby-vips` | `jekyll_picture_tag` + custom Rake | Image processing backend (`libvips`). CI installs `libvips-dev`. |
| `webrick` | `bundle exec jekyll serve` (dev only) | Bundled with Ruby pre-3.0; explicitly added here because the project pins Ruby 3.4.4 where webrick was removed from stdlib. |
| `rouge` | Jekyll's syntax highlighter | `{% highlight %}` and ``` ``` fenced blocks render through Rouge. Tokens are mapped to the Field Note palette in `_includes/theme-tokens.html` (`.highlight .k/.s/.m/.nf/...`). Use `rougify style <theme> > syntax.css` to generate themes. |

---

## Dormant plugins (in Gemfile, not in `_config.yml:plugins`)

These are installed but **not wired** — the agent should not assume
their features are live. Listed with one-line descriptions so they're
recognizable in `bundle list` output.

| Gem | What it does | To activate |
|---|---|---|
| `jekyll-asciinema` | `{% asciicast ID %}` Liquid tag → `<script src="https://asciinema.org/a/ID.js">`. ([repo](https://github.com/mnuessler/jekyll-asciinema)) | Add to `plugins:`. |
| `jekyll-compose` | Adds `bundle exec jekyll new post/draft/page/collection` commands and `default_front_matter` config. ([repo](https://github.com/jekyll/jekyll-compose)) | Add to `plugins:`; honors `EDITOR`/`VISUAL`/`JEKYLL_EDITOR` env vars. |
| `jekyll-postcss-v2` | PostCSS pipeline for stylesheets (autoprefixer, cssnano, etc.) | Add to `plugins:` + `postcss:` config. **Commented `jekyll-postcss` in Gemfile** — the site has the v2 entry but commented the original. |
| `jekyll-seo-tag` | `{% seo %}` tag → emits `<title>`, description, canonical, JSON-LD, Open Graph, Twitter Card meta. ([repo](https://github.com/jekyll/jekyll-seo-tag)) | Add to `plugins:` + drop `{% seo %}` in `<head>`. |
| `jekyll-tagging-related_posts` | Overrides Jekyll's `related_posts` to use tag overlap. ([repo](https://github.com/toshimaru/jekyll-tagging-related_posts)) | Add to `plugins:`; then `site.related_posts` works in layouts. |
| `jekyll-typogrify` | Typographic improvements (smart quotes, widow control, etc.) via `ruby-typogrify`. ([repo](https://github.com/grempe/jekyll-typogrify)) | Add to `plugins:` + wrap content with `{% typogrify %}`. |

---

## Loading-order map

Jekyll loads plugins in the order they're listed in `plugins:`. For
this site, the practical implications:

1. **`jekyll-sass-converter`** first (it's a converter, not a
   generator — runs early).
2. **`jekyll-optional-front-matter`** next (registers Markdown files
   before other plugins see them).
3. **`jekyll-paginate-v2`** before content generators so pagination
   can wrap pages.
4. **`jekyll-spaceship`** BEFORE `jekyll-link-attributes` — so the
   latter's `target`/`rel` rewriting wins (spaceship also rewrites
   external `<a>` tags).
5. **`jekyll-sitemap`** AFTER content generators, so generated pages
   are picked up.
6. **`jekyll-feed`** and **`jekyll-toc`** are content-only filters
   (no load-order sensitivity).