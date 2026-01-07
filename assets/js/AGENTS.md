# assets/js/ - JavaScript Architecture

Vanilla JavaScript modules for progressive enhancement, theme management, and canvas interactions. Works alongside React islands for selective hydration.

## STRUCTURE

```
assets/js/
├── canvas.js                      # Canvas pan/zoom system (576 LOC)
├── collapsible-sidebar.js          # Right sidebar toggle (194 LOC)
├── knowledgebase-paginator.js     # H2-based content carousel (102 LOC)
├── page-sidebar.js                # Left sidebar with scroll spy (342 LOC)
├── prism.js                      # PrismJS syntax highlighting (minified)
├── scroll-header.js               # Auto-hiding header (75 LOC)
├── theme-manager.js               # Theme switching system (177 LOC)
├── components/
│   └── sidebar-toc.js            # Shadow DOM TOC Web Component (166 LOC) - renamed from terminal-toc.js
└── dist/
    └── garden-widgets-v2.js       # Bundled React components (251,854 LOC, 10MB)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|-----------|-------|
| Canvas interaction | `canvas.js` | Pan/zoom with CSS variables, touch gestures |
| Theme switching | `theme-manager.js` | localStorage + OS preference + custom events |
| Sidebar behavior | `collapsible-sidebar.js`, `page-sidebar.js` | Toggle, persistence, scroll spy |
| Header auto-hide | `scroll-header.js` | Scroll direction detection, requestAnimationFrame |
| Knowledgebase pagination | `knowledgebase-paginator.js` | H2 splitting, carousel navigation |
| Web Components | `components/sidebar-toc.js` | Shadow DOM, custom element |

## CODE MAP

| Symbol | Type | Location | Refs | Role |
|--------|------|----------|------|------|
| `window.canvasAPI` | Object | `canvas.js` | Canvas zoom/pan controls for React components |
| `window.themeManager` | Class | `theme-manager.js` | Theme toggle with system preference detection |
| `window.collapsibleSidebar` | Class | `collapsible-sidebar.js` | Right sidebar state management |
| `window.pageSidebar` | Class | `page-sidebar.js` | Left sidebar scroll spy + media controls |
| `SidebarToc` | Custom Element | `components/sidebar-toc.js` | Web Component with Shadow DOM TOC |

## CONVENTIONS

**Naming:**
- **camelCase**: Variables, functions (`addEventListener`, `getCurrentTheme`)
- **PascalCase**: Class names (`ThemeManager`, `CollapsibleSidebar`, `PageSidebar`)
- **SCREAMING_SNAKE_CASE**: Constants (`ZOOM_SPEED`, `PAN_SMOOTH_FACTOR`, `SCROLL_THRESHOLD`)

**Module Patterns:**
- **IIFE**: Encapsulation in `scroll-header.js` (immediate execution)
- **ES Classes**: OOP pattern with constructor, methods
- **Web Components**: Custom element definition (`customElements.define()`)
- **Global Registration**: Attach to `window` for React component access

**Event Handling:**
- **passive listeners**: `{ passive: true }` for scroll events (performance)
- **requestAnimationFrame**: Smooth animations without layout thrashing
- **Custom events**: Component communication via `new CustomEvent()`

**Performance:**
- **Intersection Observer**: Scroll spy instead of scroll polling (O(1) per scroll)
- **CSS Variables**: Update transforms via properties (GPU acceleration)
- **LocalStorage**: State persistence with JSON serialization

## ANTI-PATTERNS

- **NEVER** edit `dist/garden-widgets-v2.js` - regenerated from esbuild
- **NEVER** use `innerHTML` with user content - XSS risk (use `textContent` or `createElementNS`)
- **AVOID** global namespace pollution - use classes or IIFE wrapping
- **DON'T** create memory leaks - disconnect observers/clean up event listeners on destroy
- **AVOID** blocking the main thread - use `requestAnimationFrame` for animations

## UNIQUE STYLES

**Canvas System:**
- CSS variable-based transforms (`--scale`, `--pan-x`, `--pan-y`)
- Touch gesture support (pinch-to-zoom, two-finger pan)
- Smooth animation with lerp interpolation
- Global API (`window.canvasAPI`) for React component integration

**Theme Management:**
- Priority hierarchy: explicit preference > localStorage > OS preference > default
- System preference detection via `prefers-color-scheme`
- Custom events (`themechange`) for React component synchronization

**Scroll Spy:**
- Intersection Observer with `rootMargin` optimization
- Active state tracking for TOC highlighting
- Smooth scroll to headings with `history.pushState()`

**Media Controls:**
- Audio playback speed control
- Timestamp parsing (MM:SS, HH:MM:SS formats)
- Video lazy loading with thumbnail replacement
- XSS prevention with embed ID validation

## COMMANDS

```bash
# Build React components (includes esbuild)
npm run build:js           # Compiles src/main.tsx → dist/garden-widgets-v2.js

# Watch during development
npm run watch:js           # Rebuilds on source changes

# Full site build
npm run build               # build:js + build:jekyll
```

## NOTES

- **Total Lines**: 1,632 lines (excluding dist/ bundle)
- **Dist Bundle**: 251,854 lines, 10MB (minified React + 18 components)
- **No Technical Debt**: Clean codebase, no TODO/FIXME markers
- **Progressive Enhancement**: Vanilla JS works without React bundle (graceful degradation)
- **Accessibility**: ARIA attributes, keyboard navigation, screen reader support
- **Browser Support**: Modern browsers (ES6+, Intersection Observer, Custom Elements)

**Global APIs:**
- `window.canvasAPI` - Canvas zoom/pan controls (used by JsonCanvasViewer, CanvasControls)
- `window.themeManager` - Theme toggle API (used by all React components for sync)
- `window.collapsibleSidebar` - Sidebar state (used by terminal-note layout)
- `window.pageSidebar` - Sidebar scroll spy (used by page-sidebar layout)

**Event Communication:**
- `themechange` - Theme toggle event (detail: `{ theme: 'light' | 'dark' }`)
- `sidebarchange` - Sidebar toggle event (detail: `{ isOpen: boolean }`)
- `canvas:dataUpdate` - Canvas data update event (detail: canvas data object)
