# _sass/ - SCSS Theme System

Terminal aesthetic theme system with CSS variables for dual light/dark mode support.

## STRUCTURE

```
_sass/
├── _theme-variables.scss    # CSS variables (light/dark), typography, design tokens (544 LOC)
└── _fonts.scss               # Custom font imports (Mononoki, Hack) (79 LOC)
```

## WHERE TO LOOK

| Task | Variable | Location | Notes |
|------|-----------|-----------|-------|
| Change accent color | `--accent` | Primary accent color (blue #3498db) |
| Modify theme toggle | `.dark` class | Dark mode overrides in _theme-variables.scss |
| Add design token | `--radius`, `--space-*` | Global spacing/border radius scale |
| Font configuration | `--font-mono`, `--font-prose` | Monospace for UI, readable prose font for content |
| Syntax colors | `--chart-1` to `--chart-5` | Color palette for code highlighting |

## CONVENTIONS

- **CSS Variable First**: All theme values use CSS variables (never hardcode hex/RGB)
- **Dark Mode**: Apply `.dark` class to `<html>` element for theme switching
- **Tailwind Integration**: Variables mapped to Tailwind utilities in `tailwind.config.js`
- **Hybrid Typography**: Monospace (Hack/Mononoki) for UI, prose fonts for article content

## ANTI-PATTERNS

- **NEVER** hardcode colors - use `var(--foreground)`, `var(--accent)`, etc.
- **AVOID** creating new color variables without considering dark mode overrides
- **DON'T** bypass CSS variable system for interactive components (breaks theme sync)
