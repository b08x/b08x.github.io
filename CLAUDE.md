# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Jekyll-based digital garden** implementing bidirectional linking (similar to Roam Research/Obsidian). The site is titled "syncopated notes" and is deployed via GitHub Pages.

**Tech Stack:**
- **Backend:** Jekyll 3.9+ (Ruby 3.3.8) with custom plugins
- **Frontend:** Tailwind CSS 4.x + PostCSS pipeline
- **Content:** Markdown notes with wiki-style `[[double bracket]]` links
- **Deployment:** GitHub Actions → GitHub Pages

## Development Commands

### Local Development

```bash
# Start development server with live reload
docker-compose up

# Or without Docker:
bundle install
npm install
bundle exec jekyll serve --livereload
```

Access the site at:
- Main site: http://localhost:4000
- Live reload: Port 35729

### Building

```bash
# Production build
npm install
bundle install
JEKYLL_ENV=production bundle exec jekyll build

# Output: _site/
```

### Linting

```bash
# Ruby linting
bundle exec rubocop

# Specific files
bundle exec rubocop _plugins/
```

### Content Management

```bash
# Create new note (using jekyll-compose)
bundle exec jekyll compose "Note Title"

# Creates: _notes/YYYY-MM-DD-note-title.md
```

## Architecture

### Custom Jekyll Plugins (_plugins/)

This is the core of the digital garden functionality. **Always read these plugins before modifying link or graph behavior.**

**bidirectional_links_generator.rb** (111 lines)
- Converts `[[Page Title]]` or `[[filename|label]]` syntax to HTML `<a>` tags
- Generates `notes_graph.json` for graph visualization
- Creates backlinks automatically
- **Pattern:** Uses regex to match note titles against double-bracket syntax across all content

**Key insight:** This plugin runs on every build and performs O(n²) comparisons (all notes × all notes) to find links. For large gardens (>100 notes), this can be slow.

**obsidian_callouts.rb** (47 lines)
- Converts Obsidian-style callout blocks to styled HTML
- Syntax: `> [!NOTE]`, `> [!WARNING]`, etc.

**Other plugins:**
- `empty_front_matter_note_injector.rb` - Auto-adds YAML front matter to notes without it
- `last_modified_at_generator.rb` - Tracks edit dates from Git history
- `markdown-highlighter.rb` - Syntax highlighting with Rouge
- `open_external_links_in_new_tab.rb` - Adds `target="_blank"` to external links

### Collections

**_notes/** - Digital garden content (primary collection)
- Permalink: `/:slug` (no `/notes/` prefix)
- Layout: `note.html` (includes graph, metadata, backlinks)

**_projects/** - Project showcase entries
- Permalink: `/:slug`

### Layouts (_layouts/)

**note.html** - The digital garden note template
- Includes interactive graph (`notes_graph.html`)
- Shows backlinks/references
- Displays metadata (date created, last modified)

**Theme System**
- Dual light/dark theme with localStorage persistence
- Managed by `assets/js/theme-manager.js`
- No FOUC: theme applied in `<head>` before render

### Styling Architecture

**Tailwind CSS 4.x** (utility-first)
- Config: `tailwind.config.js`
- Source: `assets/css/tailwind.css`
- Build: PostCSS pipeline (`postcss.config.js`)

**Sass partials (_sass/)**
- `_theme-variables.scss` - CSS custom properties for theming
- `_callouts.scss` - Obsidian-style callout blocks
- `_code.scss` - Code block styling

**Build order:** Sass → PostCSS → Tailwind → Autoprefixer

## Important Configuration

### _config.yml Key Settings

```yaml
# Collections
collections:
  notes:
    output: true
    permalink: /:slug  # No /notes/ prefix!

# Bidirectional link behavior
use_html_extension: false        # Links to /page not /page.html
open_external_links_in_new_tab: true

# Performance
postcss:
  cache: false  # Disable if CSS not updating

sass:
  style: compressed  # Minified CSS
```

### GitHub Actions Deployment

**Workflow:** `.github/workflows/jekyll.yml`

**Dependencies installed on CI:**
- System: `libvips-dev`, `imagemagick`, `jupyter-core`, `pandoc`
- Python: `nbconvert` (for Jupyter notebook support)
- Ruby: Bundler with caching
- Node: npm packages

**Build command:**
```bash
npm install && bundle install && jekyll build --baseurl "${{ base_path }}"
```

## Common Development Tasks

### Adding a New Plugin

1. Create `_plugins/your_plugin.rb`
2. Follow Jekyll plugin conventions (Generator, Converter, or Tag)
3. Run `rubocop _plugins/your_plugin.rb` before committing
4. Test locally: `bundle exec jekyll serve`

### Modifying Link Behavior

**Always check `_plugins/bidirectional_links_generator.rb` first.**

The plugin uses regex patterns to match:
1. `[[Note Title|custom label]]` - Link with custom label
2. `[[Note Title]]` - Link using note title

**Regex patterns:**
- Case-insensitive matching (`/i` flag)
- Handles spaces/underscores in filenames
- Matches against both filename and `title:` from front matter

### Debugging Graph Visualization

1. Check `_site/notes_graph.json` was generated
2. Verify `_includes/notes_graph.html` is included in layout
3. Inspect browser console for JavaScript errors
4. Graph data structure: `{ "edges": [...], "nodes": [...] }`

### Theme Modifications

**CSS variables:** Edit `_sass/_theme-variables.scss`
**Theme toggle:** Modify `assets/js/theme-manager.js`

**Important:** Theme choice is stored in `localStorage['theme']` as `'light'` or `'dark'`

## Docker Development

```bash
# Build container
docker-compose build

# Run with volume mounts (hot reload)
docker-compose up

# Rebuild after Gemfile/package.json changes
docker-compose down && docker-compose build --no-cache && docker-compose up
```

**Base image:** CentOS Stream 10
**Volumes:**
- `.:/srv/jekyll` - Project files
- `vendor_bundle:/srv/jekyll/vendor/bundle` - Ruby gems (persisted)
- `node_modules:/srv/jekyll/node_modules` - npm packages (persisted)

## Key Dependencies

**Jekyll Plugins (Gemfile):**
- `jekyll-last-modified-at` - Git-based modification dates
- `jekyll-jupyter-notebook` - Render `.ipynb` files
- `jekyll-pandoc` - Convert various formats via Pandoc
- `jekyll-postcss-v2` - PostCSS integration
- `jekyll-spaceship` - Enhanced Markdown (tables, diagrams)
- `jekyll_picture_tag` - Responsive images

**Node Packages:**
- `@tailwindcss/postcss` 4.1.12 - Tailwind v4 PostCSS plugin
- `@tailwindcss/typography` - Prose styling for Markdown
- `autoprefixer` - CSS vendor prefixes

## Notes on Bidirectional Links

**How it works:**
1. Jekyll loads all notes and pages
2. For each document, scan all other documents
3. Replace `[[title]]` patterns with `<a class="internal-link">` tags
4. Build graph data structure for visualization
5. Generate backlinks (pages that link to current page)

**Performance consideration:** O(n²) complexity means build time increases quadratically with note count.

**Link resolution priority:**
1. Exact match on `title:` from front matter
2. Filename match (case-insensitive, handles spaces/dashes)

**Example:**
```markdown
File: _notes/ruby-metaprogramming.md
Front matter: title: "Ruby Metaprogramming"

These all link to the same note:
- [[Ruby Metaprogramming]]
- [[ruby-metaprogramming]]
- [[ruby metaprogramming]]
```

## Content Guidelines

**Front matter template:**
```yaml
---
title: "Note Title"
tags: [tag1, tag2]
---
```

**Note:** If front matter is missing, `empty_front_matter_note_injector.rb` adds it automatically.

**Callout syntax:**
```markdown
> [!NOTE]
> This is a note callout

> [!WARNING]
> This is a warning callout
```

Available callout types: NOTE, TIP, IMPORTANT, WARNING, CAUTION

## Ruby Environment

**Version:** 3.3.8 (specified in `.ruby-version`)
**RVM gemset:** `b08xgithubio`
**RuboCop target:** Ruby 3.4

```bash
# Switch to correct Ruby version
rvm use 3.3.8@b08xgithubio
```
