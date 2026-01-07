# UTILS KNOWLEDGE BASE (src/utils/)

**Generated:** 2026-01-07
**Last Updated:** 2026-01-07

## OVERVIEW

Core TypeScript utilities for theme synchronization (CSS variables to React/JS) and code block transformation.

## STRUCTURE

```
src/utils/
├── codeProcessor.ts    # HTML parsing, code extraction, and island conversion
├── mermaidTheme.ts     # Mermaid diagram theme mapping and initialization
└── syntaxTheme.ts      # React-syntax-highlighter theme mapping via CSS variables
```

## WHERE TO LOOK

| Function | File | Purpose |
|----------|------|---------|
| `extractCodeBlocks` | `codeProcessor.ts` | Parses Rouge HTML into `CodeBlock` objects |
| `replaceCodeBlocksWithIslands` | `codeProcessor.ts` | Converts static HTML to React island markers |
| `detectFileName` | `codeProcessor.ts` | Heuristic for extracting filenames from code comments |
| `getSyntaxTheme` | `syntaxTheme.ts` | Generates dynamic Prism styles from CSS variables |
| `initMermaid` | `mermaidTheme.ts` | Global Mermaid config with theme-aware settings |

## CONVENTIONS

- **Theme Sync**: All utilities must read from `document.documentElement` CSS variables (`--accent`, `--foreground`, etc.) to ensure zero-lag switching between dark/light modes.
- **Islands Integration**: `codeProcessor` is the primary bridge between Jekyll's static output and React's hydration logic.
- **Type Safety**: All exported functions and data structures (e.g., `CodeBlock`, `SyntaxTheme`) must have explicit TypeScript types/interfaces.
- **Stateless Logic**: Utilities should remain pure functions where possible, relying on DOM state only for theme variable lookups.

## ANTI-PATTERNS

- **NEVER** hardcode hex/RGB colors; always use `getCSSVar('--variable')` or equivalent.
- **AVOID** duplicating language alias logic; update `LANGUAGE_ALIASES` in `codeProcessor.ts`.
- **DON'T** manually manipulate Rouge HTML in components; use the centralized `codeProcessor` functions.
- **AVOID** synchronous initialization of Mermaid in component bodies; use `initMermaid` during mount.
