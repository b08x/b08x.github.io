# Implementation Plan: Refactor Terminal Nomenclature + Performance Optimizations

**Source:** `todo.md`  
**Session ID:** `refactor-terminal-naming-2026-01-07`  
**Created:** 2026-01-07 14:02:30 EST  
**Current Branch:** `development`

## 📋 Overview

This is a comprehensive refactoring plan with 4 major phases:

1. **Phase 1: Nomenclature Cleanup** - Remove misleading "terminal" naming (design is IDE/editor aesthetic)
2. **Phase 2: Performance Optimizations** - Self-host fonts + enable code splitting
3. **Phase 3: Code Cleanup** - Remove commented code, update docs
4. **Phase 4: Verification & Deployment** - Testing and release

**Risk Level:** LOW (all changes are reversible via git)  
**Estimated Time:** 7-9 hours  
**Architecture:** Modern (Tailwind 4.x, React 19, CSS variables, island architecture)

---

## 🎯 Phase 1: Nomenclature Cleanup (2-3 hours)

### ✅ 1.1 Pre-Flight Safety Checks

- [ ] **1.1.1** Check for naming conflicts (header.html, sidebar.html, sidebar-layout.html)
- [ ] **1.1.2** Create backup branch: `refactor/remove-terminal-naming`
- [ ] **1.1.3** Checkpoint commit before starting

### ✅ 1.2 File Renames (git mv)

- [ ] **1.2.1** Rename `_layouts/terminal-layout.html` → `sidebar-layout.html`
- [ ] **1.2.2** Rename `_layouts/terminal-note.html` → `note-sidebar.html`
- [ ] **1.2.3** Rename `_includes/terminal-header.html` → `header.html`
- [ ] **1.2.4** Rename `_includes/terminal-sidebar.html` → `sidebar.html`

### ✅ 1.3 Update Layout References

- [ ] **1.3.1** Update child layouts extending `terminal-layout` (8 files: note.html, knowledgebase.html, page-sidebar.html, wiki.html, wiki-page.html)
- [ ] **1.3.2** Update `_config.yml` defaults (line 89: terminal-note → note-sidebar)
- [ ] **1.3.3** Update content files using `terminal-note` layout (e.g., `_notes/2024-01-26 NLP Semantic and Logical Inversion in Ruby.md`)

### ✅ 1.4 Update Include References

- [ ] **1.4.1** Update `{% include terminal-header.html %}` → `{% include header.html %}` in `_layouts/base-shell.html`
- [ ] **1.4.2** Update `{% include terminal-sidebar.html %}` → `{% include sidebar.html %}` in `sidebar-layout.html`

### ✅ 1.5 Update Variable Names

- [ ] **1.5.1** Update `left_sidebar: terminal-sidebar` → `navigation-sidebar` in `sidebar-layout.html` conditions
- [ ] **1.5.2** Update child layouts (note-sidebar.html, note.html) using `left_sidebar` variable

### ✅ 1.6 Update Documentation

- [ ] **1.6.1** Update `./AGENTS.md` (terminal-* references)
- [ ] **1.6.2** Update `_layouts/AGENTS.md` (terminal-* references)
- [ ] **1.6.3** Update `_includes/AGENTS.md` (terminal-* references)
- [ ] **1.6.4** Update `README.md` (terminal aesthetic → IDE/editor aesthetic)

### ✅ 1.7 Update CSS/JS References

- [ ] **1.7.1** Search for hardcoded "terminal" strings in JS files
- [ ] **1.7.2** Rename `assets/js/terminal-toc.js` → `sidebar-toc.js` if exists

### ✅ 1.8 Verification

- [ ] **1.8.1** Build check: `npm run build` (no errors)
- [ ] **1.8.2** Jekyll build: `bundle exec jekyll build` (no missing includes)
- [ ] **1.8.3** Visual verification: `bundle exec jekyll serve` (test homepage, notes, wikis, about)
- [ ] **1.8.4** Search for remaining "terminal" references (should only be in comments)

### ✅ 1.9 Commit

- [ ] **1.9.1** Stage and commit with detailed BREAKING CHANGES message

---

## ⚡ Phase 2: Performance Optimizations (3-4 hours)

### ✅ 2.1 Self-Host Google Fonts

#### 2.1.1 Download Fonts

- [ ] **2.1.1.1** Download JetBrains Mono (300, 400, 500, 700 weights) woff2 + ttf
- [ ] **2.1.1.2** Download Inter (400, 500, 600, 700 weights) woff2 + ttf
- [ ] **2.1.1.3** Organize files: `assets/fonts/JetBrainsMono-{weight}.woff2`, `Inter-{weight}.woff2`

#### 2.1.2 Add @font-face Declarations

- [ ] **2.1.2.1** Update `_sass/_fonts.scss` with JetBrains Mono declarations (4 weights)
- [ ] **2.1.2.2** Update `_sass/_fonts.scss` with Inter declarations (4 weights)

#### 2.1.3 Remove Google Fonts CDN

- [ ] **2.1.3.1** Remove lines 37-40 from `_layouts/base-shell.html` (preconnect + stylesheet)
- [ ] **2.1.3.2** Remove lines 16-19 from `_includes/head.html` (duplicate Google Fonts links)

#### 2.1.4 Update Font Stack Variables

- [ ] **2.1.4.1** Update `_sass/_theme-variables.scss` lines 91-92:
  - `--font-mono: 'JetBrains Mono', 'Hack', 'Mononoki', 'Courier New', monospace`
  - `--font-prose: 'Inter', 'Hack', -apple-system, BlinkMacSystemFont, sans-serif`

#### 2.1.5 Test Font Loading

- [ ] **2.1.5.1** Build: `npm run build:css`
- [ ] **2.1.5.2** Serve: `bundle exec jekyll serve`
- [ ] **2.1.5.3** Verify: No 404s, fonts render, fallbacks work, no FOUT

#### 2.1.6 Commit

- [ ] **2.1.6.1** Commit with perf message (benefits: eliminate DNS lookups, privacy, faster loading)

---

### ✅ 2.2 Enable JavaScript Code Splitting

#### 2.2.1 Update esbuild Configuration

- [ ] **2.2.1.1** Update `package.json` line 10 `build:js` script:
  - Add `--splitting --format=esm --outdir=assets/js/dist/`
  - Add `--entry-names=[name] --chunk-names=chunks/[name]`
- [ ] **2.2.1.2** Update `package.json` line 14 `watch:js` script (same changes)

#### 2.2.2 Update Script Loading

- [ ] **2.2.2.1** Update `_layouts/base-shell.html` line ~115:
  - Replace `garden-widgets-v2.js` with `main.js`
  - Change to `<script type="module" defer src="...main.js?v={{ site.time | date: '%s' }}">`

#### 2.2.3 Verify Code Splitting

- [ ] **2.2.3.1** Build: `npm run build:js`
- [ ] **2.2.3.2** Inspect output: `ls -lh assets/js/dist/` and `ls -lh assets/js/dist/chunks/`
- [ ] **2.2.3.3** Test lazy loading: DevTools Network tab (verify chunks load on-demand)

#### 2.2.4 Measure Improvement

- [ ] **2.2.4.1** Compare bundle sizes (before: single file, after: main.js + chunks/)
- [ ] **2.2.4.2** Expected: ~50-70% smaller initial bundle

#### 2.2.5 Commit

- [ ] **2.2.5.1** Commit with perf message (benefits: reduce bundle size, lazy-load, improve FCP)

---

## 🧹 Phase 3: Code Cleanup (30 minutes)

### ✅ 3.1 Remove Commented Code

- [ ] **3.1.1** Remove lines 69-79 from `_sass/_fonts.scss` (commented Sass variables)
- [ ] **3.1.2** Commit: "chore: Remove commented-out Sass variable definitions"

### ✅ 3.2 Update AGENTS.md Descriptions

- [ ] **3.2.1** Update `./AGENTS.md`: "terminal aesthetic" → "high-contrast IDE/code editor aesthetic"
- [ ] **3.2.2** Update `_sass/AGENTS.md`: "Terminal aesthetic theme" → "High-contrast IDE/editor aesthetic theme"
- [ ] **3.2.3** Commit: "docs: Update aesthetic description (terminal → IDE/editor)"

---

## ✅ Phase 4: Final Verification & Deployment (1 hour)

### ✅ 4.1 Comprehensive Build Test

- [ ] **4.1.1** Clean build: `npm run build && bundle exec jekyll clean && bundle exec jekyll build`
- [ ] **4.1.2** Verify: No errors, all pages generated

### ✅ 4.2 Visual Regression Testing

- [ ] **4.2.1** Test homepage (`/`): Header, sidebar toggle, theme toggle
- [ ] **4.2.2** Test note with sidebar (`/notes/test-note/`): Sidebar nav, TOC, graph link
- [ ] **4.2.3** Test wiki index (`/wikis/`): Card grid, pagination
- [ ] **4.2.4** Test simple page (`/about/`): Centered content, no sidebar
- [ ] **4.2.5** Test knowledgebase (`/pages/video-kb-example/`): Carousel, sidebar
- [ ] **4.2.6** Verify for all: Layout renders, fonts load, JS chunks load, theme toggle, responsive, no console errors

### ✅ 4.3 Performance Metrics

- [ ] **4.3.1** Run Lighthouse audit (before/after comparison)
- [ ] **4.3.2** Verify improvements: Bundle size -50-70%, font loading -200-500ms, Performance score +5-15 points

### ✅ 4.4 Merge to Main

- [ ] **4.4.1** Review commits: `git log --oneline -10`
- [ ] **4.4.2** Merge: `git checkout main && git merge refactor/remove-terminal-naming`
- [ ] **4.4.3** Tag release: `git tag -a v1.1.0 -m "..."`
- [ ] **4.4.4** Push: `git push origin main --tags`

---

## 📊 Success Criteria

**Clarity:**
- ✅ Layouts named by function (sidebar-layout, note-sidebar)
- ✅ Includes simplified (header.html, sidebar.html)
- ✅ Documentation reflects IDE/editor aesthetic

**Performance:**
- ✅ 0 external font requests (was 2-3)
- ✅ ~50-70% smaller initial JS bundle
- ✅ Lazy-load heavy components

**Maintainability:**
- ✅ No commented-out dead code
- ✅ Consistent nomenclature
- ✅ Accurate documentation

**No Breakage:**
- ✅ All pages render correctly
- ✅ All features work (search, theme toggle, sidebar, graphs)
- ✅ Mobile responsive preserved

---

## 🚫 Explicitly NOT Doing

- ❌ Move `_sass/` to `assets/css/components/` (already uses CSS variables)
- ❌ Implement CSS Grid for sidebar (Flexbox works perfectly)
- ❌ Mobile drawer pattern (current stack works well)
- ❌ Consolidate note.html and note-sidebar.html (different configs)
- ❌ Consolidate content-layout.html and sidebar-layout.html (different purposes)

---

## 📝 Implementation Notes

**Total Tasks:** 63 discrete subtasks  
**Estimated Time:** 7-9 hours  
**Risk Level:** LOW (git-reversible, incremental commits)  
**Dependencies:** None (can start immediately)

**Next Steps After Completion:**
- Monitor Lighthouse scores post-deployment
- Consider font subsetting for further optimization
- Evaluate PurgeCSS for unused Tailwind classes

---

## 🔄 Session Status

**Current Phase:** Analysis Complete  
**Next Action:** Start Phase 1.1 (Pre-Flight Safety Checks)  
**Branch:** development → will create refactor/remove-terminal-naming  
**Last Updated:** 2026-01-07 14:02:30 EST
