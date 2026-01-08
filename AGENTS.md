# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-08
**Commit:** 0b3ea67
**Branch:** main

## OVERVIEW

Jekyll static site with React island architecture for interactive components. Digital garden + wiki system with IDE/editor aesthetic, using esbuild bundling and Tailwind CSS. Self-hosted fonts (JetBrains Mono, Inter).

## STRUCTURE

```
./
├── src/
│   ├── components/     # React islands (18 components) - see src/components/AGENTS.md
│   ├── utils/          # Theme sync utilities - see src/utils/AGENTS.md
│   └── main.tsx        # Island hydration entry point
├── _plugins/           # Custom Jekyll plugins (11) - see _plugins/AGENTS.md
├── _layouts/           # Jekyll templates (17 layouts) - see _layouts/AGENTS.md
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
| Edit note layout | `_layouts/note-sidebar.html` | Default for _notes |
| Add bidirectional link | Use `[[Note Title]]` syntax in markdown | Auto-converted by plugin |
| Customize syntax theme | `src/utils/syntaxTheme.ts` | React-syntax-highlighter themes |
| Modify styles | `_sass/` for SCSS, `tailwind.config.js` for utilities | IDE/editor aesthetic variables |
| Debug islands | Browser console `[Garden]` prefix | Shows mount/render status |
| Font files | `assets/fonts/` | JetBrains Mono + Inter (self-hosted, woff2/ttf) |
| Add responsive images | `{% picture preset image.jpg %}` in markdown | jekyll_picture_tag v2.1.3 |
| Configure image presets | `_data/picture.yml` | Media queries, formats, widths |
| Image lightbox | Wrap picture in `<a data-lightbox="gallery">` | Lightbox2 library |

## CODE MAP

**Entry Points:**
- `src/main.tsx` - React island hydration, component registry, code block enhancement
- `_config.yml` - Jekyll configuration, collections, plugins, defaults

**Key Ruby Plugins:**
| Plugin | Purpose | Hook |
|--------|---------|------|
| `wiki_page_generator.rb` | Generates paginated wiki from JSON | Generator |
| `bidirectional_links_generator.rb` | `[[wikilink]]` → `<a>` conversion | Generator |
| `obsidian_callouts.rb` | Obsidian callout blocks → HTML | Converter |
| `empty_front_matter_note_injector.rb` | Auto-adds front matter to notes | Generator |

**Key React Components:**
| Component | LOC | Purpose |
|-----------|-----|---------|
| `KnowledgebaseCarousel` | 498 | H2-based content carousel |
| `JsonCanvasViewer` | 483 | Canvas file visualization |
| `VideoPlayer` | 410 | HLS video with segments, transcript |
| `CodeBlock` | 325 | Syntax highlighting + copy button |
| `GraphView` | 312 | D3 force-directed note graph |
| `MermaidViewer` | 280 | Interactive diagrams with zoom/pan |
| `MermaidModal` | 249 | Full-screen diagram modal |
| `NotesGrid` | 221 | Grid display with detail view |
| `SearchCmdK` | 153 | Command palette search |
| `AudioPlayer` | 144 | Audio playback with waveform |

## CONVENTIONS

**Island Architecture:**
- Components registered in `src/main.tsx` `components` object
- HTML: `<div data-island="ComponentName" data-props='...'></div>`
- Props: JSON or Base64-encoded JSON (UTF-8 safe)
- Auto-enhancement: Rouge code blocks → CodeBlock islands

**Jekyll Collections:**
- `_notes` → `/notes/:slug` (layout: note-sidebar)
- `_wikis` → `/wikis/:slug` (generated, don't edit directly)
- `_projects` → `/projects/:slug`

**Wiki Data Format:**
```json
{
  "metadata": { "repository": "...", "generated_at": "...", "page_count": N },
  "pages": [{ "id": "...", "title": "...", "content": "...", "importance": "high|medium|low" }]
}
```

**Styling (High-Contrast IDE Theme):**
- **Theme**: Dual Light/Dark mode (activated by `.dark` class on `<html>`).
- **Implementation**: All colors are managed via CSS variables defined in `_sass/_theme-variables.scss` and mapped to Tailwind utilities in `tailwind.config.js`.
- **Aesthetic**: High contrast, 1px solid borders (`--border`), minimal rounded corners, and border-based layout.
- **Typography**: Hybrid Monospace/Prose system. UI/Headings use custom monospace fonts (`Hack`, `Mononoki`); main article content uses monospace for a consistent digital garden feel.
- **Tools**: Tailwind 4.x, SCSS, PostCSS.

**Responsive Images (jekyll_picture_tag v2.1.3):**
- **Source**: `assets/img/` → **Output**: `assets/img/generated/`
- **Config**: `_config.yml` (global settings), `_data/picture.yml` (presets)
- **Usage**: `{% picture jpt-webp image.jpg %}` generates WebP + JPEG fallback with responsive srcsets
- **Presets**: `webp`, `avif`, `thumbnail`, `avatar`, `lazy` - customizable widths, formats, media queries
- **Integration**: Lightbox2 wraps pictures in `<a data-lightbox="gallery">` for modal viewing
- **Build-time**: Images optimized during `jekyll build`, cached in output directory

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER** edit files in `_wikis/` directly - generated from `_data/wikis/*.json`
- **NEVER** use wiki page slugs matching reserved words (`page`) - auto-suffixed with `-content`
- **NEVER** manually create pagination paths like `/wikis/{id}/page/{n}/index.md`
- **NEVER** commit `assets/img/generated/` to git - build artifacts excluded
- **AVOID** synchronous component imports in `main.tsx` - use `React.lazy()`
- **AVOID** hardcoded colors in components - use CSS variables for theme support
- **AVOID** using `{% picture %}` without preset name - specify preset (e.g., `jpt-webp`) for consistent output

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

## COMMANDS

```bash
# Development (concurrent)
npm run dev                    # watch:js + dev:jekyll parallel

# Build
npm run build                  # build:js + build:jekyll
npm run build:js               # esbuild bundle → assets/js/dist/garden-widgets-v2.js

# Jekyll only
npm run dev:jekyll             # jekyll serve --incremental
npm run build:jekyll           # jekyll clean && jekyll build
```

## NOTES

- **Project Scale**: 239 files, 554k LOC (62 files >500 lines)
- **wiki_page_generator disabled** in `_config.yml` (`wiki_page_generator.enabled: false`) - set to `true` to regenerate wiki pages
- **Large compiled CSS** - `assets/css/compiled.css` inflates line counts; actual code ~1k lines
- **React 19** - Uses `createRoot` API, lazy loading with Suspense
- **Minimal tests** - Only KnowledgebaseCarousel has tests (360 lines); other 17 components lack coverage
- **Graph web worker** - `src/components/graph.worker.ts` handles force simulation off main thread
- **Build Pipeline**: Parallel esbuild (React + worker) + Jekyll (Ruby plugins + SCSS)
- **Picture Tag Setup**: Recent (Jan 8 2026) - jekyll_picture_tag v2.1.3 configured with react-lightbox preset
- **React Photo View**: Replaced Lightbox2 (Jan 8 2026) - modern React lightbox with zoom/pan/gallery support
- **No Generated Images Yet**: `assets/img/generated/` not created until first `jekyll build` with picture tags
- **ImageLightbox Component**: Auto-enhancement pattern (like CodeBlock) - finds `data-lightbox="true"` and hydrates

