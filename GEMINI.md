# Project: Syncopated Notes

## Overview

This is a **Jekyll**-based website hosting "Syncopated Notes" (a personal landing page and blog). The site is built with a focus on a "Field Note" aesthetic—cream/parchment palette, dark ink text, and monospace typography.

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
- `_notes/`: Custom collection of "irregular notes" rendered at `/notes/:path/` (`output: true`). Displayed on the home page grid (not paginated, sorted by title).
- `_projects/`: Custom collection rendered at `/:path/` (`output: true`). Contains standalone pages like `skiing-smokers-game.html` (`_projects/fun/`, using `layout: none`). Entries with `card: true` appear on the home page grid.
- `_posts/`: Standard Jekyll blog posts, paginated on the home page.
- `_layouts/`:
  - `default.html`: Base HTML shell that loads head, header, nav, and footer includes.
  - `notes.html`: Light-theme base layout (chains to `default`) providing container, card grid, and pager styles.
  - `home.html`: Landing page layout (chains to `notes`), rendering filtered notes/projects and paginated posts.
  - `post.html`: Layout for blog posts (chains to `notes`).
  - `project.html`: Default wrapper for `_projects/` collection entries (chains to `notes`).

- `_includes/`:
  - `theme-tokens.html`: **Critical File.** Contains the design system's CSS variables and reusable components (badges, field-notes, post typography, code panels, etc.).


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

- **Notes Collection (`_notes/`):** Custom collection rendered at `/notes/:path/`. Front matter uses `title`, `description`, and `tags[]`. On the home page, notes are displayed sorted by title (`sort: "title"`). Vestigial `order`, `link`, and `badge_class` fields are no longer used. Notes are not paginated.
- **Projects Collection & Data (`_data/projects.yml` / `_projects/`):** `_data/projects.yml` is the canonical registry of projects (internal & external). To display on the home page grid, set `card: true`. Dedicated projects showcase is at `/projects/` (`projects.html`), featuring real-time JS category filtering and accessible card layouts. Internal generated pages live under `_projects/` collection (`output: true`, `permalink: /:path/`).

- **Blog Posts (`_posts/`):** Standard Jekyll format (`YYYY-MM-DD-title.md`). Layout is automatically set to `post` via `_config.yml` defaults. Only blog posts are paginated on the landing page (`jekyll-paginate-v2`, accessed via `paginator.posts`).
- **Links:** Prefer root-relative links. `baseurl` is empty in `_config.yml`.
- **CSS/JS:** Prefer inline `<style>` and `<script>` blocks for page-specific logic to keep pages self-contained. Shared styles live in `_layouts/*.html` and `_includes/theme-tokens.html`. No external CSS or JS frameworks.

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
