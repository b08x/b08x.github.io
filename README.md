# Syncopated Notes

A digital garden built with Jekyll, featuring a dark terminal aesthetic and bidirectional linking for knowledge management.

![Terminal Theme](https://img.shields.io/badge/theme-dark%20terminal-ff6600)
![Jekyll](https://img.shields.io/badge/jekyll-4.3+-red)
![Tailwind CSS](https://img.shields.io/badge/tailwind-4.x-38bdf8)
![Ruby](https://img.shields.io/badge/ruby-3.3.8-CC342D)

## 🎨 Theme

This digital garden features a **dark terminal aesthetic** inspired by IDE and terminal interfaces, designed for optimal readability during extended reading sessions.

### Design System

**Color Palette:**
- Background: `#0a0a0a` (nearly black)
- Surface: `#111111` (component backgrounds)
- Border: `#333333` (subtle borders)
- Text: `#e5e5e5` (light gray, reduced eye strain)
- Accent: `#ff6600` (warm orange for links and highlights)

**Typography:**
- **UI Elements** (navigation, TOC, metadata): JetBrains Mono (monospace)
- **Article Content** (prose, headings): Inter (readable sans-serif)
- **Code Blocks**: JetBrains Mono with syntax highlighting

**Layout:**
- Dual-sidebar design on desktop (>1024px)
- Single-column responsive layout on mobile
- Sticky table of contents with active section tracking
- Fixed header with site branding and navigation

## ✨ Features

### Core Functionality

- **Bidirectional Linking**: Use `[[Page Title]]` syntax to link between notes
- **Automatic Backlinks**: Shows which notes link to the current note
- **Knowledge Graph**: Interactive visualization of note connections
- **Smart TOC**: Intersection Observer-based table of contents with smooth scrolling
- **Recent Notes Sidebar**: Quick navigation to recently modified notes
- **Obsidian-Style Callouts**: 12+ callout types (note, warning, tip, success, etc.)
- **Code Block Copy Buttons**: One-click code copying with visual feedback
- **Responsive Design**: Mobile-first, collapses to single column on small screens

### Content Support

- Markdown notes with front matter
- Jupyter notebooks (`.ipynb` files)
- Pandoc conversion for various formats
- Syntax highlighting with Rouge
- Embedded media (images, audio, tweets, videos)
- Mathematical notation support
- Table of contents generation
- SEO optimization with meta tags

## 🛠️ Technology Stack

### Backend

- **Jekyll 3.9+**: Static site generator
- **Ruby 3.3.8**: Runtime environment
- **RVM**: Ruby version management with `b08xgithubio` gemset
- **Custom Plugins** (Ruby):
  - `bidirectional_links_generator.rb`: Core wiki-link functionality
  - `obsidian_callouts.rb`: Callout block rendering
  - `last_modified_at_generator.rb`: Git-based modification tracking
  - `empty_front_matter_note_injector.rb`: Auto-metadata generation

### Frontend

- **Tailwind CSS 4.x**: Utility-first styling framework
- **PostCSS**: CSS processing pipeline with autoprefixer
- **Sass/SCSS**: CSS preprocessing for theme variables
- **Web Components**: Shadow DOM-based interactive elements
- **Vanilla JavaScript**: Theme management and interactivity

### Development Tools

- **RuboCop**: Ruby linting (target: Ruby 3.4)
- **Bundler**: Ruby dependency management
- **npm**: Node.js package management
- **Docker/Podman**: Containerized development environment
- **GitHub Actions**: CI/CD pipeline for automated deployment

### Key Dependencies

**Jekyll Plugins:**
- `jekyll-last-modified-at`: Git-based modification dates
- `jekyll-jupyter-notebook`: Render Jupyter notebooks
- `jekyll-pandoc`: Format conversion
- `jekyll-postcss-v2`: PostCSS integration
- `jekyll-spaceship`: Enhanced Markdown features
- `jekyll_picture_tag`: Responsive images
- `jekyll-seo-tag`: SEO metadata

**Node Packages:**
- `@tailwindcss/postcss@4.1.12`: Tailwind v4 PostCSS plugin
- `@tailwindcss/typography@0.5.19`: Prose styling
- `autoprefixer@10.4.22`: CSS vendor prefixes

## 🚀 Quick Start

### Prerequisites

- Ruby 3.3.8 (managed via RVM)
- Node.js and npm
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/b08x/b08x.github.io.git
cd b08x.github.io

# Install Ruby dependencies
bundle install

# Install Node dependencies
npm install

# Start the development server
bundle exec jekyll serve --livereload

# Site will be available at http://localhost:4000
# Live reload server runs on port 35729
```

### Docker Development

```bash
# Start containerized development environment
docker-compose up

# Rebuild after dependency changes
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Production Build

```bash
# Build for production
JEKYLL_ENV=production bundle exec jekyll build

# Output directory: _site/
```

## 📝 Creating Content

### Adding a New Note

```bash
# Using jekyll-compose
bundle exec jekyll compose "Note Title"

# Creates: _notes/YYYY-MM-DD-note-title.md
```

### Front Matter Template

```yaml
---
title: "Your Note Title"
tags: [tag1, tag2]
---

Your content here...
```

### Bidirectional Links

```markdown
Link to another note: [[Ruby Metaprogramming]]
Link with custom text: [[ruby-metaprogramming|Click here]]
```

**How it works:**
1. Jekyll scans all notes during build
2. Replaces `[[title]]` with HTML anchor tags
3. Automatically generates backlinks
4. Creates knowledge graph visualization

### Callout Syntax

```markdown
> [!NOTE]
> This is an informational callout

> [!WARNING]
> This is a warning callout

> [!TIP]
> This is a tip callout
```

**Available types:** note, abstract, info, todo, tip, success, question, warning, failure, example, quote

## 🏗️ Architecture

### Directory Structure

```
b08x.github.io/
├── _config.yml              # Jekyll configuration
├── _notes/                  # Digital garden content
├── _layouts/
│   └── terminal-note.html   # Dual-sidebar note layout
├── _includes/
│   ├── terminal-header.html # Site header
│   ├── terminal-sidebar.html # Navigation sidebar
│   └── notes_graph.html     # Graph visualization
├── _plugins/                # Custom Ruby plugins
├── _sass/                   # Sass stylesheets
│   ├── _theme-variables.scss # Dark terminal color system
│   ├── _callouts.scss       # Callout styling
│   └── _code.scss           # Syntax highlighting
├── assets/
│   ├── css/
│   │   └── tailwind.css     # Tailwind framework
│   └── js/
│       └── components/
│           └── terminal-toc.js # Interactive TOC Web Component
└── _site/                   # Generated output (git-ignored)
```

### Bidirectional Links Architecture

**Processing Pipeline:**
1. `bidirectional_links_generator.rb` runs during Jekyll build
2. Performs O(n²) comparison: all notes × all notes
3. Regex matches `[[title]]` patterns against note titles and filenames
4. Generates `notes_graph.json` with nodes and edges
5. Creates backlinks data structure

**Link Resolution Priority:**
1. Exact match on `title:` from front matter
2. Filename match (case-insensitive, handles spaces/dashes)

**Performance Note:** Build time increases quadratically with note count. For large gardens (>100 notes), consider optimization.

### Layout System

**Desktop (>1024px):**
```
┌──────────────────────────────────────────────────┐
│              HEADER (fixed)                      │
├──────────┬─────────────────────────┬─────────────┤
│  NAV     │   MAIN CONTENT         │    TOC      │
│ (256px)  │   (max-w-4xl)          │  (192px)    │
│          │                        │   sticky    │
│ Recent   │ • Article header       │ On This     │
│ Notes    │ • Prose content        │ Page        │
│          │ • Graph visualization  │             │
└──────────┴─────────────────────────┴─────────────┘
```

**Mobile (<768px):**
- Single column layout
- Sidebars hidden
- Full-width content
- Hamburger menu for navigation

### Web Components

**terminal-toc.js:**
- Shadow DOM encapsulation for style isolation
- Intersection Observer monitors h2/h3 elements
- Smooth scroll with `history.pushState()` (no jump)
- Active section highlighting with orange accent
- Sticky positioning within right sidebar

## 🌐 Deployment

### GitHub Pages (Current)

Deployed via GitHub Actions workflow (`.github/workflows/jekyll.yml`):

```yaml
# Triggers on push to main or manual dispatch
# Installs system dependencies (vips, imagemagick, jupyter, pandoc)
# Runs: npm install && bundle install && jekyll build
# Deploys to GitHub Pages
```

**Live Site:** `https://b08x.github.io`

### Alternative: Netlify

```bash
# Build command
npm install && bundle install && jekyll build

# Publish directory
_site
```

## 🔧 Configuration

### Jekyll (_config.yml)

```yaml
title: syncopated notes
collections:
  notes:
    output: true
    permalink: /:slug

defaults:
  - scope:
      path: "_notes/**/*.md"
    values:
      layout: "terminal-note"
```

### Tailwind (tailwind.config.js)

```javascript
theme: {
  extend: {
    fontFamily: {
      mono: ['"JetBrains Mono"', 'monospace'],
      prose: ['"Inter"', 'sans-serif'],
    },
    colors: {
      bg: '#0a0a0a',
      accent: '#ff6600',
      // ... terminal palette
    },
  }
}
```

### Ruby Environment

```bash
# Ruby version: 3.3.8
# RVM gemset: b08xgithubio
rvm use 3.3.8@b08xgithubio

# RuboCop target: Ruby 3.4
```

## 🎯 Performance Considerations

### Build Time
- **Bidirectional links**: O(n²) complexity
- **Mitigation**: Incremental builds with `--incremental`
- **Recommendation**: For >100 notes, consider caching strategies

### Asset Optimization
- **CSS**: Compressed Sass output
- **Fonts**: Google Fonts with preconnect
- **Images**: Responsive images via `jekyll_picture_tag`
- **JavaScript**: Deferred script loading

### Browser Support
- Modern browsers (last 2 versions)
- Web Components support required for TOC
- CSS Grid and Flexbox required for layout

## 📚 Documentation

- **CLAUDE.md**: Development guide for AI assistants
- **Inline comments**: Component-level documentation
- **Plugin docstrings**: Ruby plugin documentation

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `bundle exec rubocop`
4. Test build: `bundle exec jekyll build`
5. Commit with descriptive message
6. Create pull request

## 📄 License

Source code is available under the [MIT license](LICENSE.md).

Based on [digital-garden-jekyll-template](https://github.com/maximevaillancourt/digital-garden-jekyll-template) by Maxime Vaillancourt.

---

**Built with ❤️ using Jekyll, Tailwind CSS, and Ruby**
