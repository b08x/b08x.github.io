# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup and Installation
```bash
# Install Ruby dependencies
bundle install

# Serve site locally for development
bundle exec jekyll serve

# Serve site with suppressed Nokogiri warning (optional)
bundle exec jekyll serve 2>/dev/null

# Serve site including draft posts
bundle exec jekyll serve --drafts

# Build the site for production
bundle exec jekyll build --baseurl ""
```

### Linting and Code Quality
```bash
# Run RuboCop for Ruby code linting
bundle exec rubocop

# Run RuboCop with auto-correction
bundle exec rubocop -a
```

### Development Environment
- Ruby version: 3.4.4 (specified in .ruby-version)
- Uses RVM for Ruby version management (.ruby-gemset file present)
- Development server runs on default Jekyll port (4000)

## Architecture Overview

### Site Structure
This is a Jekyll-based personal website/portfolio with the following key characteristics:

**Content Collections:**
- `_posts/` - Blog posts with automatic layout assignment
- `_notes/` - Notes collection with bidirectional linking support
- `_projects/` - Project portfolio items  
- `_pages/` - Static pages (about, etc.)
- `_drafts/` - Draft posts (not published, use --drafts flag to preview)

**Layout System:**
- `default.html` - Base layout template
- `home.html` - Homepage layout
- `post.html`, `note.html`, `page.html`, `project.html` - Content-specific layouts

**Plugin Architecture:**
- Custom bidirectional links generator for note interconnections
- Tweet embedding with privacy controls
- External link handling (opens in new tabs)
- Jupyter notebook integration
- React player for media content
- Image processing with jekyll_picture_tag
- Jekyll Paginate V2 for advanced pagination (10 posts per page, configured)

### Key Features

**Content Processing:**
- Kramdown markdown processor
- Mermaid diagram support with dark theme
- Pagination (10 items per page)
- Jupyter notebook rendering
- Asciinema terminal recording embeds

**Styling:**
- Sass preprocessing with compression
- Custom styles in `_sass/` directory
- Responsive image generation in `assets/img/generated/`

**Deployment:**
- GitHub Actions workflow for automatic deployment
- Deploys to GitHub Pages from main branch
- Requires libvips-dev and libopenslide-dev system dependencies

## Known Issues

### Nokogiri libxml Version Warning
- **Warning**: "Nokogiri was built against libxml version 2.13.8, but has dynamically loaded 2.14.4"
- **Impact**: Cosmetic only - does not affect site functionality
- **Cause**: Minor version mismatch between compiled and system libxml
- **Solution**: Warning can be suppressed using `2>/dev/null` or ignored safely

### Development Patterns

**File Organization:**
- Layouts use modular includes from `_includes/`
- Notebook-specific includes in `_includes/notebook/`
- Site data stored in `_data/picture.yml` for image processing
- Custom plugins in `_plugins/` directory

**Content Conventions:**
- Front matter defaults automatically assign layouts based on collection
- Notes support bidirectional linking between files
- External links automatically open in new tabs
- Tweet URLs can be embedded (currently disabled for privacy)

**Build Process:**
- Uses bundle exec for all Jekyll commands
- Production builds set JEKYLL_ENV=production
- Assets are processed and optimized during build
- Site excludes development files and caches from output