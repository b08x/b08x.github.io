# .github/ - GitHub Configuration

**Generated:** 2026-03-12

## OVERVIEW

GitHub-specific configuration including CI/CD workflows, issue templates, and funding.

## STRUCTURE

```
.github/
├── workflows/
│   └── jekyll.yml       # GitHub Actions workflow
├── ISSUE_TEMPLATE/       # Issue templates
├── dependabot.yml       # Dependency updates
└── FUNDING.yml         # Funding configuration
```

## WHERE TO LOOK

| File | Purpose |
|------|---------|
| `workflows/jekyll.yml` | Build and deploy to GitHub Pages |
| `dependabot.yml` | Automatic dependency updates |
| `FUNDING.yml` | Sponsor links |

## CONVENTIONS

- Workflows run on push to `main` branch
- Use `npm run build` for Jekyll + React builds
- Dependabot weekly schedule for npm and Ruby gems

## ANTI-PATTERNS

- **NEVER** commit secrets to workflows - use GitHub secrets
- **AVOID** expensive operations in CI - optimize build times
