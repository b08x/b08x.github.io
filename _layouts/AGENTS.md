# _layouts/ - Jekyll Layout Templates

17 layout files with consolidated inheritance hierarchy. Terminal aesthetic shared across all.

## HIERARCHY MAP

```
base-shell.html (ROOT - 125 LOC)
│   └── Provides: <html>, <head>, sticky header, footer, SearchCmdK
│   └── Includes: terminal-header.html, footer.html
│   └── Scripts: theme-manager.js, scroll-header.js, garden-widgets-v2.js
│
├── collapsible-sidebar.html (extends base-shell directly)
│       └── Full-screen with collapsible right sidebar
│
├── notebook.html (extends base-shell directly)
│       └── max-w-[1800px] notebook-style layout
│
├── content-layout.html (38 LOC - simple centered content)
│   │   └── max-w-4xl centered, prose styling, optional hero
│   ├── about.html
│   ├── home.html
│   └── page.html
│
└── terminal-layout.html (290 LOC - unified sidebar layout)
    │   └── Configurable left/right sidebars, TOC, GraphView
    │   └── Left sidebar modes: wiki-nav, terminal-sidebar, knowledgebase-toc
    │   └── Right sidebar modes: toc, related, media, references
    │   └── Container widths: max-w-notebook (wiki/sidebar), max-w-content-2col (default)
    │   └── Includes: terminal-sidebar.html, page_sidebar/*.html
    │   └── Scripts: terminal-toc.js, knowledgebase.css
    │
    ├── terminal-note.html (default for _notes collection)
    │       └── Sets: left_sidebar=terminal-sidebar, right_sidebar=toc, show_graph=true
    ├── note.html
    ├── page-sidebar.html
    │       └── Sets: right_sidebar=toc media references
    ├── knowledgebase.html
    │       └── Sets: left_sidebar=knowledgebase-toc
    │       └── Uses: KnowledgebaseCarousel React island
    ├── wiki.html (paginated index grid)
    │       └── Card grid, pagination controls, metadata bar
    └── wiki-page.html (individual wiki page)
            └── Source context, related pages, prev/next nav

STANDALONE (no parent):
├── canvas.html          - JsonCanvas viewer (includes head.html directly)
├── canvas-home.html     - Canvas homepage (includes head.html directly)
└── docs.html            - Documentation (uses jcanvas/* includes)
```

## UI/UX CONSISTENCY STATUS

| Area | Status | Notes |
|------|--------|-------|
| **Font usage** | ✓ Consistent | `font-prose` for content, `font-mono` for UI |
| **Container widths** | ✓ Unified | `max-w-4xl` (content), `max-w-notebook` (wiki/sidebar), `max-w-content-2col` (default terminal) |
| **Sidebar implementations** | ✓ Unified | All use `terminal-layout` with `wiki-nav` mode |
| **TOC component** | ✓ Single | `<terminal-toc>` web component everywhere |
| **CSS variables** | ✓ Modernized | page_sidebar/* migrated to Tailwind classes |

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Change site-wide header/footer | `base-shell.html` | ROOT - affects all pages |
| Add global scripts | `base-shell.html:112-115` | Before closing </body> |
| Modify note layout | `terminal-note.html` | Sets sidebar configs for terminal-layout |
| Change wiki sidebar | `terminal-layout.html:27-53` | Wiki-nav mode in left sidebar |
| Modify wiki cards | `wiki.html` | Grid and card styling |
| Add new sidebar widget | `terminal-layout.html:164-205` | Right sidebar section |
| Change content width | `terminal-layout.html:5-14` | container_max_width logic |

## CONVENTIONS

**Layout Variables (set in child, used in parent):**
```yaml
---
layout: terminal-layout
left_sidebar: wiki-nav | terminal-sidebar | knowledgebase-toc
right_sidebar: toc | related | media | references  # space-separated
right_sidebar_xl_only: true  # hide on smaller screens
container_max_width: max-w-notebook  # or max-w-content-2col (default)
content_max_width: max-w-content
show_metadata: true
show_graph: true
hide_header: false  # set true to hide page header
---
```

**Container Width Logic (terminal-layout.html):**
- `wiki` or `wiki-page` layout → `max-w-notebook`
- Has `right_sidebar` → `max-w-notebook`
- Default → `max-w-content-2col`

**Terminal Aesthetic Pattern:**
- Monospace fonts (`font-mono`) for UI, prose fonts (`font-prose`) for content
- 1px borders with `border-border` 
- Background layering: `bg-background` (page) → `bg-surface` (cards)
- Accent color for interactive: `text-accent`, `border-accent`, `hover:text-accent`

## ANTI-PATTERNS

- **NEVER** create new layouts extending non-existent `default.html` or `wiki-layout.html` (deleted)
- **NEVER** duplicate sidebar logic - extend `terminal-layout` with appropriate sidebar mode
- **AVOID** inline styles when Tailwind utilities exist
- **AVOID** hardcoded colors - use CSS variables via Tailwind (`text-foreground`, etc.)
- **AVOID** legacy CSS variables (`--text-muted`, `--bg-surface`) - use Tailwind classes directly

## SCRIPTS LOADED

| Script | Loaded By | Purpose |
|--------|-----------|---------|
| `theme-manager.js` | base-shell | Dark/light mode toggle |
| `scroll-header.js` | base-shell | Hide header on scroll |
| `garden-widgets-v2.js` | base-shell | React island hydration |
| `terminal-toc.js` | terminal-layout | Web component for TOC |
| `knowledgebase.css` | terminal-layout | Knowledgebase-specific styles |

## DELETED LAYOUTS (commit 609db48)

| Layout | Reason | Migration |
|--------|--------|-----------|
| `default.html` | Unnecessary passthrough | Use `base-shell` directly |
| `wiki-layout.html` | Duplicate of terminal-layout | Use `terminal-layout` with `wiki-nav` sidebar |
