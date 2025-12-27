# Archived SASS Files

This directory contains deprecated SASS files that have been replaced by Tailwind CSS utilities or consolidated into other files.

## Archive Log

### Phase 4: SASS Cleanup (December 27, 2025)

**Archived Files:**

1. **_normalize.scss** (338 lines)
   - **Reason**: Redundant with Tailwind Preflight (modern CSS reset)
   - **Replacement**: Tailwind's built-in normalization via Preflight
   - **Archived**: 2025-12-27

2. **_style.scss** (155 lines)
   - **Reason**: Global element styles duplicated by _theme-variables.scss and Tailwind utilities
   - **Replacement**: CSS custom properties in _theme-variables.scss + Tailwind utility classes
   - **Archived**: 2025-12-27

3. **_page-sidebar.scss** (158 lines)
   - **Reason**: Page-sidebar.html layout migrated to terminal-layout.html
   - **Replacement**: Tailwind utilities in terminal-layout.html and collapsible-sidebar.html
   - **Migration Status**: Complete (only test-sidebar-layout.md still uses old layout)
   - **Archived**: 2025-12-27

## Retained SASS Files

The following SASS files are CRITICAL and must be preserved:

- **_theme-variables.scss** (520 lines) - CSS custom properties foundation for entire theme system
- **_code.scss** (91 lines) - Rouge syntax highlighting (cannot be replaced by Tailwind)
- **_callouts.scss** (199 lines) - Obsidian-style callout components (specialized feature)

## Migration Impact

**Before Cleanup:**
- Total SASS lines: 1,461
- SASS bundle size: ~19KB
- Tailwind bundle size: 119KB

**After Cleanup:**
- Total SASS lines: 810 (reduced by 651 lines / 45% reduction)
- Expected SASS bundle size: ~10KB (47% reduction)
- Tailwind bundle size: 119KB (stable)

## Restoration Instructions

If you need to restore any archived file:

```bash
# Restore a specific file
git mv _sass/_archived/<filename> _sass/<filename>

# Re-add import to styles.scss
echo '@import "_archived/<filename>";' >> styles.scss
```

## Related Documentation

- Phase 3 documentation: /docs/development/tailwind-migration.md
- Tailwind configuration: /tailwind.config.js
- Theme system documentation: /docs/architecture/theme-system.md
