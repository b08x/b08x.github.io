# Project: Syncopated Notes & HindsightAI

## Overview

This is a **Jekyll**-based website hosting "Syncopated Notes" (a personal landing page and blog) and "HindsightAI" (a satirical/fictional AI startup research platform). The site is built with a focus on a "Field Note" aesthetic—cream/parchment palette, dark ink text, and monospace typography.

### Core Technologies

- **Static Site Generator:** Jekyll
- **Language:** Ruby, Liquid
- **Styling:** Vanilla CSS (no frameworks)
- **Typography:** Space Mono (Google Fonts)
- **Diagrams:** Mermaid (via `jekyll-spaceship` and `mermaid.ink`)
- **Pagination:** `jekyll-paginate-v2`
- **Deployment:** GitHub Actions to GitHub Pages

## Architecture & Structure

- `index.md`: The root landing page, using the `home` layout.
- `_notes/`: A Jekyll collection of "irregular notes" displayed on the home page (not generated as standalone pages).
- `_posts/`: Standard Jekyll blog posts.
- `hindsightai/`: Contains the HindsightAI platform and research pages.
- `_layouts/`:
  - `notes.html`: Light-theme base layout for the landing page and posts.
  - `home.html`: Landing page specific layout.
  - `post.html`: Layout for blog posts.
  - `hindsight.html`: Dark-theme base layout for HindsightAI pages.
- `_includes/`:
  - `theme-tokens.html`: **Critical File.** Contains the design system's CSS variables and reusable components (badges, field-notes, etc.).
  - `hindsight-*.html`: Components specific to the HindsightAI layout (nav, breadcrumbs, footer).
- `pages/`: Standalone pages like `skiing-smokers-game.html`.

## Getting Started

### Prerequisites

- Ruby (check `.tool-versions` or `Gemfile`)
- Bundler

### Commands

- **Install Dependencies:** `bundle install`
- **Local Development:** `bundle exec jekyll serve` (serves at `http://localhost:4000`)
- **Build Site:** `bundle exec jekyll build` (outputs to `_site/`)
- **Linting:** `bundle exec rubocop`

## Development Conventions

### Design System ("Field Note")

- **Palette:** Cream paper (`#EDE6D6`), Terracotta accent (`#B5654A`), Dark ink (`#2A2420`).
- **Tokens:** Always refer to `_includes/theme-tokens.html` for CSS variables and component classes.
- **Typography:** Use `Space Mono`.

### Content & Layout

- **HindsightAI Pages:** Must use `layout: hindsight`. Use `nav_active`, `breadcrumbs`, and `footer_*` front matter to control layout features.
- **Notes Collection:** Managed in `_notes/*.md`. Use the `order` field for sorting.
- **Blog Posts:** Standard Jekyll format in `_posts/`. Layout is automatically set to `post` via `_config.yml` defaults.
- **Links:** Prefer root-relative links. `baseurl` is empty.
- **CSS/JS:** Prefer inline `<style>` and `<script>` blocks for page-specific logic to keep pages self-contained. No external frameworks.

### Diagrams

- Use standard fenced `mermaid` code blocks. These are processed by `jekyll-spaceship` into `mermaid.ink` image tags.

## Tools & Automation

- **Trackboi:** This project uses [Trackboi](https://github.com/b08x/trackboi) for task and track management. Context is stored in `.trackboi/`. Use Trackboi MCP tools if available.
- **AGENTS.md:** A detailed technical reference for agents is maintained at `AGENTS.md`.

## Instructions for Gemini

- **Refinement:** When modifying layouts, ensure consistency with the "Field Note" design system.
- **Validation:** Always verify changes by running `bundle exec jekyll build` if possible.
- **Front Matter:** Be meticulous with Liquid front matter, especially for pagination and breadcrumbs.
- **Respect Exclusions:** Do not attempt to process files listed in the `exclude` section of `_config.yml` as part of the Jekyll site build.
