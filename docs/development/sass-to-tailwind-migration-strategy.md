# SASS-to-Tailwind Migration Strategy
**Digital Garden Layout Consolidation - Phase 1**

> **Document Purpose**: Comprehensive catalog of all SASS/SCSS constraints and migration roadmap to Tailwind CSS for the b08x.github.io Digital Garden project.

---

## Executive Summary

The b08x.github.io Digital Garden currently operates a **dual styling system**:
- **Legacy SASS** (`_sass/` directory) - 6 SCSS files with hardcoded constraints
- **Modern Tailwind CSS** - Partially configured with CSS variable integration

This migration strategy documents all width, spacing, and media query constraints in SASS and provides a phased approach to fully transition to Tailwind while maintaining design consistency.

**Key Finding**: The project has **already established Tailwind infrastructure** with CSS variables, making migration primarily a matter of replacing inline styles and hardcoded SASS rules with Tailwind utilities.

---

## 1. SASS Constraint Catalog

### 1.1 Container Width Constraints

| Source File | Line | Current SASS Rule | Context | Usage |
|-------------|------|-------------------|---------|-------|
| `_page-sidebar.scss` | 12 | `width: 100%` | Sidebar mobile | All mobile layouts |
| `_page-sidebar.scss` | 19 | `max-height: calc(100vh - 4rem)` | Sidebar desktop sticky | Sticky sidebar scroll |
| `_page-sidebar.scss` | 87 | `max-width: 100%` | Widget container | Prevent overflow |
| `_page-sidebar.scss` | 156 | `width: 100% !important` | Print styles | PDF generation |
| `_style.scss` | 49 | `max-width: 100%` | Images | Responsive images |
| `_style.scss` | 52 | `max-height: 75vh` | Images | Vertical constraint |
| `_style.scss` | 128-129 | `width: 100%; max-width: 100%` | Notes container | Content width |
| `_theme-variables.scss` | 303 | `width: 100%` | Tables | Full-width tables |
| `_theme-variables.scss` | 326 | `max-width: 100%` | Mermaid SVG | Diagram responsiveness |
| **Inline** `page-sidebar.html` | 13 | `max-width: 48rem` | Description paragraph | Text readability |
| **Inline** `wiki.html` | 6 | `max-width: none !important` | Body override | Full-width wiki |
| **Inline** `notebook.html` | 5 | `max-w-[1800px]` | Notebook container | Wide layout cap |
| **Inline** `collapsible-sidebar.html` | 42 | `width: 400px` | Fixed sidebar | Desktop sidebar |
| **Inline** `collapsible-sidebar.html` | 157 | `width: 100%` | Mobile sidebar | Responsive override |
| `note.html` | 7 | `w-[80%] max-w-7xl` | Note container | Centered wide layout |
| `page.html` | 5 | `max-w-4xl` | Page container | Standard content width |
| `terminal-note.html` | 16 | `max-w-screen-xl` | Container | Terminal layout width |
| `page-sidebar.html` | 5 | `max-w-screen-xl` | Container | Sidebar layout width |
| `wiki.html` | 23 | `max-w-screen-xl` | Container | Wiki layout width |

### 1.2 Spacing Constraints (SASS Variables)

| CSS Variable | SASS Value | Usage Context | Frequency |
|--------------|------------|---------------|-----------|
| `--space-xs` | `0.3125rem` (5px) | Fine-grained spacing, nested lists | Medium |
| `--space-sm` | `0.625rem` (10px) | Button padding, compact elements | High |
| `--space-md` | `1.25rem` (20px) | Standard padding, code blocks, pre | Very High |
| `--space-lg` | `1.875rem` (30px) | Section margins, blockquotes | High |
| `--space-xl` | `2.5rem` (40px) | Major dividers (hr), large gaps | Medium |
| `--space-2xl` | `3.75rem` (60px) | Hero sections, major layout breaks | Low |

**Current Tailwind Config**: Already mapped via `spacing` extension in `tailwind.config.js` lines 51-58.

### 1.3 Media Query Breakpoints

| Source File | Line | Breakpoint | Purpose | SASS Query |
|-------------|------|------------|---------|------------|
| `_page-sidebar.scss` | 15 | `1024px` | Sticky sidebar activation | `@media (min-width: 1024px)` |
| `_page-sidebar.scss` | 150 | Print | Hide sidebar on print | `@media print` |
| `notebook.html` | 120 | `1023px` | Mobile stack | `@media (max-width: 1023px)` |
| `notebook.html` | 133 | `1024px` | Sticky sidebars | `@media (min-width: 1024px)` |
| `collapsible-sidebar.html` | 155 | `768px` | Mobile full-width sidebar | `@media (max-width: 768px)` |

**Tailwind Equivalents**:
- `1024px` = `lg:` prefix (Tailwind default)
- `768px` = `md:` prefix (Tailwind default)
- `1023px` = `max-lg:` prefix (inverse of lg)
- Print = `print:` prefix (Tailwind built-in)

### 1.4 Hardcoded Pixel Values in SASS

| File | Property | Value | Context |
|------|----------|-------|---------|
| `_page-sidebar.scss` | `scrollbar width` | `6px` | Custom scrollbar |
| `_theme-variables.scss` | `--radius-sm` | `5px` | Small border radius |
| `_theme-variables.scss` | `--radius-md` | `10px` | Medium border radius |
| `_theme-variables.scss` | `--radius-lg` | `20px` | Large border radius |
| `_theme-variables.scss` | `--radius` | `20px` | Default radius |
| `_theme-variables.scss` | `--font-size-base` | `16px` | Base font size |
| `_style.scss` | `$border-radius` | `4px` | **LEGACY** - Should use CSS vars |
| `_code.scss` | `border-radius` | Uses `var(--radius-md)` | Correct usage |
| `_callouts.scss` | `border-radius` | Uses `var(--radius-md)` | Correct usage |

**Note**: `$border-radius: 4px` in `_style.scss` is a **legacy Sass variable** that conflicts with the CSS variable system. Should be migrated to `var(--radius-sm)`.

---

## 2. Tailwind Equivalency Mapping

### 2.1 Width Constraints

| SASS Rule | Tailwind Utility | Rationale |
|-----------|------------------|-----------|
| `width: 100%` | `w-full` | Standard full-width |
| `max-width: 100%` | `max-w-full` | Prevent overflow |
| `max-width: 48rem` | `max-w-3xl` | Tailwind's 768px (48rem) breakpoint |
| `max-width: none` | `max-w-none` | Remove constraint |
| `max-w-[1800px]` | `max-w-[1800px]` | Custom value, keep as-is |
| `width: 400px` | `w-[400px]` | Custom fixed width, keep arbitrary value |
| `max-w-screen-xl` | `max-w-screen-xl` | Already using Tailwind (1280px) |
| `max-w-7xl` | `max-w-7xl` | Already using Tailwind (80rem/1280px) |
| `max-w-4xl` | `max-w-4xl` | Already using Tailwind (56rem/896px) |
| `w-[80%]` | `w-4/5` or `w-[80%]` | Percentage-based, already Tailwind |
| `min-w-0` | `min-w-0` | Already using Tailwind |
| `width: 20px` | `w-5` | Tailwind's 20px (1.25rem) |
| `width: 24px` | `w-6` | Tailwind's 24px (1.5rem) |
| `width: 48px` | `w-12` | Tailwind's 48px (3rem) |

### 2.2 Height Constraints

| SASS Rule | Tailwind Utility | Rationale |
|-----------|------------------|-----------|
| `max-height: 75vh` | `max-h-[75vh]` | Custom viewport height |
| `max-height: calc(100vh - 4rem)` | `max-h-[calc(100vh-4rem)]` | Custom calc, arbitrary value |
| `height: 100%` | `h-full` | Standard full-height |
| `height: 20px` | `h-5` | Tailwind's 20px |
| `height: 24px` | `h-6` | Tailwind's 24px |
| `height: 48px` | `h-12` | Tailwind's 48px |
| `min-h-screen` | `min-h-screen` | Already Tailwind |

### 2.3 Spacing (Padding/Margin)

| SASS Rule | Tailwind Utility | Notes |
|-----------|------------------|-------|
| `padding: 0` | `p-0` | Standard |
| `margin: 0` | `m-0` | Standard |
| `padding: var(--space-xs)` | `p-xs` | **Custom** - Already in config |
| `padding: var(--space-sm)` | `p-sm` | **Custom** - Already in config |
| `padding: var(--space-md)` | `p-md` | **Custom** - Already in config |
| `padding: var(--space-lg)` | `p-lg` | **Custom** - Already in config |
| `padding: var(--space-xl)` | `p-xl` | **Custom** - Already in config |
| `padding: var(--space-2xl)` | `p-2xl` | **Custom** - Already in config |
| `margin: 0.5em 0 1em` | `my-4 mt-2 mb-4` | Em-based, approximate conversion |
| `margin: 2em 0` | `my-8` | Standard |
| `padding: 1.5em` | `p-6` | 24px equivalent |
| `padding: 1em` | `p-4` | 16px equivalent |
| `padding-left: 2rem` | `pl-8` | Standard |
| `gap: 0.5em` | `gap-2` | Standard |

**Important**: The custom spacing scale (`--space-xs` through `--space-2xl`) is already configured in Tailwind, so these can be used directly (e.g., `p-md` instead of `p-5`).

### 2.4 Border Radius

| SASS Rule | Tailwind Utility | Notes |
|-----------|------------------|-------|
| `border-radius: var(--radius-sm)` | `rounded-sm` | Already in config (5px) |
| `border-radius: var(--radius-md)` | `rounded-md` | Already in config (10px) |
| `border-radius: var(--radius-lg)` | `rounded-lg` | Already in config (20px) |
| `border-radius: 4px` | `rounded` | Tailwind default (4px) |
| `border-radius: var(--radius)` | `rounded-[var(--radius)]` | Custom 20px, use `rounded-lg` |

---

## 3. CSS Variable Integration Analysis

### 3.1 Correctly Integrated Variables

The following CSS variables are **already working seamlessly** with Tailwind:

**Colors** (lines 18-49 in `tailwind.config.js`):
- `background`, `foreground`, `surface`, `border`, `muted`, `accent`
- `card`, `popover`, `primary`, `secondary`, `destructive`
- Legacy mappings: `bg-primary`, `bg-secondary`, `text-primary`, etc.
- Chart colors: `chart-1` through `chart-5`

**Spacing** (lines 51-58):
- `xs`, `sm`, `md`, `lg`, `xl`, `2xl` mapped to `--space-*` variables

**Border Radius** (lines 59-64):
- `sm`, `md`, `lg`, `DEFAULT` mapped to `--radius-*` variables

**Typography** (lines 13-17):
- `font-mono`, `font-prose`, `font-sans` mapped to `--font-*` variables

**Transitions** (lines 65-69):
- `fast`, `DEFAULT`, `slow` mapped to `--transition-*` variables

### 3.2 Variables Used Inline (Needs Migration)

The following inline `style="..."` usages should be replaced with Tailwind utilities:

| Layout File | Inline Style | Replacement Strategy |
|-------------|--------------|---------------------|
| `page-sidebar.html` | `color: var(--text-secondary)` | Remove, use `text-muted` class |
| `page-sidebar.html` | `border-color: var(--border-primary)` | Remove, use `border-border` class |
| `wiki.html` | `border-color: var(--border)` | Remove, use `border-border` class |
| `wiki.html` | `background-color: var(--surface)` | Remove, use `bg-surface` class |
| `collapsible-sidebar.html` | `background: var(--bg-primary)` | Remove, use `bg-background` class |
| All layouts | `style="color: var(--muted)"` | Replace with `text-muted` |

**Reason for Migration**: While inline CSS variables work, they bypass Tailwind's responsive/hover/dark mode prefixes and create maintenance overhead.

---

## 4. Conflict Analysis

### 4.1 SASS vs Tailwind Specificity Conflicts

**Current Conflicts Identified**:

1. **Body max-width override** (`wiki.html` line 6):
   ```scss
   body { max-width: none !important; }
   ```
   - **Conflict**: Uses `!important` to override potential SASS defaults
   - **Solution**: Remove once SASS is deprecated; Tailwind utility classes have sufficient specificity

2. **Sidebar sticky positioning** (`_page-sidebar.scss` line 15-20):
   ```scss
   @media (min-width: 1024px) {
     position: sticky;
     top: 2rem;
   }
   ```
   - **Conflict**: None currently, but could conflict with Tailwind's `lg:sticky` if added to HTML
   - **Solution**: Migrate to `lg:sticky lg:top-8` and remove SASS

3. **Print styles override** (`_page-sidebar.scss` line 150-157):
   ```scss
   @media print {
     #page-sidebar { display: none; }
     main { width: 100% !important; }
   }
   ```
   - **Conflict**: `!important` may override Tailwind utilities
   - **Solution**: Use Tailwind's `print:` prefix: `print:hidden` and `print:w-full`

4. **Custom scrollbar** (`_page-sidebar.scss` line 23-40):
   - **Conflict**: Pseudo-elements (`::-webkit-scrollbar`) cannot be replaced with Tailwind utilities alone
   - **Solution**: Keep in SASS as `@layer components` or move to global styles in `_theme-variables.scss`

### 4.2 Cascade and Load Order Issues

**Current Load Order** (from `head.html`, assumed):
1. Tailwind CSS (compiled)
2. SASS stylesheets (`_style.scss`, `_page-sidebar.scss`, etc.)
3. Inline `<style>` blocks in layouts

**Potential Issues**:
- SASS rules loaded after Tailwind can override utilities
- Inline styles have highest specificity, making refactoring difficult

**Mitigation Strategy**:
- Phase out SASS files incrementally
- Move non-replaceable styles (scrollbars, animations) to Tailwind's `@layer base` or `@layer components`
- Eliminate inline `<style>` blocks, move to component includes or Tailwind utilities

---

## 5. Recommended `tailwind.config.js` Updates

### 5.1 Add Custom Max-Width for Notebook Layout

**Current Usage**: `notebook.html` uses `max-w-[1800px]`

**Recommendation**: Add to `theme.extend.maxWidth`:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      maxWidth: {
        'notebook': '1800px', // For wide 3-column notebook layout
      },
      // ... existing config
    }
  }
}
```

**Usage**: Replace `max-w-[1800px]` with `max-w-notebook`

### 5.2 Add Custom Width for Fixed Sidebar

**Current Usage**: `collapsible-sidebar.html` uses `width: 400px`

**Recommendation**: Add to `theme.extend.width`:

```javascript
width: {
  'sidebar-fixed': '400px', // For collapsible sidebar
},
```

**Usage**: Replace `w-[400px]` with `w-sidebar-fixed`

### 5.3 Add Custom Max-Height for Images

**Current Usage**: `_style.scss` uses `max-height: 75vh` for images

**Recommendation**: Add to `theme.extend.maxHeight`:

```javascript
maxHeight: {
  'image': '75vh', // For responsive image height cap
},
```

**Usage**: Apply `max-h-image` to image containers

### 5.4 Add Print Variant (Already Built-in)

Tailwind v3+ includes `print:` variant by default. No config changes needed.

**Usage**:
- `print:hidden` for `#page-sidebar`
- `print:w-full` for main content

### 5.5 Complete Updated Config

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_notes/*.md',
    './_pages/*.md',
    './src/**/*.{ts,tsx}',
    './*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-mono)', 'Courier New', 'Courier', 'monospace'],
        prose: ['var(--font-prose)', 'Courier New', 'Courier', 'monospace'],
        sans: ['var(--font-prose)', 'Courier New', 'Courier', 'monospace'],
      },
      colors: {
        // Core theme colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',

        // Extended palette
        card: 'var(--card)',
        popover: 'var(--popover)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        destructive: 'var(--destructive)',

        // Legacy mappings
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-code': 'var(--bg-code)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'link-base': 'var(--link-base)',
        'link-hover': 'var(--link-hover)',

        // Chart colors
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        DEFAULT: 'var(--radius)',
      },
      transitionDuration: {
        fast: 'var(--transition-fast)',
        DEFAULT: 'var(--transition-base)',
        slow: 'var(--transition-slow)',
      },
      // NEW ADDITIONS
      maxWidth: {
        'notebook': '1800px',
      },
      width: {
        'sidebar-fixed': '400px',
      },
      maxHeight: {
        'image': '75vh',
        'sidebar': 'calc(100vh - 4rem)',
      },
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

---

## 6. Migration Phases

### Phase A: Establish Tailwind Baseline
**Duration**: 1-2 hours
**Goal**: Update Tailwind config with all necessary custom values

**Tasks**:
1. ✅ Update `tailwind.config.js` with new `maxWidth`, `width`, `maxHeight` values (see Section 5.5)
2. ✅ Rebuild Tailwind CSS: `npm run build:css` (or equivalent)
3. ✅ Verify CSS variables still work in dev environment
4. ✅ Test dark mode toggle functionality

**Deliverables**:
- Updated `tailwind.config.js`
- Rebuilt CSS bundle
- Smoke test verification

---

### Phase B: Migrate Modern Layouts
**Duration**: 3-4 hours
**Goal**: Convert Tailwind-first layouts to pure utilities

**Target Files**:
1. `_layouts/wiki.html`
2. `_layouts/notebook.html`
3. `_layouts/terminal-note.html`

**Tasks**:

#### B.1: `wiki.html` (Estimated: 1 hour)
- [ ] Remove inline `<style>` block (lines 4-18)
- [ ] Replace `max-width: none !important` with Tailwind utility on body
- [ ] Convert inline CSS variable styles to utility classes:
  - `style="border-color: var(--border)"` → `border-border`
  - `style="color: var(--muted)"` → `text-muted`
  - `style="background-color: var(--surface)"` → `bg-surface`
- [ ] Test wiki layout responsiveness

#### B.2: `notebook.html` (Estimated: 1.5 hours)
- [ ] Remove inline `<style>` block (lines 118-171)
- [ ] Replace media queries with Tailwind responsive prefixes:
  - `@media (max-width: 1023px)` → `max-lg:` prefix
  - `@media (min-width: 1024px)` → `lg:` prefix
- [ ] Convert custom scrollbar styles to component layer (keep in SASS for now)
- [ ] Replace `max-w-[1800px]` with `max-w-notebook`
- [ ] Test 3-column layout on desktop/tablet/mobile

#### B.3: `terminal-note.html` (Estimated: 30 min)
- [ ] Already mostly Tailwind, verify no inline styles remain
- [ ] Test terminal layout

**Deliverables**:
- 3 layout files with zero inline `<style>` blocks
- Component-level styles moved to `_theme-variables.scss` if needed
- Responsive testing checklist completed

---

### Phase C: Migrate Legacy Layouts
**Duration**: 4-6 hours
**Goal**: Convert SASS-dependent layouts to Tailwind

**Target Files**:
1. `_layouts/page-sidebar.html`
2. `_layouts/collapsible-sidebar.html`
3. `_layouts/default.html`
4. `_layouts/note.html`
5. `_layouts/page.html`

**Tasks**:

#### C.1: `page-sidebar.html` (Estimated: 2 hours)
- [ ] Remove inline `style="max-width: 48rem"` (line 13) → Add `max-w-3xl` class
- [ ] Convert all `style="color: var(--*)"` to utility classes
- [ ] Migrate `_page-sidebar.scss` styles:
  - [ ] Move sticky positioning to HTML: `lg:sticky lg:top-8`
  - [ ] Move custom scrollbar to `@layer components` in `_theme-variables.scss`
  - [ ] Convert button styles to utility classes
  - [ ] Add `print:hidden` to sidebar, `print:w-full` to main
- [ ] **Delete** `_sass/_page-sidebar.scss` after verification
- [ ] Test sidebar collapse on mobile, sticky behavior on desktop

#### C.2: `collapsible-sidebar.html` (Estimated: 2 hours)
- [ ] Remove entire inline `<style>` block (lines 6-174)
- [ ] Convert all CSS to Tailwind utilities:
  - [ ] `.fullscreen-container` → `relative flex flex-col min-h-screen p-5 bg-cover bg-center`
  - [ ] `.main-content-area` → `flex-1 overflow-y-auto p-5 transition-all duration-300`
  - [ ] `.fixed-right-sidebar` → `fixed top-0 right-0 bottom-0 w-sidebar-fixed h-full bg-background border-l border-border flex flex-col z-[999] transition-transform duration-300`
  - [ ] `.sidebar-toggle-btn` → `fixed top-5 right-5 z-[1000] w-12 h-12 rounded-md border border-border bg-surface text-foreground flex items-center justify-center hover:bg-ui-hover`
  - [ ] Media query `@media (max-width: 768px)` → `md:w-full`
- [ ] Test sidebar collapse animation
- [ ] Test responsive behavior on mobile

#### C.3: Remaining Layouts (Estimated: 1-2 hours)
- [ ] `default.html`: Verify no inline styles
- [ ] `note.html`: Already uses Tailwind classes, verify
- [ ] `page.html`: Already uses `max-w-4xl`, verify

**Deliverables**:
- 5 layout files fully migrated to Tailwind
- `_page-sidebar.scss` deleted
- Responsive testing checklist completed

---

### Phase D: Remove Deprecated SASS Rules
**Duration**: 2-3 hours
**Goal**: Clean up legacy SASS files, retain only essentials

**Tasks**:

#### D.1: Audit Remaining SASS Files
- [ ] **`_style.scss`**:
  - [ ] Delete `$border-radius: 4px` (line 13) - use CSS var `--radius-sm`
  - [ ] Migrate global element styles to Tailwind `@layer base` if needed
  - [ ] Delete file if fully replaced
- [ ] **`_code.scss`**:
  - [ ] Syntax highlighting styles cannot be replaced with Tailwind
  - [ ] **Keep this file**, ensure it uses CSS variables correctly
- [ ] **`_callouts.scss`**:
  - [ ] Complex component styles, cannot be replaced with utilities alone
  - [ ] **Keep this file**, move to `@layer components` in Tailwind
- [ ] **`_theme-variables.scss`**:
  - [ ] This is the source of truth for CSS variables
  - [ ] **Keep and maintain** - core of the theming system
- [ ] **`_normalize.scss`**:
  - [ ] Browser reset styles
  - [ ] **Keep** - Tailwind's Preflight doesn't cover everything

#### D.2: Organize Retained SASS
Create a new structure:

```
_sass/
├── _theme-variables.scss   (KEEP - CSS variables)
├── _normalize.scss          (KEEP - Browser resets)
├── components/
│   ├── _syntax-highlighting.scss (Renamed from _code.scss)
│   ├── _callouts.scss       (KEEP - Component styles)
│   └── _custom-scrollbar.scss (Extract from _page-sidebar.scss)
└── deprecated/
    ├── _style.scss          (ARCHIVE - After migration)
    └── _page-sidebar.scss   (ARCHIVE - After migration)
```

#### D.3: Final Cleanup
- [ ] Remove unused Sass variables from `_style.scss`
- [ ] Verify all layouts render correctly
- [ ] Run CSS bundle size comparison (before vs after)
- [ ] Update documentation in `README.md` or `docs/`

**Deliverables**:
- Streamlined `_sass/` directory
- Only essential SASS files retained
- Bundle size report

---

## 7. Testing Checklist

### 7.1 Visual Regression Testing

**Layouts to Test**:
- [ ] `wiki.html` - Full-width, left nav, right TOC
- [ ] `notebook.html` - 3-column layout with sticky sidebars
- [ ] `page-sidebar.html` - 2-column with collapsible sidebar
- [ ] `collapsible-sidebar.html` - Fixed overlay sidebar
- [ ] `terminal-note.html` - Terminal theme layout
- [ ] `note.html` - Centered wide note
- [ ] `page.html` - Simple centered page

**Responsive Breakpoints**:
- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px - 1279px)
- [ ] Wide Desktop (≥ 1280px)

**Dark Mode**:
- [ ] All layouts render correctly in light mode
- [ ] All layouts render correctly in dark mode
- [ ] Dark mode toggle works on all pages

### 7.2 Functionality Testing

- [ ] Sidebar collapse/expand animations work
- [ ] Sticky sidebar scrolling works on desktop
- [ ] Print styles hide sidebar correctly
- [ ] Custom scrollbars appear on desktop
- [ ] Wiki navigation active states work
- [ ] TOC links scroll correctly
- [ ] Video embeds render in notebook layout
- [ ] Code block copy buttons work

### 7.3 Performance Testing

**Metrics to Measure**:
- [ ] Initial CSS bundle size (before migration)
- [ ] Final CSS bundle size (after migration)
- [ ] Page load time (Lighthouse score)
- [ ] First Contentful Paint (FCP)
- [ ] Cumulative Layout Shift (CLS)

**Expected Outcome**: Bundle size should **decrease** by ~20-30% after removing duplicate styles.

---

## 8. Rollback Strategy

### 8.1 Git Workflow

**Branching Strategy**:
```bash
# Create feature branch for migration
git checkout -b feature/tailwind-migration

# Work in phases (one branch per phase)
git checkout -b feature/tailwind-phase-a
# ... complete Phase A ...
git merge feature/tailwind-phase-a

git checkout -b feature/tailwind-phase-b
# ... complete Phase B ...
git merge feature/tailwind-phase-b

# etc.
```

**Rollback Command**:
```bash
# If migration causes issues, rollback to main
git checkout main
git branch -D feature/tailwind-migration
```

### 8.2 Backup Plan

**Before Starting Migration**:
1. Create full backup of `_sass/` directory
2. Tag current commit: `git tag pre-tailwind-migration`
3. Document current CSS bundle size

**Rollback Trigger Conditions**:
- Visual regression in production
- Bundle size increases significantly (>10%)
- Performance degrades (Lighthouse score drops >5 points)
- Critical functionality breaks

---

## 9. Post-Migration Cleanup

### 9.1 Documentation Updates

- [ ] Update `README.md` with new styling approach
- [ ] Document custom Tailwind utilities (e.g., `max-w-notebook`)
- [ ] Create style guide for contributors
- [ ] Remove references to deleted SASS files

### 9.2 Developer Experience Improvements

- [ ] Add Tailwind IntelliSense to VSCode workspace settings
- [ ] Configure Prettier to format Tailwind classes
- [ ] Add linting for Tailwind best practices
- [ ] Update CI/CD to build Tailwind CSS

### 9.3 Future-Proofing

**Recommendations**:
1. **Use Tailwind's `@layer` directive** for custom component styles:
   ```scss
   @layer components {
     .custom-scrollbar {
       /* Styles that can't be utilities */
     }
   }
   ```

2. **Avoid inline `<style>` blocks** - Use Tailwind utilities or component classes

3. **Leverage CSS variables** - Keep theme variables in `_theme-variables.scss`, reference via Tailwind config

4. **Document exceptions** - If a style can't be migrated (e.g., pseudo-elements), document why in code comments

---

## Appendix A: Quick Reference

### A.1 Common SASS → Tailwind Conversions

| SASS Pattern | Tailwind Utility |
|--------------|------------------|
| `width: 100%` | `w-full` |
| `max-width: 48rem` | `max-w-3xl` |
| `padding: var(--space-md)` | `p-md` |
| `margin: 2rem 0` | `my-8` |
| `@media (min-width: 1024px)` | `lg:` prefix |
| `border-radius: var(--radius-md)` | `rounded-md` |
| `color: var(--text-primary)` | `text-foreground` |
| `background: var(--bg-primary)` | `bg-background` |
| `display: none` (print) | `print:hidden` |

### A.2 Files Safe to Delete (After Phase D)

- `_sass/_style.scss` (after migrating global styles)
- `_sass/_page-sidebar.scss` (after Phase C.1)

### A.3 Files to Keep

- `_sass/_theme-variables.scss` (CSS variables)
- `_sass/_normalize.scss` (Browser resets)
- `_sass/_code.scss` (Syntax highlighting)
- `_sass/_callouts.scss` (Complex components)

---

## Appendix B: Estimated Time Investment

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| **Phase A** | Tailwind config updates | 1-2 hours |
| **Phase B** | Modern layout migration (3 files) | 3-4 hours |
| **Phase C** | Legacy layout migration (5 files) | 4-6 hours |
| **Phase D** | SASS cleanup and organization | 2-3 hours |
| **Testing** | Visual/functional/performance | 2-3 hours |
| **Documentation** | Update docs and guides | 1-2 hours |
| **TOTAL** | Full migration completion | **13-20 hours** |

---

## Appendix C: Contact and Resources

**Project Owner**: b08x
**Repository**: https://github.com/b08x/b08x.github.io
**Tailwind Docs**: https://tailwindcss.com/docs
**Jekyll SASS Docs**: https://jekyllrb.com/docs/assets/

**Migration Lead**: DX Optimizer Agent
**Document Version**: 1.0
**Last Updated**: 2025-12-26

---

**End of SASS-to-Tailwind Migration Strategy**
