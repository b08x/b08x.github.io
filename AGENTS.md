# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-06
**Commit:** aaeb14d
**Branch:** development

## OVERVIEW

Jekyll static site with React island architecture for interactive components. Digital garden + wiki system with terminal aesthetic, using esbuild bundling and Tailwind CSS.

## STRUCTURE

```
./
├── src/components/     # React islands (18 components) - see src/components/AGENTS.md
├── _plugins/           # Custom Jekyll plugins (11) - see _plugins/AGENTS.md
├── _layouts/           # Jekyll templates (19 layouts) - see _layouts/AGENTS.md
├── _includes/          # Reusable partials (14 files) - see _includes/AGENTS.md
├── _notes/             # Digital garden markdown content
├── _wikis/             # Generated wiki pages (from _data/wikis/*.json)
├── _data/wikis/        # Wiki source JSON files
├── _pages/             # Static pages (about, index, projects)
├── _sass/              # SCSS partials
├── assets/             # Static assets (js/dist, css, fonts, img)
└── src/main.tsx        # Island hydration entry point
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add React component | `src/components/` + register in `src/main.tsx` | Lazy-loaded, island pattern |
| Modify wiki pagination | `_plugins/wiki_page_generator.rb` | ITEMS_PER_PAGE=12, RESERVED_SLUGS |
| Add wiki content | `_data/wikis/{wiki-id}.json` then `jekyll build` | Auto-generates pages |
| Edit note layout | `_layouts/terminal-note.html` | Default for _notes |
| Add bidirectional link | Use `[[Note Title]]` syntax in markdown | Auto-converted by plugin |
| Customize syntax theme | `src/utils/syntaxTheme.ts` | React-syntax-highlighter themes |
| Modify styles | `_sass/` for SCSS, `tailwind.config.js` for utilities | Terminal aesthetic variables |
| Debug islands | Browser console `[Garden]` prefix | Shows mount/render status |

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
| `VideoPlayer` | 410 | HLS video with segments, transcript |
| `KnowledgebaseCarousel` | 498 | H2-based content carousel |
| `MermaidViewer` | 280 | Interactive diagrams with zoom/pan |
| `CodeBlock` | 224 | Syntax highlighting + copy button |
| `GraphView` | 254 | D3 force-directed note graph |
| `JsonCanvasViewer` | - | Canvas file visualization |

## CONVENTIONS

**Island Architecture:**
- Components registered in `src/main.tsx` `components` object
- HTML: `<div data-island="ComponentName" data-props='...'></div>`
- Props: JSON or Base64-encoded JSON (UTF-8 safe)
- Auto-enhancement: Rouge code blocks → CodeBlock islands

**Jekyll Collections:**
- `_notes` → `/notes/:slug` (layout: terminal-note)
- `_wikis` → `/wikis/:slug` (generated, don't edit directly)
- `_projects` → `/projects/:slug`

**Wiki Data Format:**
```json
{
  "metadata": { "repository": "...", "generated_at": "...", "page_count": N },
  "pages": [{ "id": "...", "title": "...", "content": "...", "importance": "high|medium|low" }]
}
```

**Styling:**
- Terminal aesthetic: monospace fonts, 1px borders, high contrast
- CSS variables: `--foreground`, `--background`, `--accent`, `--border`, `--muted`
- Tailwind 4.x with `@tailwindcss/postcss`

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER** edit files in `_wikis/` directly - generated from `_data/wikis/*.json`
- **NEVER** use wiki page slugs matching reserved words (`page`) - auto-suffixed with `-content`
- **NEVER** manually create pagination paths like `/wikis/{id}/page/{n}/index.md`
- **AVOID** synchronous component imports in `main.tsx` - use `React.lazy()`
- **AVOID** hardcoded colors in components - use CSS variables for theme support

## UNIQUE STYLES

**Component Registration Pattern:**
```typescript
const MyComponent = React.lazy(() => import('./components/MyComponent'));
const components = { ..., MyComponent };  // Add to registry
```

**Mermaid Enhancement:** Static `img.mermaid` from jekyll-spaceship auto-converted to interactive `MermaidViewer` islands.

**Code Block Enhancement:** Rouge-generated `div.highlighter-rouge` auto-converted to `CodeBlock` islands with copy button.

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

- **wiki_page_generator disabled** in `_config.yml` (`wiki_page_generator.enabled: false`) - set to `true` to regenerate wiki pages
- **Large compiled CSS** - `assets/css/compiled.css` inflates line counts; actual code ~5k lines
- **React 19** - Uses `createRoot` API, lazy loading with Suspense
- **No tests** - `npm test` returns error; consider adding Jest for components

