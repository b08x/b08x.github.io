# _layouts/ - Jekyll Layout Templates

**Generated:** 2026-01-09
**Commit:** 72ff106
**Branch:** development

## OVERVIEW

14 layout files (1,132 LOC) with unified inheritance hierarchy. IDE/editor aesthetic with monospace UI fonts, high contrast, 1px borders. Primary layout is `sidebar-layout.html` with configurable left/right sidebar modes.

## STRUCTURE

```
_layouts/
├── base-shell.html           # ROOT (120 LOC) - HTML structure, header/footer, global scripts
├── sidebar-layout.html       # PRIMARY (308 LOC) - configurable sidebars, container widths
├── content-layout.html       # Simple centered content (37 LOC)
├── wiki.html                 # Paginated wiki index (250 LOC)
├── wiki-page.html            # Individual wiki detail (115 LOC)
├── notebook.html             # Notebook layout (103 LOC)
├── canvas.html               # Canvas viewer standalone (106 LOC)
├── canvas-home.html          # Canvas homepage standalone (14 LOC)
├── knowledgebase.html        # KB with carousel (19 LOC)
├── docs.html                 # Documentation (33 LOC)
├── note.html                 # Note layout (8 LOC)
├── page.html                 # Generic page (6 LOC)
├── home.html                 # Homepage (7 LOC)
└── about.html                # About page (6 LOC)
```

## HIERARCHY

```
base-shell.html (root)
│
├── sidebar-layout.html
│   ├── knowledgebase.html
│   ├── note.html
│   ├── page.html
│   ├── wiki.html
│   └── wiki-page.html
│
├── content-layout.html
│   ├── about.html
│   ├── home.html
│   └── (page.html also extends this)
│
├── notebook.html
│
└── Standalone (bypass inheritance):
    ├── canvas.html
    ├── canvas-home.html
    └── docs.html
```

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Site-wide header/footer | `base-shell.html` | ROOT - affects all pages |
| Global scripts | `base-shell.html:112-115` | Before `</body>` |
| Sidebar configuration | `sidebar-layout.html:5-33` | Container width + effective sidebar logic |
| Left sidebar modes | `sidebar-layout.html:38-108` | wiki-nav, navigation-sidebar, knowledgebase-toc |
| Right sidebar widgets | `sidebar-layout.html:135-207` | toc, related, media, references |
| Wiki card grid | `wiki.html:50-100` | Pagination + card styling |
| Note default config | `note.html` | Sets navigation-sidebar + toc |
| Canvas viewer | `canvas.html` | JsonCanvasViewer island |

## CONVENTIONS

**Layout Variables (set in child layout front matter):**
```yaml
layout: sidebar-layout
left_sidebar: wiki-nav | navigation-sidebar | knowledgebase-toc
right_sidebar: toc related media references  # space-separated, multiple allowed
right_sidebar_xl_only: true     # hide on <xl screens
container_max_width: max-w-notebook | max-w-content-2col
hide_left_sidebar: true         # override defaults
hide_header: true               # hide page header section
```

**Container Width Logic:**
- `wiki`, `wiki-page`, `note`, `page` layouts → `max-w-notebook`
- Has `right_sidebar` → `max-w-notebook`
- Default → `max-w-content-2col`
- Override with `container_max_width` variable

**Sidebar Defaults:**
- `note.html` → `left_sidebar: navigation-sidebar`, `right_sidebar: toc`
- `page.html` → `right_sidebar: toc` only

**IDE/Editor Aesthetic:**
- UI elements: `font-mono`, `border-border`, `text-foreground`
- Content: `font-prose` for long-form text
- Cards: `bg-surface` over `bg-background`
- Interactive: `text-accent`, `border-accent`, `hover:text-accent`

## ANTI-PATTERNS

- **NEVER** extend deleted layouts: `default.html`, `wiki-layout.html`, `terminal-layout.html`, `note-sidebar.html`, `page-sidebar.html`, `collapsible-sidebar.html` (all removed)
- **NEVER** duplicate sidebar logic - extend `sidebar-layout` with appropriate mode
- **AVOID** inline styles - use Tailwind utilities
- **AVOID** hardcoded colors - use CSS variables via Tailwind (`text-foreground`, not `#333`)
- **AVOID** legacy CSS variables (`--text-muted`, `--bg-surface`) - migrated to Tailwind classes

## SCRIPTS LOADED

| Script | Loaded By | Purpose |
|--------|-----------|---------|
| `theme-manager.js` | base-shell | Dark/light toggle, localStorage persistence |
| `scroll-header.js` | base-shell | Auto-hide header on scroll down |
| `garden-widgets-v2.js` | base-shell | React island hydration (all components) |
| `sidebar-toc.js` | sidebar-layout | `<sidebar-toc>` web component registration |
| `knowledgebase.css` | sidebar-layout (conditional) | Knowledgebase-specific styles |

## UNIQUE STYLES

**Sidebar Modes:**
- `wiki-nav`: Wiki page list navigation (used by wiki index/detail)
- `navigation-sidebar`: Standard site nav with backlinks (used by notes)
- `knowledgebase-toc`: KB section navigation with KnowledgebaseCarousel

**React Island Usage:**
- `base-shell`: SearchCmdK (Cmd/Ctrl+K global search)
- `knowledgebase`: KnowledgebaseCarousel
- `canvas-home`: JsonCanvasViewer + CanvasControls
- `notebook`: NotesGrid + NotebookGuide + AudioPlayer

**Standalone Layouts:**
Canvas and docs layouts bypass `base-shell` inheritance and include `head.html` directly for specialized needs (custom CSS, different script loading).

## NOTES

- **Recent refactoring** (commit 72ff106, Jan 8 2026): Removed `collapsible-sidebar.html`, `note-sidebar.html`, `page-sidebar.html` - consolidated sidebar logic into `sidebar-layout` and child layouts
- **Previous refactoring** (commit f4c913e): Renamed `terminal-layout` → `sidebar-layout`, `terminal-note` → `note-sidebar` (now removed), `terminal-sidebar` variable → `navigation-sidebar`
- **Deleted layouts** (commit 609db48): `default.html`, `wiki-layout.html` removed as unnecessary passthroughs
- **Layout count**: Was 17, now 14 after consolidation
- **No subdirectories**: Flat structure, all 14 files at root level
- **Web component**: `<sidebar-toc>` tag exists but JS file named `sidebar-toc.js` (not `terminal-toc.js`)
