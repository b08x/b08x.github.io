# Syncopated Notes

[![Deploy Jekyll site to Pages](https://github.com/b08x/b08x.github.io/actions/workflows/jekyll.yml/badge.svg)](https://github.com/b08x/b08x.github.io/actions/workflows/jekyll.yml)

> A digital garden experiment integrating React islands with Jekyll, exploring the intersection of static site generation and modern interactive components.


## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
  - [Jekyll Foundation](#jekyll-foundation)
  - [React Island Architecture](#react-island-architecture)
  - [Custom Jekyll Plugins](#custom-jekyll-plugins)
  - [Wiki System](#wiki-system)
- [Key Technologies](#key-technologies)
- [Component Library](#component-library)
- [Content Creation](#content-creation)
  - [Writing Notes](#writing-notes)
  - [Creating Wiki Pages](#creating-wiki-pages)
  - [Using React Components](#using-react-components)
- [Customization](#customization)
  - [Theming](#theming)
  - [Adding New Components](#adding-new-components)
  - [Custom Plugins](#custom-plugins)
- [Deployment](#deployment)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)





## Overview

![Terminal Theme](https://img.shields.io/badge/theme-dark%20terminal-ff6600)
![Jekyll](https://img.shields.io/badge/jekyll-4.3+-red)
![React](https://img.shields.io/badge/react-19-61DAFB)
![esbuild](https://img.shields.io/badge/build-esbuild-FFCF00)
![Tailwind CSS](https://img.shields.io/badge/tailwind-4.x-38bdf8)

**Syncopated Notes** is a digital garden built on Jekyll with React islands for interactive components. It combines the simplicity and SEO benefits of static site generation with the rich interactivity of modern JavaScript frameworks.

The site is designed as a personal knowledge base and note-taking system, featuring:
- A collection of markdown notes with bidirectional linking
- An interactive wiki system with pagination
- Rich media support (video, audio, diagrams)
- Syntax-highlighted code blocks with copy functionality
- Interactive knowledge base carousels
- Graph visualization of note connections

**Built with vibe-coding principles using `claude-code` and `gemini-cli`**, this project represents an experiment in AI-assisted development and progressive enhancement.

**Base Template:** [Digital Garden Jekyll Template](https://github.com/maximevaillancourt/digital-garden-jekyll-template)

---

## Key Features

### Content Management
- **Digital Garden Notes**: Markdown-based notes with automatic bidirectional linking
- **Wiki System**: Multi-page wikis with automated pagination (12 items/page)
- **Rich Media**: Embedded video tutorials, audio players, and interactive diagrams
- **Code Highlighting**: Syntax highlighting for 19+ programming languages with copy-to-clipboard
- **Search**: Command palette search (Cmd/Ctrl+K) with real-time filtering

### Interactive Components
- **React Islands**: Progressive enhancement with island architecture
- **18 React Components**: From simple code blocks to complex video players and canvas viewers
- **Interactive Diagrams**: Zoomable/pannable Mermaid diagrams and D3 force graphs
- **Theme Awareness**: Automatic dark/light mode synchronization
- **Accessibility**: Full keyboard navigation, ARIA labels, screen reader support

### Jekyll Enhancements
- **11 Custom Plugins**: Bidirectional links, Obsidian callouts, wiki generation, and more
- **17 Layout Templates**: Specialized layouts for different content types
- **Automatic Processing**: Code block enhancement, Mermaid diagram rendering
- **SEO Optimization**: Jekyll SEO tags, sitemaps, RSS feeds

### Developer Experience
- **TypeScript**: Full type safety for React components
- **Live Reload**: Instant preview with Jekyll LiveReload + esbuild watch mode
- **Modern Build Tools**: esbuild for JavaScript, Tailwind CSS for styling
- **Extensive Documentation**: Component README with comprehensive API docs

---

## Quick Start

### Prerequisites

**Required:**
- Ruby 3.0+ with Bundler
- Node.js 18+ with npm
- Git

<!-- Removed Netlify CLI -->

### Installation

```bash
# Clone the repository
git clone https://github.com/b08x/b08x.github.io.git
cd b08x.github.io

# Install Ruby dependencies
bundle install

# Install Node dependencies
npm install
```

### Development

Run concurrent development servers:

```bash
# Terminal 1: React component watcher (esbuild)
npm run watch:js

# Terminal 2: Jekyll development server with LiveReload
npm run dev:jekyll
```

Or use the combined command:

```bash
npm run dev
```

Visit `http://localhost:4000` to see your site.

### Building for Production

```bash
# Build React components
npm run build:js

# Build Jekyll site
npm run build:jekyll

# Or build everything
npm run build
```

Output will be in `_site/` directory.

---

## Project Structure

```
b08x.github.io/
├── AGENTS.md                   # Root project knowledge base ✓
├── _config.yml                 # Jekyll configuration
├── package.json                # Node dependencies & scripts
├── Gemfile                     # Ruby dependencies
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
│
├── _layouts/                   # Jekyll layout templates (17 files) → [_layouts/AGENTS.md]
│   ├── default.html            # Base layout
│   ├── home.html               # Homepage layout
│   ├── terminal-note.html      # Note detail view
│   ├── wiki.html               # Wiki index with pagination
│   ├── wiki-page.html          # Wiki detail view
│   └── ...                     # Other specialized layouts
│
├── _includes/                  # Reusable Jekyll partials → [_includes/AGENTS.md]
│   └── page_sidebar/           # Sidebar components
│
├── _plugins/                   # Custom Jekyll plugins (11 files) → [_plugins/AGENTS.md]
│   ├── bidirectional_links_generator.rb
│   ├── wiki_page_generator.rb  # Wiki pagination system
│   ├── obsidian_callouts.rb
│   └── ...
│
├── _sass/                      # Sass stylesheets → [_sass/AGENTS.md]
│
├── _notes/                     # Markdown notes (digital garden)
│   ├── *.md                    # Individual notes
│   └── nlp-ai-notebook-example/
│
├── _data/                      # Jekyll data files
│   └── wikis/                  # Wiki JSON data
│       └── *.json              # Wiki page collections
│
├── _pages/                     # Static pages
│   ├── index.md                # Homepage
│   ├── about.md                # About page
│   └── ...
│
├── src/                        # React components source
│   ├── main.tsx                # Component registry & island hydration
│   ├── components/             # React components (18 files) → [src/components/AGENTS.md]
│   │   ├── CodeBlock.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── MermaidViewer.tsx
│   │   ├── KnowledgebaseCarousel.tsx
│   │   └── ...
│   └── utils/                  # Utility functions → [src/utils/AGENTS.md]
│       └── syntaxTheme.ts      # Syntax theme selector
│
├── assets/                     # Static assets
│   ├── css/                    # Compiled CSS
│   ├── js/                     # JavaScript bundles
│   │   └── dist/
│   │       └── garden-widgets.js  # React component bundle
│   ├── fonts/                  # Custom fonts (Mononoki, Hack)
│   ├── audio/                  # Audio files
│   └── videos/                 # Video files
│
└── README.md                   # This file
```

**Documentation Navigation:**
- [./AGENTS.md](./AGENTS.md) - Root project knowledge base
- [_layouts/AGENTS.md](_layouts/AGENTS.md) - Layout templates hierarchy
- [_includes/AGENTS.md](_includes/AGENTS.md) - Reusable partials and sidebar widgets
- [_plugins/AGENTS.md](_plugins/AGENTS.md) - Custom Jekyll plugins
- [_sass/AGENTS.md](_sass/AGENTS.md) - Theme system and CSS variables
- [src/components/AGENTS.md](src/components/AGENTS.md) - React island components
- [src/utils/AGENTS.md](src/utils/AGENTS.md) - TypeScript utilities for theme sync

---

## Architecture

### Jekyll Foundation

**Jekyll** serves as the static site generator, converting markdown files to HTML:
- **Collections**: Notes (`_notes`) and projects (`_projects`)
- **Plugins**: Custom Ruby plugins extend Jekyll functionality
- **Liquid Templates**: Dynamic content rendering with Jekyll/Liquid syntax
- **Front Matter**: YAML metadata for pages and posts

**Key Configurations** (`_config.yml`):
- `permalink: pretty` - Clean URLs without `.html` extensions
- `collections` - Notes and projects output as pages
- `exclude` - Ignores build artifacts and development files

### React Island Architecture

The project uses **island architecture** for progressive enhancement:

> **See [src/components/AGENTS.md](src/components/AGENTS.md) for component patterns, island registration, and theming conventions.**

```
┌─────────────────────────────────────────────────┐
│ Static HTML (Jekyll-generated)                  │
│                                                  │
│  ┌──────────────┐    ┌──────────────┐           │
│  │ React Island │    │ React Island │           │
│  │ (CodeBlock)  │    │ (VideoPlayer)│           │
│  └──────────────┘    └──────────────┘           │
│                                                  │
│  Static content                                  │
│                                                  │
│  ┌──────────────┐                               │
│  │ React Island │                               │
│  │ (GraphView)  │                               │
│  └──────────────┘                               │
└─────────────────────────────────────────────────┘
```

**How It Works:**
1. Jekyll generates static HTML with `data-island` markers
2. Browser loads page with static content (instant, SEO-friendly)
3. `garden-widgets.js` loads asynchronously
4. Component registry scans for `[data-island]` elements
5. React hydrates only marked elements, preserving surrounding HTML

**Benefits:**
- **Fast Initial Load**: No JavaScript required for first paint
- **SEO-Friendly**: Search engines see complete HTML
- **Progressive Enhancement**: Works without JS, enhanced with it
- **Selective Interactivity**: React only where needed

**Example Island:**
```html
<!-- Jekyll generates this -->
<div data-island="CodeBlock" data-props='{
  "code": "console.log(\"Hello\");",
  "language": "javascript"
}'></div>

<!-- React hydrates it to interactive component -->
```

### Custom Jekyll Plugins

**11 Custom Plugins** extend Jekyll functionality:

> **See [_plugins/AGENTS.md](_plugins/AGENTS.md) for plugin types, generator patterns, and anti-patterns.**

| Plugin                                | Purpose                                    | LOC  |
|---------------------------------------|--------------------------------------------|------|
| `wiki_page_generator.rb`              | Generates paginated wiki indices from JSON | ~352 |
| `bidirectional_links_generator.rb`    | Creates automatic backlinks between notes  | ~114 |
| `obsidian_callouts.rb`                | Converts Obsidian-style callouts to HTML   | ~100 |
| `empty_front_matter_note_injector.rb` | Adds front matter to notes without it      | ~50  |
| `last_modified_at_generator.rb`       | Tracks file modification dates             | ~75  |
| `markdown-highlighter.rb`             | Enhanced markdown syntax highlighting      | ~100 |
| `open_external_links_in_new_tab.rb`   | Opens external links in new tabs           | ~50  |
| `embed_tweets.rb`                     | Embeds Twitter content                     | ~75  |
| `render_liquid.rb`                    | Renders Liquid tags in markdown content    | ~50  |
| `base64_filter.rb`                    | Base64 encoding filter for templates       | ~30  |
| `jekyll-react-player.rb`              | React player integration plugin            | ~40  |

**Featured Plugin: Wiki Page Generator**

Transforms wiki data from JSON into paginated static pages:

```ruby
# Configuration
ITEMS_PER_PAGE = 12  # Pages per index

# Input: _data/wikis/example.json
{
  "metadata": { "repository": "...", "page_count": 32 },
  "pages": [/* wiki entries */]
}

# Output:
# - /wikis/example/index.html (page 1)
# - /wikis/example/page/2/index.html (page 2)
# - /wikis/example/{page_slug}/index.html (detail pages)
```

See [Wiki Pagination Architecture](#wiki-system) for details.

### Wiki System

The wiki system provides scalable pagination for large content collections:

> **See [_plugins/AGENTS.md](_plugins/AGENTS.md) for wiki pagination configuration, reserved slugs, and generator behavior.**

**Architecture Components:**
1. **Generator Plugin** (`_plugins/wiki_page_generator.rb`)
   - Reads wiki data from `_data/wikis/{wiki_id}.json`
   - Creates paginated index pages (12 items/page)
   - Generates individual wiki entry detail pages
   - Prevents slug conflicts with reserved words

2. **Wiki Layout** (`_layouts/wiki.html`)
   - Terminal-aesthetic grid layout (1-4 columns responsive)
   - Pagination controls (Previous/Next + page indicator)
   - Project metadata header
   - Card-based display with importance badges and excerpts

3. **Data Flow**:
   ```
   JSON Data → Generator Plugin → Front Matter → Liquid Template → Static HTML
   ```

**Front Matter Example:**
```yaml
layout: wiki
title: "Example Wiki"
wiki_id: "example"
pagination:
  current_page: 1
  total_pages: 3
  has_next: true
  next_page_url: "/wikis/example/page/2/"
pages:
  - id: "page-1"
    title: "Page Title"
    excerpt: "First 200 chars..."
    importance: "high"
    url: "/wikis/example/page-1/"
```

**User Experience:**
- **Header**: Shows wiki scope, repository link, generation date
- **Grid**: Card-based display with importance badges
- **Pagination**: Previous/Next buttons with page number
- **Accessibility**: Full keyboard navigation, ARIA labels

---

## Key Technologies

### Frontend
| Technology                   | Version | Purpose                          |
|------------------------------|---------|----------------------------------|
| **Jekyll**                   | 4.x     | Static site generator            |
| **React**                    | 19.2.3  | UI components (island hydration) |
| **TypeScript**               | 5.9.3   | Type safety                      |
| **Tailwind CSS**             | 4.1.17  | Utility-first styling            |
| **esbuild**                  | 0.27.2  | JavaScript bundler               |
| **D3.js**                    | 7.9.0   | Data visualization               |
| **Mermaid**                  | 11.12.2 | Diagram generation               |
| **react-syntax-highlighter** | 15.6.0  | Code syntax highlighting         |

### Backend (Build-Time)
| Technology         | Version | Purpose                    |
|--------------------|---------|----------------------------|
| **Ruby**           | 3.0+    | Jekyll runtime             |
| **Bundler**        | -       | Ruby dependency management |
| **Jekyll Plugins** | Various | Custom functionality       |
| **Nokogiri**       | -       | HTML parsing               |
| **Rouge**          | -       | Syntax highlighting        |

### Build Tools
- **npm-run-all**: Parallel script execution
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

---

## Component Library

**18 Interactive React Components** with 4,084 total lines of code.

**See [src/components/README.md](src/components/README.md) or [src/components/AGENTS.md](src/components/AGENTS.md)** for comprehensive documentation including:
- Component APIs and props interfaces
- Usage examples with code snippets
- Architecture patterns (island hydration, theme sync)
- Accessibility features
- Troubleshooting guides

**Component Overview:**

| Component                 | LOC  | Purpose                                      |
|---------------------------|------|----------------------------------------------|
| **KnowledgebaseCarousel** | 498  | H2-based content carousel with keyboard nav  |
| **JsonCanvasViewer**      | 483  | Canvas file visualization and editing        |
| **VideoPlayer**           | 410  | HLS video with segments, actions, transcript |
| **CodeBlock**             | 325  | Syntax-highlighted code with copy button     |
| **GraphView**             | 312  | D3 force-directed graph visualization        |
| **MermaidViewer**         | 280  | Interactive Mermaid diagrams with zoom/pan   |
| **MermaidModal**          | 249  | Full-screen Mermaid diagram modal            |
| **NotesGrid**             | 221  | Grid display for notes with detail view      |
| **SearchCmdK**            | 153  | Command palette search (Cmd+K)               |
| **AudioPlayer**           | 144  | Audio playback with waveform                 |
| **NotebookGuide**         | 112  | Guide/tutorial assistance                    |
| **CanvasControls**        | ~150 | Canvas viewer control panel                  |
| **CanvasExporter**        | ~120 | Canvas export functionality                  |
| **CanvasMinimap**         | ~100 | Canvas minimap navigation                    |
| **OutputPanel**           | ~80  | Canvas output display                        |
| **NodeEditor**            | ~200 | Canvas node editing                          |
| **ReactPlayerIsland**     | ~50  | React player wrapper component               |
| **HelloGarden**           | 13   | Demo/test component                          |

---

## Content Creation

### Writing Notes

Notes are markdown files in `_notes/` directory with YAML front matter:

```markdown
---
title: My Note Title
tags: [ruby, programming, web]
---

# My Note Title

This is the content of my note.

## Bidirectional Links

Link to other notes with [[Note Title]] syntax.

## Features
- Automatic bidirectional linking
- Tag organization
- Last modified tracking
- Graph visualization
```

**Features:**
- **Bidirectional Links**: `[[Note Title]]` creates automatic backlinks
- **Front Matter**: Optional YAML metadata (title, tags, date)
- **Obsidian Compatibility**: Supports Obsidian-style callouts
- **Auto-Enhancement**: Code blocks upgraded to interactive CodeBlock islands

### Creating Wiki Pages

Add wiki data to `_data/wikis/{wiki-id}.json`:

```json
{
  "metadata": {
    "repository": "https://github.com/user/repo",
    "generated_at": "2026-01-03T00:00:00Z",
    "page_count": 12
  },
  "pages": [
    {
      "id": "unique-id",
      "title": "Page Title",
      "content": "Full markdown or HTML content...",
      "importance": "high",
      "relatedPages": ["other-page-id"],
      "filePaths": ["src/file.py"]
    }
  ]
}
```

Then rebuild:
```bash
jekyll build
```

Output:
- Index pages: `/wikis/{wiki-id}/`, `/wikis/{wiki-id}/page/2/`, ...
- Detail pages: `/wikis/{wiki-id}/{page-slug}/`

### Using React Components

Embed React islands in any Jekyll page:

```html
<!-- Simple component -->
<div data-island="HelloGarden" data-props='{"name": "Developer"}'></div>

<!-- Complex component with Jekyll data -->
{% assign videoProps = page.video | jsonify %}
<div data-island="VideoPlayer" data-props='{{ videoProps }}'></div>

<!-- Code block (auto-enhanced from Rouge) -->
```javascript
const greeting = "Hello, World!";
console.log(greeting);
```
```

**Available Components:**
See [Component Library](#component-library) or [src/components/README.md](src/components/README.md)

---

## Customization

### Theming

Themes use CSS variables defined in `tailwind.config.js`:

> **See [_sass/AGENTS.md](_sass/AGENTS.md) for CSS variable definitions, dark mode overrides, and terminal aesthetic guidelines.**

```css
:root {
  --foreground: ...;     /* Primary text */
  --background: ...;     /* Page background */
  --accent: ...;         /* Primary accent */
  --border: ...;         /* Border color */
  --muted: ...;          /* Secondary text */
}

.dark {
  /* Dark mode overrides */
}
```

**Custom Fonts:**
- **Mono**: Mononoki, Hack (for code and terminal aesthetic)
- **Sans**: System UI fonts
- **Prose**: Georgia (for long-form content)

**Terminal Aesthetic Guidelines:**
- Monospace fonts for UI elements
- Border-based design (1px solid borders)
- High contrast (WCAG AA minimum)
- Rounded corners with `rounded-lg`

### Adding New Components

See [src/components/README.md](src/components/README.md) or [src/components/AGENTS.md](src/components/AGENTS.md) for step-by-step guide.

**Quick steps:**
1. Create `src/components/MyComponent.tsx`
2. Register in `src/main.tsx`
3. Build: `npm run build:js`
4. Use: `<div data-island="MyComponent" data-props='...'></div>`

### Custom Plugins

Add Ruby plugins to `_plugins/` directory:

```ruby
module Jekyll
  class MyPlugin < Generator
    def generate(site)
      # Plugin logic
    end
  end
end
```

Rebuild Jekyll to activate.

---

## Deployment

### GitHub Pages (Recommended)

This site is configured for automatic deployment to GitHub Pages via GitHub Actions.

**Deployment Process:**
1. Push changes to the `main` branch.
2. The [Deploy Jekyll site to Pages](.github/workflows/jekyll.yml) workflow triggers automatically.
3. The workflow builds React components (`npm run build`), then builds the Jekyll site.
4. The site is deployed to GitHub Pages.

### Manual Deployment

```bash
# Build production assets
npm run build

# Upload _site/ directory to hosting
rsync -avz _site/ user@server:/var/www/html/
```

---

## Development Workflow

### Typical Development Session

```bash
# 1. Start development servers
npm run dev  # or separate terminals for watch:js + dev:jekyll

# 2. Edit content
# - Create/edit notes in _notes/
# - Modify React components in src/components/ → See [src/components/AGENTS.md](src/components/AGENTS.md)
# - Update Jekyll layouts in _layouts/ → See [_layouts/AGENTS.md](_layouts/AGENTS.md)
# - Edit partials in _includes/ → See [_includes/AGENTS.md](_includes/AGENTS.md)

# 3. Preview changes
# - Visit http://localhost:4000
# - LiveReload auto-refreshes on save

# 4. Test in both themes
# - Toggle dark/light mode in browser

# 5. Build for production
npm run build
```

### Debugging

**Browser Console:**
Look for `[Garden]` logs showing island mounting:
```
[Garden] Found 3 islands to mount
[Garden] Attempting to mount island: CodeBlock
[Garden] Successfully rendered island: CodeBlock
```

**Common Issues:**
- **Component not rendering**: Check registry in `main.tsx`
- **Props not working**: Validate JSON syntax in `data-props`
- **Theme not updating**: Implement MutationObserver pattern
- **Build errors**: Check TypeScript types and imports

See [Troubleshooting](#troubleshooting) for details.

---

## Troubleshooting

### Component Not Rendering

**Symptoms:**
- Island `<div>` remains empty
- No error in console

**Solutions:**
1. Verify component is in `main.tsx` registry
2. Check `data-island` attribute matches component name (case-sensitive)
3. Ensure `garden-widgets.js` is loaded
4. Check browser console for errors

### Props Not Working

**Symptoms:**
- Component renders but props are `undefined`
- Component displays default values

**Solutions:**
1. Validate JSON syntax in `data-props`
2. Check for smart quotes (Jekyll may convert them)
3. Verify all required props are provided
4. Check TypeScript interface for type mismatches

**Debug:**
```javascript
// Browser console
document.querySelectorAll('[data-island]').forEach(el => {
  console.log('Island:', el.getAttribute('data-island'));
  console.log('Props:', el.getAttribute('data-props'));
});
```

### Theme Not Updating

**Symptoms:**
- Component doesn't respond to dark/light mode toggle

**Solutions:**
1. Implement MutationObserver pattern:
   ```typescript
   useEffect(() => {
     const observer = new MutationObserver(() => {
       setTheme(getTheme());
     });
     observer.observe(document.documentElement, {
       attributes: true,
       attributeFilter: ['class']
     });
     return () => observer.disconnect();
   }, []);
   ```
2. Use CSS variables instead of hardcoded colors
3. Test in both dark and light modes

### Build Errors

**Symptoms:**
- `npm run build` fails with TypeScript errors

**Solutions:**
1. Check TypeScript types: `npx tsc --noEmit`
2. Verify all imports have correct paths and extensions
3. Install missing `@types/*` packages
4. Clear caches: `rm -rf node_modules package-lock.json && npm install`

**Common TypeScript Fixes:**
```bash
# Install missing type definitions
npm install --save-dev @types/react @types/d3
```

---

## Contributing

Contributions welcome! This is a personal project, but improvements and suggestions are appreciated.

**Areas for Contribution:**
- New React components
- Jekyll plugin enhancements
- Documentation improvements
- Bug fixes
- Performance optimizations

**Development Guidelines:**
1. Follow TypeScript interfaces for type safety
2. Use CSS variables for all theming
3. Implement accessibility features (ARIA, keyboard nav)
4. Test in both dark and light modes
5. Update documentation with changes

---

## License

This project builds upon the [Digital Garden Jekyll Template](https://github.com/maximevaillancourt/digital-garden-jekyll-template) foundation.

**Original Template License:** MIT License
**This Project:** MIT License (see LICENSE file)

**Third-Party Dependencies:**
See `package.json` and `Gemfile` for full list of dependencies and their licenses.

---

**Last Updated:** 2026-01-07
**Maintainer:** [b08x](https://github.com/b08x)
**Status:** Active Development
**Architecture:** Jekyll + React Islands + Tailwind CSS

**Site Purpose:** Personal digital garden and knowledge base exploring the intersection of static site generation and modern interactive components, built with AI-assisted vibe-coding principles.

---

## Acknowledgments

- **Maxime Vaillancourt** - [Digital Garden Jekyll Template](https://github.com/maximevaillancourt/digital-garden-jekyll-template)
- **Anthropic** - Claude AI for `claude-code` development assistance
- **Google** - Gemini for `gemini-cli` development assistance
- **Jekyll Community** - Static site generation framework
- **React Team** - Island architecture inspiration

---

For detailed documentation:
- **Components**: [src/components/README.md](src/components/README.md) or [src/components/AGENTS.md](src/components/AGENTS.md)
- **Layouts**: [_layouts/AGENTS.md](_layouts/AGENTS.md)
- **Includes**: [_includes/AGENTS.md](_includes/AGENTS.md)
- **Plugins**: [_plugins/AGENTS.md](_plugins/AGENTS.md)
- **Theme**: [_sass/AGENTS.md](_sass/AGENTS.md)
- **Utilities**: [src/utils/AGENTS.md](src/utils/AGENTS.md)
