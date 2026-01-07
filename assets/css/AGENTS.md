# assets/css/ - CSS Architecture

Dual-build CSS system combining Jekyll SCSS processing with Tailwind CSS 4.x utilities. Terminal aesthetic theme with dual light/dark mode support.

## STRUCTURE

```
assets/css/
├── tailwind.css               # Tailwind entry point with @layer imports (26 LOC)
├── compiled.css                # Compiled Tailwind output (92KB, minified)
├── knowledgebase.css           # Knowledgebase carousel styles (119 LOC)
├── jcanvas/
│   └── style.css              # Canvas viewer styles (700 LOC)
└── components/
    ├── _ui.css                # UI components (backlinks, theme toggle) (34 LOC)
    ├── _syntax-highlighting.css  # Syntax highlighting theme (85 LOC)
    └── _callouts.css          # Obsidian callout styling (197 LOC)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Change theme colors | `_sass/_theme-variables.scss` | CSS variables (light/dark) |
| Modify Tailwind config | `tailwind.config.js` | Maps variables to utilities |
| Update component styles | `components/*.css` | @layer components organization |
| Canvas-specific styles | `jcanvas/style.css` | Interactive positioning, pan/zoom |
| Syntax colors | `components/_syntax-highlighting.css` | Rouge-generated code blocks |
| Callout theming | `components/_callouts.css` | 12 callout types, data-attribute styling |

## CODE MAP

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `@layer components` | CSS layer | `components/*.css` | Tailwind v4 layer organization |
| `@theme` | CSS directive | `tailwind.css` | Tailwind v4 theme configuration |
| `.callout[data-callout]` | Selector | `_callouts.css` | Type-safe callout variants |
| `--scale`, `--pan-x`, `--pan-y` | CSS variables | `jcanvas/style.css` | Canvas transform controls |
| `--foreground`, `--accent` | Theme variables | `_theme-variables.scss` | Core color system |

## CONVENTIONS

**Build System:**
- **Dual Pipelines**: Jekyll SCSS (`styles.scss`) + Tailwind CSS (`tailwind.css`)
- **Tailwind v4**: Uses `@import "tailwindcss"` and `@theme` directives
- **Layer Organization**: `@layer components` for component styles

**Loading Order:**
1. `compiled.css` - Always loaded (base-shell.html, head.html)
2. `knowledgebase.css` - Conditional (terminal-layout.html)
3. `jcanvas/style.css` - Conditional (docs.html)

**Theme Integration:**
- All colors reference CSS variables (`var(--foreground)`, `var(--accent)`)
- Dark mode via `.dark` class on `<html>` element
- Tailwind utilities mapped to variables in `tailwind.config.js`

## ANTI-PATTERNS

- **NEVER** edit `compiled.css` directly - regenerated from Tailwind build
- **NEVER** hardcode colors - use CSS variables (breaks theme sync)
- **AVOID** creating custom utility classes - use Tailwind utilities instead
- **DON'T** bypass `@layer` organization in components (breaks Tailwind v4 architecture)

## UNIQUE STYLES

**Terminal Aesthetic:**
- Monospace fonts for UI (`--font-mono`: Hack, Mononoki, Consolas)
- Border-based layout (1px solid `--border`)
- High contrast colors (WCAG AA compliant)
- Minimal rounded corners (`--radius: 20px`)

**Component Patterns:**
- Callouts use `data-callout` attribute for variants (12 types)
- Syntax highlighting maps Rouge tokens to CSS variables
- Canvas uses CSS transforms (`translate(var(--pan-x), var(--pan-y)) scale(var(--scale))`)

**Typography Hybrid:**
- UI elements (nav, sidebar): Monospace (`--font-mono`)
- Article content: Prose font (`--font-prose`)
- Headings: Monospace (terminal aesthetic)

## COMMANDS

```bash
# Build Tailwind CSS (includes component files)
npm run build:js           # Compiles tailwind.css → compiled.css

# Watch during development
npm run watch:js           # Rebuilds on CSS file changes
```

## NOTES

- **Total Lines**: 1,156 lines across CSS files
- **Compiled Size**: 92KB for `compiled.css` (Tailwind v4 output)
- **No Technical Debt**: Clean codebase, no TODO/FIXME markers
- **Conditional Loading**: `knowledgebase.css` and `jcanvas/style.css` loaded only when needed
- **Syntax Highlighting**: Works with both Rouge-generated blocks and React `CodeBlock` component

**Canvas-Specific Variables:**
- `--scale`: Zoom level (controlled by canvas controls)
- `--pan-x`, `--pan-y`: Pan position (controlled by drag gestures)
- `--border`, `--accent`: Theme colors for nodes and edges

**Color Palette (Chart Colors):**
- `--chart-1` through `--chart-5`: Used for syntax highlighting, data visualization, and callout variants
- Mapped to Tailwind utilities (`bg-chart-1`, `text-chart-2`, etc.)
