# _layouts/ - Jekyll Layout Templates

19 layout files with complex inheritance hierarchy. Terminal aesthetic shared across all but implementation varies.

## HIERARCHY MAP

```
base-shell.html (ROOT - 125 LOC)
│   └── Provides: <html>, <head>, sticky header, footer, SearchCmdK
│   └── Includes: terminal-header.html, footer.html
│   └── Scripts: theme-manager.js, scroll-header.js, garden-widgets-v2.js
│
├── default.html (DEPRECATED - just passes through to base-shell)
│   ├── collapsible-sidebar.html
│   └── notebook.html
│
├── content-layout.html (38 LOC - simple centered content)
│   │   └── max-w-4xl centered, prose styling, optional hero
│   ├── about.html
│   ├── home.html
│   └── page.html
│
├── terminal-layout.html (312 LOC - full-featured with sidebars)
│   │   └── Configurable left/right sidebars, TOC, GraphView
│   │   └── Left sidebar modes: wiki-nav, terminal-sidebar, knowledgebase-toc
│   │   └── Right sidebar modes: toc, related, media, references
│   │   └── Includes: terminal-sidebar.html, page_sidebar/*.html
│   │   └── Scripts: terminal-toc.js, knowledgebase.css
│   │
│   ├── terminal-note.html (default for _notes collection)
│   │       └── Sets: left_sidebar=terminal-sidebar, right_sidebar=toc, show_graph=true
│   ├── note.html
│   ├── page-sidebar.html
│   │       └── Sets: right_sidebar=toc media references
│   └── knowledgebase.html
│           └── Sets: left_sidebar=knowledgebase-toc
│           └── Uses: KnowledgebaseCarousel React island
│
└── wiki-layout.html (125 LOC - wiki-specific with nav)
    │   └── Fixed left wiki nav, optional right TOC (xl only)
    │   └── max-w-[1800px] wider container
    │   └── Scripts: terminal-toc.js
    │
    ├── wiki.html (251 LOC - paginated index grid)
    │       └── Card grid, pagination controls, metadata bar
    └── wiki-page.html (115 LOC - individual wiki page)
            └── Source context, related pages, prev/next nav

STANDALONE (no parent):
├── canvas.html          - JsonCanvas viewer (includes head.html directly)
├── canvas-home.html     - Canvas homepage (includes head.html directly)
└── docs.html            - Documentation (uses jcanvas/* includes)
```

## UI/UX CONSISTENCY ISSUES

| Issue | Location | Description |
|-------|----------|-------------|
| **Font inconsistency** | Various | `font-prose` vs `font-mono` mixing in headers |
| **Container widths** | 3 different | `max-w-4xl` (content), `max-w-screen-xl/2xl` (terminal), `max-w-[1800px]` (wiki) |
| **Sidebar implementations** | 2 systems | `terminal-layout` vs `wiki-layout` duplicate sidebar logic |
| **TOC components** | 2 different | `<terminal-toc>` (web component) vs `#toc-list` (include) |
| **Deprecated layout** | `default.html` | Still used by some pages, passes through to base-shell |
| **CSS variable naming** | page_sidebar | Uses `--text-muted` instead of `--muted`, `--bg-surface` vs `--surface` |
| **Include styling** | page_sidebar/* | Legacy CSS variables not matching Tailwind |

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Change site-wide header/footer | `base-shell.html` | ROOT - affects all pages |
| Add global scripts | `base-shell.html:112-115` | Before closing </body> |
| Modify note layout | `terminal-note.html` | Sets sidebar configs for terminal-layout |
| Change wiki sidebar | `wiki-layout.html:12-46` | Wiki navigation |
| Modify wiki cards | `wiki.html:72-118` | Grid and card styling |
| Add new sidebar widget | `terminal-layout.html:164-205` | Right sidebar section |
| Change content width | `terminal-layout.html:5-12` | container_max_width logic |

## CONVENTIONS

**Layout Variables (set in child, used in parent):**
```yaml
---
layout: terminal-layout
left_sidebar: wiki-nav | terminal-sidebar | knowledgebase-toc
right_sidebar: toc | related | media | references  # space-separated
right_sidebar_xl_only: true  # hide on smaller screens
container_max_width: max-w-screen-2xl
content_max_width: max-w-content
show_metadata: true
show_graph: true
hide_header: false
---
```

**Terminal Aesthetic Pattern:**
- Monospace fonts (`font-mono`) for UI, prose fonts (`font-prose`) for content
- 1px borders with `border-border` 
- Background layering: `bg-background` (page) → `bg-surface` (cards)
- Accent color for interactive: `text-accent`, `border-accent`, `hover:text-accent`

## ANTI-PATTERNS

- **NEVER** use `default.html` for new pages - it's deprecated
- **NEVER** duplicate sidebar logic - extend `terminal-layout` or `wiki-layout`
- **AVOID** inline styles when Tailwind utilities exist
- **AVOID** hardcoded colors - use CSS variables via Tailwind (`text-foreground`, etc.)
- **AVOID** mixing CSS variable naming conventions (use Tailwind's: `--foreground` not `--text-primary`)

## UNIFICATION OPPORTUNITIES

1. **Merge wiki-layout into terminal-layout** - `wiki-nav` sidebar mode already exists in terminal-layout
2. **Standardize container widths** - Create width presets in Tailwind config
3. **Single TOC implementation** - Use `<terminal-toc>` web component everywhere
4. **Consolidate page_sidebar includes** - Update to use Tailwind CSS variables
5. **Remove default.html** - Update pages using it to use appropriate layout directly

## SCRIPTS LOADED

| Script | Loaded By | Purpose |
|--------|-----------|---------|
| `theme-manager.js` | base-shell | Dark/light mode toggle |
| `scroll-header.js` | base-shell | Hide header on scroll |
| `garden-widgets-v2.js` | base-shell | React island hydration |
| `terminal-toc.js` | terminal-layout, wiki-layout | Web component for TOC |
| `knowledgebase.css` | terminal-layout | Knowledgebase-specific styles |
