# 📌 Remediation & Refactoring Plan (REVISED)

**Generated:** Wednesday, January 7, 2026  
**Status:** Ready for Implementation  
**Analysis Basis:** Comprehensive codebase analysis via 4 parallel explore agents + direct inspection

---

## 📊 Analysis Summary

**Codebase Health:** ✅ GOOD  
**Architecture:** Modern (Tailwind 4.x, React 19, CSS variables, island architecture)  
**Primary Need:** Nomenclature cleanup + targeted performance optimizations

**Original Plan Issues Identified:**
- ❌ Assumed Sass variables exist (reality: CSS custom properties already used)
- ❌ Assumed layouts are duplicates (reality: different purposes - simple vs. sidebar-based)
- ❌ Assumed JS width toggling exists (reality: CSS-only responsive with Flexbox)
- ❌ Assumed fonts not self-hosted (reality: 50% already self-hosted)

**Revised Focus:**
1. Remove misleading "terminal" nomenclature (design is IDE/editor aesthetic, not terminal)
2. Performance wins (self-host remaining fonts, enable code splitting)
3. Code cleanup (remove commented code, update documentation)

---

## 🎯 Phase 1: Nomenclature Cleanup - Remove "Terminal" Concept

**Rationale:** The design is a **high-contrast IDE/code editor aesthetic** with monospace fonts and border-based layout, NOT a terminal interface. The "terminal-*" naming creates conceptual confusion.

### Step 1.1: Pre-Flight Safety Checks

- [ ] **Verify No Conflicts:**
  ```bash
  # Check if target names already exist
  ls _includes/header.html _includes/sidebar.html 2>/dev/null
  ls _layouts/sidebar-layout.html 2>/dev/null
  ```
  - **Expected:** No output (files don't exist)
  - **If files exist:** Rename to `*.old.html` before proceeding

- [ ] **Create Backup Branch:**
  ```bash
  git checkout -b refactor/remove-terminal-naming
  git add -A && git commit -m "Checkpoint before nomenclature refactor"
  ```

### Step 1.2: Rename Layout Files

- [ ] **Rename `terminal-layout.html` → `sidebar-layout.html`:**
  ```bash
  git mv _layouts/terminal-layout.html _layouts/sidebar-layout.html
  ```
  - **Purpose:** Describes what it does (configurable sidebars) not a false "terminal" concept

- [ ] **Rename `terminal-note.html` → `note-sidebar.html`:**
  ```bash
  git mv _layouts/terminal-note.html _layouts/note-sidebar.html
  ```
  - **Purpose:** Note layout with sidebar (differentiates from simple `note.html`)

### Step 1.3: Rename Include Files

- [ ] **Rename `terminal-header.html` → `header.html`:**
  ```bash
  git mv _includes/terminal-header.html _includes/header.html
  ```

- [ ] **Rename `terminal-sidebar.html` → `sidebar.html`:**
  ```bash
  git mv _includes/terminal-sidebar.html _includes/sidebar.html
  ```

### Step 1.4: Update Layout References

- [ ] **Update child layouts extending `terminal-layout`:**
  
  Files to update (8 total):
  - `_layouts/note.html` (line 2)
  - `_layouts/knowledgebase.html` (line 2)
  - `_layouts/page-sidebar.html` (line 2)
  - `_layouts/wiki.html` (line 2)
  - `_layouts/wiki-page.html` (line 2)
  - Any other layouts found via:
    ```bash
    grep -l "layout: terminal-layout" _layouts/*.html
    ```
  
  **Change:**
  ```yaml
  # FROM:
  layout: terminal-layout
  
  # TO:
  layout: sidebar-layout
  ```

- [ ] **Update `_config.yml` defaults:**
  
  File: `_config.yml` (line 89)
  
  **Change:**
  ```yaml
  # FROM:
  defaults:
    - scope:
        path: "_notes"
      values:
        layout: "terminal-note"
  
  # TO:
  defaults:
    - scope:
        path: "_notes"
      values:
        layout: "note-sidebar"
  ```

- [ ] **Update content files using `terminal-note` layout:**
  
  File: `_notes/2024-01-26 NLP Semantic and Logical Inversion in Ruby.md` (line 11)
  
  **Change:**
  ```yaml
  # FROM:
  layout: terminal-note
  
  # TO:
  layout: note-sidebar
  ```

### Step 1.5: Update Include References

- [ ] **Update layouts including `terminal-header.html`:**
  
  Files to update:
  - `_layouts/base-shell.html`
  - Any others found via:
    ```bash
    grep -l "terminal-header.html" _layouts/*.html _includes/*.html
    ```
  
  **Change:**
  ```liquid
  # FROM:
  {% include terminal-header.html %}
  
  # TO:
  {% include header.html %}
  ```

- [ ] **Update layouts including `terminal-sidebar.html`:**
  
  Expected location: `_layouts/sidebar-layout.html` (after rename)
  
  **Change:**
  ```liquid
  # FROM:
  {% include terminal-sidebar.html %}
  
  # TO:
  {% include sidebar.html %}
  ```

### Step 1.6: Update Variable Names in `sidebar-layout.html`

- [ ] **Update sidebar configuration variable names:**
  
  File: `_layouts/sidebar-layout.html` (after rename)
  
  **Find and update references:**
  ```yaml
  # Current sidebar modes:
  left_sidebar: terminal-sidebar    # Used in note.html, note-sidebar.html
  
  # Rename to:
  left_sidebar: navigation-sidebar  # More accurate semantic name
  ```
  
  **Update condition in layout (line 55-61):**
  ```liquid
  # FROM:
  {% if page.left_sidebar == 'terminal-sidebar' %}
    {% include terminal-sidebar.html %}
  {% endif %}
  
  # TO:
  {% if page.left_sidebar == 'navigation-sidebar' %}
    {% include sidebar.html %}
  {% endif %}
  ```

- [ ] **Update child layouts using sidebar mode:**
  
  Files:
  - `_layouts/note-sidebar.html` (was terminal-note.html)
  - `_layouts/note.html`
  
  **Change:**
  ```yaml
  # FROM:
  left_sidebar: terminal-sidebar
  
  # TO:
  left_sidebar: navigation-sidebar
  ```

### Step 1.7: Update Documentation

- [ ] **Update `AGENTS.md` references:**
  
  Files to update:
  - `./AGENTS.md`
  - `_layouts/AGENTS.md`
  - `_includes/AGENTS.md`
  
  **Find and replace:**
  - `terminal-layout` → `sidebar-layout`
  - `terminal-note` → `note-sidebar`
  - `terminal-header` → `header`
  - `terminal-sidebar` → `sidebar` (when referring to file)
  - `terminal-sidebar` → `navigation-sidebar` (when referring to mode/variable)

- [ ] **Update `README.md`:**
  
  Search for "terminal" references and update to reflect IDE/editor aesthetic

### Step 1.8: Update CSS/JavaScript References

- [ ] **Check for hardcoded "terminal" strings in scripts:**
  ```bash
  grep -r "terminal" assets/js/*.js _layouts/*.html _includes/*.html
  ```
  
  **Known files to check:**
  - `assets/js/terminal-toc.js` - rename if needed
  - CSS class names in `sidebar-layout.html`

- [ ] **Update TOC script if needed:**
  ```bash
  # If terminal-toc.js exists:
  git mv assets/js/terminal-toc.js assets/js/sidebar-toc.js
  
  # Update reference in sidebar-layout.html
  ```

### Step 1.9: Verification

- [ ] **Build Check:**
  ```bash
  npm run build
  ```
  - **Expected:** No errors, successful compilation

- [ ] **Jekyll Build:**
  ```bash
  bundle exec jekyll build
  ```
  - **Expected:** No "Missing include" errors, no broken layout chains

- [ ] **Visual Verification:**
  ```bash
  bundle exec jekyll serve
  ```
  - **Check pages:**
    - `/` (homepage)
    - `/notes/test-note/` (note with sidebar)
    - `/wikis/` (wiki index)
    - `/about/` (simple content page)
  
  - **Verify:**
    - ✅ Header appears correctly
    - ✅ Sidebar appears on note pages
    - ✅ Navigation works
    - ✅ Theme toggle works
    - ✅ Mobile responsive (test at 768px, 1024px breakpoints)

- [ ] **Search for Remaining "terminal" References:**
  ```bash
  # Should only find CSS variable names and theme descriptions
  grep -ri "terminal" _layouts _includes _sass assets/css | grep -v "terminal aesthetic"
  ```

### Step 1.10: Commit Changes

- [ ] **Stage and Commit:**
  ```bash
  git add -A
  git commit -m "refactor: Remove misleading 'terminal' nomenclature
  
  - Rename terminal-layout → sidebar-layout (describes functionality)
  - Rename terminal-note → note-sidebar (differentiates from simple note)
  - Rename terminal-header → header (no namespace needed)
  - Rename terminal-sidebar → sidebar (include file)
  - Update sidebar mode: terminal-sidebar → navigation-sidebar (variable)
  - Update all layout references in child layouts and content files
  - Update _config.yml defaults
  - Update documentation (AGENTS.md, README.md)
  
  BREAKING CHANGES:
  - Layout name: terminal-layout → sidebar-layout
  - Layout name: terminal-note → note-sidebar
  - Sidebar mode: terminal-sidebar → navigation-sidebar
  - Include files: terminal-header.html → header.html, terminal-sidebar.html → sidebar.html
  
  Migration: Update any custom content using these layout names."
  ```

---

## ⚡ Phase 2: Performance Optimizations

### Task 2.1: Self-Host Google Fonts

**Current State:**
- ✅ Self-hosted: Mononoki (8 files) + Hack (4 files)
- ❌ CDN-loaded: JetBrains Mono + Inter from Google Fonts

**Files Using CDN:**
- `_layouts/base-shell.html` (lines 37-40)
- `_includes/head.html` (lines 16-19)
- `_projects/voice-to-ssml/index.html` (lines 10-12) - uses different fonts (Fira Code, Lato, Montserrat)

#### Step 2.1.1: Download Fonts

- [ ] **Download JetBrains Mono:**
  ```bash
  # Download from https://fonts.google.com/specimen/JetBrains+Mono
  # Weights needed: 300, 400, 500, 700
  # Formats: woff2 (modern browsers), ttf (fallback)
  
  wget https://fonts.google.com/download?family=JetBrains%20Mono -O jetbrains-mono.zip
  unzip jetbrains-mono.zip -d assets/fonts/jetbrains-mono/
  ```

- [ ] **Download Inter:**
  ```bash
  # Download from https://fonts.google.com/specimen/Inter
  # Weights needed: 400, 500, 600, 700
  
  wget https://fonts.google.com/download?family=Inter -O inter.zip
  unzip inter.zip -d assets/fonts/inter/
  ```

- [ ] **Organize Font Files:**
  ```bash
  # Move to assets/fonts/ root with consistent naming:
  mv assets/fonts/jetbrains-mono/JetBrainsMono-Light.woff2 assets/fonts/JetBrainsMono-300.woff2
  mv assets/fonts/jetbrains-mono/JetBrainsMono-Regular.woff2 assets/fonts/JetBrainsMono-400.woff2
  mv assets/fonts/jetbrains-mono/JetBrainsMono-Medium.woff2 assets/fonts/JetBrainsMono-500.woff2
  mv assets/fonts/jetbrains-mono/JetBrainsMono-Bold.woff2 assets/fonts/JetBrainsMono-700.woff2
  
  # Repeat for Inter...
  ```

#### Step 2.1.2: Add `@font-face` Declarations

- [ ] **Update `_sass/_fonts.scss`:**
  
  Add after existing Hack definitions (after line 67):
  
  ```scss
  // Font imports for JetBrains Mono (for code/monospace)
  @font-face {
    font-family: 'JetBrains Mono';
    src: url('../assets/fonts/JetBrainsMono-300.woff2') format('woff2'),
         url('../assets/fonts/JetBrainsMono-300.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'JetBrains Mono';
    src: url('../assets/fonts/JetBrainsMono-400.woff2') format('woff2'),
         url('../assets/fonts/JetBrainsMono-400.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'JetBrains Mono';
    src: url('../assets/fonts/JetBrainsMono-500.woff2') format('woff2'),
         url('../assets/fonts/JetBrainsMono-500.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'JetBrains Mono';
    src: url('../assets/fonts/JetBrainsMono-700.woff2') format('woff2'),
         url('../assets/fonts/JetBrainsMono-700.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  
  // Font imports for Inter (for UI text)
  @font-face {
    font-family: 'Inter';
    src: url('../assets/fonts/Inter-400.woff2') format('woff2'),
         url('../assets/fonts/Inter-400.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'Inter';
    src: url('../assets/fonts/Inter-500.woff2') format('woff2'),
         url('../assets/fonts/Inter-500.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'Inter';
    src: url('../assets/fonts/Inter-600.woff2') format('woff2'),
         url('../assets/fonts/Inter-600.ttf') format('truetype');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'Inter';
    src: url('../assets/fonts/Inter-700.woff2') format('woff2'),
         url('../assets/fonts/Inter-700.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  ```

#### Step 2.1.3: Remove Google Fonts CDN Links

- [ ] **Update `_layouts/base-shell.html`:**
  
  **Remove lines 37-40:**
  ```html
  <!-- DELETE THESE LINES: -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Inter:wght@400;500;600;700&display=swap"
    media="print" onload="this.media='all'">
  ```

- [ ] **Update `_includes/head.html`:**
  
  **Remove lines 16-19** (same Google Fonts links)

#### Step 2.1.4: Update Font Stack Variables

- [ ] **Verify `_sass/_theme-variables.scss` font stacks:**
  
  Check lines 91-92:
  ```scss
  --font-mono: 'Courier New', 'Courier', monospace;
  --font-prose: 'Hack', 'Consolas', monospace;
  ```
  
  **Update to:**
  ```scss
  --font-mono: 'JetBrains Mono', 'Hack', 'Mononoki', 'Courier New', monospace;
  --font-prose: 'Inter', 'Hack', -apple-system, BlinkMacSystemFont, sans-serif;
  ```

#### Step 2.1.5: Test Font Loading

- [ ] **Build and verify:**
  ```bash
  npm run build:css
  bundle exec jekyll serve
  ```
  
  **Check:**
  - ✅ No 404 errors for font files in Network tab
  - ✅ Fonts render correctly
  - ✅ Fallbacks work if fonts fail to load
  - ✅ No FOUT (Flash of Unstyled Text) - `font-display: swap` should prevent this

#### Step 2.1.6: Commit Font Self-Hosting

- [ ] **Commit:**
  ```bash
  git add assets/fonts _sass/_fonts.scss _sass/_theme-variables.scss _layouts/base-shell.html _includes/head.html
  git commit -m "perf: Self-host JetBrains Mono and Inter fonts
  
  - Download JetBrains Mono (300, 400, 500, 700) and Inter (400, 500, 600, 700)
  - Add @font-face declarations to _sass/_fonts.scss
  - Remove Google Fonts CDN links from base-shell.html and head.html
  - Update font stack variables in _theme-variables.scss
  
  Benefits:
  - Eliminate 2-3 external DNS lookups
  - Improve privacy (no Google tracking)
  - Faster font loading (local cache)
  - Reduce TTFB (Time to First Byte)"
  ```

---

### Task 2.2: Enable JavaScript Code Splitting

**Current State:**
- Single bundle: `garden-widgets-v2.js` (~all 18 React components)
- Separate worker: `graph.worker.js`
- No code splitting → users download VideoPlayer/JsonCanvasViewer on every page

**Goal:** Split bundle into chunks, lazy-load heavy components only when needed

#### Step 2.2.1: Update esbuild Configuration

- [ ] **Update `package.json` build scripts:**
  
  **Current (line 10):**
  ```json
  "build:js": "esbuild src/main.tsx --bundle --outfile=assets/js/dist/garden-widgets-v2.js --minify --sourcemap --target=es2020 --jsx=automatic --alias:react=./node_modules/react --alias:react-dom=./node_modules/react-dom"
  ```
  
  **Update to:**
  ```json
  "build:js": "esbuild src/main.tsx --bundle --splitting --format=esm --outdir=assets/js/dist/ --entry-names=[name] --chunk-names=chunks/[name] --minify --sourcemap --target=es2020 --jsx=automatic --alias:react=./node_modules/react --alias:react-dom=./node_modules/react-dom"
  ```
  
  **Changes explained:**
  - `--splitting`: Enable code splitting
  - `--format=esm`: Required for splitting (ESM modules)
  - `--outdir=assets/js/dist/`: Output directory instead of single file
  - `--entry-names=[name]`: Predictable main.js filename (no hash for Jekyll)
  - `--chunk-names=chunks/[name]`: Organize chunks in subdirectory

- [ ] **Update watch script (line 14):**
  
  **Update to:**
  ```json
  "watch:js": "esbuild src/main.tsx --bundle --splitting --format=esm --outdir=assets/js/dist/ --entry-names=[name] --chunk-names=chunks/[name] --sourcemap --target=es2020 --watch --jsx=automatic --alias:react=./node_modules/react --alias:react-dom=./node_modules/react-dom"
  ```

#### Step 2.2.2: Update Script Loading in Layouts

- [ ] **Update `_layouts/base-shell.html`:**
  
  **Find (around line 115):**
  ```html
  <script defer src="{{ site.baseurl }}/assets/js/dist/garden-widgets-v2.js"></script>
  ```
  
  **Replace with:**
  ```html
  <script type="module" defer src="{{ site.baseurl }}/assets/js/dist/main.js?v={{ site.time | date: '%s' }}"></script>
  ```
  
  **Note:** Cache busting via `?v={{ site.time }}` ensures fresh chunks after rebuild

#### Step 2.2.3: Verify Code Splitting Works

- [ ] **Build and inspect output:**
  ```bash
  npm run build:js
  ls -lh assets/js/dist/
  ls -lh assets/js/dist/chunks/
  ```
  
  **Expected output:**
  ```
  main.js                    # Entry point
  chunks/react.js            # React shared chunk
  chunks/CodeBlock.js        # CodeBlock component chunk
  chunks/VideoPlayer.js      # VideoPlayer component chunk
  ...
  ```

- [ ] **Test lazy loading:**
  ```bash
  bundle exec jekyll serve
  ```
  
  **Open browser DevTools → Network tab:**
  - Visit homepage → should only load `main.js` + small chunks
  - Visit page with VideoPlayer → should dynamically load `VideoPlayer.js` chunk
  - Verify no errors in console

#### Step 2.2.4: Measure Bundle Size Improvement

- [ ] **Compare bundle sizes:**
  ```bash
  # Before (single bundle):
  ls -lh assets/js/dist/garden-widgets-v2.js
  
  # After (split bundles):
  du -sh assets/js/dist/
  ls -lh assets/js/dist/chunks/
  ```
  
  **Expected:**
  - Initial bundle size: ~50-70% smaller
  - Chunks load on-demand: Only when component is used

#### Step 2.2.5: Commit Code Splitting

- [ ] **Commit:**
  ```bash
  git add package.json _layouts/base-shell.html assets/js/dist/
  git commit -m "perf: Enable JavaScript code splitting with esbuild
  
  - Update build:js script to use --splitting --format=esm
  - Output to directory structure: main.js + chunks/[component].js
  - Update base-shell.html to load main.js as ES module
  - Add cache busting via Jekyll site.time
  
  Benefits:
  - Reduce initial bundle size by ~50-70%
  - Lazy-load heavy components (VideoPlayer, JsonCanvasViewer, GraphView)
  - Improve First Contentful Paint (FCP)
  - Better caching (chunks only invalidate when component changes)"
  ```

---

## 🧹 Phase 3: Code Cleanup

### Task 3.1: Remove Commented Code

- [ ] **Clean up `_sass/_fonts.scss`:**
  
  **Remove lines 69-79** (commented-out Sass variables):
  ```scss
  // DELETE THESE COMMENTED LINES:
  // // Font variables
  // $heading-font-family: 'Mononoki', 'Courier New', monospace;
  // // $body-font-family: 'Hack', 'Consolas', monospace;
  // $body-font-family: ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji"...
  // ...
  ```

- [ ] **Commit cleanup:**
  ```bash
  git add _sass/_fonts.scss
  git commit -m "chore: Remove commented-out Sass variable definitions
  
  CSS variables in _theme-variables.scss have replaced these.
  No functional change."
  ```

### Task 3.2: Update AGENTS.md Aesthetic Description

- [ ] **Update `./AGENTS.md` overview:**
  
  **Find:**
  ```markdown
  Jekyll static site with React island architecture for interactive components. 
  Digital garden + wiki system with terminal aesthetic...
  ```
  
  **Replace with:**
  ```markdown
  Jekyll static site with React island architecture for interactive components. 
  Digital garden + wiki system with high-contrast IDE/code editor aesthetic...
  ```

- [ ] **Update `_sass/AGENTS.md` references:**
  
  **Find:**
  ```markdown
  Terminal aesthetic theme system...
  ```
  
  **Replace with:**
  ```markdown
  High-contrast IDE/code editor aesthetic theme system...
  ```

- [ ] **Commit documentation updates:**
  ```bash
  git add AGENTS.md _sass/AGENTS.md README.md
  git commit -m "docs: Update aesthetic description (terminal → IDE/editor)
  
  Clarifies that the design is inspired by code editors/IDEs, 
  not terminal interfaces."
  ```

---

## ✅ Phase 4: Final Verification & Deployment

### Task 4.1: Comprehensive Build Test

- [ ] **Clean build:**
  ```bash
  npm run build
  bundle exec jekyll clean
  bundle exec jekyll build
  ```
  
  **Expected:** No errors, all pages generated

### Task 4.2: Visual Regression Testing

- [ ] **Test critical pages:**
  
  | Page | URL | Checks |
  |------|-----|--------|
  | Homepage | `/` | Header, sidebar toggle, theme toggle |
  | Note with sidebar | `/notes/test-note/` | Sidebar navigation, TOC, graph link |
  | Wiki index | `/wikis/` | Card grid, pagination |
  | Simple page | `/about/` | Centered content, no sidebar |
  | Knowledgebase | `/pages/video-kb-example/` | Carousel, sidebar |
  
  **For each page:**
  - ✅ Layout renders correctly
  - ✅ Fonts load (check for fallback fonts in DevTools)
  - ✅ JS chunks load on-demand (Network tab)
  - ✅ Theme toggle works (light/dark)
  - ✅ Mobile responsive (test 375px, 768px, 1024px, 1440px)
  - ✅ No console errors

### Task 4.3: Performance Metrics

- [ ] **Measure performance improvement:**
  
  **Before refactor:**
  ```bash
  # Lighthouse audit on homepage
  # Note: Bundle size, font loading time
  ```
  
  **After refactor:**
  ```bash
  # Re-run Lighthouse
  # Compare: FCP, LCP, TBT, bundle size
  ```
  
  **Expected improvements:**
  - ⬇️ Initial bundle size: -50-70%
  - ⬇️ Font loading time: -200-500ms (no external DNS lookup)
  - ⬆️ Lighthouse Performance score: +5-15 points

### Task 4.4: Merge to Main

- [ ] **Final commit:**
  ```bash
  git status
  git log --oneline -10  # Review commits
  ```

- [ ] **Merge to main:**
  ```bash
  git checkout main
  git merge refactor/remove-terminal-naming
  ```

- [ ] **Tag release:**
  ```bash
  git tag -a v1.1.0 -m "Release v1.1.0: Nomenclature cleanup + performance optimizations
  
  - Remove misleading 'terminal' nomenclature (→ IDE/editor aesthetic)
  - Self-host JetBrains Mono and Inter fonts
  - Enable JavaScript code splitting
  - Clean up commented code
  - Update documentation"
  
  git push origin main --tags
  ```

---

## 📊 Success Metrics

**After completing this plan:**

✅ **Clarity:**
- Layouts named by function (`sidebar-layout`, `note-sidebar`) not false concepts
- Includes named without namespace (`header.html`, `sidebar.html`)
- Documentation reflects actual IDE/editor aesthetic

✅ **Performance:**
- 0 external font requests (was 2-3)
- ~50-70% smaller initial JS bundle (code splitting)
- Lazy-load heavy components (VideoPlayer, JsonCanvasViewer)

✅ **Maintainability:**
- No commented-out dead code
- Consistent nomenclature across codebase
- Accurate documentation in AGENTS.md files

✅ **No Breakage:**
- All pages render correctly
- All features work (search, theme toggle, sidebar, graphs)
- Mobile responsive preserved

---

## 🚫 Explicitly NOT Doing (Based on Analysis)

❌ **DO NOT move `_sass/` files to `assets/css/components/`**
- _Reason:_ Already uses CSS variables, not Sass variables. Current architecture works.

❌ **DO NOT implement CSS Grid for sidebar**
- _Reason:_ Flexbox works perfectly, no JS width toggling exists, no CLS issues observed.

❌ **DO NOT implement mobile drawer pattern**
- _Reason:_ Current stack (flex-col → flex-row) works well, no accessibility issues reported.

❌ **DO NOT consolidate `note.html` and `note-sidebar.html` into one**
- _Reason:_ Different configurations (metadata, graph settings). Both actively used.

❌ **DO NOT consolidate `content-layout.html` and `sidebar-layout.html`**
- _Reason:_ Fundamentally different purposes (simple centered vs. configurable sidebars).

---

## 📝 Notes

**Estimated Time:**
- Phase 1 (Nomenclature): ~2-3 hours
- Phase 2 (Performance): ~3-4 hours
- Phase 3 (Cleanup): ~30 minutes
- Phase 4 (Verification): ~1 hour
- **Total:** ~7-9 hours

**Risk Level:** LOW
- All tasks are reversible (git revert)
- No database migrations or data loss risk
- Incremental commits allow rollback at any point

**Dependencies:**
- None - can start immediately

**Next Steps After Completion:**
- Monitor Lighthouse scores post-deployment
- Consider adding font subsetting for further optimization
- Evaluate PurgeCSS for unused Tailwind classes (minor gain expected)
