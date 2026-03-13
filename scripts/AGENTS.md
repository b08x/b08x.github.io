# scripts/ - Build and Utility Scripts

**Generated:** 2026-03-12

## OVERVIEW

Ruby and shell scripts for site maintenance, content generation, and build automation.

## STRUCTURE

```
scripts/
└── generate_wiki.rb      # Wiki JSON generation script (12KB)
```

## WHERE TO LOOK

| Script | Purpose |
|--------|---------|
| `generate_wiki.rb` | Generates wiki JSON files from source |

## CONVENTIONS

- Ruby scripts use Jekyll APIs when needed
- Executable permission: `chmod +x script.rb`

## ANTI-PATTERNS

- **NEVER** commit credentials or API keys in scripts
- **AVOID** modifying Jekyll build process directly - use plugins instead

## NOTES

- Minimal scripts directory - most automation in npm scripts or GitHub Actions
