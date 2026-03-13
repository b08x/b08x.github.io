# _pages/ - Static Jekyll Pages

**Generated:** 2026-03-12

## OVERVIEW

Static pages collection for top-level site pages (homepage, about, projects, etc.). Uses sidebar-layout with various sidebar configurations.

## STRUCTURE

```
_pages/
├── index.md              # Homepage
├── about.md              # About page
├── notes.md             # Notes index
├── projects.md          # Projects index
├── wikis.md             # Wikis index
├── react-test.md        # React component test page
├── test-sidebar-layout.md # Layout testing
├── video-kb-example.md # Video knowledge base example
├── presentation-demo.md # Presentation demo
├── presentation-test.md # Presentation test
└── demos/               # Demo subdirectory
```

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Homepage | `index.md` | Main entry point |
| About page | `about.md` | Static content |
| Notes listing | `notes.md` | Links to `_notes/` collection |
| Projects listing | `projects.md` | Links to `_projects/` collection |
| Wikis listing | `wikis.md` | Links to wiki collections |
| Layout testing | `test-sidebar-layout.md` | Test various sidebar configs |

## CONVENTIONS

- **Layout**: `sidebar-layout` (primary) or `content-layout`
- **Front matter**: `title`, `layout`, `left_sidebar`, `right_sidebar`
- **Navigation**: Defined in `_data/navigation.yml`

## ANTI-PATTERNS

- **NEVER** put content meant for collections in `_pages/` - use `_notes/`, `_projects/`, etc.
- **AVOID** complex front matter - keep pages simple

## NOTES

- Pages are static (not generated from data like wikis)
- Demo pages in `demos/` for testing features
