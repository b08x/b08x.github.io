## Goal

Convert the existing pure static-HTML GitHub Pages site into a Jekyll site, preserving all current URLs and visual design, while removing duplication (shared nav/breadcrumb/footer/base CSS across the HindsightAI pages).

## Current site structure (pre-conversion)

- `/index.html` — "Syncopated Notes" landing page, light theme, fully self-contained (inline CSS).
- `/hindsightai/index.html` — HindsightAI dark-theme landing page, sticky nav, hero, stats, feature cards, testimonial, footer.
- `/hindsightai/research/index.html` — Research listing page, same dark theme + nav + breadcrumb, paper card with JS-toggled abstract panel.
- `/hindsightai/research/scraps/scraps-acronym.html` — standalone full page (nav/breadcrumb/footer duplicated), acronym explainer fragment.
- `/hindsightai/research/scraps/whitepaper-abstract.html` — standalone full page, full paper abstract fragment.
- `/hindsightai/research/scraps/latent-manifold.html` — standalone full page, canvas-based interactive visualization with inline JS.
- `/skiing-smokers-game.html` — standalone canvas game page, own dark theme variant, fully self-contained with game JS.

All HindsightAI-family pages (hindsightai/index, research/index, and the 3 scraps pages) share: CSS custom properties (--bg, --amber, etc.), the sticky `nav` with logo/nav-links/CTA, a `footer`, and (for research+scraps) a `breadcrumb` bar with Liquid-able current-page label. Each currently duplicates ~40 lines of shared CSS and ~10 lines of nav/footer markup.

## Target architecture

- `_config.yml` + `Gemfile` (github-pages gem) at repo root.
- `.gitignore` additions: `_site/`, `.sass-cache/`, `.jekyll-cache/`, `.jekyll-metadata`.
- `_layouts/notes.html` — light theme layout for the root Syncopated Notes index.
- `_layouts/hindsight.html` — dark theme base layout: shared `<head>` (fonts/vars/base CSS), nav include, optional breadcrumb include (driven by front matter), `{{ content }}`, footer include.
- `_includes/hindsight-nav.html` — nav bar, with `nav_active` front-matter var controlling the `.active` class.
- `_includes/hindsight-breadcrumb.html` — breadcrumb trail driven by a `breadcrumbs` front-matter array + `breadcrumb_current` string.
- `_includes/hindsight-footer.html` — shared footer (left/right text driven by front-matter vars with sensible defaults).
- Shared base CSS (vars, body::before grid, nav, breadcrumb, footer, fonts) lives in the `hindsight` layout's `<style>` or `assets/css/hindsight-base.css`; page-specific CSS stays inline per-page in front-matter content.
- Root `index.html` becomes front matter + content using `notes` layout (CSS extracted to layout).
- `hindsightai/index.html`, `hindsightai/research/index.html`, and the 3 scraps pages converted to front matter + content using `hindsight` layout, with duplicated nav/breadcrumb/footer/base-CSS removed.
- `skiing-smokers-game.html` — minimal/no layout (`layout: null` or omitted), just enough front matter for Jekyll to process it at its current path; game CSS/JS/canvas stay fully inline as-is (it's an intentionally standalone artifact, different design system).
- All internal links remain root-relative (`/hindsightai/...`) — site deploys at root of b08x.github.io (org/user GitHub Pages site), so baseurl is empty; no `relative_url` filter needed.

## Constraints / things to preserve

- Exact current URLs/permalinks for every page (GitHub Pages default permalink = file path, so converting `.html` files in place preserves URLs as long as filenames/paths don't change).
- Visual design and behavior identical (research abstract toggle JS, latent-manifold canvas animation, skiing game).
- AGENTS.md should be updated to reflect the new Jekyll structure (layouts/includes/config) once conversion is done.

## Reference files (already read this session)

- `/home/b08x/WorkspaceV3/b08x.github.io/index.html`
- `/home/b08x/WorkspaceV3/b08x.github.io/AGENTS.md`
- `/home/b08x/WorkspaceV3/b08x.github.io/hindsightai/index.html`
- `/home/b08x/WorkspaceV3/b08x.github.io/hindsightai/research/index.html`
- `/home/b08x/WorkspaceV3/b08x.github.io/hindsightai/research/scraps/{scraps-acronym,whitepaper-abstract,latent-manifold}.html`
- `/home/b08x/WorkspaceV3/b08x.github.io/skiing-smokers-game.html`
- `/home/b08x/WorkspaceV3/b08x.github.io/.gitignore` (currently a Ruby/Jekyll gem template, needs Jekyll build-output entries)
