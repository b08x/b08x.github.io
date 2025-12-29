# Unified Shell Component Specifications

**Project:** b08x.github.io Digital Garden
**Document Version:** 1.0
**Date:** 2025-12-26
**Status:** Design Specification - Ready for Implementation
**Author:** Frontend Developer Agent

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Base Shell Component](#base-shell-component)
3. [Terminal Layout Component](#terminal-layout-component)
4. [Content Layout Component](#content-layout-component)
5. [React Island Integration Standard](#react-island-integration-standard)
6. [Migration Conversion Guide](#migration-conversion-guide)
7. [Terminal Aesthetic Preservation](#terminal-aesthetic-preservation)
8. [Accessibility & SEO](#accessibility-and-seo)
9. [Testing Checklist](#testing-checklist)

---

## Executive Summary

This specification defines three core layout components that consolidate 11 existing layouts into a unified, maintainable architecture:

- **base-shell.html** - Universal wrapper for all pages (DOCTYPE, head, header, footer)
- **terminal-layout.html** - Responsive 1-3 column grid for content-heavy pages
- **content-layout.html** - Simple single-column centered layout for static pages

**Consolidation Impact:**
- 11 layouts → 4 files (64% reduction)
- 282 lines of inline styles eliminated
- 5 max-width strategies unified to 2 canonical patterns
- 100% Tailwind utilities (zero inline `<style>` blocks)

---

## Base Shell Component

### Purpose

The outer shell wraps ALL page types, providing:
- Semantic HTML5 structure
- Terminal header integration
- Dark mode class management
- React island mounting preparation
- Footer and meta tags

### File Location

`_layouts/base-shell.html`

### Complete Implementation

```html
<!DOCTYPE html>
<html lang="{{ site.lang | default: 'en' }}" class="{{ page.theme | default: 'dark' }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO Meta Tags -->
  <title>{% if page.title %}{{ page.title }} | {% endif %}{{ site.title }}</title>
  <meta name="description" content="{{ page.description | default: site.description | strip_html | normalize_whitespace | truncate: 160 }}">
  <meta name="author" content="{{ site.author }}">

  <!-- Open Graph / Social Media -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{% if page.title %}{{ page.title }} | {% endif %}{{ site.title }}">
  <meta property="og:description" content="{{ page.description | default: site.description | strip_html | normalize_whitespace | truncate: 160 }}">
  <meta property="og:url" content="{{ page.url | absolute_url }}">
  {% if page.image %}
  <meta property="og:image" content="{{ page.image | absolute_url }}">
  {% endif %}

  <!-- Canonical URL -->
  <link rel="canonical" href="{{ page.url | absolute_url }}">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="{{ '/assets/images/favicon.svg' | relative_url }}">
  <link rel="alternate icon" href="{{ '/assets/images/favicon.ico' | relative_url }}">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Theme Color -->
  <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#f0f0f0" media="(prefers-color-scheme: light)">

  {% if jekyll.environment == 'production' and site.google_analytics %}
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={{ site.google_analytics }}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '{{ site.google_analytics }}');
  </script>
  {% endif %}
</head>

<body class="bg-background text-foreground min-h-screen font-mono antialiased">

  <!-- Skip to Content Link (Accessibility) -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded">
    Skip to main content
  </a>

  <!-- Main Container -->
  <div id="app-container" class="flex flex-col min-h-screen">

    <!-- Header -->
    <header id="site-header" class="flex-none border-b border-border" role="banner">
      {% include terminal-header.html %}
    </header>

    <!-- Main Content Area (Layout-specific content injected here) -->
    <main id="main-content" class="flex-grow" role="main">
      {{ content }}
    </main>

    <!-- Footer -->
    <footer id="site-footer" class="flex-none py-8 px-4 sm:px-6 lg:px-8 border-t border-border" role="contentinfo">
      {% include footer.html %}
    </footer>

  </div>

  <!-- React Islands Root Container -->
  <div id="react-portals">
    <!-- SearchCmdK is global and always mounted -->
    <div data-island="SearchCmdK"></div>
  </div>

  <!-- Scripts -->
  <script src="{{ '/assets/js/dist/garden-widgets.js' | relative_url }}" defer></script>

  {% if page.custom_js %}
    {% for script in page.custom_js %}
    <script src="{{ script | relative_url }}" defer></script>
    {% endfor %}
  {% endif %}

</body>
</html>
```

### Key Features

1. **Semantic HTML5 Structure**
   - Proper landmark roles (`banner`, `main`, `contentinfo`)
   - Skip-to-content link for screen readers
   - ARIA-compliant header hierarchy

2. **Dark Mode Integration**
   - Class-based theme switching via `<html>` tag
   - CSS variable cascade from `:root` and `.dark`
   - Theme-color meta tags for browser chrome

3. **SEO Optimization**
   - Dynamic title generation
   - Open Graph meta tags
   - Canonical URLs
   - Structured description truncation

4. **Performance**
   - Deferred script loading
   - Preconnect hints for external resources
   - Conditional analytics loading (production only)

### Liquid Variables

| Variable | Type | Default | Purpose |
|----------|------|---------|---------|
| `page.theme` | String | `'dark'` | Sets HTML class for theme |
| `page.title` | String | - | Page title |
| `page.description` | String | `site.description` | Meta description |
| `page.image` | String | - | Social media preview image |
| `page.custom_js` | Array | - | Additional scripts to load |

---

## Terminal Layout Component

### Purpose

The flexible 1-3 column responsive grid that consolidates 6 existing layouts:
- `wiki.html` (3-column)
- `terminal-note.html` (2-column)
- `knowledgebase.html` (3-column with carousel)
- `note.html` (2-column)
- `page-sidebar.html` (2-column)
- `default.html` (1-column fallback)

### File Location

`_layouts/terminal-layout.html`

### Complete Implementation

```html
---
layout: base-shell
---

<div class="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">

  <!-- Responsive Grid Container -->
  <div class="flex flex-col lg:flex-row gap-8">

    <!-- Left Sidebar (Optional) -->
    {% if page.left_sidebar %}
    <aside
      id="left-sidebar"
      class="w-full lg:w-64 lg:flex-shrink-0"
      aria-label="Navigation sidebar"
    >
      <div class="lg:sticky lg:top-8 lg:self-start">

        {% if page.left_sidebar == 'wiki-nav' %}
          <!-- Wiki Navigation Pattern -->
          <h3 class="text-xs font-bold uppercase tracking-wider mb-4 text-muted">
            Wiki Pages
          </h3>
          <nav>
            <ul class="space-y-1">
              {% assign wiki_data = site.data.wikis[page.wiki_id] %}
              {% for wp in wiki_data.pages %}
              <li>
                <a
                  href="#{{ wp.id }}"
                  class="block py-2 px-3 text-sm border-l-2 border-transparent transition-all hover:bg-surface hover:border-accent wiki-nav-link"
                  data-page-id="{{ wp.id }}"
                >
                  {{ wp.title }}
                </a>
              </li>
              {% endfor %}
            </ul>
          </nav>

          <div class="mt-12 pt-6 border-t border-border">
            <a
              href="{{ site.baseurl }}/"
              class="block text-sm font-mono text-muted hover:text-accent transition-colors"
            >
              ← Back to Garden
            </a>
          </div>
        {% endif %}

        {% if page.left_sidebar == 'terminal-sidebar' %}
          <!-- Standard Navigation Sidebar -->
          <h3 class="text-xs font-bold uppercase tracking-wider mb-4 text-muted">
            Navigation
          </h3>
          {% include terminal-sidebar.html %}
        {% endif %}

        {% if page.left_sidebar == 'knowledgebase-toc' %}
          <!-- Knowledgebase TOC -->
          <h3 class="text-xs font-bold uppercase tracking-wider mb-6 text-muted">
            Knowledgebase
          </h3>
          <nav id="kb-toc" class="space-y-2">
            <!-- Dynamically populated by JS -->
          </nav>

          {% if page.resources %}
          <div class="mt-10 pt-10 border-t border-border">
            <h4 class="text-xs font-bold uppercase tracking-wider mb-4 text-muted">
              Resources
            </h4>
            <div class="space-y-4">
              {% for item in page.resources %}
              <div class="flex items-center gap-2 text-sm">
                <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <a href="{{ item.url }}" class="hover:text-accent transition-colors">
                  {{ item.title }}
                </a>
              </div>
              {% endfor %}
            </div>
          </div>
          {% endif %}
        {% endif %}

      </div>
    </aside>
    {% endif %}

    <!-- Main Content Column -->
    <main
      id="main-content-column"
      class="flex-1 min-w-0"
      aria-label="Main content"
    >

      <!-- Page Header -->
      <header class="mb-12">
        <h1 class="text-3xl md:text-4xl font-prose font-bold mb-4 text-foreground">
          {{ page.title }}
        </h1>

        <!-- Metadata (Conditional) -->
        {% if page.show_metadata != false %}
        <div class="text-sm font-mono text-muted">
          {% if page.last_modified_at %}
          <time datetime="{{ page.last_modified_at | date_to_xmlschema }}" class="inline-block mr-4">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ page.last_modified_at | date: "%Y-%m-%d" }}
          </time>
          {% endif %}

          {% if page.tags and page.tags.size > 0 %}
          <div class="mt-3 flex flex-wrap gap-2">
            {% for tag in page.tags %}
            <span class="px-2 py-1 text-xs border border-border bg-surface rounded">
              {{ tag }}
            </span>
            {% endfor %}
          </div>
          {% endif %}
        </div>
        {% endif %}
      </header>

      <!-- Article Content -->
      <article class="prose font-prose max-w-none">
        <div id="notes-entry-container">
          {{ content }}
        </div>
      </article>

      <!-- React Island: GraphView (Conditional) -->
      {% if page.show_graph %}
      <section class="mt-16 pt-10 border-t border-border">
        <h2 class="text-xl font-mono font-bold mb-6 text-foreground">
          Knowledge Graph
        </h2>
        <p class="mb-6 text-base font-prose text-muted">
          Here are all the notes in this garden, along with their links, visualized as a graph.
        </p>
        <div data-island="GraphView"></div>
      </section>
      {% endif %}

    </main>

    <!-- Right Sidebar (Optional) -->
    {% if page.right_sidebar %}
    <aside
      id="right-sidebar"
      class="w-full lg:w-80 lg:flex-shrink-0 {% if page.right_sidebar_xl_only %}hidden xl:block{% endif %}"
      aria-label="Table of contents and related content"
    >
      <div class="lg:sticky lg:top-8 lg:self-start space-y-10">

        {% if page.right_sidebar contains 'toc' %}
        <!-- Table of Contents -->
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider mb-4 text-muted">
            Table of Contents
          </h3>
          <terminal-toc></terminal-toc>
        </div>
        {% endif %}

        {% if page.right_sidebar contains 'related' %}
        <!-- Related Pages -->
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider mb-4 text-muted">
            Related Notes
          </h3>
          <div class="space-y-2">
            <!-- Dynamically populated -->
          </div>
        </div>
        {% endif %}

      </div>
    </aside>
    {% endif %}

  </div>

</div>

<!-- Web Component: Terminal TOC -->
<script src="{{ site.baseurl }}/assets/js/components/terminal-toc.js" defer></script>

<!-- Wiki Navigation Active State Script (if wiki layout) -->
{% if page.left_sidebar == 'wiki-nav' %}
<script>
  document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".wiki-nav-link");
    const sections = document.querySelectorAll("section[id]");

    function updateActiveLink() {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 150) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("border-accent", "bg-surface/50", "text-accent");
        link.classList.add("border-transparent", "text-muted");

        if (link.getAttribute("href").slice(1) === current) {
          link.classList.remove("border-transparent", "text-muted");
          link.classList.add("border-accent", "bg-surface/50", "text-accent");
        }
      });
    }

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();
  });
</script>
{% endif %}

<!-- Knowledgebase Paginator (if knowledgebase layout) -->
{% if page.left_sidebar == 'knowledgebase-toc' %}
<link rel="stylesheet" href="{{ '/assets/css/knowledgebase.css' | relative_url }}">
<script src="{{ '/assets/js/knowledgebase-paginator.js' | relative_url }}" defer></script>
{% endif %}
```

### Responsive Behavior

#### Desktop (≥1280px) - 3 Columns
```
┌────────────┬─────────────────────┬────────────┐
│ Left Nav   │   Main Content      │   Right    │
│ (256px)    │   (flex-1)          │   TOC      │
│            │                     │   (320px)  │
│ Sticky     │   Article           │   Sticky   │
│ top-8      │                     │   top-8    │
└────────────┴─────────────────────┴────────────┘
```

#### Tablet (1024px-1280px) - 2 Columns
```
┌─────────────────────────┬────────────┐
│    Main Content         │  Sidebar   │
│    (flex-1)             │  (320px)   │
│                         │            │
│    Article              │  Sticky    │
│                         │  top-8     │
└─────────────────────────┴────────────┘
```

#### Mobile (<1024px) - 1 Column Stack
```
┌─────────────────────────┐
│    Main Content         │
├─────────────────────────┤
│    Sidebar Content      │
│    (stacked below)      │
└─────────────────────────┘
```

### Front Matter Configuration

#### Example: 3-Column Wiki Layout

```yaml
---
layout: terminal-layout
title: "Linux Networking Wiki"
wiki_id: "linux-networking"
left_sidebar: "wiki-nav"
right_sidebar: "toc"
right_sidebar_xl_only: true
show_metadata: false
show_graph: false
---
```

#### Example: 2-Column Note Layout

```yaml
---
layout: terminal-layout
title: "Understanding Docker Compose"
left_sidebar: false
right_sidebar: "toc"
show_metadata: true
show_graph: true
tags: ["docker", "devops", "containers"]
last_modified_at: 2025-12-26
---
```

#### Example: 1-Column Simple Layout

```yaml
---
layout: terminal-layout
title: "About This Garden"
left_sidebar: false
right_sidebar: false
show_metadata: false
show_graph: false
---
```

### Tailwind Classes Reference

| Element | Classes | Purpose |
|---------|---------|---------|
| Container | `container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10` | Centered, responsive padding |
| Grid Wrapper | `flex flex-col lg:flex-row gap-8` | Mobile stack → Desktop row |
| Left Sidebar | `w-full lg:w-64 lg:flex-shrink-0` | Full mobile → 256px desktop |
| Main Content | `flex-1 min-w-0` | Flexible width, prevents overflow |
| Right Sidebar | `w-full lg:w-80 lg:flex-shrink-0` | Full mobile → 320px desktop |
| Sticky Wrapper | `lg:sticky lg:top-8 lg:self-start` | Sticky at 32px offset on desktop |

---

## Content Layout Component

### Purpose

Streamlined single-column layout for simple pages:
- `about.html`
- `home.html`
- `page.html`

### File Location

`_layouts/content-layout.html`

### Complete Implementation

```html
---
layout: base-shell
---

<div class="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">

  {% if page.show_hero %}
  <!-- Hero Section (Optional) -->
  <header class="mb-16 text-center">
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground">
      {{ page.title }}
    </h1>
    {% if page.subtitle %}
    <p class="text-xl md:text-2xl text-muted leading-relaxed max-w-3xl mx-auto">
      {{ page.subtitle }}
    </p>
    {% endif %}
  </header>
  {% else %}
  <!-- Standard Header -->
  <header class="mb-12">
    <h1 class="text-3xl md:text-4xl font-bold mb-4 text-foreground">
      {{ page.title }}
    </h1>
    {% if page.description %}
    <p class="text-lg text-muted">
      {{ page.description }}
    </p>
    {% endif %}
  </header>
  {% endif %}

  <!-- Main Content -->
  <article class="prose prose-base lg:prose-lg xl:prose-xl max-w-none font-prose">
    {{ content }}
  </article>

</div>
```

### Responsive Padding

| Breakpoint | Horizontal Padding | Vertical Padding |
|------------|-------------------|------------------|
| Mobile (<640px) | 16px (`px-4`) | 40px (`py-10`) |
| Tablet (640px-1024px) | 24px (`px-6`) | 40px (`py-10`) |
| Desktop (≥1024px) | 32px (`px-8`) | 40px (`py-10`) |

### Front Matter Configuration

#### Example: Hero Page

```yaml
---
layout: content-layout
title: "Welcome to My Digital Garden"
subtitle: "A collection of interconnected notes, ideas, and explorations"
show_hero: true
---
```

#### Example: Simple About Page

```yaml
---
layout: content-layout
title: "About"
description: "Learn more about this project and its creator"
show_hero: false
---
```

### Tailwind Classes Reference

| Element | Classes | Purpose |
|---------|---------|---------|
| Container | `container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10` | Centered, 896px max-width |
| Hero Title | `text-4xl md:text-5xl lg:text-6xl font-bold mb-6` | Responsive heading |
| Hero Subtitle | `text-xl md:text-2xl text-muted` | Muted secondary text |
| Article | `prose prose-base lg:prose-lg xl:prose-xl max-w-none` | Tailwind Typography plugin |

---

## React Island Integration Standard

### Mounting Pattern

All React components use the standardized `data-island` attribute pattern:

```html
<div data-island="ComponentName" data-props='{"key": "value"}'>
  <!-- Loading State Placeholder -->
  <div class="bg-surface border border-border rounded-lg p-8 text-center">
    <span class="text-muted font-mono text-sm">Loading Component...</span>
  </div>
</div>
```

### Registered Components

| Component | Mount Location | Props | Purpose |
|-----------|----------------|-------|---------|
| `SearchCmdK` | Global (base-shell) | None | Cmd+K search modal |
| `GraphView` | Content area (conditional) | None | D3 knowledge graph visualization |
| `NotesGrid` | Content area | `{"filter": "tag-name"}` | Grid of note cards |
| `AudioPlayer` | Inline content | `{"src": "/path/to/audio.mp3"}` | Audio player widget |
| `VideoPlayer` | Inline content | `{"src": "/path/to/video.mp4"}` | Video player widget |
| `NotebookGuide` | Content area | `{"notebook": "name"}` | Notebook navigation |
| `TerminalTOC` | Right sidebar | None | Web component (not React) |

### Hydration Strategy

**Immediate Hydration** (via main.tsx):
- All islands hydrate on `DOMContentLoaded`
- React Suspense provides loading fallback
- Lazy loading via `React.lazy()` for code splitting

**Implementation** (already exists in `src/main.tsx`):

```typescript
const components: Record<string, React.ComponentType<any>> = {
  HelloGarden,
  GraphView,
  SearchCmdK,
  VideoPlayer,
  NotesGrid,
  AudioPlayer,
  NotebookGuide,
};

const mountIslands = () => {
  const islands = document.querySelectorAll('[data-island]');

  islands.forEach((container) => {
    const componentName = container.getAttribute('data-island');
    if (componentName && components[componentName]) {
      const Component = components[componentName];
      let props = {};

      const propsAttr = container.getAttribute('data-props');
      if (propsAttr) {
        props = JSON.parse(propsAttr);
      }

      const root = createRoot(container);
      root.render(
        <Suspense fallback={<div>Loading component...</div>}>
          <Component {...props} />
        </Suspense>
      );
    }
  });
};
```

### Props Passing Convention

**Simple Props:**
```html
<div data-island="NotesGrid" data-props='{"filter": "docker"}'></div>
```

**Complex Props (with escaping):**
```html
<div data-island="VideoPlayer" data-props='{"src": "/assets/videos/demo.mp4", "autoplay": false, "controls": true}'></div>
```

### Loading States

**Standard Placeholder:**
```html
<div class="bg-surface border border-border rounded-lg p-8 text-center animate-pulse">
  <svg class="w-8 h-8 mx-auto mb-2 text-muted animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
  <span class="text-muted font-mono text-sm">Loading...</span>
</div>
```

### Error Handling

Components handle errors internally (see `GraphView.tsx` example):

```typescript
if (error) {
  return (
    <div className="w-full h-96 flex items-center justify-center border border-destructive rounded-lg bg-destructive/10 text-destructive font-mono">
      Error loading component: {error}
    </div>
  );
}
```

---

## Migration Conversion Guide

### Layout 1: wiki.html → terminal-layout.html

**Configuration:**

```yaml
---
layout: terminal-layout
title: "{{ page.title }}"
wiki_id: "{{ page.wiki_id }}"
left_sidebar: "wiki-nav"
right_sidebar: "toc"
right_sidebar_xl_only: true
show_metadata: false
show_graph: false
---
```

**Changes:**

1. **Remove inline `<style>` block** (lines 4-18)
   - Replace `body { max-width: none !important; }` with base-shell defaults
   - Active link styling now handled by Tailwind classes in sidebar

2. **Remove duplicate header/footer includes**
   - Handled by base-shell.html

3. **Preserve wiki-specific JavaScript**
   - Active link scroll tracking (retained in terminal-layout conditional)
   - Code-copy-buttons (extract to shared module)

4. **Update container classes**
   ```diff
   - <div id="container" class="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
   + (Handled by terminal-layout wrapper)
   ```

**Testing Checklist:**
- [ ] Wiki navigation active states update on scroll
- [ ] 3-column layout on desktop (left nav, content, TOC)
- [ ] 2-column layout on tablet (content, TOC)
- [ ] 1-column stack on mobile
- [ ] SearchCmdK modal opens with Cmd+K
- [ ] Code copy buttons work

---

### Layout 2: terminal-note.html → terminal-layout.html

**Configuration:**

```yaml
---
layout: terminal-layout
title: "{{ page.title }}"
left_sidebar: "terminal-sidebar"
right_sidebar: "toc"
show_metadata: true
show_graph: true
tags: {{ page.tags }}
last_modified_at: {{ page.last_modified_at }}
---
```

**Changes:**

1. **Replace body classes**
   ```diff
   - <body class="max-w-none m-0 p-0 h-screen flex flex-col bg-background text-foreground font-mono antialiased">
   + (Handled by base-shell.html)
   ```

2. **Update sidebar include**
   ```diff
   - {% include terminal-sidebar.html %}
   + (Handled by terminal-layout left_sidebar conditional)
   ```

3. **GraphView integration**
   ```diff
   - {% include react_graph.html %}
   + (Rendered via data-island="GraphView" when show_graph: true)
   ```

**Testing Checklist:**
- [ ] Left sidebar navigation renders correctly
- [ ] Right sidebar TOC is sticky on desktop
- [ ] Metadata (date, tags) displays properly
- [ ] GraphView loads and renders D3 visualization
- [ ] Responsive behavior: 2-column → 1-column

---

### Layout 3: note.html → terminal-layout.html

**Configuration:**

```yaml
---
layout: terminal-layout
title: "{{ page.title }}"
left_sidebar: false
right_sidebar: false
show_metadata: true
show_graph: true
tags: {{ page.tags }}
last_modified_at: {{ page.last_modified_at }}
---
```

**Changes:**

1. **Remove all inline `style` attributes**
   ```diff
   - <div class="mx-auto w-[80%] max-w-7xl">
   + (Container handled by terminal-layout with max-w-screen-xl)
   ```

2. **Convert CSS variable usage to Tailwind**
   ```diff
   - style="color: var(--text-primary)"
   + class="text-foreground"

   - style="border-bottom: 1px solid var(--border-primary)"
   + class="border-b border-border"
   ```

3. **Replace legacy GraphView include**
   ```diff
   - {% include react_graph.html %}
   + (Handled by terminal-layout show_graph conditional)
   ```

4. **Extract code-copy-buttons script** to shared module

**Testing Checklist:**
- [ ] Wide single-column layout (no sidebars)
- [ ] Metadata displays correctly
- [ ] GraphView renders below content
- [ ] Code copy buttons work
- [ ] No inline styles remain

---

### Layout 4: page-sidebar.html → terminal-layout.html

**Configuration:**

```yaml
---
layout: terminal-layout
title: "{{ page.title }}"
description: "{{ page.description }}"
left_sidebar: false
right_sidebar: "toc"
show_metadata: false
toc: true
audio_file: "{{ page.audio_file }}"
videos: {{ page.videos }}
sources: {{ page.sources }}
---
```

**Changes:**

1. **Remove container wrapper**
   ```diff
   - <div class="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
   + (Handled by terminal-layout)
   ```

2. **Convert hero header to standard header**
   ```diff
   - <header class="mb-10 pb-8 border-b-2" style="border-color: var(--border-primary)">
   + (Use terminal-layout standard header with description)
   ```

3. **Sidebar media widgets**
   - Migrate to right_sidebar custom content blocks
   - Or handle via custom includes based on front matter

4. **Mobile toggle button**
   - Terminal-layout handles responsive sidebar visibility
   - Remove custom JavaScript for toggle

**Testing Checklist:**
- [ ] 2-column layout on desktop
- [ ] Sidebar stacks below content on mobile
- [ ] TOC sidebar is sticky
- [ ] Audio/video widgets render if present
- [ ] Sources section renders if present

---

### Layout 5: default.html → terminal-layout.html

**Configuration:**

```yaml
---
layout: terminal-layout
title: "{{ page.title }}"
left_sidebar: false
right_sidebar: false
show_metadata: false
show_graph: false
---
```

**Changes:**

1. **Simplify to minimal terminal-layout**
   ```diff
   - <div id="container" class="w-full px-0 flex flex-col min-h-screen">
   + (Use terminal-layout with no sidebars)
   ```

2. **Remove nav include**
   ```diff
   - {% include nav.html %}
   + (Handled by base-shell terminal-header)
   ```

3. **Preserve link-previews include** (if needed)
   - Add to terminal-layout or base-shell as optional feature

**Testing Checklist:**
- [ ] Single-column centered content
- [ ] SearchCmdK works
- [ ] Footer renders correctly
- [ ] No sidebars visible

---

### Layout 6: knowledgebase.html → terminal-layout.html

**Configuration:**

```yaml
---
layout: terminal-layout
title: "{{ page.title }}"
description: "{{ page.description }}"
left_sidebar: "knowledgebase-toc"
right_sidebar: false
show_metadata: false
resources: {{ page.resources }}
---
```

**Changes:**

1. **Preserve carousel functionality**
   - Keep custom JavaScript for knowledgebase-paginator
   - Load conditionally via front matter

2. **Update container**
   ```diff
   - <div class="container mx-auto px-4 sm:px-6 lg:px-8">
   + (Handled by terminal-layout)
   ```

3. **Left sidebar TOC pattern**
   - Use `left_sidebar: "knowledgebase-toc"` variant
   - Dynamically populated by existing JS

**Testing Checklist:**
- [ ] Left sidebar TOC navigation works
- [ ] Carousel pagination buttons work
- [ ] Resources section renders
- [ ] Responsive: sidebar stacks on mobile

---

## Terminal Aesthetic Preservation

### Typography Rules

**Monospace for UI Elements:**
```html
<!-- Navigation, metadata, sidebars -->
<nav class="font-mono">...</nav>
<aside class="font-mono">...</aside>
<div class="metadata font-mono">...</div>
```

**Prose for Content:**
```html
<!-- Article content, paragraphs, headings -->
<article class="font-prose">...</article>
<h1 class="font-prose">...</h1>
<p class="font-prose">...</p>
```

### Color Scheme Application

**Primary Palette (CSS Variables):**
```css
--background: #1a1a1a    (dark terminal background)
--foreground: #e0e0e0    (light text)
--surface:    #252525    (card backgrounds)
--border:     #444444    (subtle borders)
--muted:      #888888    (secondary text)
--accent:     #3498db    (interactive elements)
```

**Tailwind Class Usage:**
```html
<body class="bg-background text-foreground">
<div class="bg-surface border border-border">
<span class="text-muted">
<a class="text-accent hover:text-accent/80">
```

### Border Styling

**Sharp Edges (Terminal-Inspired):**
```html
<!-- Use default rounded or sharp corners -->
<div class="rounded-lg">  <!-- 20px radius via --radius-lg -->
<div class="rounded-md">  <!-- 10px radius via --radius-md -->
<div class="rounded-sm">  <!-- 5px radius via --radius-sm -->
<div class="rounded-none"> <!-- Sharp corners -->
```

### Spacing Rhythm

**Consistent Gaps:**
```
Container Padding:   px-4 sm:px-6 lg:px-8  (16px → 24px → 32px)
Vertical Sections:   py-10                 (40px)
Grid Gaps:           gap-8                  (32px)
Section Spacing:     space-y-10            (40px between sections)
Sticky Offset:       top-8                  (32px)
```

### Interactive States

**Transitions:**
```html
<a class="transition-colors duration-base hover:text-accent">
<button class="transition-all duration-fast hover:bg-surface">
```

**Focus States (Accessibility):**
```html
<a class="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
```

---

## Accessibility and SEO

### Semantic HTML Requirements

**Mandatory Landmarks:**
```html
<header role="banner">
<main role="main">
<nav role="navigation" aria-label="Primary navigation">
<aside aria-label="Table of contents">
<footer role="contentinfo">
```

### ARIA Labels

**Navigation:**
```html
<nav aria-label="Wiki pages">
<nav aria-label="Primary navigation">
<aside aria-label="Table of contents">
```

**Interactive Elements:**
```html
<button aria-expanded="false" aria-controls="sidebar-content">
<a aria-label="Back to home page">
```

### Keyboard Navigation

**Skip Link:**
```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded">
  Skip to main content
</a>
```

**Focus Indicators:**
```css
*:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

### SEO Meta Tags

**Required in base-shell.html:**
```html
<title>{{ page.title }} | {{ site.title }}</title>
<meta name="description" content="{{ page.description }}">
<meta property="og:title" content="{{ page.title }}">
<meta property="og:description" content="{{ page.description }}">
<link rel="canonical" href="{{ page.url | absolute_url }}">
```

### Image Alt Text

**Mandatory:**
```html
<img src="..." alt="Descriptive alt text" />
```

**Decorative Images:**
```html
<img src="..." alt="" role="presentation" />
```

---

## Testing Checklist

### Component Testing

**base-shell.html:**
- [ ] HTML validates (W3C validator)
- [ ] All meta tags render correctly
- [ ] Dark mode class toggles properly
- [ ] Skip-to-content link works
- [ ] SearchCmdK mounts and opens with Cmd+K
- [ ] Footer renders on all pages
- [ ] Custom JS loads when specified in front matter

**terminal-layout.html:**
- [ ] 3-column layout on desktop (≥1280px)
- [ ] 2-column layout on tablet (1024px-1280px)
- [ ] 1-column stack on mobile (<1024px)
- [ ] Sticky sidebars work on desktop
- [ ] Left sidebar variants render correctly (wiki-nav, terminal-sidebar, knowledgebase-toc)
- [ ] Right sidebar TOC is sticky
- [ ] Metadata displays when `show_metadata: true`
- [ ] GraphView renders when `show_graph: true`
- [ ] Wiki navigation active states update on scroll
- [ ] Knowledgebase paginator works

**content-layout.html:**
- [ ] Centered single-column layout (max-w-4xl)
- [ ] Hero section renders when `show_hero: true`
- [ ] Standard header renders when `show_hero: false`
- [ ] Responsive padding works (px-4 → px-6 → px-8)
- [ ] Prose typography applies correctly

### Responsive Testing Matrix

| Layout | 320px | 640px | 768px | 1024px | 1280px | 1536px |
|--------|-------|-------|-------|--------|--------|--------|
| base-shell | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| terminal-layout (3-col) | 1-col | 1-col | 1-col | 2-col | 3-col | 3-col |
| terminal-layout (2-col) | 1-col | 1-col | 1-col | 2-col | 2-col | 2-col |
| content-layout | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### React Island Testing

**All Islands:**
- [ ] SearchCmdK: Opens with Cmd+K, searches, navigates
- [ ] GraphView: Loads /graph.json, renders D3 visualization, zoom/pan works
- [ ] NotesGrid: Filters by tag, renders note cards
- [ ] AudioPlayer: Plays audio, controls work
- [ ] VideoPlayer: Plays video, controls work
- [ ] NotebookGuide: Renders navigation, links work
- [ ] TerminalTOC: Generates TOC from headings, scrolls to sections

### Accessibility Testing

**WCAG 2.1 AA Compliance:**
- [ ] Color contrast ratio ≥4.5:1 (text) and ≥3:1 (UI components)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all focusable elements
- [ ] Skip-to-content link works
- [ ] ARIA labels present on all landmarks
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Images have alt text or role="presentation"
- [ ] Forms have associated labels

**Screen Reader Testing:**
- [ ] VoiceOver (macOS): Page structure announced correctly
- [ ] NVDA (Windows): Navigation landmarks work
- [ ] JAWS (Windows): Headings navigable

### Performance Testing

**Lighthouse Metrics (Target Scores):**
- [ ] Performance: ≥90
- [ ] Accessibility: 100
- [ ] Best Practices: ≥90
- [ ] SEO: 100

**Bundle Size:**
- [ ] CSS bundle ≤50KB (gzipped)
- [ ] JS bundle ≤150KB (gzipped)
- [ ] First Contentful Paint ≤1.5s
- [ ] Cumulative Layout Shift ≤0.1

### Cross-Browser Testing

**Required Browsers:**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Mobile (Android 12+)

### Dark Mode Testing

**Theme Toggle:**
- [ ] Theme persists on page reload
- [ ] All components respect dark mode
- [ ] CSS variables update correctly
- [ ] No FOUC (flash of unstyled content)

---

## Implementation Sequence

### Phase 1: Base Shell (1 hour)
1. Create `_layouts/base-shell.html`
2. Test on one existing page
3. Verify SearchCmdK works
4. Check dark mode toggle

### Phase 2: Terminal Layout (2-3 hours)
1. Create `_layouts/terminal-layout.html`
2. Migrate `wiki.html` first (test 3-column pattern)
3. Migrate `terminal-note.html` (test 2-column pattern)
4. Migrate remaining layouts
5. Test all responsive breakpoints

### Phase 3: Content Layout (30 minutes)
1. Create `_layouts/content-layout.html`
2. Migrate `home.html`, `about.html`, `page.html`
3. Test hero section variant

### Phase 4: Cleanup (1 hour)
1. Delete deprecated layout files
2. Extract code-copy-buttons to shared module
3. Update front matter on all markdown files
4. Run full test suite

---

## Success Criteria

**Consolidation:**
- [ ] 11 layouts reduced to 4 files
- [ ] 282 lines of inline styles eliminated
- [ ] 5 max-width strategies unified to 2

**Code Quality:**
- [ ] 100% Tailwind utilities (no inline `<style>` blocks)
- [ ] Zero CSS variable inline usage (all via Tailwind classes)
- [ ] Consistent responsive patterns across all layouts

**Functionality:**
- [ ] All React islands hydrate correctly
- [ ] Wiki navigation active states work
- [ ] Knowledgebase paginator works
- [ ] TOC scrollspy works

**Performance:**
- [ ] Lighthouse score ≥90 (all categories)
- [ ] CSS bundle reduced by 20-30%
- [ ] No layout shifts (CLS ≤0.1)

---

## Appendix: Liquid Variable Reference

### base-shell.html

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `page.title` | String | Yes | - | Page title |
| `page.description` | String | No | `site.description` | Meta description |
| `page.image` | String | No | - | Social media image |
| `page.theme` | String | No | `'dark'` | Theme class (`dark` or `light`) |
| `page.custom_js` | Array | No | - | Additional scripts |

### terminal-layout.html

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `page.left_sidebar` | String/Boolean | No | `false` | Sidebar variant (`wiki-nav`, `terminal-sidebar`, `knowledgebase-toc`, or `false`) |
| `page.right_sidebar` | String/Boolean | No | `false` | Sidebar content (`toc`, `related`, or `false`) |
| `page.right_sidebar_xl_only` | Boolean | No | `false` | Show right sidebar only on XL screens |
| `page.show_metadata` | Boolean | No | `true` | Display date/tags metadata |
| `page.show_graph` | Boolean | No | `false` | Render GraphView component |
| `page.tags` | Array | No | - | Article tags |
| `page.last_modified_at` | Date | No | - | Last update date |
| `page.wiki_id` | String | Conditional | - | Wiki data ID (required if `left_sidebar: wiki-nav`) |
| `page.resources` | Array | No | - | Knowledgebase resources |

### content-layout.html

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `page.show_hero` | Boolean | No | `false` | Use hero header variant |
| `page.subtitle` | String | No | - | Hero subtitle text |
| `page.description` | String | No | - | Standard header description |

---

**End of Specification**

**Status:** Ready for Implementation
**Estimated Implementation Time:** 5-6 hours
**Next Steps:** Begin Phase 1 (Base Shell creation and testing)

