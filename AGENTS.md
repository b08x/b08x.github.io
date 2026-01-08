# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-08
**Commit:** 72ff106
**Branch:** development

## OVERVIEW

Jekyll static site with React island architecture for interactive components. Digital garden + wiki system with IDE/editor aesthetic, using esbuild bundling and Tailwind CSS 4.x. Self-hosted fonts (JetBrains Mono, Inter).

## STRUCTURE

```
./
├── src/
│   ├── components/     # React islands (18 components) - see src/components/AGENTS.md
│   ├── utils/          # Theme sync utilities - see src/utils/AGENTS.md
│   └── main.tsx        # Island hydration entry point
├── _plugins/           # Custom Jekyll plugins (11) - see _plugins/AGENTS.md
├── _layouts/           # Jekyll templates (15 layouts) - see _layouts/AGENTS.md
├── _includes/          # Reusable partials (14 files) - see _includes/AGENTS.md
├── _sass/              # SCSS theme system - see _sass/AGENTS.md
├── assets/
│   ├── js/             # Vanilla JS + React bundle - see assets/js/AGENTS.md
│   ├── css/            # Compiled CSS + components - see assets/css/AGENTS.md
│   ├── fonts/          # Self-hosted fonts (JetBrains Mono, Inter, Hack)
│   └── [audio, videos, img]/
├── _notes/             # Digital garden markdown content
├── _wikis/             # Generated wiki pages (from _data/wikis/*.json)
├── _data/wikis/        # Wiki source JSON files
├── _pages/             # Static pages (about, index, projects)
└── _projects/          # Project collection
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add React component | `src/components/` + register in `src/main.tsx` | Lazy-loaded, island pattern |
| Modify wiki pagination | `_plugins/wiki_page_generator.rb` | ITEMS_PER_PAGE=12, RESERVED_SLUGS |
| Add wiki content | `_data/wikis/{wiki-id}.json` then `jekyll build` | Auto-generates pages |
| Edit note layout | `_layouts/note.html` | Uses sidebar-layout with navigation-sidebar |
| Add bidirectional link | Use `[[Note Title]]` syntax in markdown | Auto-converted by plugin |
| Customize syntax theme | `src/utils/syntaxTheme.ts` | Dynamic Prism themes from CSS vars |
| Modify styles | `_sass/_theme-variables.scss` + `tailwind.config.js` | CSS variables → Tailwind utilities |
| Debug islands | Browser console `[Garden]` prefix | Shows mount/render status |
| Font files | `assets/fonts/` | JetBrains Mono + Inter (self-hosted, woff2/ttf) |
| Add responsive images | `{% picture react-lightbox image.jpg %}` | jekyll_picture_tag v2.1.3 |
| Configure image presets | `_data/picture.yml` | Media queries, formats, widths |
| Image lightbox | Use react-lightbox preset | React Photo View with zoom/pan/gallery |

## CODE MAP

**Entry Points:**
- `src/main.tsx` - React island hydration, component registry, auto-enhancement pipelines
- `_config.yml` - Jekyll configuration, collections, plugins, defaults

**Key Ruby Plugins:**
| Plugin | Purpose | Hook |
|--------|---------|------|
| `wiki_page_generator.rb` | Generates paginated wiki from JSON | Generator (:low) |
| `bidirectional_links_generator.rb` | `[[wikilink]]` → `<a>` conversion + backlinks | Generator (:normal) |
| `obsidian_callouts.rb` | Obsidian `> [!type]` callouts → HTML | Hook (:post_render) |
| `render_liquid.rb` | Renders Liquid within JSON/strings | Filter |
| `empty_front_matter_note_injector.rb` | Auto-adds front matter to notes | Hook (:after_init) |

**Key React Components:**
| Component | LOC | Purpose |
|-----------|-----|---------|
| `JsonCanvasViewer` | 614 | Canvas file visualization with D3 zoom/pan |
| `KnowledgebaseCarousel` | 498 | H2-based content carousel with keyboard nav |
| `VideoPlayer` | 411 | HLS video with segments, transcript search |
| `CodeBlock` | 326 | Syntax highlighting + copy + theme sync |
| `GraphView` | 314 | D3 force-directed note graph (web worker) |
| `MermaidViewer` | 281 | Interactive diagrams with zoom/pan |
| `MermaidModal` | 250 | Full-screen diagram modal |
| `NotesGrid` | 222 | Grid display with detail view |
| `SearchCmdK` | 153 | Command palette search (Cmd/Ctrl+K) |
| `AudioPlayer` | 144 | Audio playback with waveform |

## CONVENTIONS

**Island Architecture:**
- Components registered in `src/main.tsx` `components` object
- HTML: `<div data-island="ComponentName" data-props='...'></div>`
- Props: JSON or Base64-encoded JSON (UTF-8 safe)
- Auto-enhancement: Rouge code blocks → CodeBlock, Mermaid images → MermaidViewer, pictures → ImageLightbox

**Jekyll Collections:**
- `_notes` → `/notes/:slug` (layout: note.html with sidebar-layout)
- `_wikis` → `/wikis/:slug` (generated from JSON, don't edit directly)
- `_projects` → `/projects/:slug`

**Wiki Data Format:**
```json
{
  "metadata": { "repository": "...", "generated_at": "...", "page_count": N },
  "pages": [{ "id": "...", "title": "...", "content": "...", "importance": "high|medium|low" }]
}
```

**Layout Naming:**
- Uses `sidebar-layout.html` as the primary layout with navigation sidebar
- Individual content types use specific layouts like `note.html`
- Navigation sidebar variable is named `navigation-sidebar`
- Designed with IDE/editor aesthetic using monospace fonts and high-contrast styling

**Styling (High-Contrast IDE Theme):**
- **Theme**: Dual Light/Dark mode (activated by `.dark` class on `<html>`)
- **Implementation**: CSS variables (`_sass/_theme-variables.scss`) → Tailwind utilities (`tailwind.config.js`)
- **Aesthetic**: High contrast, 1px solid borders (`--border`), minimal rounded corners
- **Typography**: Hybrid Monospace/Prose - UI/Headings use monospace, content uses prose
- **Tools**: Tailwind 4.x, SCSS, PostCSS

**Responsive Images (jekyll_picture_tag v2.1.3):**
- **Source**: `assets/img/` → **Output**: `assets/img/generated/`
- **Config**: `_config.yml` (global), `_data/picture.yml` (presets)
- **Usage**: `{% picture react-lightbox image.jpg %}` generates WebP + fallback with responsive srcsets
- **Presets**: `react-lightbox` (recommended), `webp`, `avif`, `thumbnail`, `avatar`, `lazy`
- **Lightbox**: React Photo View with zoom/pan/gallery support
- **Build-time**: Images optimized during `jekyll build`, cached in output directory

**Theme Synchronization:**
- **Vanilla JS**: `theme-manager.js` toggles `.dark` class, dispatches `themechange` events
- **React**: Components use `MutationObserver` watching `document.documentElement.classList`
- **Priority**: explicit preference > localStorage > OS `prefers-color-scheme` > light default
- **Zero-lag**: CSS variables update instantly, React components re-render asynchronously

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER** edit files in `_wikis/` directly - generated from `_data/wikis/*.json`
- **NEVER** use wiki page slugs matching reserved words (`page`) - auto-suffixed with `-content`
- **NEVER** manually create pagination paths like `/wikis/{id}/page/{n}/index.md`
- **NEVER** commit `assets/img/generated/` to git - build artifacts excluded
- **NEVER** commit `assets/js/dist/` to git - build artifacts with 3448 chunks
- **NEVER** use synchronous component imports in `main.tsx` - use `React.lazy()`
- **NEVER** hardcode colors in components - use CSS variables (`--foreground`, `--accent`)
- **NEVER** extend deleted layouts (`default.html`, `wiki-layout.html`) - use `sidebar-layout`
- **NEVER** use `innerHTML` with user content - XSS risk
- **NEVER** edit compiled CSS (`compiled.css`) or built JS (`garden-widgets-v2.js`) directly
- **AVOID** using `{% picture %}` without preset name - specify preset for consistent output

## UNIQUE STYLES

**Component Registration Pattern:**
```typescript
const MyComponent = React.lazy(() => import('./components/MyComponent'));
const components = { ..., MyComponent };  // Add to registry
```

**Mermaid Enhancement:** Static `img.mermaid` from jekyll-spaceship auto-converted to interactive `MermaidViewer` islands.

**Code Block Enhancement:** Rouge-generated `div.highlighter-rouge` auto-converted to `CodeBlock` islands with copy button.

**Picture Tag + React Lightbox Pattern:**
```liquid
<!-- Single image with zoom -->
{% picture react-lightbox image.jpg --alt "Description" %}

<!-- Gallery (multiple images) -->
{% picture react-lightbox img1.jpg --picture data-gallery="project" %}
{% picture react-lightbox img2.jpg --picture data-gallery="project" %}
```

**ImageLightbox Special Hydration:**
- Unlike regular islands, uses `PhotoProvider` context for gallery management
- Separate `mountPhotoProvider()` instead of standard `mountIslands()`
- Uses `createPortal` to render components back to original DOM positions

**Markdown Extensions:**
- **Bidirectional Links**: `[[Note Title]]` → `<a class="internal-link">` with backlinks
- **Obsidian Callouts**: `> [!type]` → `<div class="callout" data-callout="type">`
- **Mermaid Diagrams**: ````mermaid` → static image → auto-enhanced to interactive viewer

## COMMANDS

```bash
# Development (concurrent)
npm run dev                    # watch:js + dev:jekyll parallel

# Build
npm run build                  # build:js + build:worker + build:css + build:jekyll
npm run build:js               # esbuild bundle → assets/js/dist/garden-widgets-v2.js

# Jekyll only
npm run dev:jekyll             # jekyll serve --incremental
npm run build:jekyll           # jekyll clean && jekyll build
```

## NOTES

- **Project Scale**: 239 files, 10.8k LOC (2 files >500 lines, max depth 5)
- **Build Artifacts**: 3,448 esbuild chunks in `assets/js/dist/chunks/` from react-syntax-highlighter code splitting (language parsers + themes)
- **Chunk Strategy**: esbuild auto-chunks dynamic imports - 4 chunks per language, ~650 core chunks, aggressive splitting for on-demand loading
- **wiki_page_generator disabled** in `_config.yml` (`wiki_page_generator.enabled: false`) - set to `true` to regenerate
- **Layout System**: Uses `sidebar-layout.html` as the primary layout with navigation sidebar
- **React 19**: Uses `createRoot` API, lazy loading with Suspense
- **Minimal Tests**: Only KnowledgebaseCarousel has tests (360 lines); 94% of components untested (missing Jest config)
- **Graph Web Worker**: `src/components/graph.worker.ts` handles D3 force simulation off main thread
- **Build Pipeline**: Parallel esbuild (React + worker) + Jekyll (Ruby plugins + SCSS) via npm-run-all
- **Picture Tag Setup**: Recent (Jan 8 2026) - jekyll_picture_tag v2.1.3 configured with react-lightbox preset
- **React Photo View**: Modern React lightbox with zoom/pan/gallery/keyboard nav
- **New Plugin**: `render_liquid.rb` (Jan 3 2026) - renders Liquid tags within JSON data for canvas files
- **ImageLightbox Component**: Auto-enhancement pattern - finds `data-lightbox="true"` and hydrates with PhotoProvider context
- **Theme System**: CSS variables (`--foreground`, `--accent`) → Tailwind utilities → React MutationObserver sync
- **No ESLint**: Project lacks linting configuration - relies on TypeScript strict mode only
- **Web Component Tag Inconsistency**: `<terminal-toc>` HTML tag exists but JS file renamed to `sidebar-toc.js`
