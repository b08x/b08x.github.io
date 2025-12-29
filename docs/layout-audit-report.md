# Layout Audit Report: b08x.github.io Digital Garden
**Phase 1: Layout Template Consolidation Analysis**

**Date:** 2025-12-26
**Auditor:** Frontend Developer Agent
**Scope:** All 11 layout templates in `_layouts/`

---

## Executive Summary

This audit examined all 11 layout templates in the b08x.github.io Digital Garden project, revealing significant architectural inconsistencies between modern layouts (wiki.html, notebook.html, terminal-note.html) that use Tailwind's responsive grid system and legacy layouts (note.html, page-sidebar.html, page.html, about.html, home.html) that use simpler container approaches. The analysis identified 4 distinct layout archetypes, 7 major inconsistencies, and provides a preliminary unified shell design to consolidate the patterns.

**Key Findings:**
- **4 Layout Archetypes** identified: Modern Terminal (3 layouts), Legacy Simple (3 layouts), Specialized Layouts (3 layouts), Full-Screen Layout (1 layout), Base Shell (1 layout)
- **7 Major Inconsistencies** in container strategies, max-width approaches, spacing systems, React integration, and responsive patterns
- **Recommendation:** Implement unified shell component with Tailwind-first approach supporting 1-3 column responsive layouts

---

## 1. Comprehensive Layout Inventory

### 1.1 Inventory Comparison Table

| Layout File | Type | Container Strategy | Max Width | Grid Structure | Spacing System | React Islands | Responsive | Header/Footer |
|-------------|------|-------------------|-----------|----------------|---------------|---------------|------------|---------------|
| **wiki.html** | Modern Terminal | Tailwind (`container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8`) | screen-xl (1280px) | 3-column flex (`lg:flex-row`) | Tailwind utilities | Yes (SearchCmdK) | Mobile → Desktop | Terminal header, Footer |
| **notebook.html** | Modern Layered | Tailwind (`max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8`) | 1800px | 3-column grid (`grid-cols-[320px_1fr_280px]`) | Tailwind utilities | Yes (NotesGrid, NotebookGuide, AudioPlayer) | Mobile-first stacking | Default layout wrapper |
| **terminal-note.html** | Modern Terminal | Tailwind (`container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8`) | screen-xl (1280px) | 2-column flex (`lg:flex-row`) | Tailwind utilities | Yes (SearchCmdK) | Mobile → Desktop | Terminal header, Footer, Sidebar |
| **page-sidebar.html** | Legacy Hybrid | Tailwind (`container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8`) | screen-xl (1280px) | 2-column flex (`lg:flex-row`) | Tailwind utilities + CSS vars | No direct islands | Mobile → Desktop | Default layout wrapper |
| **knowledgebase.html** | Specialized | Tailwind (`container mx-auto px-4 sm:px-6 lg:px-8`) | None (full width) | 2-column flex (`lg:flex-row`) | Tailwind utilities | No | Carousel + Sidebar | Default layout wrapper |
| **collapsible-sidebar.html** | Full-Screen | Inline CSS (`position: fixed`) | None (full viewport) | Custom fixed sidebar (400px) | CSS custom props + inline | No | Media queries at 768px | Default layout wrapper |
| **default.html** | Base Shell | Inline styles (`w-full px-0`) | None | Single column flex | Tailwind utilities | Yes (SearchCmdK) | Minimal | Nav, Footer |
| **note.html** | Legacy Simple | Inline styles (`mx-auto w-[80%] max-w-7xl`) | 7xl (1280px) + 80% constraint | Single column | CSS vars (inline styles) | Yes (react_graph) | Basic responsive | Default layout wrapper |
| **page.html** | Legacy Simple | Tailwind (`mx-auto w-full max-w-4xl px-4 py-10`) | 4xl (896px) | Single column | Tailwind utilities | No | Basic | Default layout wrapper |
| **about.html** | Legacy Simple | Tailwind (`mx-auto w-full max-w-4xl px-4 py-10`) | 4xl (896px) | Single column | Tailwind utilities | No | Basic | Default layout wrapper |
| **home.html** | Legacy Simple | Tailwind (`mx-auto w-full max-w-4xl px-4 py-10`) | 4xl (896px) | Single column | Tailwind utilities | No | Basic | Default layout wrapper |

### 1.2 Layout Archetypes

Based on the analysis, 4 distinct layout archetypes emerged:

#### **Archetype A: Modern Terminal Layouts** (wiki.html, terminal-note.html)
- **Container:** `container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8`
- **Grid:** Responsive flex layout (1-col mobile → 2-3 col desktop)
- **Features:** Full-height containers, sticky sidebars, Terminal aesthetic
- **React:** Integrated SearchCmdK, terminal-toc components
- **Inline Styles:** Use CSS custom properties (`var(--border)`, `var(--foreground)`)
- **Breakpoints:** Responsive at `lg:` (1024px) and `xl:` (1280px)

#### **Archetype B: Legacy Simple Layouts** (page.html, about.html, home.html)
- **Container:** `mx-auto w-full max-w-4xl px-4 py-10`
- **Grid:** Single column, centered
- **Features:** Minimal structure, content-first
- **React:** None
- **Styling:** Pure Tailwind utilities
- **Breakpoints:** None (static width)

#### **Archetype C: Specialized Layouts** (notebook.html, knowledgebase.html, page-sidebar.html)
- **Container:** Varies (custom max-widths: 1800px, 7xl, screen-xl)
- **Grid:** 2-3 column grids with specific use cases
- **Features:** Sidebars, carousels, media widgets, collapsible sections
- **React:** Heavy React island usage (notebook.html)
- **Styling:** Mix of Tailwind + inline styles + CSS vars
- **Breakpoints:** Mobile-first responsive design

#### **Archetype D: Full-Screen Layout** (collapsible-sidebar.html)
- **Container:** Fixed positioning, viewport-based
- **Grid:** Fixed sidebar (400px) + flexible main area
- **Features:** Video backgrounds, full-screen experience, toggle mechanics
- **React:** None
- **Styling:** Heavy inline CSS in `<style>` block
- **Breakpoints:** Media query at 768px

---

## 2. Detailed Pattern Analysis

### 2.1 Container Strategies

#### **Modern Tailwind Approach (Recommended)**
Used by: wiki.html, terminal-note.html, page-sidebar.html, knowledgebase.html
```html
<div class="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
```
- **Max Width:** 1280px (screen-xl)
- **Horizontal Padding:** Responsive (4 → 6 → 8 at breakpoints)
- **Centering:** `mx-auto`
- **Benefits:** Consistent, responsive, maintains Terminal aesthetic

#### **Custom Max-Width Approach (Inconsistent)**
Used by: notebook.html (1800px), note.html (80% + max-w-7xl)
```html
<div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
```
- **Issue:** Non-standard breakpoints create visual inconsistency
- **Problem:** note.html uses `w-[80%]` which creates unpredictable responsive behavior

#### **Constrained Simple Approach (Legacy)**
Used by: page.html, about.html, home.html
```html
<div class="mx-auto w-full max-w-4xl px-4 py-10">
```
- **Max Width:** 896px (max-w-4xl)
- **Issue:** Too narrow for multi-column Terminal aesthetic
- **Recommendation:** Migrate to screen-xl standard

#### **No Container Approach (Edge Case)**
Used by: default.html, collapsible-sidebar.html
```html
<div id="container" class="w-full px-0 flex flex-col min-h-screen">
```
- **Purpose:** Base shell for nested layouts
- **Note:** Correctly designed as minimalist wrapper

### 2.2 Grid and Layout Structures

#### **Three-Column Grid** (wiki.html, notebook.html)

**wiki.html** - Flex-based approach:
```html
<div class="flex-grow flex flex-col lg:flex-row gap-8 py-10">
  <aside id="wiki-nav" class="w-full lg:w-64 lg:flex-shrink-0">
    <!-- Left Sidebar: Wiki Navigation -->
  </aside>

  <main id="content" class="flex-1 min-w-0">
    <!-- Main Content -->
  </main>

  <aside id="toc-sidebar" class="hidden xl:block w-64 lg:flex-shrink-0">
    <!-- Right Sidebar: TOC -->
  </aside>
</div>
```
- **Breakpoints:** Stacks vertically on mobile, 2-col on `lg:`, 3-col on `xl:`
- **Sidebar Widths:** 256px (16rem / w-64) for both sidebars
- **Flexibility:** `flex-1 min-w-0` prevents content overflow

**notebook.html** - Grid-based approach:
```html
<div class="grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] xl:grid-cols-[380px_1fr_320px] gap-6">
  <aside class="source-guide"><!-- Left Sidebar --></aside>
  <main class="notes-and-video"><!-- Main Content --></main>
  <aside class="notebook-guide"><!-- Right Sidebar --></aside>
</div>
```
- **Breakpoints:** 1-col mobile → 3-col desktop
- **Sidebar Widths:** Precise pixel values (320px/380px, 280px/320px)
- **Flexibility:** Grid template columns with `1fr` for main content

**Pattern Identified:** Both use sticky sidebars (`lg:sticky lg:top-8`), but differ in implementation (flex vs grid)

#### **Two-Column Layouts** (terminal-note.html, page-sidebar.html, knowledgebase.html)

**Consistent Pattern:**
```html
<div class="flex flex-col lg:flex-row gap-8 py-10">
  <main class="flex-1 min-w-0"><!-- Main Content --></main>
  <aside class="w-full lg:w-80 lg:flex-shrink-0"><!-- Sidebar --></aside>
</div>
```
- **Sidebar Width:** 320px (w-80) standard
- **Gap:** 32px (gap-8) standard
- **Vertical Padding:** 40px (py-10) standard

**Exception:** knowledgebase.html uses sidebar on left with navigation + carousel controls

#### **Single-Column Layouts** (page.html, about.html, home.html, note.html)

**Simple Structure:**
```html
<div class="mx-auto w-full max-w-4xl px-4 py-10">
  {{ content }}
</div>
```
- **No grid complexity**
- **Purely content-driven**
- **Issue:** note.html adds unnecessary width constraint (`w-[80%]`)

### 2.3 Spacing and Padding Systems

#### **Tailwind Utilities (Preferred)**
Used by: wiki.html, notebook.html, terminal-note.html, page-sidebar.html, knowledgebase.html

**Container Padding:**
```html
px-4 sm:px-6 lg:px-8
```
- Mobile: 16px
- Tablet (640px+): 24px
- Desktop (1024px+): 32px

**Vertical Spacing:**
```html
py-10  → 40px vertical padding
gap-8  → 32px gap between grid items
gap-6  → 24px gap (notebook.html variant)
```

**Sticky Positioning:**
```html
lg:sticky lg:top-8
```
- Consistent `top-8` (32px) offset across all sticky sidebars

#### **CSS Custom Properties (Hybrid)**
Used by: note.html, page-sidebar.html (inline styles)

```html
style="border-color: var(--border); color: var(--muted);"
```
- **Issue:** Mixing inline styles with Tailwind creates maintenance burden
- **Recommendation:** Use Tailwind's color classes (`text-muted`, `border-border`)

#### **Inline CSS (Legacy/Specialized)**
Used by: collapsible-sidebar.html

```css
.fixed-right-sidebar {
  padding: 2rem 1.5rem 1rem;
  border-left: 1px solid var(--border);
}
```
- **Issue:** Not reusable, harder to maintain
- **Use Case:** Justified for specialized full-screen layout

### 2.4 Responsive Breakpoints

#### **Tailwind Default Breakpoints** (Used by all modern layouts)
```
sm:  640px  → Tablet portrait
md:  768px  → Tablet landscape
lg:  1024px → Desktop (primary breakpoint for 2-3 column layouts)
xl:  1280px → Large desktop (3rd column reveal)
2xl: 1536px → Extra large (not used in current layouts)
```

#### **Common Responsive Patterns**

**Mobile-First Stacking:**
```html
<!-- Stacks vertically on mobile, horizontal on desktop -->
<div class="flex flex-col lg:flex-row">
```
Used by: wiki.html, terminal-note.html, page-sidebar.html, knowledgebase.html

**Grid Column Transformation:**
```html
<!-- 1 column mobile → 3 columns desktop -->
<div class="grid grid-cols-1 lg:grid-cols-[320px_1fr_280px]">
```
Used by: notebook.html

**Conditional Visibility:**
```html
<!-- Hide on mobile, show on large desktop -->
<aside class="hidden xl:block">
```
Used by: wiki.html (right TOC sidebar)

```html
<!-- Show on desktop, hide on mobile -->
<button class="lg:hidden">Toggle Sidebar</button>
```
Used by: page-sidebar.html (mobile toggle)

#### **Custom Media Queries (Edge Case)**
collapsible-sidebar.html uses inline media query:
```css
@media (max-width: 768px) {
  .fixed-right-sidebar {
    width: 100%;
  }
}
```
- **Issue:** Inconsistent with Tailwind's `md:` breakpoint (768px)
- **Recommendation:** Use Tailwind responsive utilities

### 2.5 React Component Mount Points

#### **Modern Layouts with React Islands**

**wiki.html:**
```html
<!-- Terminal TOC Web Component -->
<terminal-toc></terminal-toc>

<!-- React Island -->
<div data-island="SearchCmdK"></div>
<script src="{{ '/assets/js/dist/garden-widgets.js' | relative_url }}"></script>
```

**notebook.html:**
```html
<!-- NotesGrid Island -->
<div data-island="NotesGrid" data-props='{{ notes_data | escape }}'>
  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg">
    <span class="text-gray-500">Loading notes...</span>
  </div>
</div>

<!-- NotebookGuide Island -->
<div data-island="NotebookGuide" data-props='{"suggestedQuestions": {{ questions | jsonify }}}'>
  <!-- Placeholder -->
</div>

<!-- AudioPlayer Island -->
<div data-island="AudioPlayer" data-props='{"audioUrl": "{{ page.audio_url }}"}'>
  <!-- Placeholder -->
</div>
```

**terminal-note.html:**
```html
<terminal-toc></terminal-toc>
<div data-island="SearchCmdK"></div>
```

**note.html:**
```html
{% include react_graph.html %}
```

#### **Pattern Analysis:**

**Consistent Island Mounting Pattern:**
1. `data-island="ComponentName"` attribute
2. Optional `data-props` JSON data
3. Placeholder content for progressive enhancement
4. Single script include: `garden-widgets.js`

**Inconsistency:**
- Some layouts use `{% include react_graph.html %}` (note.html)
- Others use direct `data-island` attributes
- **Recommendation:** Standardize on `data-island` pattern across all layouts

**Loading States:**
All React islands include placeholder content:
```html
<div class="bg-gray-50 dark:bg-gray-800 rounded-lg border p-8 text-center">
  <span class="text-gray-500 font-mono text-sm">Loading...</span>
</div>
```
- Good practice for progressive enhancement
- Consistent loading experience

### 2.6 Inline `<style>` Blocks

#### **Layouts with Inline Styles**

**wiki.html:**
```html
<style>
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
</style>
```
- **Purpose:** Override default body constraints, create full-height layout
- **Active state styling** for navigation links

**notebook.html:**
```html
<style>
/* Responsive adjustments */
@media (max-width: 1023px) {
  .notebook-container > div {
    grid-template-columns: 1fr;
  }
}

/* Smooth scrolling for sticky sidebars */
@media (min-width: 1024px) {
  .source-guide,
  .notebook-guide {
    max-height: calc(100vh - 3rem);
    overflow-y: auto;
  }
}

/* Loading state animation */
[data-island] > div {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
```
- **Purpose:** Custom scrollbar styles, loading animations
- **Issue:** Could be extracted to shared CSS file

**collapsible-sidebar.html:**
```html
<style>
  /* 174 lines of inline CSS */
  .fullscreen-container { ... }
  .fixed-right-sidebar { ... }
  .sidebar-toggle-btn { ... }
  /* ... etc */
</style>
```
- **Purpose:** Full custom layout with fixed positioning
- **Issue:** Largest inline style block (174 lines)
- **Justification:** Specialized layout, rarely used

**note.html:**
```html
<style>
  /* Code block wrapper and copy button styles */
</style>
```
- **Purpose:** Code block styling
- **Issue:** Duplicated in terminal-note.html and wiki.html

#### **Pattern Identified: Code Block Copy Button Duplication**

**Same script appears in 3 layouts:**
- wiki.html (lines 179-215)
- terminal-note.html (lines 110-148)
- note.html (lines 66-107)

**Code:**
```javascript
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre code").forEach((codeBlock) => {
    // Create wrapper and copy button
  });
});
```

**Recommendation:** Extract to shared JavaScript module

---

## 3. Common Patterns Identified

### 3.1 Repeated Container Structures

#### **Pattern 1: Terminal Container**
**Frequency:** 3 layouts (wiki.html, terminal-note.html, page-sidebar.html)
```html
<div class="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
  <!-- Responsive padding and max-width -->
</div>
```

#### **Pattern 2: Flex Column Wrapper**
**Frequency:** 5 layouts (wiki.html, terminal-note.html, page-sidebar.html, knowledgebase.html, default.html)
```html
<div class="flex flex-col min-h-screen">
  <header class="flex-none">...</header>
  <main class="flex-grow">...</main>
  <footer class="flex-none">...</footer>
</div>
```

#### **Pattern 3: Sticky Sidebar**
**Frequency:** 4 layouts (wiki.html, terminal-note.html, notebook.html, page-sidebar.html)
```html
<aside class="lg:sticky lg:top-8 lg:self-start">
  <div class="sticky top-8">
    <!-- Content -->
  </div>
</aside>
```

### 3.2 Sidebar Patterns

#### **Left Navigation Sidebar** (wiki.html, knowledgebase.html)
```html
<aside class="w-full lg:w-64 lg:flex-shrink-0">
  <div class="sticky top-8">
    <h3 class="text-xs font-bold uppercase tracking-wider mb-4">Navigation</h3>
    <nav><!-- Links --></nav>
  </div>
</aside>
```
- **Width:** 256px (w-64)
- **Sticky:** Yes
- **Purpose:** Page/section navigation

#### **Right TOC Sidebar** (wiki.html, terminal-note.html)
```html
<aside class="hidden xl:block w-64 lg:flex-shrink-0">
  <div class="sticky top-8">
    <h3 class="text-xs font-bold uppercase tracking-wider mb-4">Table of Contents</h3>
    <terminal-toc></terminal-toc>
  </div>
</aside>
```
- **Width:** 256px (w-64) or 320px (w-80)
- **Visibility:** Hidden on mobile/tablet, visible on xl
- **Purpose:** Table of contents

#### **Collapsible Sidebar** (page-sidebar.html, collapsible-sidebar.html)
```html
<!-- Mobile Toggle -->
<button id="sidebar-toggle" class="lg:hidden">
  <span>Contents & Resources</span>
  <svg class="w-5 h-5 transition-transform rotate-180">...</svg>
</button>

<!-- Sidebar Content -->
<div id="sidebar-content" class="space-y-8">
  <!-- Widgets -->
</div>
```
- **Mobile Behavior:** Collapsible with toggle button
- **Desktop Behavior:** Always visible
- **JavaScript:** Requires toggle script

### 3.3 Header and Footer Patterns

#### **Terminal Header** (wiki.html, terminal-note.html)
```html
<header id="header" class="flex-none border-b" style="border-color: var(--border);">
  {% include terminal-header.html %}
</header>
```

#### **Default Nav Header** (default.html, page-sidebar.html, note.html)
```html
<header id="header" class="flex-none py-6 border-b" style="border-color: var(--border);">
  {% include nav.html %}
</header>
```

#### **Standard Footer** (All layouts except collapsible-sidebar.html)
```html
<footer id="footer" class="flex-none py-8 border-t px-4 sm:px-6 lg:px-8" style="border-color: var(--border);">
  {% include footer.html %}
</footer>
```

**Inconsistency:** Padding varies between `py-6` (header) and `py-8` (footer)

---

## 4. Inconsistency Catalog

### 4.1 Different Max-Width Values

| Max Width | Layouts | Pixel Value | Use Case |
|-----------|---------|-------------|----------|
| `max-w-4xl` | page.html, about.html, home.html, page-sidebar.html header | 896px | Simple content pages |
| `max-w-7xl` | note.html | 1280px | Legacy note layout |
| `max-w-screen-xl` | wiki.html, terminal-note.html, page-sidebar.html | 1280px | Terminal layouts |
| `max-w-[1800px]` | notebook.html | 1800px | Wide notebook layout |
| No max-width | default.html, knowledgebase.html, collapsible-sidebar.html | Full width | Base shell, specialized layouts |

**Issue:** 5 different max-width strategies create visual inconsistency across pages

**Recommendation:** Standardize on `max-w-screen-xl` (1280px) for all multi-column layouts, `max-w-4xl` (896px) only for simple single-column content pages

### 4.2 Mixed Use of Tailwind vs Inline Styles

#### **Tailwind-Only (Ideal)**
- page.html
- about.html
- home.html

#### **Tailwind + CSS Custom Properties (Hybrid)**
- wiki.html
- terminal-note.html
- page-sidebar.html
- knowledgebase.html

Example:
```html
<h3 class="text-xs font-bold uppercase tracking-wider mb-4" style="color: var(--muted);">
```

**Issue:** Mixing Tailwind classes with inline styles reduces maintainability

**Recommendation:** Define Tailwind color classes in config:
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      muted: 'var(--muted)',
      border: 'var(--border)',
      foreground: 'var(--foreground)',
    }
  }
}
```

Then use: `class="text-muted border-border"`

#### **Heavy Inline Styles (Legacy)**
- collapsible-sidebar.html (174 lines of `<style>`)
- note.html (code block styles)

**Recommendation:** Extract to dedicated CSS modules

### 4.3 Conflicting Spacing Systems

#### **Responsive Container Padding**

**Modern (Consistent):**
```html
px-4 sm:px-6 lg:px-8
```
Used by: wiki.html, terminal-note.html, notebook.html, knowledgebase.html

**Legacy (Fixed):**
```html
px-4 py-10
```
Used by: page.html, about.html, home.html, note.html

**Issue:** Legacy layouts don't adapt padding at breakpoints

#### **Gap Between Grid Items**

**Standard:**
```html
gap-8  (32px)
```
Used by: wiki.html, terminal-note.html, page-sidebar.html

**Variant:**
```html
gap-6  (24px)
```
Used by: notebook.html

**Issue:** Inconsistent visual rhythm

**Recommendation:** Standardize on `gap-8` for all multi-column layouts

#### **Vertical Padding**

**Standard:**
```html
py-10  (40px)
```
Used by: Most layouts

**Variant:**
```html
py-6   (24px) - headers
py-8   (32px) - footers
```

**Issue:** Headers and footers use different vertical padding

**Recommendation:** Standardize on `py-8` for headers and footers

### 4.4 Different Responsive Strategies

#### **Strategy 1: Flex-based Stacking**
```html
<div class="flex flex-col lg:flex-row">
```
Used by: wiki.html, terminal-note.html, page-sidebar.html, knowledgebase.html

**Behavior:** Mobile-first vertical stacking, switches to horizontal at `lg:` breakpoint

#### **Strategy 2: Grid Column Transformation**
```html
<div class="grid grid-cols-1 lg:grid-cols-[320px_1fr_280px]">
```
Used by: notebook.html

**Behavior:** Grid-based responsive layout with explicit column widths

#### **Strategy 3: No Responsive Design**
```html
<div class="mx-auto w-full max-w-4xl">
```
Used by: page.html, about.html, home.html

**Behavior:** Static max-width, no layout changes at breakpoints

**Issue:** Inconsistent user experience across device sizes

**Recommendation:** All multi-column layouts should use Strategy 1 (flex-based stacking) for consistency

### 4.5 Header Include Inconsistency

| Layout | Header Include | Purpose |
|--------|---------------|---------|
| wiki.html | `terminal-header.html` | Terminal-themed header with special nav |
| terminal-note.html | `terminal-header.html` | Terminal-themed header |
| default.html | `nav.html` | Standard navigation |
| page-sidebar.html | Embedded directly | Hero/header section with page title |

**Issue:** 3 different header strategies create navigation inconsistency

**Recommendation:** Standardize on `terminal-header.html` for all layouts (maintains Terminal aesthetic)

### 4.6 React Island Implementation

#### **Consistent Pattern**
```html
<div data-island="ComponentName" data-props='{"key": "value"}'>
  <!-- Placeholder -->
</div>
<script src="{{ '/assets/js/dist/garden-widgets.js' | relative_url }}"></script>
```
Used by: wiki.html, terminal-note.html, notebook.html, default.html

#### **Inconsistent Pattern**
```html
{% include react_graph.html %}
```
Used by: note.html, terminal-note.html

**Issue:** Two different mounting mechanisms

**Recommendation:** Standardize on `data-island` pattern, convert `react_graph.html` include to island

### 4.7 Code Block Copy Button Duplication

**Same functionality implemented in 3 separate files:**
- wiki.html (lines 179-215)
- terminal-note.html (lines 110-148)
- note.html (lines 66-107)

**Issue:** Maintenance burden, code duplication

**Recommendation:** Extract to shared module:
```javascript
// assets/js/components/code-copy-buttons.js
export function initCodeCopyButtons() {
  document.addEventListener("DOMContentLoaded", () => {
    // Implementation
  });
}
```

Then import in each layout:
```html
<script type="module">
  import { initCodeCopyButtons } from '{{ site.baseurl }}/assets/js/components/code-copy-buttons.js';
  initCodeCopyButtons();
</script>
```

---

## 5. Preliminary Unified Shell Design

Based on the audit findings, here is a proposed unified shell component that consolidates common patterns while supporting layout variations.

### 5.1 Design Principles

1. **Tailwind-First:** Use Tailwind utilities over inline styles
2. **Mobile-First Responsive:** Design for mobile, enhance for desktop
3. **Terminal Aesthetic:** Maintain monospace fonts, dark mode support, clean borders
4. **Flexible Grid:** Support 1-3 column layouts via props/slots
5. **React Island Ready:** Built-in support for `data-island` mounting
6. **Accessibility:** ARIA labels, semantic HTML, keyboard navigation

### 5.2 Component Architecture

#### **Proposed File Structure**
```
_layouts/
  ├── base-shell.html          (New: Base layout wrapper)
  ├── terminal-layout.html     (New: Unified Terminal layout - replaces wiki.html, terminal-note.html)
  ├── content-layout.html      (New: Simple content layout - replaces page.html, about.html, home.html)
  ├── notebook.html            (Keep as specialized layout)
  ├── collapsible-sidebar.html (Keep as specialized layout)
  └── default.html             (Keep as minimal base)
```

#### **Component Hierarchy**
```
base-shell.html
  ├── Header (terminal-header.html or nav.html)
  ├── Main Content Container
  │   ├── Left Sidebar (optional, slot-based)
  │   ├── Main Content Area (required)
  │   └── Right Sidebar (optional, slot-based)
  └── Footer (footer.html)
```

### 5.3 Unified Shell Implementation

#### **File: `_layouts/base-shell.html`**

```html
<!DOCTYPE html>
<html lang="en" class="{{ page.theme_mode | default: 'dark' }}">
{% include head.html %}

<body class="bg-background text-foreground min-h-screen font-mono antialiased">

  <!-- Global Container -->
  <div id="app" class="flex flex-col min-h-screen">

    <!-- Header -->
    <header id="header" class="flex-none border-b border-border">
      {% if page.header_type == "terminal" %}
        {% include terminal-header.html %}
      {% else %}
        {% include nav.html %}
      {% endif %}
    </header>

    <!-- Main Content Area -->
    <main id="main" class="flex-grow">
      {{ content }}
    </main>

    <!-- Footer -->
    <footer id="footer" class="flex-none py-8 border-t border-border px-4 sm:px-6 lg:px-8">
      {% include footer.html %}
    </footer>

  </div>

  <!-- Global React Islands -->
  <div data-island="SearchCmdK"></div>

  <!-- Global Scripts -->
  {% include link-previews.html wrapperQuerySelector="content" %}
  <script src="{{ '/assets/js/dist/garden-widgets.js' | relative_url }}"></script>
  <script type="module" src="{{ '/assets/js/components/code-copy-buttons.js' | relative_url }}"></script>

</body>
</html>
```

#### **File: `_layouts/terminal-layout.html`**

```html
---
layout: base-shell
header_type: terminal
---

<!-- Terminal Container with Responsive Padding -->
<div class="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">

  <!-- Responsive Grid: 1-col mobile → 2-col tablet → 3-col desktop -->
  <div class="flex flex-col lg:flex-row gap-8 py-10">

    <!-- Left Sidebar (Conditional) -->
    {% if page.left_sidebar %}
    <aside id="left-sidebar" class="w-full lg:w-64 lg:flex-shrink-0">
      <div class="sticky top-8">
        {{ page.left_sidebar }}
      </div>
    </aside>
    {% endif %}

    <!-- Main Content -->
    <article id="content" class="flex-1 min-w-0">

      <!-- Article Header -->
      <header class="mb-12">
        <h1 class="text-3xl md:text-4xl font-prose font-bold mb-4 text-foreground">
          {{ page.title }}
        </h1>

        <!-- Metadata -->
        {% if page.last_modified_at or page.tags %}
        <div class="text-sm font-mono text-muted">
          {% if page.last_modified_at %}
          <time datetime="{{ page.last_modified_at | date_to_xmlschema }}" class="inline-block mr-4">
            <svg class="w-4 h-4 inline mr-1" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ page.last_modified_at | date: "%Y-%m-%d" }}
          </time>
          {% endif %}

          {% if page.tags and page.tags.size > 0 %}
          <div class="mt-3 flex flex-wrap gap-2">
            {% for tag in page.tags %}
            <span class="px-2 py-1 text-xs border border-border bg-surface">
              {{ tag }}
            </span>
            {% endfor %}
          </div>
          {% endif %}
        </div>
        {% endif %}
      </header>

      <!-- Content -->
      <div class="prose font-prose max-w-none">
        {{ content }}
      </div>

      <!-- Optional: Knowledge Graph -->
      {% if page.show_graph %}
      <section class="mt-16 pt-10 border-t border-border">
        <h2 class="text-xl font-mono font-bold mb-6 text-foreground">
          Knowledge Graph
        </h2>
        <div data-island="NotesGraph"></div>
      </section>
      {% endif %}

    </article>

    <!-- Right Sidebar (Conditional) -->
    {% if page.right_sidebar or page.show_toc %}
    <aside id="right-sidebar" class="w-full lg:w-80 lg:flex-shrink-0 {% unless page.show_toc_mobile %}hidden lg:block{% endunless %}">
      <div class="sticky top-8 space-y-10">

        <!-- Table of Contents -->
        {% if page.show_toc %}
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider mb-4 text-muted">Table of Contents</h3>
          <terminal-toc></terminal-toc>
        </div>
        {% endif %}

        <!-- Custom Sidebar Content -->
        {% if page.right_sidebar %}
        {{ page.right_sidebar }}
        {% endif %}

      </div>
    </aside>
    {% endif %}

  </div>

</div>

<!-- Terminal-specific Components -->
<script src="{{ site.baseurl }}/assets/js/components/terminal-toc.js" defer></script>
```

#### **File: `_layouts/content-layout.html`**

```html
---
layout: base-shell
header_type: standard
---

<!-- Simple Content Container -->
<div class="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
  <article class="prose prose-lg max-w-none">
    {{ content }}
  </article>
</div>
```

### 5.4 Layout Usage Examples

#### **Example 1: Three-Column Terminal Layout (wiki.html replacement)**

**Front Matter:**
```yaml
---
layout: terminal-layout
title: "Ruby on Rails Wiki"
header_type: terminal
left_sidebar: true
show_toc: true
show_graph: false
---
```

**Layout Customization:**
- Modify `terminal-layout.html` to include custom left sidebar (wiki navigation)
- Right sidebar automatically includes TOC via `show_toc: true`

#### **Example 2: Two-Column Note Layout (terminal-note.html replacement)**

**Front Matter:**
```yaml
---
layout: terminal-layout
title: "My Technical Note"
header_type: terminal
show_toc: true
show_graph: true
tags: [ruby, rails, backend]
last_modified_at: 2025-12-26
---
```

**Result:**
- No left sidebar
- Right sidebar with TOC
- Knowledge graph at bottom

#### **Example 3: Simple Content Page (page.html replacement)**

**Front Matter:**
```yaml
---
layout: content-layout
title: "About Me"
---
```

**Result:**
- Single column centered content
- Max-width: 896px
- Standard navigation header

### 5.5 Configuration via Front Matter

**Available Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `layout` | string | required | `terminal-layout` or `content-layout` |
| `header_type` | string | `"standard"` | `"terminal"` or `"standard"` |
| `left_sidebar` | boolean/string | `false` | Enable left sidebar or provide custom content |
| `right_sidebar` | boolean/string | `false` | Enable right sidebar or provide custom content |
| `show_toc` | boolean | `false` | Show table of contents in right sidebar |
| `show_toc_mobile` | boolean | `false` | Show TOC on mobile (hidden by default) |
| `show_graph` | boolean | `false` | Show knowledge graph at bottom of content |
| `max_width` | string | `"screen-xl"` | Override max-width: `"4xl"`, `"7xl"`, `"screen-xl"`, `"full"` |

### 5.6 Responsive Behavior

#### **Mobile (< 1024px)**
```
┌─────────────────────┐
│      Header         │
├─────────────────────┤
│                     │
│   Main Content      │
│                     │
├─────────────────────┤
│  Right Sidebar      │
│  (if visible)       │
├─────────────────────┤
│      Footer         │
└─────────────────────┘
```
- Single column stacking
- Left sidebar hidden or moved to top
- Right sidebar hidden unless `show_toc_mobile: true`

#### **Tablet/Desktop (1024px - 1280px)**
```
┌─────────────────────────────────┐
│           Header                │
├─────────────────────────────────┤
│           │                     │
│  Content  │   Right Sidebar     │
│           │   (if enabled)      │
│           │                     │
├─────────────────────────────────┤
│           Footer                │
└─────────────────────────────────┘
```
- Two-column flex layout
- Main content: `flex-1`
- Right sidebar: `w-80` (320px)

#### **Large Desktop (> 1280px)**
```
┌───────────────────────────────────────┐
│              Header                   │
├────────┬──────────────┬───────────────┤
│  Left  │              │     Right     │
│ Sidebar│   Content    │   Sidebar     │
│ (w-64) │   (flex-1)   │    (w-80)     │
│        │              │               │
├────────┴──────────────┴───────────────┤
│              Footer                   │
└───────────────────────────────────────┘
```
- Three-column flex layout
- Left sidebar: `w-64` (256px)
- Main content: `flex-1`
- Right sidebar: `w-80` (320px)

### 5.7 Terminal Aesthetic Requirements

#### **Typography**
```css
/* Monospace for UI elements (nav, sidebar, metadata) */
font-family: var(--font-mono); /* Courier New */

/* Readable font for prose content */
font-family: var(--font-prose); /* Courier New for Terminal theme */
```

#### **Color Palette (CSS Custom Properties)**
```css
--background: #1a1a1a;     /* Dark background */
--foreground: #e0e0e0;     /* Light text */
--surface: #252525;        /* Card/surface background */
--border: #444444;         /* Borders */
--muted: #888888;          /* Muted text */
--accent: #3498db;         /* Accent color (blue) */
```

#### **Spacing System**
```css
--space-xs: 0.3125rem;  /* 5px */
--space-sm: 0.625rem;   /* 10px */
--space-md: 1.25rem;    /* 20px */
--space-lg: 1.875rem;   /* 30px */
--space-xl: 2.5rem;     /* 40px */
--space-2xl: 3.75rem;   /* 60px */
```

**Tailwind Equivalents:**
- `gap-8` → 32px (standard grid gap)
- `py-10` → 40px (standard vertical padding)
- `px-4 sm:px-6 lg:px-8` → Responsive horizontal padding

#### **Border Radius**
```css
--radius-sm: 5px;
--radius-md: 10px;
--radius-lg: 20px;
```

#### **Transitions**
```css
--transition-fast: 150ms ease-in-out;
--transition-base: 300ms ease-in-out;
--transition-slow: 500ms ease-in-out;
```

### 5.8 Accessibility Features

#### **Semantic HTML**
```html
<header role="banner">
<nav role="navigation" aria-label="Primary navigation">
<main role="main" id="main-content">
<aside role="complementary" aria-label="Sidebar navigation">
<footer role="contentinfo">
```

#### **Keyboard Navigation**
- Skip to main content link
- Focus visible states (outline ring)
- Keyboard-accessible sidebar toggles

#### **ARIA Attributes**
```html
<button id="sidebar-toggle"
        aria-expanded="false"
        aria-controls="sidebar-content"
        aria-label="Toggle sidebar navigation">
```

#### **Focus Styles**
```css
*:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

---

## 6. Migration Roadmap

### Phase 1: Create Unified Shell (Week 1)
1. Create `base-shell.html` with header/footer wrapper
2. Create `terminal-layout.html` with 1-3 column responsive grid
3. Create `content-layout.html` for simple pages
4. Extract code-copy-buttons to shared module

### Phase 2: Migrate Modern Layouts (Week 2)
1. Migrate `wiki.html` → `terminal-layout.html` with custom left sidebar
2. Migrate `terminal-note.html` → `terminal-layout.html`
3. Migrate `page-sidebar.html` → `terminal-layout.html`
4. Test responsive behavior and React islands

### Phase 3: Migrate Legacy Layouts (Week 3)
1. Migrate `page.html` → `content-layout.html`
2. Migrate `about.html` → `content-layout.html`
3. Migrate `home.html` → `content-layout.html`
4. Migrate `note.html` → `terminal-layout.html`

### Phase 4: Specialized Layouts (Week 4)
1. Refactor `notebook.html` to use `terminal-layout.html` base
2. Evaluate `knowledgebase.html` for consolidation or keep as-is
3. Keep `collapsible-sidebar.html` as specialized layout
4. Remove deprecated layout files

### Phase 5: Cleanup and Optimization (Week 5)
1. Remove duplicated inline styles
2. Consolidate CSS custom properties usage
3. Standardize React island mounting
4. Update documentation
5. Run accessibility audit

---

## 7. Benefits of Unified Shell

### 7.1 Developer Experience
- **Single Source of Truth:** One layout system instead of 11 variations
- **Easier Maintenance:** Update shell once, affects all pages
- **Consistent Patterns:** Standardized container, grid, spacing approaches
- **Less Code Duplication:** Shared components, scripts, styles

### 7.2 User Experience
- **Visual Consistency:** Same max-width, spacing, responsive behavior across site
- **Predictable Navigation:** Uniform header/footer placement
- **Faster Load Times:** Reduced CSS/JS duplication
- **Better Accessibility:** Centralized ARIA labels, semantic HTML

### 7.3 Performance
- **Smaller HTML Files:** No inline style blocks
- **Cached Shared Modules:** Code-copy-buttons, terminal-toc loaded once
- **Optimized React Islands:** Single `garden-widgets.js` bundle

---

## 8. Recommendations Summary

### Immediate Actions (High Priority)

1. **Standardize Container Strategy**
   - Use `container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8` for all multi-column layouts
   - Use `mx-auto max-w-4xl px-4 sm:px-6 lg:px-8` for simple single-column content

2. **Remove Inline Styles**
   - Extract collapsible-sidebar.html styles to dedicated CSS file
   - Replace inline `style="color: var(--muted)"` with Tailwind classes

3. **Consolidate Code Block Functionality**
   - Extract copy-button script to `assets/js/components/code-copy-buttons.js`
   - Remove duplication from wiki.html, terminal-note.html, note.html

4. **Standardize Spacing**
   - Use `gap-8` for all grid gaps
   - Use `py-10` for main content vertical padding
   - Use `py-8` for header/footer vertical padding

### Medium-Term Actions (Medium Priority)

5. **Create Unified Shell Components**
   - Implement `base-shell.html`
   - Implement `terminal-layout.html`
   - Implement `content-layout.html`

6. **Migrate Layouts Incrementally**
   - Start with modern layouts (wiki.html, terminal-note.html)
   - Then migrate legacy layouts (page.html, about.html, home.html)
   - Finally refactor specialized layouts (notebook.html)

7. **Standardize React Island Mounting**
   - Convert `{% include react_graph.html %}` to `data-island="NotesGraph"`
   - Ensure all islands use consistent placeholder markup

### Long-Term Actions (Low Priority)

8. **Tailwind Configuration Enhancement**
   - Add color classes to Tailwind config for better DX:
     ```javascript
     colors: {
       muted: 'var(--muted)',
       border: 'var(--border)',
       foreground: 'var(--foreground)',
     }
     ```

9. **Accessibility Audit**
   - Add skip-to-content links
   - Ensure all interactive elements have proper ARIA labels
   - Test keyboard navigation across all layouts

10. **Documentation**
    - Create layout usage guide for content authors
    - Document available front matter options
    - Provide migration examples

---

## 9. Conclusion

The audit revealed a site in transition from legacy patterns to modern Tailwind-based Terminal aesthetics. While modern layouts (wiki.html, terminal-note.html) demonstrate best practices, legacy layouts (page.html, note.html) and specialized layouts (collapsible-sidebar.html) introduce significant inconsistencies.

**Key Takeaways:**
- **4 distinct layout archetypes** requiring consolidation
- **7 major inconsistencies** impacting maintainability and UX
- **Unified shell design** will reduce codebase by ~60% and improve consistency
- **Phased migration approach** minimizes risk and allows incremental testing

**Success Metrics:**
- Reduce layout files from 11 to 4 (base-shell, terminal-layout, content-layout, specialized)
- Eliminate all inline `<style>` blocks except for specialized layouts
- Achieve 100% Tailwind coverage (no mixed inline styles)
- Standardize responsive behavior across all pages

**Next Steps:**
1. Review this audit with stakeholders
2. Approve preliminary unified shell design
3. Begin Phase 1 implementation (create unified shell components)
4. Test with sample pages before full migration

---

## Appendix A: Layout File Sizes

| Layout File | Lines of Code | Inline Styles | React Islands |
|-------------|---------------|---------------|---------------|
| wiki.html | 220 | 14 lines | 1 |
| notebook.html | 172 | 53 lines | 3 |
| terminal-note.html | 152 | 0 | 2 |
| collapsible-sidebar.html | 237 | 174 lines | 0 |
| knowledgebase.html | 70 | 0 | 0 |
| page-sidebar.html | 67 | 0 | 0 |
| default.html | 32 | 0 | 1 |
| note.html | 108 | 41 lines | 1 |
| page.html | 7 | 0 | 0 |
| about.html | 7 | 0 | 0 |
| home.html | 7 | 0 | 0 |
| **Total** | **1,079** | **282 lines** | **8** |

**Projected Unified Shell:**
- base-shell.html: ~50 lines
- terminal-layout.html: ~120 lines
- content-layout.html: ~20 lines
- **Total: ~190 lines** (82% reduction)

---

## Appendix B: Tailwind Breakpoints Reference

```javascript
// Default Tailwind Breakpoints
{
  'sm': '640px',   // Tablet portrait
  'md': '768px',   // Tablet landscape
  'lg': '1024px',  // Desktop (primary multi-column breakpoint)
  'xl': '1280px',  // Large desktop (3-column reveal)
  '2xl': '1536px'  // Extra large (not used)
}

// Tailwind Max-Width Values
{
  'max-w-4xl': '896px',   // Legacy simple layouts
  'max-w-7xl': '1280px',  // Note layout
  'max-w-screen-xl': '1280px' // Terminal layouts (recommended)
}
```

---

**End of Layout Audit Report**
