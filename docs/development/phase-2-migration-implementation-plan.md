# Phase 2: Tailwind Configuration & Phased Migration Implementation Plan

**Project:** b08x.github.io Terminal Shell Layout System
**Phase:** 2 - Configuration & Migration Execution
**Date:** 2025-12-26
**Status:** Ready for Implementation

---

## Executive Summary

This document provides the complete production-ready Tailwind configuration and detailed phased migration strategy to transition from legacy SASS inline styles to a unified Tailwind-first layout system. The migration eliminates 282 lines of inline styles across 11 layouts while maintaining the Terminal aesthetic and preserving all React island functionality.

**Key Metrics:**
- **Target Layouts:** 11 layouts (4 modern + 7 legacy)
- **Inline Styles to Remove:** 282 lines
- **SASS Files to Archive:** 2 (_page-sidebar.scss, _print.scss)
- **Custom Tailwind Values Added:** 45+ (max-width, width, grid, z-index)
- **Estimated Total Time:** 14-19 hours over 5 weeks
- **Risk Level:** Low (phased approach with rollback at each stage)

---

## Table of Contents

1. [Optimized Tailwind Configuration](#1-optimized-tailwind-configuration)
2. [Phased Migration Strategy](#2-phased-migration-strategy)
   - [Phase A: Establish Tailwind Baseline](#phase-a-establish-tailwind-baseline)
   - [Phase B: Migrate Modern Layouts](#phase-b-migrate-modern-layouts)
   - [Phase C: Migrate Legacy Layouts](#phase-c-migrate-legacy-layouts)
   - [Phase D: SASS Cleanup & Optimization](#phase-d-sass-cleanup--optimization)
3. [Conflict Resolution Guide](#3-conflict-resolution-guide)
4. [Rollback Strategy](#4-rollback-strategy)
5. [Performance Impact Analysis](#5-performance-impact-analysis)
6. [Testing & Validation Procedures](#6-testing--validation-procedures)

---

## 1. Optimized Tailwind Configuration

### Overview

The proposed `tailwind.config.js` extends the existing configuration with 45+ custom values specifically designed to support the unified 3-tier layout system while maintaining Terminal aesthetic integration via CSS custom properties.

### Configuration Location

**File:** `/var/home/b08x/Workspace/b08xgithubio/b08x.github.io/tailwind.config.js.proposed`
**Status:** Ready for review and deployment

### Key Additions

#### 1.1 Custom Max-Width Values (3-Tier Layout System)

```javascript
maxWidth: {
  // Tier 1: Wide Content Layouts
  'notebook': '1800px',           // notebook.html
  'wiki-3col': '1536px',          // wiki.html (desktop XL 3-column)

  // Tier 2: Standard Content Layouts
  'content-2col': '1280px',       // 2-column layouts
  'content': '896px',             // Standard content width

  // Tier 3: Compact Content Layouts
  'compact': '768px',             // Mobile-first narrow
}
```

**Purpose:** Provides semantic width constraints matching the 3-tier categorization from Phase 1 audit.

#### 1.2 Custom Width Values (Sidebar System)

```javascript
width: {
  // Sidebar Widths
  'sidebar-sm': '256px',          // wiki left nav
  'sidebar-md': '280px',          // notebook right sidebar
  'sidebar-lg': '320px',          // terminal-note sidebar
  'sidebar-xl': '380px',          // notebook left sidebar XL

  'sidebar-fluid': '20%',         // Fluid sidebar

  // Utility Widths
  'scrollbar': '6px',
  'icon-sm': '16px',
  'icon-md': '20px',
}
```

**Purpose:** Standardizes sidebar dimensions across all layouts, replacing SASS variables.

#### 1.3 Grid Template Columns (Responsive Layouts)

```javascript
gridTemplateColumns: {
  // 3-Column Layouts
  'terminal-3col': '256px 1fr 256px',
  'terminal-3col-lg': '300px 1fr 300px',

  // Notebook Specialized
  'notebook-base': '320px 1fr 280px',
  'notebook-xl': '380px 1fr 320px',

  // 2-Column Layouts
  'terminal-2col': '1fr 320px',
  'terminal-2col-reverse': '320px 1fr',
  'terminal-2col-fluid': '1fr 25%',
}
```

**Purpose:** Enables consistent grid-based layouts with semantic naming, replacing inline grid-template-columns.

#### 1.4 Custom Z-Index Scale (Layer Management)

```javascript
zIndex: {
  'base': '1',                    // Base content
  'sticky': '10',                 // Sticky sidebars
  'dropdown': '20',               // Dropdowns
  'modal': '100',                 // SearchCmdK
  'overlay': '110',               // GraphView
  'toast': '120',                 // Notifications
}
```

**Purpose:** Prevents layer clipping conflicts (especially with SearchCmdK and GraphView React islands).

#### 1.5 Custom Height Constraints

```javascript
maxHeight: {
  'sidebar': 'calc(100vh - 3rem)',
  'sidebar-sticky': 'calc(100vh - 4rem)',
  'image': '75vh',
}
```

**Purpose:** Replaces viewport-based height calculations from _page-sidebar.scss and _style.scss.

#### 1.6 Custom Plugins

**Scrollbar Utilities Plugin:**
```javascript
'.scrollbar-terminal': {
  '&::-webkit-scrollbar': { width: '6px' },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(156, 163, 175, 0.3)',
    borderRadius: '2px',
  },
}
```

**Print Utilities Plugin:**
```javascript
'.print\\:hidden': { display: 'none !important' },
'.print\\:no-break': { 'break-inside': 'avoid' },
```

**Purpose:** Provides utility classes for Terminal-aesthetic scrollbars and print styles (replacing _print.scss).

### Configuration Deployment Steps

1. **Review** the proposed configuration at `tailwind.config.js.proposed`
2. **Backup** the current configuration:
   ```bash
   cp tailwind.config.js tailwind.config.js.backup-$(date +%Y%m%d)
   ```
3. **Replace** the production config:
   ```bash
   mv tailwind.config.js.proposed tailwind.config.js
   ```
4. **Verify** the build process (see Phase A below)

---

## 2. Phased Migration Strategy

### Migration Philosophy

The migration follows a **low-risk, incremental approach** with built-in validation and rollback mechanisms at each phase. Each layout is migrated individually, tested, and committed before proceeding.

**Key Principles:**
- Modern layouts first (least risky, lowest complexity)
- One layout per commit (easy rollback)
- Visual regression testing at every step
- No functionality changes (only style implementation)

---

### Phase A: Establish Tailwind Baseline

**Duration:** Week 1, 2-3 hours
**Risk Level:** Low
**Dependencies:** None

#### Objectives

1. Deploy the optimized Tailwind configuration
2. Regenerate Tailwind CSS with new custom values
3. Verify no visual regressions on existing pages
4. Establish performance baseline

#### Step-by-Step Tasks

**A.1: Deploy Tailwind Configuration**

```bash
# Navigate to project root
cd /var/home/b08x/Workspace/b08xgithubio/b08x.github.io

# Backup current config
cp tailwind.config.js tailwind.config.js.backup-$(date +%Y%m%d)

# Deploy new config
mv tailwind.config.js.proposed tailwind.config.js

# Verify file is correct
head -20 tailwind.config.js
```

**A.2: Rebuild Tailwind CSS**

```bash
# Run full build
npm run build

# Expected output:
# - Tailwind processes new custom values
# - No build errors
# - CSS bundle generated at _site/styles.css
```

**A.3: Verify Custom Classes Available**

Open browser DevTools on any page:

```javascript
// Test custom max-width classes
document.body.classList.add('max-w-notebook');
// Should apply max-width: 1800px

// Test custom grid classes
document.querySelector('.grid').classList.add('grid-cols-terminal-3col');
// Should apply grid-template-columns: 256px 1fr 256px

// Test custom z-index
document.querySelector('.modal').classList.add('z-modal');
// Should apply z-index: 100
```

**A.4: Visual Regression Check**

Test pages to ensure no visual changes:

| Layout | Test Page | Breakpoints to Check |
|--------|-----------|---------------------|
| terminal-note.html | `/notes/any-note` | 375px, 768px, 1280px |
| notebook.html | `/notebook/any-video` | 375px, 1024px, 1800px |
| wiki.html | `/wikis/any-wiki` | 375px, 1024px, 1536px |
| page-sidebar.html | `/about` or any page with sidebar | 375px, 768px, 1024px |
| default.html | `/` | 375px, 768px, 1280px |

**A.5: Performance Baseline Measurement**

```bash
# Measure CSS bundle size
du -sh _site/styles.css _site/assets/css/compiled.css

# Expected current sizes:
# styles.css: ~20KB
# compiled.css: ~104KB
```

Run Lighthouse audit on key pages:
```bash
# Install Lighthouse CLI if needed
npm install -g @lhci/cli

# Audit homepage
lhci autorun --url=http://localhost:4000
```

Record baseline metrics:
- **Time to First Contentful Paint (FCP):** ________
- **Largest Contentful Paint (LCP):** ________
- **Cumulative Layout Shift (CLS):** ________
- **Total CSS Bundle Size:** ________

**A.6: Commit Changes**

```bash
git add tailwind.config.js
git commit -m "feat: Add unified layout system Tailwind configuration

- Add custom max-width values for 3-tier layout system
- Add sidebar width/height constraints from SASS audit
- Add grid template columns for Terminal layouts
- Add custom z-index scale for layer management
- Add scrollbar and print utility plugins

Related: Phase 2 migration baseline establishment"

git push origin development
```

#### Phase A Validation Checklist

- [ ] `npm run build` completes without errors
- [ ] All custom classes are available in DevTools
- [ ] No visual regressions on 5 test pages (screenshot comparison)
- [ ] CSS bundle size increase < 10% (expected: +2-5KB from new utilities)
- [ ] Lighthouse performance scores remain stable (±5 points)
- [ ] Changes committed to `development` branch

---

### Phase B: Migrate Modern Layouts

**Duration:** Week 2, 4-6 hours
**Risk Level:** Low-Medium
**Dependencies:** Phase A complete

#### Objectives

Migrate the 3 modern layouts with minimal inline styles first:
1. `terminal-note.html` (32 lines inline styles)
2. `wiki.html` (18 lines inline styles)
3. `notebook.html` (54 lines inline styles)

These layouts already use Tailwind extensively and have well-structured markup, making them ideal for learning the migration pattern.

#### Migration Order & Rationale

1. **terminal-note.html** - Simplest 2-column layout, uses terminal-layout system
2. **wiki.html** - 3-column responsive, demonstrates grid conversion
3. **notebook.html** - Complex 3-column with React islands, most challenging

---

#### B.1: Migrate terminal-note.html

**Current State:**
- **Layout Type:** 2-column (content + right sidebar)
- **Inline Styles:** 32 lines in `<style>` block
- **Key Features:** Sticky sidebar, metadata display, TOC, graph visualization

**Inline Styles to Remove:**

```css
/* Lines 5-16: Body layout reset */
body {
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Metadata text color (already using var(--muted)) */
/* Active state for wiki links (not applicable to terminal-note) */
```

**Migration Steps:**

1. **Create Backup:**
   ```bash
   cp _layouts/terminal-note.html _layouts/terminal-note.html.backup
   ```

2. **Remove Inline `<style>` Block (Lines 4-16):**

   Replace:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   {% include head.html %}
   <style>
     body {
       max-width: none !important;
       margin: 0 !important;
       padding: 0 !important;
       height: 100vh;
       display: flex;
       flex-direction: column;
     }
   </style>
   ```

   With:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   {% include head.html %}
   <!-- Body layout handled by Tailwind classes on <body> tag below -->
   ```

3. **Update `<body>` Tag (Line 5):**

   Current:
   ```html
   <body class="max-w-none m-0 p-0 h-screen flex flex-col bg-background text-foreground font-mono antialiased">
   ```

   Verified: Already correct - no changes needed.

4. **Verify Grid Layout (Line 16):**

   Current:
   ```html
   <div class="flex-grow flex flex-col lg:flex-row gap-8 py-10 container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
   ```

   Replace with custom max-width:
   ```html
   <div class="flex-grow flex flex-col lg:flex-row gap-8 py-10 container mx-auto max-w-content-2col px-4 sm:px-6 lg:px-8">
   ```

   **Rationale:** `max-w-content-2col` (1280px) is the semantic width for 2-column layouts.

5. **Test Changes:**

   ```bash
   bundle exec jekyll serve
   ```

   Navigate to any note page (e.g., `/notes/example-note`) and verify:

   | Check | Expected Result |
   |-------|----------------|
   | Page max-width | 1280px on desktop |
   | No inline `<style>` tags | View source - should be clean |
   | Sidebar sticks on scroll | Position: sticky working |
   | Mobile responsive | Columns stack on mobile (< 1024px) |
   | React islands load | SearchCmdK and GraphView functional |

6. **Visual Regression Screenshots:**

   Take screenshots at:
   - Mobile: 375px width
   - Tablet: 768px width
   - Desktop: 1280px width
   - Desktop XL: 1536px width

   Compare with baseline (from Phase A).

7. **Commit Changes:**

   ```bash
   git add _layouts/terminal-note.html
   git commit -m "refactor(terminal-note): Replace inline styles with Tailwind utilities

   - Remove 32-line <style> block from layout
   - Replace max-w-screen-xl with semantic max-w-content-2col
   - Maintain Terminal aesthetic via CSS custom properties
   - No visual or functional changes

   Phase 2B: Modern layout migration (1/3)"
   ```

**Rollback Plan:**

If issues arise:
```bash
git restore _layouts/terminal-note.html
# or
cp _layouts/terminal-note.html.backup _layouts/terminal-note.html
```

---

#### B.2: Migrate wiki.html

**Current State:**
- **Layout Type:** 3-column responsive (left nav + content + TOC)
- **Inline Styles:** 18 lines in `<style>` block
- **Key Features:** Scroll-spy navigation, sticky sidebars, wiki page sections

**Inline Styles to Remove:**

```css
/* Lines 4-18 */
body {
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.active-wiki-link {
  color: var(--accent) !important;
  border-left-color: var(--accent) !important;
  background-color: rgba(255, 102, 0, 0.1);
}
```

**Migration Steps:**

1. **Create Backup:**
   ```bash
   cp _layouts/wiki.html _layouts/wiki.html.backup
   ```

2. **Remove Inline `<style>` Block (Lines 4-18):**

   Delete the entire `<style>` section.

3. **Update `<body>` Tag (Line 20):**

   Current:
   ```html
   <body class="bg-background text-foreground min-h-screen font-mono antialiased">
   ```

   Replace with:
   ```html
   <body class="max-w-none m-0 p-0 h-screen flex flex-col bg-background text-foreground font-mono antialiased">
   ```

   **Rationale:** Applies the same layout constraints previously in `<style>` block.

4. **Update Container Max-Width (Line 23):**

   Current:
   ```html
   <div id="container" class="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
   ```

   Replace with:
   ```html
   <div id="container" class="container mx-auto max-w-wiki-3col px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
   ```

   **Rationale:** `max-w-wiki-3col` (1536px) provides appropriate width for 3-column wiki layout.

5. **Create Tailwind Utility for `.active-wiki-link`:**

   Since this is a dynamic state class applied by JavaScript (line 166), we need a Tailwind approach.

   **Option A: Add to global CSS** (Recommended for dynamic classes)

   Create/update `_sass/_custom-utilities.scss`:
   ```scss
   // Active state for wiki navigation links
   .active-wiki-link {
     color: var(--accent) !important;
     border-left-color: var(--accent) !important;
     background-color: rgba(255, 102, 0, 0.1);
   }
   ```

   **Option B: Use Tailwind @apply in JavaScript** (Alternative)

   Update the scroll-spy script (line 166) to apply multiple classes:
   ```javascript
   link.classList.add('text-accent', 'border-l-accent', 'bg-accent/10');
   ```

   **Recommendation:** Use Option A for simplicity and consistency. The dynamic class is toggled frequently by scroll events, so a single class is more performant.

6. **Test Changes:**

   Navigate to any wiki page (e.g., `/wikis/example-wiki`) and verify:

   | Check | Expected Result |
   |-------|----------------|
   | Page max-width | 1536px on desktop XL |
   | 3 columns visible | Left nav + content + TOC on XL screens |
   | 2 columns on desktop | Left nav + content on lg screens (TOC hidden) |
   | 1 column on mobile | All stacked vertically |
   | Active link highlight | Orange accent color on scroll |
   | No inline `<style>` | View source - clean markup |

7. **Commit Changes:**

   ```bash
   git add _layouts/wiki.html _sass/_custom-utilities.scss
   git commit -m "refactor(wiki): Replace inline styles with Tailwind utilities

   - Remove 18-line <style> block from layout
   - Replace max-w-screen-xl with semantic max-w-wiki-3col
   - Move .active-wiki-link to _custom-utilities.scss
   - Maintain scroll-spy functionality

   Phase 2B: Modern layout migration (2/3)"
   ```

**Rollback Plan:**
```bash
git restore _layouts/wiki.html _sass/_custom-utilities.scss
```

---

#### B.3: Migrate notebook.html

**Current State:**
- **Layout Type:** 3-column complex (source guide + content + notebook guide)
- **Inline Styles:** 54 lines in `<style>` block (lines 118-171)
- **Key Features:** Video embeds, React islands (NotesGrid, NotebookGuide, AudioPlayer), sticky sidebars

**Inline Styles to Remove:**

```css
/* Lines 118-171 */
/* Responsive adjustments */
@media (max-width: 1023px) {
  .notebook-container > div {
    grid-template-columns: 1fr;
  }
  .source-guide, .notebook-guide {
    position: static !important;
  }
}

/* Smooth scrolling for sticky sidebars */
@media (min-width: 1024px) {
  .source-guide, .notebook-guide {
    max-height: calc(100vh - 3rem);
    overflow-y: auto;
  }
  .source-guide::-webkit-scrollbar,
  .notebook-guide::-webkit-scrollbar {
    width: 4px;
  }
  .source-guide::-webkit-scrollbar-thumb,
  .notebook-guide::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.3);
    border-radius: 2px;
  }
}

/* Loading state animation */
[data-island] > div {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
[data-island].mounted > div {
  animation: none;
}
```

**Migration Steps:**

1. **Create Backup:**
   ```bash
   cp _layouts/notebook.html _layouts/notebook.html.backup
   ```

2. **Remove Inline `<style>` Block (Lines 118-171):**

   Delete the entire `<style>` section.

3. **Update Container (Line 5):**

   Current:
   ```html
   <div class="notebook-container max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
   ```

   Replace with:
   ```html
   <div class="notebook-container max-w-notebook mx-auto px-4 sm:px-6 lg:px-8">
   ```

   **Rationale:** Replace arbitrary value `max-w-[1800px]` with semantic `max-w-notebook`.

4. **Update Grid Layout (Line 7):**

   Current:
   ```html
   <div class="grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] xl:grid-cols-[380px_1fr_320px] gap-6">
   ```

   Replace with:
   ```html
   <div class="grid grid-cols-1 lg:grid-cols-notebook-base xl:grid-cols-notebook-xl gap-6">
   ```

   **Rationale:** Use semantic grid template columns from Tailwind config.

5. **Update Sidebar Classes (Lines 10, 92):**

   Current (both sidebars):
   ```html
   <aside class="source-guide bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 lg:sticky lg:top-6 lg:self-start">
   ```

   Replace with:
   ```html
   <aside class="source-guide bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 lg:sticky lg:top-6 lg:self-start lg:max-h-sidebar lg:overflow-y-auto scrollbar-terminal">
   ```

   **Rationale:**
   - `lg:max-h-sidebar` applies `calc(100vh - 3rem)` constraint
   - `lg:overflow-y-auto` enables scrolling
   - `scrollbar-terminal` applies custom scrollbar styling from Tailwind plugin

   Repeat for `.notebook-guide` sidebar (line 92).

6. **Handle Responsive Grid Stacking:**

   The media query `@media (max-width: 1023px)` forced `grid-template-columns: 1fr`. Tailwind already handles this with `grid-cols-1` base class, so no additional changes needed.

   The `position: static !important` override is also unnecessary because `lg:sticky` only applies the sticky positioning at `lg` breakpoint and above.

7. **Migrate Loading Animation:**

   The loading animation for React islands can be moved to `_custom-utilities.scss`:

   Update `_sass/_custom-utilities.scss`:
   ```scss
   // React island loading animation
   [data-island] > div {
     animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
   }

   [data-island].mounted > div {
     animation: none;
   }
   ```

   **Note:** We're using `pulse-slow` animation defined in Tailwind config `theme.extend.animation`.

8. **Test Changes:**

   Navigate to a notebook page (e.g., `/notebook/example-video`) and verify:

   | Check | Expected Result |
   |-------|----------------|
   | Page max-width | 1800px on all screen sizes |
   | 3 columns on XL | 380px + 1fr + 320px grid |
   | 3 columns on lg | 320px + 1fr + 280px grid |
   | 1 column on mobile | All stacked vertically |
   | Sidebar scrollbars | Thin scrollbars with Terminal styling |
   | React islands load | NotesGrid, NotebookGuide, AudioPlayer render |
   | Loading animation | Pulse effect until `.mounted` class added |
   | No inline `<style>` | View source - clean markup |

9. **Commit Changes:**

   ```bash
   git add _layouts/notebook.html _sass/_custom-utilities.scss
   git commit -m "refactor(notebook): Replace inline styles with Tailwind utilities

   - Remove 54-line <style> block from layout
   - Replace arbitrary max-w-[1800px] with semantic max-w-notebook
   - Replace arbitrary grid-cols with semantic grid-cols-notebook-*
   - Apply custom scrollbar styling via Tailwind plugin
   - Move React island loading animation to _custom-utilities.scss
   - Maintain all functionality and responsive behavior

   Phase 2B: Modern layout migration (3/3)"
   ```

**Rollback Plan:**
```bash
git restore _layouts/notebook.html _sass/_custom-utilities.scss
```

---

#### Phase B Summary

**Completed:**
- 3 modern layouts migrated
- 104 lines of inline styles removed (32 + 18 + 54)
- 3 individual commits for easy rollback
- All React island functionality preserved

**Files Modified:**
- `_layouts/terminal-note.html`
- `_layouts/wiki.html`
- `_layouts/notebook.html`
- `_sass/_custom-utilities.scss` (created)

**Next Phase:**
- Proceed to Phase C (migrate 7 legacy layouts)

---

### Phase C: Migrate Legacy Layouts

**Duration:** Week 3-4, 6-8 hours
**Risk Level:** Medium
**Dependencies:** Phase B complete

#### Objectives

Migrate the 7 remaining layouts that have more extensive inline styles and complex Liquid templating:

1. `page-sidebar.html` (highest impact)
2. `default.html`
3. `page.html`
4. `about.html`
5. `home.html`
6. `note.html`
7. `collapsible-sidebar.html`

These layouts require more careful handling due to:
- More inline styles (178 lines total)
- Older markup patterns
- More Liquid variable usage
- Higher page usage (more testing required)

#### Migration Order & Rationale

**High Impact (Migrate First):**
1. `page-sidebar.html` - Most inline styles, widely used
2. `default.html` - Base layout for many pages

**Medium Impact:**
3. `page.html` - Standard content pages
4. `about.html` - About/info pages

**Low Impact (Migrate Last):**
5. `home.html` - Homepage (unique layout)
6. `note.html` - Legacy note layout (potentially deprecated)
7. `collapsible-sidebar.html` - Specialized use case

---

#### C.1: Migrate page-sidebar.html

**Current State:**
- **Layout Type:** 2-column (content + right sidebar) with collapsible nav
- **Inline Styles:** Estimated ~40 lines (needs verification by reading file)
- **Key Features:** Sidebar navigation, collapsible sections, sticky behavior
- **SASS Dependency:** `_page-sidebar.scss` (to be archived)

**Before Starting:**

Read the current file to audit inline styles:

```bash
grep -n "<style>" _layouts/page-sidebar.html
# Count lines between <style> and </style>
```

**Expected Inline Styles:**
- Body layout resets
- Sidebar positioning and scrolling
- Responsive breakpoint overrides
- Collapsible section states

**Migration Steps:**

1. **Create Backup:**
   ```bash
   cp _layouts/page-sidebar.html _layouts/page-sidebar.html.backup
   ```

2. **Read Current File:**
   ```bash
   cat _layouts/page-sidebar.html
   ```

3. **Identify Inline Styles:**

   Document all styles found in `<style>` blocks (create checklist).

4. **Create Tailwind Equivalents:**

   For each inline style rule, create Tailwind class replacement:

   | Inline Style | Tailwind Replacement |
   |--------------|---------------------|
   | `max-width: 100%` | `max-w-full` |
   | `width: 100%` | `w-full` |
   | `position: sticky` | `lg:sticky` |
   | `top: 4rem` | `lg:top-16` |
   | `max-height: calc(100vh - 4rem)` | `lg:max-h-sidebar-sticky` |
   | `overflow-y: auto` | `lg:overflow-y-auto` |
   | Custom scrollbar | `scrollbar-terminal` |

5. **Update Layout Markup:**

   Replace inline styles with Tailwind classes on corresponding elements.

6. **Handle Liquid Variables:**

   Ensure all Liquid template variables are preserved:
   - `{{ page.title }}`
   - `{{ content }}`
   - `{% include sidebar.html %}`

7. **Test Extensively:**

   This layout is used on multiple pages, so test:

   | Page | URL | Key Features |
   |------|-----|--------------|
   | About | `/about` | Sidebar nav, content sections |
   | Projects | `/projects` | Grid layout, sidebar |
   | Documentation | `/docs/*` | Nested nav, sticky sidebar |

   Verify at breakpoints: 375px, 768px, 1024px, 1280px

8. **Archive SASS Dependency:**

   ```bash
   mkdir -p _sass/_archived
   git mv _sass/_page-sidebar.scss _sass/_archived/_page-sidebar.scss
   ```

9. **Commit Changes:**

   ```bash
   git add _layouts/page-sidebar.html _sass/_archived/
   git commit -m "refactor(page-sidebar): Replace inline styles with Tailwind utilities

   - Remove ~40-line <style> block from layout
   - Replace sidebar positioning with Tailwind utilities
   - Apply custom scrollbar styling via scrollbar-terminal
   - Archive _page-sidebar.scss (no longer needed)
   - Maintain collapsible nav functionality

   Phase 2C: Legacy layout migration (1/7)"
   ```

**Rollback Plan:**
```bash
git restore _layouts/page-sidebar.html _sass/_page-sidebar.scss _sass/_archived/
```

---

#### C.2: Migrate default.html

**Current State:**
- **Layout Type:** Base layout (1-column, simple container)
- **Inline Styles:** Estimated ~20 lines
- **Key Features:** Basic page structure, header, footer

**Migration Steps:**

1. **Create Backup:**
   ```bash
   cp _layouts/default.html _layouts/default.html.backup
   ```

2. **Audit Inline Styles:**

   Expected styles:
   - Body layout resets
   - Container max-width
   - Flexbox layout for header/content/footer

3. **Create Tailwind Equivalents:**

   | Inline Style | Tailwind Replacement |
   |--------------|---------------------|
   | `display: flex; flex-direction: column; min-height: 100vh` | `flex flex-col min-h-screen` |
   | `max-width: 1280px` | `max-w-content-2col` |
   | `margin: 0 auto` | `mx-auto` |

4. **Update Markup:**

   Replace inline `<style>` block with Tailwind classes on `<body>` and container elements.

5. **Test:**

   | Page | Expected Behavior |
   |------|------------------|
   | Homepage (/) | Centered container, max-width 1280px |
   | Any page using default layout | Header/content/footer flexbox layout |

6. **Commit:**

   ```bash
   git add _layouts/default.html
   git commit -m "refactor(default): Replace inline styles with Tailwind utilities

   - Remove ~20-line <style> block from base layout
   - Apply flexbox layout via Tailwind classes
   - Use semantic max-w-content-2col

   Phase 2C: Legacy layout migration (2/7)"
   ```

---

#### C.3-C.7: Migrate Remaining Layouts

For the remaining 5 layouts (`page.html`, `about.html`, `home.html`, `note.html`, `collapsible-sidebar.html`), follow the same pattern:

**Standard Migration Process:**

1. **Create Backup**
2. **Audit Inline Styles** (document all rules)
3. **Create Tailwind Equivalents Table**
4. **Update Markup** (replace `<style>` with Tailwind classes)
5. **Test Thoroughly** (responsive + functionality)
6. **Commit Individually** (one layout per commit)

**Commit Message Template:**

```
refactor([layout-name]): Replace inline styles with Tailwind utilities

- Remove [N]-line <style> block from layout
- [List key changes]
- Maintain [key functionality]

Phase 2C: Legacy layout migration ([X]/7)
```

**Time Estimate per Layout:**
- Audit: 20 minutes
- Migration: 30-45 minutes
- Testing: 20 minutes
- Total: ~1.5 hours each

---

#### Phase C Summary

**Completed:**
- 7 legacy layouts migrated
- 178 lines of inline styles removed
- `_page-sidebar.scss` archived
- 7 individual commits for easy rollback

**Total Inline Styles Removed (Phase B + C):**
- 282 lines (104 from Phase B + 178 from Phase C)

**Files Modified:**
- `_layouts/page-sidebar.html`
- `_layouts/default.html`
- `_layouts/page.html`
- `_layouts/about.html`
- `_layouts/home.html`
- `_layouts/note.html`
- `_layouts/collapsible-sidebar.html`
- `_sass/_archived/_page-sidebar.scss` (archived)

---

### Phase D: SASS Cleanup & Optimization

**Duration:** Week 5, 2-3 hours
**Risk Level:** Low
**Dependencies:** Phase C complete

#### Objectives

1. Archive deprecated SASS files
2. Organize remaining essential SASS
3. Optimize CSS bundle (purge unused styles)
4. Run final performance audit
5. Document new architecture

---

#### D.1: Archive Deprecated SASS Files

**Files to Archive:**

```bash
mkdir -p _sass/_archived

# Archive page-sidebar.scss (already done in Phase C)
# Verify it was moved:
ls -la _sass/_archived/_page-sidebar.scss

# Archive print.scss (if fully migrated to Tailwind plugin)
# First verify no remaining references:
grep -r "_print.scss" _sass/ _layouts/

# If no references found:
git mv _sass/_print.scss _sass/_archived/_print.scss
```

**Files to Retain:**

Essential SASS files that must remain:
- `_theme-variables.scss` - CSS custom properties for Terminal aesthetic
- `_code.scss` - Syntax highlighting (Rouge/Pygments integration)
- `_callouts.scss` - Obsidian-style callout blocks
- `_normalize.scss` - Browser reset
- `_style.scss` - Global styles and typography
- `_custom-utilities.scss` - Dynamic classes (created in Phase B/C)

---

#### D.2: Organize Remaining SASS Structure

**Proposed SASS Architecture:**

```
_sass/
├── _archived/                  # Deprecated files
│   ├── _page-sidebar.scss
│   └── _print.scss
├── core/                       # Essential framework files
│   ├── _theme-variables.scss   # CSS custom properties
│   ├── _normalize.scss         # Browser reset
│   └── _style.scss             # Global typography
├── components/                 # Reusable components
│   ├── _code.scss              # Syntax highlighting
│   ├── _callouts.scss          # Obsidian callouts
│   └── _custom-utilities.scss  # Dynamic state classes
└── main.scss                   # Import orchestration
```

**Create New Directory Structure:**

```bash
cd _sass
mkdir -p core components

# Move files to new structure
mv _theme-variables.scss core/
mv _normalize.scss core/
mv _style.scss core/
mv _code.scss components/
mv _callouts.scss components/
mv _custom-utilities.scss components/
```

**Update main.scss:**

```scss
// main.scss - SASS Import Orchestration

// Core Framework
@import "core/theme-variables";
@import "core/normalize";
@import "core/style";

// Components
@import "components/code";
@import "components/callouts";
@import "components/custom-utilities";
```

---

#### D.3: Optimize CSS Bundle

**Enable Tailwind Purge:**

Verify `tailwind.config.js` has correct `content` paths (should already be set):

```javascript
content: [
  './_includes/**/*.html',
  './_layouts/**/*.html',
  './_notes/*.md',
  './_pages/*.md',
  './src/**/*.{ts,tsx}',
  './*.html',
],
```

**Build Optimized Production CSS:**

```bash
# Set NODE_ENV for production optimization
NODE_ENV=production npm run build

# Measure new CSS bundle size
du -sh _site/styles.css _site/assets/css/compiled.css
```

**Expected Results:**
- **styles.css:** 15-20KB (down from 20KB, thanks to purge)
- **compiled.css:** 90-100KB (down from 104KB)

---

#### D.4: Run Final Performance Audit

**Lighthouse Audit:**

```bash
# Audit key pages
lhci autorun --url=http://localhost:4000
lhci autorun --url=http://localhost:4000/notes/example-note
lhci autorun --url=http://localhost:4000/notebook/example-video
```

**Performance Metrics Comparison:**

| Metric | Baseline (Phase A) | After Migration | Change |
|--------|-------------------|-----------------|--------|
| FCP | _____ ms | _____ ms | _____ |
| LCP | _____ ms | _____ ms | _____ |
| CLS | _____ | _____ | _____ |
| CSS Bundle | 104KB | ~95KB | -9KB |
| Build Time | _____ s | _____ s | _____ |

**Expected Improvements:**
- **CSS Bundle:** -5-10% (reduced unused styles)
- **FCP/LCP:** Neutral or slight improvement (fewer inline `<style>` tags)
- **CLS:** Neutral (no layout changes)
- **Build Time:** Potentially faster (less SASS compilation)

---

#### D.5: Update Documentation

**Create Architecture Documentation:**

Create `/docs/development/unified-layout-architecture.md`:

```markdown
# Unified Layout Architecture

## Overview

The b08x.github.io layout system uses a Tailwind-first approach with CSS custom properties for theming.

## Layout Tiers

### Tier 1: Wide Content Layouts
- **notebook.html** - max-w-notebook (1800px)
- **wiki.html (XL)** - max-w-wiki-3col (1536px)

### Tier 2: Standard Content Layouts
- **terminal-note.html** - max-w-content-2col (1280px)
- **page-sidebar.html** - max-w-content-2col (1280px)
- **default.html** - max-w-content-2col (1280px)

### Tier 3: Compact Content Layouts
- **page.html** - max-w-content (896px)
- **about.html** - max-w-content (896px)
- **home.html** - max-w-compact (768px)

## Grid System

### 3-Column Grids
- `grid-cols-terminal-3col` - 256px | 1fr | 256px
- `grid-cols-notebook-base` - 320px | 1fr | 280px (lg)
- `grid-cols-notebook-xl` - 380px | 1fr | 320px (xl)

### 2-Column Grids
- `grid-cols-terminal-2col` - 1fr | 320px
- `grid-cols-terminal-2col-reverse` - 320px | 1fr

## Sidebar System

### Fixed Widths
- `w-sidebar-sm` - 256px (wiki nav)
- `w-sidebar-md` - 280px (notebook right)
- `w-sidebar-lg` - 320px (standard)
- `w-sidebar-xl` - 380px (notebook left XL)

### Sticky Behavior
- `lg:sticky lg:top-6` - Basic sticky
- `lg:max-h-sidebar` - Max height constraint
- `scrollbar-terminal` - Custom scrollbar styling

## Z-Index Layers

- `z-base` (1) - Base content
- `z-sticky` (10) - Sticky sidebars/headers
- `z-dropdown` (20) - Dropdown menus
- `z-modal` (100) - SearchCmdK
- `z-overlay` (110) - GraphView

## Custom Utilities

### Scrollbar Styling
- `.scrollbar-terminal` - Terminal-themed scrollbars
- `.scrollbar-thin` - Minimal scrollbars
- `.scrollbar-none` - Hidden scrollbars

### Print Utilities
- `.print:hidden` - Hide on print
- `.print:no-break` - Avoid page breaks

## SASS Organization

Essential SASS files retained:
- `core/_theme-variables.scss` - CSS custom properties
- `core/_style.scss` - Global typography
- `components/_code.scss` - Syntax highlighting
- `components/_callouts.scss` - Obsidian callouts
```

---

#### D.6: Commit Phase D Changes

```bash
git add _sass/ docs/development/unified-layout-architecture.md
git commit -m "refactor: Reorganize SASS architecture and optimize CSS bundle

- Archive deprecated _print.scss
- Organize SASS into core/ and components/ structure
- Update import statements in main.scss
- Enable Tailwind purge for production builds
- Create unified layout architecture documentation

Phase 2D: SASS cleanup & optimization complete

Performance Impact:
- CSS bundle reduced by ~9KB (104KB -> 95KB)
- 282 lines of inline styles removed across 11 layouts
- Build time improved by purging unused Tailwind utilities"
```

---

#### Phase D Summary

**Completed:**
- SASS architecture reorganized
- Deprecated files archived
- CSS bundle optimized (-9KB)
- Performance audit completed
- Architecture documentation created

**Final Metrics:**
- **Layouts Migrated:** 11/11 (100%)
- **Inline Styles Removed:** 282 lines
- **SASS Files Archived:** 2 (_page-sidebar.scss, _print.scss)
- **CSS Bundle Size:** ~95KB (down from 104KB)
- **Custom Tailwind Values Added:** 45+

---

## 3. Conflict Resolution Guide

### Overview

Phase 1 audit identified 4 potential conflicts between existing SASS constraints and Tailwind utilities. This section provides resolution strategies for each.

---

### Conflict 1: Sidebar Width Constraints

**Issue:**

SASS defines:
```scss
// _page-sidebar.scss
.sidebar {
  width: 100%;
  @media (min-width: 1024px) {
    width: 400px;
  }
}
```

Tailwind uses:
```html
<aside class="w-full lg:w-sidebar-lg">
```

But `w-sidebar-lg` is 320px, not 400px.

**Root Cause:** Inconsistent sidebar width definitions across layouts.

**Resolution:**

**Option A: Standardize on 320px (Recommended)**

Most layouts use 320px sidebars. Update `page-sidebar.html` to use `w-sidebar-lg` (320px).

**Rationale:** Consistency across layouts improves visual harmony.

**Option B: Add 400px Variant**

If 400px is critical for `page-sidebar.html`:

Update `tailwind.config.js`:
```javascript
width: {
  'sidebar-2xl': '400px',
}
```

Use in layout:
```html
<aside class="w-full lg:w-sidebar-2xl">
```

**Testing:**

After applying resolution:
1. Open page using `page-sidebar.html`
2. Resize to 1024px width
3. Verify sidebar is 320px or 400px (depending on chosen option)
4. Check for layout breaks or overflow

---

### Conflict 2: Max-Height Calculations

**Issue:**

SASS defines:
```scss
// _page-sidebar.scss
.sidebar {
  max-height: calc(100vh - 4rem);
}
```

Tailwind config defines:
```javascript
maxHeight: {
  'sidebar-sticky': 'calc(100vh - 4rem)',
}
```

Potential conflict if both are applied simultaneously.

**Root Cause:** Duplicate height constraints from SASS and Tailwind.

**Resolution:**

**Migration Steps:**

1. **Remove SASS Constraint:**

   When migrating `page-sidebar.html`, remove the `max-height` rule from `_page-sidebar.scss`.

2. **Apply Tailwind Class:**

   ```html
   <aside class="lg:max-h-sidebar-sticky lg:overflow-y-auto">
   ```

3. **Verify Behavior:**

   - Sidebar should not exceed viewport height minus 4rem
   - Scrollbar should appear when content overflows

**Testing:**

1. Add long content to sidebar (e.g., 50+ navigation links)
2. Verify scrollbar appears
3. Check that sidebar height is `calc(100vh - 4rem)`

---

### Conflict 3: Print Media Queries

**Issue:**

SASS defines:
```scss
// _print.scss
@media print {
  .sidebar { display: none; }
  .no-print { display: none; }
}
```

Tailwind plugin defines:
```javascript
'.print\\:hidden': { display: 'none !important' }
```

Potential duplicate print styles.

**Root Cause:** SASS and Tailwind both handle print styles.

**Resolution:**

**Migration Strategy:**

1. **Audit _print.scss:**

   List all print-specific rules:
   ```bash
   grep -A2 "@media print" _sass/_print.scss
   ```

2. **Migrate to Tailwind Classes:**

   For each rule in `_print.scss`, apply equivalent Tailwind class:

   | SASS Rule | Tailwind Class |
   |-----------|----------------|
   | `.sidebar { display: none }` | `print:hidden` |
   | `.no-print { display: none }` | `print:hidden` |
   | `.page-break { page-break-before: always }` | `print:break-before` |

3. **Update Layout Markup:**

   Add `print:hidden` to sidebars, navigation, etc.:
   ```html
   <aside class="sidebar print:hidden">
   ```

4. **Archive _print.scss:**

   ```bash
   git mv _sass/_print.scss _sass/_archived/_print.scss
   ```

**Testing:**

1. Open any page
2. Use browser Print Preview (Cmd+P)
3. Verify:
   - Sidebars are hidden
   - Navigation is hidden
   - Main content is visible
   - Page breaks work correctly

---

### Conflict 4: Z-Index Layer Conflicts

**Issue:**

SearchCmdK and GraphView React islands may have z-index conflicts with sticky sidebars.

**Observed Behavior:**
- Modal dialogs appear behind sticky elements
- Overlays clip incorrectly

**Root Cause:** No centralized z-index scale.

**Resolution:**

**Implement Z-Index Scale (Already in Tailwind Config):**

```javascript
zIndex: {
  'base': '1',
  'sticky': '10',
  'dropdown': '20',
  'modal': '100',
  'overlay': '110',
  'toast': '120',
}
```

**Migration Steps:**

1. **Apply to Sticky Sidebars:**

   ```html
   <aside class="lg:sticky lg:top-6 z-sticky">
   ```

2. **Apply to React Islands:**

   Update `src/main.tsx` or component files:

   **SearchCmdK:**
   ```tsx
   <div className="fixed inset-0 z-modal">
   ```

   **GraphView:**
   ```tsx
   <div className="fixed inset-0 z-overlay">
   ```

3. **Test Layer Order:**

   | Element | Z-Index | Expected Behavior |
   |---------|---------|------------------|
   | Main content | z-base (1) | Behind everything |
   | Sticky sidebar | z-sticky (10) | Above content |
   | SearchCmdK modal | z-modal (100) | Above sidebars |
   | GraphView overlay | z-overlay (110) | Above modals |

**Testing:**

1. Open page with sticky sidebar
2. Trigger SearchCmdK (Cmd+K)
3. Verify modal appears above sidebar
4. Close modal, open GraphView
5. Verify overlay appears above everything
6. Check for any clipping or layer conflicts

---

## 4. Rollback Strategy

### Philosophy

Every phase and every layout migration has a dedicated rollback mechanism. Rollbacks are designed to be fast (<5 minutes) and safe (no data loss).

---

### Git Branch Strategy

**Recommended Workflow:**

```bash
# Create feature branch from development
git checkout development
git pull origin development
git checkout -b feature/phase-2-tailwind-migration

# Work on Phase A
# ... make changes ...
git add .
git commit -m "Phase A: Establish Tailwind baseline"

# Work on Phase B
# ... migrate each layout individually ...
git commit -m "Phase B: Migrate terminal-note.html"
git commit -m "Phase B: Migrate wiki.html"
git commit -m "Phase B: Migrate notebook.html"

# Continue for Phases C and D...

# When all phases complete:
git checkout development
git merge feature/phase-2-tailwind-migration
```

**Benefits:**
- All migration work isolated in feature branch
- Easy to discard entire migration: `git branch -D feature/phase-2-tailwind-migration`
- Individual commits for each layout (granular rollback)

---

### Phase-Level Rollback

**Scenario:** Phase C fails, need to rollback entire phase.

**Steps:**

1. **Identify Last Good Commit:**

   ```bash
   git log --oneline --grep="Phase B"
   # Find commit hash of "Phase B complete"
   ```

2. **Revert to Phase B:**

   ```bash
   git reset --hard <commit-hash>
   ```

3. **Restore Working Tree:**

   ```bash
   git status  # Should show clean working tree
   ```

4. **Verify Site Builds:**

   ```bash
   npm run build
   bundle exec jekyll serve
   ```

---

### Layout-Level Rollback

**Scenario:** Single layout migration causes issues (e.g., `notebook.html` breaks).

**Steps:**

**Option A: Git Restore (if uncommitted):**

```bash
git restore _layouts/notebook.html
```

**Option B: Revert Specific Commit (if committed):**

```bash
# Find commit hash
git log --oneline _layouts/notebook.html

# Revert that specific commit
git revert <commit-hash>
```

**Option C: Use Backup File:**

```bash
cp _layouts/notebook.html.backup _layouts/notebook.html
```

---

### Tailwind Config Rollback

**Scenario:** New Tailwind config breaks the build.

**Steps:**

```bash
# Restore from timestamped backup
cp tailwind.config.js.backup-YYYYMMDD tailwind.config.js

# Rebuild
npm run build

# Verify
bundle exec jekyll serve
```

---

### Emergency Full Rollback

**Scenario:** Entire migration needs to be abandoned.

**Steps:**

```bash
# Discard all changes in feature branch
git checkout development
git branch -D feature/phase-2-tailwind-migration

# Verify site works
npm run build
bundle exec jekyll serve
```

**Result:** Site reverts to pre-migration state. All inline styles and SASS files remain.

---

## 5. Performance Impact Analysis

### Current State (Baseline)

**Measurements Taken:** 2025-12-26 (Phase A)

| Metric | Value | Notes |
|--------|-------|-------|
| **CSS Bundle Size** | | |
| styles.css | 20KB | Tailwind output |
| compiled.css | 104KB | SASS compilation |
| **Total CSS** | 124KB | Combined |
| **Inline Styles** | 282 lines | Across 11 layouts |
| **Build Time** | ___ seconds | `npm run build` |
| **Lighthouse Scores** | | |
| Performance | ___ | Average across 5 pages |
| FCP | ___ ms | First Contentful Paint |
| LCP | ___ ms | Largest Contentful Paint |
| CLS | ___ | Cumulative Layout Shift |

---

### Expected After Migration

**Predicted Improvements:**

| Metric | Baseline | After Migration | Change | Impact |
|--------|----------|----------------|--------|--------|
| **CSS Bundle** | 124KB | ~110KB | -14KB (-11%) | Reduced download/parse time |
| **Inline Styles** | 282 lines | 0 lines | -282 (-100%) | Cleaner HTML, better caching |
| **SASS Files** | 8 files | 6 files | -2 | Faster SASS compilation |
| **Build Time** | ___ s | ___ s | -10-15% | Fewer SASS rules to process |
| **FCP** | ___ ms | ±0-50ms | Neutral/slight improvement | Fewer inline `<style>` tags |
| **LCP** | ___ ms | ±0-50ms | Neutral | No image/content changes |
| **CLS** | ___ | ___ | No change | No layout shifts |

**Key Benefits:**

1. **Better Caching:** All styles in external CSS (no inline styles to re-download per page)
2. **Smaller HTML:** 282 fewer lines across 11 layouts
3. **Improved Maintainability:** Single source of truth (Tailwind config)
4. **Faster Builds:** Less SASS compilation overhead

---

### Measurement Methodology

**Tools:**

- **Lighthouse CLI:** For performance audits
- **du -sh:** For file size measurements
- **Chrome DevTools:** For render performance
- **git diff --stat:** For code changes

**Test Pages:**

| Layout | Test URL | Importance |
|--------|----------|-----------|
| terminal-note.html | `/notes/example-note` | High traffic |
| notebook.html | `/notebook/example-video` | Complex layout |
| wiki.html | `/wikis/example-wiki` | 3-column test |
| page-sidebar.html | `/about` | Legacy layout |
| default.html | `/` | Homepage |

**Breakpoints to Test:**

- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1280px (Standard)
- Desktop XL: 1536px (Wide screen)

---

### Post-Migration Audit Checklist

After completing Phase D:

- [ ] Measure CSS bundle size (`du -sh _site/*.css`)
- [ ] Run Lighthouse on 5 test pages
- [ ] Record FCP, LCP, CLS scores
- [ ] Measure build time (`time npm run build`)
- [ ] Compare against baseline
- [ ] Document results in `/docs/development/phase-2-performance-results.md`

---

## 6. Testing & Validation Procedures

### Overview

Each phase requires rigorous testing to ensure no regressions. This section defines validation procedures for each migration stage.

---

### Visual Regression Testing

**Method:** Screenshot Comparison

**Tools:**
- Browser DevTools (responsive mode)
- Manual screenshot capture
- Optional: Percy, BackstopJS, or Chromatic for automated visual testing

**Process:**

1. **Capture Baseline Screenshots (Before Migration):**

   For each layout, capture screenshots at 4 breakpoints:

   | Breakpoint | Width | Device |
   |------------|-------|--------|
   | Mobile | 375px | iPhone SE |
   | Tablet | 768px | iPad |
   | Desktop | 1280px | Standard |
   | Desktop XL | 1536px | Wide screen |

   Save to `docs/testing/screenshots/baseline/[layout-name]/`

2. **Capture Post-Migration Screenshots:**

   After migrating each layout, capture the same screenshots.

   Save to `docs/testing/screenshots/migrated/[layout-name]/`

3. **Compare:**

   Manually review or use tools:

   ```bash
   # Install ImageMagick for automated comparison
   sudo dnf install ImageMagick

   # Compare screenshots
   compare baseline/wiki-375px.png migrated/wiki-375px.png diff/wiki-375px.png
   ```

4. **Acceptance Criteria:**

   - **Pixel-perfect match** preferred
   - **Minor differences allowed:** Font rendering, anti-aliasing
   - **No layout shifts:** Elements must remain in same positions
   - **No color changes:** CSS custom properties must preserve colors

---

### Functional Testing

**Scope:** Ensure all interactive features work after migration.

**Test Cases:**

#### TC1: Sticky Sidebar Behavior

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open page with sticky sidebar (e.g., `/notes/example-note`) | Sidebar visible |
| 2 | Scroll down 500px | Sidebar sticks to top of viewport |
| 3 | Scroll to bottom | Sidebar remains visible |
| 4 | Resize to mobile (< 1024px) | Sidebar unsticks, appears above/below content |

#### TC2: Responsive Grid Layouts

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open wiki page (e.g., `/wikis/example-wiki`) | 3 columns visible on XL (>1536px) |
| 2 | Resize to 1280px | 2 columns visible (left nav + content) |
| 3 | Resize to 768px | 1 column, all sections stack vertically |
| 4 | Test TOC scrollspy | Active link highlights on scroll |

#### TC3: React Island Rendering

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open notebook page | NotesGrid, NotebookGuide, AudioPlayer load |
| 2 | Verify loading animation | Pulse animation until `.mounted` class added |
| 3 | Open SearchCmdK (Cmd+K) | Modal appears above all content |
| 4 | Close modal, open GraphView | Overlay appears correctly |

#### TC4: Print Styles

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open any page | Normal view |
| 2 | Print Preview (Cmd+P) | Sidebars hidden |
| 3 | Check navigation | Navigation hidden |
| 4 | Check main content | Content visible, properly formatted |

#### TC5: Scrollbar Styling

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open page with scrollable sidebar | Scrollbar visible |
| 2 | Check scrollbar width | 6px (Terminal styling) |
| 3 | Check scrollbar color | `rgba(156, 163, 175, 0.3)` |
| 4 | Hover over scrollbar | Opacity increases |

---

### Cross-Browser Testing

**Browsers to Test:**

| Browser | Version | Priority |
|---------|---------|----------|
| Chrome | Latest | High |
| Firefox | Latest | High |
| Safari | Latest | Medium |
| Edge | Latest | Low |

**Test Plan:**

For each browser:
1. Open 3 key pages (homepage, note, wiki)
2. Verify sticky sidebars work
3. Verify responsive breakpoints
4. Verify React islands render
5. Check for console errors

---

### Accessibility Testing

**Tools:**
- Lighthouse Accessibility Audit
- axe DevTools
- WAVE Browser Extension

**Checks:**

| Check | Expected Result |
|-------|----------------|
| Color contrast | All text meets WCAG AA (4.5:1) |
| Keyboard navigation | Tab order logical, focus visible |
| Screen reader | Headings hierarchical, landmarks present |
| ARIA attributes | Valid and necessary only |

---

### Performance Testing

**Lighthouse Audit:**

```bash
lhci autorun --url=http://localhost:4000/notes/example-note --collect.numberOfRuns=3
```

**Metrics to Track:**

| Metric | Target | Acceptance |
|--------|--------|-----------|
| Performance Score | >90 | >85 |
| FCP | <1.5s | <2s |
| LCP | <2.5s | <3s |
| CLS | <0.1 | <0.25 |

**Network Throttling:**

Test on simulated 3G connection:

```bash
lhci autorun --url=http://localhost:4000 --collect.settings.throttling.rttMs=150 --collect.settings.throttling.throughputKbps=1600
```

---

### Build Testing

**Verify Build Process:**

```bash
# Clean build
rm -rf _site
npm run build

# Expected:
# - No errors
# - No warnings
# - CSS bundle generated
# - HTML files generated
```

**Check for Errors:**

```bash
# Search for build errors in output
npm run build 2>&1 | grep -i "error\|fail"

# Check Jekyll build
bundle exec jekyll build --verbose
```

---

### Final Validation Checklist

Before merging Phase 2 to `development`:

**Code Quality:**
- [ ] All inline `<style>` blocks removed (search: `grep -r "<style>" _layouts/`)
- [ ] No hardcoded widths/heights (search: `grep -r "width:\|height:" _layouts/`)
- [ ] SASS files organized in `core/` and `components/`
- [ ] Deprecated files in `_sass/_archived/`

**Functionality:**
- [ ] All 11 layouts render correctly
- [ ] Sticky sidebars work on all applicable pages
- [ ] Responsive breakpoints function as expected
- [ ] React islands load and interact correctly
- [ ] Print styles hide sidebars/nav
- [ ] Scrollbars use Terminal styling

**Performance:**
- [ ] CSS bundle size reduced by ≥5%
- [ ] Lighthouse scores ≥85 on all test pages
- [ ] No CLS regressions
- [ ] Build time stable or improved

**Testing:**
- [ ] Visual regression tests passed
- [ ] Functional tests passed (all 5 test cases)
- [ ] Cross-browser tests passed (Chrome, Firefox, Safari)
- [ ] Accessibility audit passed (Lighthouse >90)

**Documentation:**
- [ ] `unified-layout-architecture.md` created
- [ ] Performance results documented
- [ ] Migration notes recorded

---

## Summary & Next Steps

### Migration Overview

This Phase 2 plan provides a complete, production-ready roadmap to transition from inline SASS styles to a unified Tailwind-first layout system.

**Key Deliverables:**

1. ✅ Optimized `tailwind.config.js` with 45+ custom values
2. ✅ Phased migration plan (4 phases, 14-19 hours)
3. ✅ Conflict resolution guide (4 conflicts addressed)
4. ✅ Rollback strategy (git-based, multiple levels)
5. ✅ Performance impact analysis (expected -11% CSS size)
6. ✅ Comprehensive testing procedures

**Time Estimate:**

| Phase | Duration | Hours |
|-------|----------|-------|
| Phase A | Week 1 | 2-3 |
| Phase B | Week 2 | 4-6 |
| Phase C | Week 3-4 | 6-8 |
| Phase D | Week 5 | 2-3 |
| **Total** | **5 weeks** | **14-19** |

**Risk Mitigation:**

- Low-risk phased approach
- Individual commits per layout (easy rollback)
- Comprehensive testing at every stage
- No functionality changes (only implementation)

---

### Immediate Next Steps

1. **Review this plan** with the team
2. **Review `tailwind.config.js.proposed`** for accuracy
3. **Create git feature branch:** `feature/phase-2-tailwind-migration`
4. **Begin Phase A:** Deploy Tailwind config and establish baseline
5. **Document baseline metrics** for performance comparison

---

### Success Criteria

The migration is considered successful when:

- ✅ All 11 layouts use Tailwind utilities (0 inline `<style>` blocks)
- ✅ SASS reduced to essential files (theme, code, callouts)
- ✅ CSS bundle optimized (≥5% reduction)
- ✅ No visual or functional regressions
- ✅ Performance metrics stable or improved
- ✅ Documentation complete

---

**End of Phase 2 Implementation Plan**

---

## Appendix

### A. Quick Reference: Tailwind Custom Classes

**Max-Width:**
- `max-w-notebook` → 1800px
- `max-w-wiki-3col` → 1536px
- `max-w-content-2col` → 1280px
- `max-w-content` → 896px
- `max-w-compact` → 768px

**Width:**
- `w-sidebar-sm` → 256px
- `w-sidebar-md` → 280px
- `w-sidebar-lg` → 320px
- `w-sidebar-xl` → 380px

**Grid Columns:**
- `grid-cols-terminal-3col` → 256px 1fr 256px
- `grid-cols-notebook-base` → 320px 1fr 280px
- `grid-cols-notebook-xl` → 380px 1fr 320px
- `grid-cols-terminal-2col` → 1fr 320px

**Z-Index:**
- `z-base` → 1
- `z-sticky` → 10
- `z-modal` → 100
- `z-overlay` → 110

**Custom Utilities:**
- `scrollbar-terminal` → Terminal-themed scrollbar
- `max-h-sidebar` → calc(100vh - 3rem)
- `print:hidden` → Hide on print

---

### B. File Locations Reference

**Configuration:**
- Proposed Tailwind config: `/var/home/b08x/Workspace/b08xgithubio/b08x.github.io/tailwind.config.js.proposed`
- Current Tailwind config: `/var/home/b08x/Workspace/b08xgithubio/b08x.github.io/tailwind.config.js`

**Layouts:**
- All layouts: `/var/home/b08x/Workspace/b08xgithubio/b08x.github.io/_layouts/`

**SASS:**
- Current SASS: `/var/home/b08x/Workspace/b08xgithubio/b08x.github.io/_sass/`
- Archived SASS: `/var/home/b08x/Workspace/b08xgithubio/b08x.github.io/_sass/_archived/`

**Documentation:**
- This plan: `/var/home/b08x/Workspace/b08xgithubio/b08x.github.io/docs/development/phase-2-migration-implementation-plan.md`
- Architecture docs: `/var/home/b08x/Workspace/b08xgithubio/b08x.github.io/docs/development/unified-layout-architecture.md`

---

### C. Contact & Support

For questions or issues during migration:

1. Review this plan's relevant section
2. Check rollback strategy if issues arise
3. Refer to Tailwind documentation: https://tailwindcss.com/docs
4. Consult Phase 1 audit for context

---

**Document Version:** 1.0
**Last Updated:** 2025-12-26
**Status:** Ready for Implementation
