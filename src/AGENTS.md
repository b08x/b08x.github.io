# src/ - React Island Architecture

**Generated:** 2026-02-09
**Commit:** 1769b89
**Branch:** feature/three_col_grid

## OVERVIEW

React 19 island architecture with TypeScript. Single entry point (`main.tsx`) hydrates 20 lazy-loaded components, 3 enhancement pipelines, and theme sync utilities.

## STRUCTURE

```
src/
├── main.tsx            # Island registry, hydration, auto-enhancement (414 LOC)
├── components/         # 20 React islands (4,013 LOC) → see components/AGENTS.md
├── utils/              # Theme sync utilities → see utils/AGENTS.md
└── types/              # TypeScript interfaces (1 file)
    └── prompt.ts       # Prompt flow diagram types
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new component | Create in `components/`, register in `main.tsx` | Use `React.lazy()` pattern |
| Modify island hydration | `main.tsx:104-156` | `mountIslands()` function |
| Add enhancement pipeline | `main.tsx:205-400` | See Mermaid/CodeBlock/ImageLightbox patterns |
| Update component registry | `main.tsx:46-67` | String-to-component mapping |
| Theme utilities | `utils/syntaxTheme.ts`, `utils/mermaidTheme.ts` | CSS variable → Prism/Mermaid themes |
| Props encoding/decoding | `main.tsx:69-102` | Base64 + UTF-8 support |

## CONVENTIONS

**Component Registration:**
```typescript
// 1. Lazy load at top
const MyComponent = React.lazy(() => import('./components/MyComponent'));

// 2. Add to registry
const components: Record<string, React.ComponentType<any>> = {
  MyComponent,  // Must match data-island attribute exactly
};
```

**Island Hydration:**
- HTML: `<div data-island="ComponentName" data-props='{"key": "value"}'></div>`
- Props: JSON or Base64-encoded JSON with UTF-8 support
- Suspense fallback: `<div>Loading component...</div>`
- Error boundary: `onUncaughtError` handler in `createRoot()`

**Enhancement Pipelines:**
1. **CodeBlock**: Rouge `div.language-*.highlighter-rouge` → CodeBlock island
2. **Mermaid**: `img.mermaid` from jekyll-spaceship → MermaidViewer island
3. **ImageLightbox**: `picture[data-lightbox="true"]` → ImageLightbox island

**Theme Sync:**
- MutationObserver watches `document.documentElement.classList` for `.dark` class
- CSS variables (`--foreground`, `--accent`) bridge to React components
- Zero-lag switching: CSS updates instantly, React re-renders asynchronously

## ANTI-PATTERNS

- **NEVER** use synchronous imports - always `React.lazy(() => import(...))`
- **NEVER** hardcode colors - use CSS variables or Tailwind utilities
- **NEVER** skip error boundaries for complex components
- **AVOID** inline styles when Tailwind utilities exist
- **AVOID** direct DOM manipulation outside `useEffect`

## BUILD SYSTEM

**esbuild Configuration** (package.json:10):
```bash
esbuild src/main.tsx --bundle --minify --sourcemap --target=es2020 --jsx=automatic
```

**Output:**
- Main bundle: `assets/js/dist/garden-widgets-v2.js` (11MB)
- Chunks: `assets/js/dist/chunks/` (1,724 files, 14.2MB JS + 56MB source maps)

**Chunk Strategy:**
- Core app chunks: ~650 files (components, utilities)
- Language parsers: ~854 files (react-syntax-highlighter Prism languages)
- Theme variants: ~320 files (syntax highlighting themes)

**Root Cause of 1,724 Chunks:**
- `react-syntax-highlighter` includes 150+ language parsers
- Each language generates ~4 chunks (base + 3 theme variants)
- esbuild's aggressive code splitting for optimal on-demand loading

## COMPONENT REGISTRY

**20 Components** (as of 2026-02-09):

| Component | LOC | Purpose |
|-----------|-----|---------|
| PromptFlowDiagram | 924 | YAML-driven prompt flow visualizer |
| JsonCanvasViewer | 613 | D3 canvas editor with zoom/pan |
| KnowledgebaseCarousel | 498 | H2-based content carousel |
| VideoPlayer | 410 | HLS video with segments/transcript |
| CodeBlock | 325 | Syntax highlighting + copy button |
| GraphView | 312 | D3 force-directed graph |
| MermaidViewer | 280 | Interactive diagrams with zoom |
| MermaidModal | 249 | Full-screen diagram modal |
| NotesGrid | 221 | Grid display with detail view |
| NodeEditor | 200 | Canvas node editing |
| CanvasMinimap | 159 | Canvas minimap navigation |
| SearchCmdK | 153 | Command palette (Cmd/Ctrl+K) |
| CanvasControls | 150 | Canvas control panel |
| AudioPlayer | 144 | Audio with waveform |
| CanvasExporter | 120 | Canvas export functionality |
| NotebookGuide | 112 | Guide/tutorial component |
| OutputPanel | 106 | Canvas output panel |
| DashboardIsland | ~80 | Dashboard widget container |
| ReactPlayerIsland | 42 | react-player wrapper |
| HelloGarden | 13 | Demo/test component |

**See `components/AGENTS.md` for detailed component documentation.**

## UNIQUE STYLES

**Island Architecture Benefits:**
- SEO-friendly: Static HTML serves first, no JS required for initial render
- Fast initial load: Only main bundle (11MB) loads, components lazy-load on-demand
- Progressive enhancement: Works without JS, enhanced with it
- Selective interactivity: React only where `data-island` markers exist

**Props Encoding:**
```typescript
// Supports JSON and Base64-encoded JSON with UTF-8
const props = decodeProps(container.getAttribute('data-props'));
// Handles smart quotes from Jekyll: "" → ""
```

**Auto-Enhancement Example (CodeBlock):**
```typescript
// Before: Rouge-generated static HTML
<div class="language-javascript highlighter-rouge">
  <pre><code>const x = 42;</code></pre>
</div>

// After: Interactive CodeBlock island
<div data-island="CodeBlock" data-props='{"code":"const x = 42;","language":"javascript"}'></div>
```

## NOTES

- **Entry point**: `main.tsx` is the single JavaScript entry point for all React functionality
- **React 19**: Uses new `createRoot` API with `onUncaughtError` error boundary
- **JSX Transform**: `--jsx=automatic` (no `import React` needed)
- **Component count**: Increased from 18 to 20 (added DashboardIsland, PromptFlowDiagram)
- **Chunk artifacts**: `assets/js/dist/` excluded from git per root AGENTS.md anti-patterns
- **Web worker**: `components/graph.worker.ts` handles D3 force simulation off main thread
- **PhotoProvider**: ImageLightbox uses special hydration via `mountPhotoProvider()` for gallery context
- **Global API**: `window.canvasAPI` exposed for JsonCanvasViewer control from other components
