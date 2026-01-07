# _sass/ - SCSS Theme System

IDE/editor aesthetic theme system with CSS variables for dual light/dark mode support. Self-hosted fonts (JetBrains Mono, Inter).

## STRUCTURE

```
_sass/
├── _theme-variables.scss    # CSS variables (light/dark), typography, design tokens (544 LOC)
└── _fonts.scss               # @font-face declarations for self-hosted fonts (79 LOC)
```

## WHERE TO LOOK

| Task | Variable | Location | Notes |
|------|-----------|-----------|-------|
| Change accent color | `--accent` | Primary accent color (blue #3498db) |
| Modify theme toggle | `.dark` class | Dark mode overrides in _theme-variables.scss |
| Add design token | `--radius`, `--space-*` | Global spacing/border radius scale |
| Font configuration | `--font-mono`, `--font-prose` | JetBrains Mono + Hack for code, Inter for content |
| Syntax colors | `--chart-1` to `--chart-5` | Color palette for code highlighting |

## CONVENTIONS

- **CSS Variable First**: All theme values use CSS variables (never hardcode hex/RGB)
- **Dark Mode**: Apply `.dark` class to `<html>` element for theme switching
- **Tailwind Integration**: Variables mapped to Tailwind utilities in `tailwind.config.js`
- **Hybrid Typography**: JetBrains Mono/Hack for code/UI, Inter for prose content
- **Self-Hosted Fonts**: 16 font files in `assets/fonts/` (woff2 + ttf), no Google CDN

## ANTI-PATTERNS

- **NEVER** hardcode colors - use `var(--foreground)`, `var(--accent)`, etc.
- **AVOID** creating new color variables without considering dark mode overrides
- **DON'T** bypass CSS variable system for interactive components (breaks theme sync)
