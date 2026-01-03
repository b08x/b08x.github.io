# React Component Library

> Interactive React islands for Jekyll-based digital garden. 11 components, 2,558 lines of TypeScript, progressive enhancement with island architecture.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture Deep Dive](#architecture-deep-dive)
- [Component Catalog](#component-catalog)
  - [Media Components](#media-components)
  - [Visualization Components](#visualization-components)
  - [Navigation Components](#navigation-components)
  - [Content Components](#content-components)
- [Theming System](#theming-system)
- [Development Guide](#development-guide)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)

---

## Overview

This library provides interactive React components for a Jekyll static site using an **island architecture** pattern. Static HTML pages are progressively enhanced with interactive "islands" of React functionality, providing the benefits of both worlds: SEO-friendly static HTML with rich client-side interactivity where needed.

### Component Inventory

| Component | LOC | Complexity | Purpose |
|-----------|-----|------------|---------|
| **VideoPlayer** | 410 | Complex | HLS video with segments, actions, and transcript |
| **KnowledgebaseCarousel** | 498 | Complex | Accessible H2-based content carousel with keyboard nav |
| **MermaidViewer** | 280 | Complex | Interactive Mermaid diagrams with D3 zoom/pan |
| **GraphView** | 254 | Complex | D3 force-directed graph visualization |
| **MermaidModal** | 249 | Moderate | Full-screen Mermaid diagram modal |
| **CodeBlock** | 224 | Moderate | Syntax-highlighted code with copy button |
| **NotesGrid** | 221 | Moderate | Grid display for notes with detail view |
| **SearchCmdK** | 153 | Moderate | Command palette search (Cmd+K) |
| **AudioPlayer** | 144 | Moderate | Audio playback with waveform |
| **NotebookGuide** | 112 | Simple | Guide/tutorial assistance component |
| **HelloGarden** | 13 | Simple | Demo/test component |

**Total: 11 components, 2,558 lines of code**

### Key Features

- **Island Architecture**: Progressive enhancement with `data-island` hydration
- **Theme-Aware**: Automatic dark/light mode synchronization via MutationObserver
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Terminal Aesthetic**: Monospace fonts, border-based design, high contrast
- **Type-Safe**: Full TypeScript with interfaces for all props
- **Enhancement Pipelines**: Automatic upgrade of static content (Rouge → CodeBlock, Mermaid images → MermaidViewer)

---

## Quick Start

### Installation

```bash
npm install
```

### Development Workflow

```bash
# Watch mode for component changes
npm run dev

# Jekyll server (in separate terminal)
bundle exec jekyll serve
```

### Build Process

```bash
# Production bundle
npm run build

# Jekyll build
bundle exec jekyll build
```

### Basic Embedding

Embed a React component in any Jekyll page or layout:

```html
<div data-island="ComponentName" data-props='{"prop": "value"}'></div>
```

### Jekyll Integration

Pass Jekyll data to React components using the `jsonify` filter:

```liquid
{% assign props = '{"title": "' | append: page.title | append: '"}' %}
<div data-island="CodeBlock" data-props='{{ props }}'></div>
```

Or pass complex objects:

```liquid
{% assign videoProps = page.video | jsonify %}
<div data-island="VideoPlayer" data-props='{{ videoProps }}'></div>
```

### How It Works

1. **Jekyll Generates HTML**: Static site generator creates HTML with `data-island` markers
2. **Browser Loads Bundle**: `garden-widgets.js` bundle loads on page
3. **Registry Scans DOM**: Component registry finds all `[data-island]` elements
4. **React Hydrates**: Each island is hydrated with React, receiving props from `data-props` JSON

```
┌─────────────┐
│ Jekyll      │  Generates static HTML with island markers
│ Build       │──────────────────────────────────────┐
└─────────────┘                                      │
                                                     ▼
                                           ┌──────────────────┐
                                           │ HTML with        │
                                           │ data-island tags │
                                           └──────────────────┘
                                                     │
                                                     ▼
┌─────────────┐                           ┌──────────────────┐
│ Browser     │  Loads garden-widgets.js  │ Component        │
│ Runtime     │──────────────────────────▶│ Registry Scans   │
└─────────────┘                           └──────────────────┘
                                                     │
                                                     ▼
                                           ┌──────────────────┐
                                           │ React Hydrates   │
                                           │ Each Island      │
                                           └──────────────────┘
```

---

## Architecture Deep Dive

### Island Architecture Pattern

The island architecture provides progressive enhancement: static HTML serves as the foundation, with specific DOM nodes marked for React hydration.

**Benefits:**
- **SEO-Friendly**: Search engines see complete HTML content
- **Fast Initial Load**: No JavaScript required for initial page render
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **Selective Interactivity**: Only interactive parts use React

**How Islands Work:**

```html
<!-- Static HTML (generated by Jekyll) -->
<div data-island="CodeBlock" data-props='{
  "code": "const x = 42;",
  "language": "javascript"
}'></div>
```

When the page loads:
1. Browser sees static HTML
2. `garden-widgets.js` loads asynchronously
3. Registry scans for `[data-island]` attributes
4. React component hydrates that specific DOM node
5. Props from `data-props` JSON are passed to component

### Component Registry (`src/main.tsx`)

The registry maps string names to React components using lazy loading:

```typescript
import { createRoot } from 'react-dom/client';

// Lazy-loaded components
const CodeBlock = React.lazy(() => import('./components/CodeBlock'));
const VideoPlayer = React.lazy(() => import('./components/VideoPlayer'));
// ... other components

// String-to-component mapping
const components: Record<string, React.ComponentType<any>> = {
  CodeBlock,
  VideoPlayer,
  // ... other components
};

// Mount all islands on page
const mountIslands = () => {
  const islands = document.querySelectorAll('[data-island]');

  islands.forEach((container) => {
    const componentName = container.getAttribute('data-island');

    if (componentName && components[componentName]) {
      const Component = components[componentName];
      let props = {};

      try {
        const propsAttr = container.getAttribute('data-props');
        if (propsAttr) {
          // Smart quote sanitization
          const sanitized = propsAttr
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[\u2018\u2019]/g, "'");
          props = JSON.parse(sanitized);
        }
      } catch (e) {
        console.error(`Failed to parse props for ${componentName}:`, e);
      }

      const root = createRoot(container);
      root.render(
        <Suspense fallback={<div>Loading...</div>}>
          <Component {...props} />
        </Suspense>
      );
    }
  });
};
```

**Key Features:**
- **Lazy Loading**: Components loaded on-demand with `React.lazy()`
- **Error Handling**: Graceful degradation if props parsing fails
- **Smart Quote Sanitization**: Handles Jekyll's quote conversion (lines 44-48)
- **Suspense Fallback**: Loading states while components load

### Build System

**esbuild Configuration:**
- TypeScript compilation (`tsx` → `js`)
- Code splitting (one bundle per component)
- Tree shaking (removes unused code)
- Minification (production builds)

**Output:**
- `assets/js/garden-widgets.js` - Main bundle
- Includes React, ReactDOM, and all components

### Enhancement Pipelines

Two automatic systems replace static content with React islands:

#### CodeBlock Enhancement

Upgrades Jekyll's Rouge syntax highlighting to interactive CodeBlock islands.

**Process** (lines 131-191 in `main.tsx`):

```typescript
const enhanceCodeBlocks = () => {
  // 1. Find Rouge-generated code blocks
  const containers = document.querySelectorAll(
    'div[class*="language-"].highlighter-rouge'
  );

  containers.forEach((container) => {
    const codeElement = container.querySelector('pre code');
    if (!codeElement) return;

    // 2. Extract code and language
    const code = codeElement.textContent || '';
    const classNames = container.className.split(' ');
    const languageClass = classNames.find(cls =>
      cls.startsWith('language-')
    );
    let language = languageClass ?
      languageClass.replace('language-', '') : 'text';

    // 3. Apply language aliases
    const ALIASES = {
      js: 'javascript',
      ts: 'typescript',
      py: 'python',
      rb: 'ruby',
      yml: 'yaml',
      sh: 'bash'
    };
    language = ALIASES[language] || language;

    // 4. Create island
    const island = document.createElement('div');
    island.setAttribute('data-island', 'CodeBlock');
    island.setAttribute('data-props', JSON.stringify({
      code: code.trim(),
      language,
      showLineNumbers: false
    }));

    // 5. Replace original container
    container.replaceWith(island);
  });

  // 6. Re-mount islands
  mountIslands();
};
```

**Benefit**: Content authors write simple markdown code blocks, users get interactive copy-to-clipboard functionality.

#### Mermaid Enhancement

Converts static Mermaid diagram images into interactive viewers.

**Process** (lines 73-129 in `main.tsx`):

```typescript
const enhanceMermaidDiagrams = () => {
  // 1. Find mermaid.ink image tags
  const mermaidImages = document.querySelectorAll('img.mermaid');

  mermaidImages.forEach((img) => {
    // 2. Extract mermaid.ink URL
    const src = img.getAttribute('src') || '';
    const match = src.match(/mermaid\.ink\/svg\/(.+)$/);
    if (!match) return;

    // 3. Decode base64 diagram code
    const encoded = match[1];

    // Convert URL-safe base64 to standard
    const standardBase64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Add padding
    const paddedBase64 = standardBase64 +
      '=='.substring(0, (4 - standardBase64.length % 4) % 4);

    // Decode
    const decoded = atob(paddedBase64);
    const data = JSON.parse(decoded);
    const code = data.code;

    // 4. Create MermaidViewer island
    const island = document.createElement('div');
    island.setAttribute('data-island', 'MermaidViewer');
    island.setAttribute('data-props', JSON.stringify({ code }));

    // 5. Replace static image with island
    img.parentElement?.replaceWith(island);
  });

  // 6. Re-mount islands
  mountIslands();
};
```

**Benefit**: Static mermaid.ink images become zoomable, pannable diagrams with theme sync.

### Props Passing System

**JSON Serialization:**

Props are passed via the `data-props` attribute as JSON strings:

```html
<div data-island="VideoPlayer" data-props='{
  "videoUrl": "/assets/videos/demo.mp4",
  "title": "Demo Video"
}'></div>
```

**Smart Quote Sanitization:**

Jekyll's text processors may convert straight quotes to smart quotes. The registry sanitizes these (lines 44-48):

```typescript
const sanitizedProps = propsAttr
  .replace(/[\u201C\u201D]/g, '"')  // Smart double quotes → "
  .replace(/[\u2018\u2019]/g, "'");  // Smart single quotes → '
```

**Jekyll Liquid Integration:**

Use Jekyll's `jsonify` filter to safely serialize complex data:

```liquid
{% assign videoData = page.video | jsonify %}
<div data-island="VideoPlayer" data-props='{{ videoData }}'></div>
```

**Error Handling:**

If props parsing fails, component receives empty props object and error is logged:

```typescript
try {
  props = JSON.parse(sanitizedProps);
} catch (e) {
  console.error(`Failed to parse props for ${componentName}:`, e);
  console.error(`Raw props content:`, propsAttr);
}
```

---

## Component Catalog

### Media Components

#### VideoPlayer

**Purpose:** Feature-rich video player with timeline segments, actionable steps, and searchable transcript.

**File:** `src/components/VideoPlayer.tsx` (410 lines)

**Key Features:**
- HTML5 video with custom playback controls
- Playback rate control (0.5x - 2x speed)
- Time-based segment navigation with visual timeline
- Actionable step tracking with completion indicators
- Searchable transcript with timestamp-based jump navigation
- Current time display and active segment highlighting
- Responsive two-panel layout (video + sidebar)

**Props Interface:**

```typescript
interface VideoPlayerProps {
  videoUrl: string;              // Path to video file or HLS stream
  segments: Segment[];           // Timeline segments with actions
  transcript?: TranscriptItem[]; // Optional searchable transcript
  title?: string;                // Video title (default: "Video Tutorial")
}

interface Segment {
  id: string;           // Unique segment identifier
  title: string;        // Segment display name
  startTime: number;    // Start time in seconds
  endTime: number;      // End time in seconds
  actions: Action[];    // Actionable steps within segment
}

interface Action {
  timestamp: number;    // When this action appears (seconds)
  description: string;  // Action description
  completed?: boolean;  // Optional completion status
}

interface TranscriptItem {
  timestamp: number;    // When text was spoken (seconds)
  text: string;         // Transcript text
}
```

**Usage Example:**

```html
<div data-island="VideoPlayer" data-props='{
  "videoUrl": "/assets/videos/ruby-tutorial.mp4",
  "title": "Ruby on Rails Tutorial",
  "segments": [
    {
      "id": "intro",
      "title": "Introduction",
      "startTime": 0,
      "endTime": 120,
      "actions": [
        {"timestamp": 10, "description": "Install Ruby 3.0+"},
        {"timestamp": 45, "description": "Create new Rails project"},
        {"timestamp": 90, "description": "Run database migrations"}
      ]
    },
    {
      "id": "models",
      "title": "Creating Models",
      "startTime": 120,
      "endTime": 300,
      "actions": [
        {"timestamp": 130, "description": "Generate User model"},
        {"timestamp": 180, "description": "Add validations"}
      ]
    }
  ],
  "transcript": [
    {"timestamp": 0, "text": "Welcome to this Ruby on Rails tutorial"},
    {"timestamp": 5, "text": "Today we will learn how to build a complete application"}
  ]
}'></div>
```

**Dependencies:** React hooks (useState, useRef, useEffect)

**Accessibility:**
- Semantic HTML5 `<video>` element with native controls
- Keyboard-accessible custom controls
- Clickable timestamps for screen reader navigation
- Visual progress indicators

---

#### AudioPlayer

**Purpose:** Audio playback controls with progress tracking and playback rate adjustment.

**File:** `src/components/AudioPlayer.tsx` (144 lines)

**Key Features:**
- HTML5 audio with custom controls
- Progress bar with seek functionality
- Playback rate control (0.75x - 2x speed)
- Time display (current / total duration)
- Play/pause toggle with visual feedback

**Props Interface:**

```typescript
interface AudioPlayerProps {
  audioUrl: string;  // Path to audio file
  title?: string;    // Audio title (default: "Audio Overview")
}
```

**Usage Example:**

```html
<div data-island="AudioPlayer" data-props='{
  "audioUrl": "/assets/audio/podcast-episode-1.mp3",
  "title": "Podcast Episode 1: Introduction to React Islands"
}'></div>
```

**Dependencies:** React hooks (useState, useRef, useEffect)

**Accessibility:**
- Semantic HTML5 `<audio>` element
- Keyboard-accessible controls
- Visual progress indicator

---

### Visualization Components

#### MermaidViewer

**Purpose:** Interactive Mermaid diagram renderer with zoom, pan, and modal expansion.

**File:** `src/components/MermaidViewer.tsx` (280 lines)

**Key Features:**
- D3-based zoom (0.5x - 4x) and pan controls
- Automatic theme synchronization (dark/light mode via MutationObserver)
- Full-screen modal expansion
- Zoom controls with smooth transitions (in/out/reset)
- SVG manipulation with D3.js
- Cursor visual feedback (grab/grabbing)
- Loading and error states

**Props Interface:**

```typescript
interface MermaidViewerProps {
  code: string;          // Mermaid diagram code
  allowModal?: boolean;  // Enable modal expansion (default: true)
}
```

**Usage Example:**

```html
<div data-island="MermaidViewer" data-props='{
  "code": "graph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Process]\n    B -->|No| D[End]\n    C --> D"
}'></div>
```

**Dependencies:** mermaid, d3

**Integration:** Automatically enhanced from `img.mermaid` tags by enhancement pipeline

**Accessibility:**
- SVG with ARIA labels
- Keyboard-accessible zoom controls
- Focus indicators on buttons

**Theme Sync Pattern:**

```typescript
useEffect(() => {
  const observer = new MutationObserver(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  return () => observer.disconnect();
}, []);
```

---

#### MermaidModal

**Purpose:** Full-screen modal for expanded Mermaid diagram viewing.

**File:** `src/components/MermaidModal.tsx` (249 lines)

**Key Features:**
- Full-screen overlay with backdrop blur
- Enhanced zoom range (0.1x - 8x for detailed inspection)
- Keyboard shortcuts (ESC to close, +/- to zoom, 0 to reset)
- SVG export functionality
- Theme support (dark/light)
- D3 zoom/pan with smooth animations

**Props Interface:**

```typescript
interface MermaidModalProps {
  code: string;             // Mermaid diagram code
  isOpen: boolean;          // Modal open state
  onClose: () => void;      // Close callback
  theme: 'dark' | 'light';  // Theme mode
}
```

**Usage:** Triggered by MermaidViewer's expand button

**Dependencies:** mermaid, d3

**Keyboard Shortcuts:**
- **ESC**: Close modal
- **+ or =**: Zoom in
- **-**: Zoom out
- **0**: Reset zoom

---

#### GraphView

**Purpose:** D3-based force-directed graph visualization for exploring node/edge relationships.

**File:** `src/components/GraphView.tsx` (254 lines)

**Key Features:**
- Force-directed graph layout with D3 simulation
- Interactive node highlighting on hover
- Zoom and pan with D3 zoom behavior (0.1x - 4x scale)
- Isolated node detection with special rendering
- Node size based on connection count
- Click nodes to navigate to linked pages
- Responsive container with ResizeObserver

**Data Fetching:** Loads graph data from `/graph.json`

**Props Interface:**

```typescript
// GraphView has no props - fetches data from /graph.json

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface Node {
  id: string;    // Unique node identifier
  path: string;  // URL path for navigation
  label: string; // Display label
}

interface Edge {
  source: string;  // Source node ID
  target: string;  // Target node ID
}
```

**Usage Example:**

```html
<div data-island="GraphView"></div>
```

**Dependencies:** d3

**Expected Data Format (`/graph.json`):**

```json
{
  "nodes": [
    {"id": "1", "path": "/notes/react", "label": "React Basics"},
    {"id": "2", "path": "/notes/typescript", "label": "TypeScript"}
  ],
  "edges": [
    {"source": "1", "target": "2"}
  ]
}
```

---

### Navigation Components

#### KnowledgebaseCarousel

**Purpose:** Fully accessible carousel for knowledgebase content with section-based navigation.

**File:** `src/components/KnowledgebaseCarousel.tsx` (498 lines)

**Key Features:**
- Parses HTML content by H2 tags into slides
- Keyboard navigation (Arrow keys, vim-style h/l, Home/End)
- Hash-based URL navigation (#slide-N)
- Screen reader announcements for slide changes (ARIA live regions)
- Automatic CodeBlock component integration in slides
- Progress indicator pagination dots
- Previous/Next buttons with disabled states
- Custom event system for TOC synchronization

**Props Interface:**

```typescript
interface KnowledgebaseCarouselProps {
  contentElementId?: string;  // ID of element with H2-divided content
  content?: string;           // HTML string (fallback)
  initialSlide?: number;      // Start slide (from URL hash)
}
```

**Usage Example:**

```html
<!-- Hidden content with H2 sections -->
<div id="kb-content" style="display:none;">
  <h2>Section 1: Introduction</h2>
  <p>Welcome to the knowledgebase...</p>

  <h2>Section 2: Getting Started</h2>
  <p>First, install the dependencies...</p>

  <h2>Section 3: Advanced Topics</h2>
  <p>Now let's explore advanced features...</p>
</div>

<!-- Carousel island -->
<div data-island="KnowledgebaseCarousel" data-props='{
  "contentElementId": "kb-content"
}'></div>
```

**Keyboard Controls:**
- **Arrow Left / h**: Previous slide
- **Arrow Right / l**: Next slide
- **Home**: First slide
- **End**: Last slide

**Dependencies:** CodeBlock component (for syntax highlighting in slides)

**Accessibility:**
- ARIA live regions for slide change announcements
- Full keyboard navigation
- Focus management with ring indicators
- Screen reader-friendly progress text ("Section 2 of 5")
- Semantic `role="region"` and `aria-label`

**Custom Events:**
- `kb-slides-ready`: Dispatched when slides are parsed
- `kb-slide-change`: Dispatched on navigation (for TOC sync)
- `kb-toc-click`: Listens for TOC navigation requests

---

#### SearchCmdK

**Purpose:** Command palette search interface with keyboard-first design.

**File:** `src/components/SearchCmdK.tsx` (153 lines)

**Key Features:**
- Keyboard shortcut activation (Cmd/Ctrl+K)
- Real-time search filtering by title and tags
- Arrow key navigation through results
- ESC to close
- Enter to navigate to selected result
- Fetches search index from `/search.json`
- Modal overlay with backdrop blur

**Data Fetching:** Loads search index from `/search.json`

**Props Interface:**

```typescript
// SearchCmdK has no props - self-contained component

interface SearchResult {
  title: string;  // Page title
  url: string;    // Page URL
  type: string;   // Content type (note, post, wiki, etc.)
  tags: string[]; // Associated tags
  date: string;   // Publication date
}
```

**Usage Example:**

```html
<div data-island="SearchCmdK"></div>
```

**Keyboard Shortcuts:**
- **Cmd/Ctrl+K**: Toggle search modal
- **ESC**: Close modal
- **Arrow Up/Down**: Navigate results
- **Enter**: Open selected result

**Expected Data Format (`/search.json`):**

```json
[
  {
    "title": "React Island Architecture",
    "url": "/notes/react-islands",
    "type": "note",
    "tags": ["react", "architecture"],
    "date": "2025-01-03"
  }
]
```

---

### Content Components

#### CodeBlock

**Purpose:** Syntax-highlighted code blocks with copy-to-clipboard and theme awareness.

**File:** `src/components/CodeBlock.tsx` (224 lines)

**Key Features:**
- Syntax highlighting for 19 languages via Prism
- Copy-to-clipboard with visual feedback (checkmark on success)
- Theme-aware auto-switching (dark/light mode via MutationObserver)
- File name display in header
- Optional line numbers
- Empty code block handling with user-friendly message
- Screen reader announcements for copy action
- Fallback for unsupported languages (renders as plaintext)

**Props Interface:**

```typescript
interface CodeBlockProps {
  code: string;              // Source code to display
  language: string;          // Programming language
  showLineNumbers?: boolean; // Show line numbers (default: false)
  fileName?: string;         // Optional file name for header
}
```

**Supported Languages:**

javascript, typescript, python, ruby, bash, markdown, json, yaml, jsx, tsx, css, scss, html, sql, go, rust, java, c, cpp

**Usage Example:**

```html
<div data-island="CodeBlock" data-props='{
  "code": "const greeting = \"Hello, World!\";\nconsole.log(greeting);",
  "language": "javascript",
  "fileName": "example.js",
  "showLineNumbers": false
}'></div>
```

**Dependencies:** react-syntax-highlighter (Prism themes)

**Integration:** Automatically enhanced from Rouge code blocks by enhancement pipeline

**Accessibility:**
- ARIA live region for copy feedback ("Code copied to clipboard")
- Screen reader-only text with `sr-only` class
- Keyboard-accessible copy button
- High contrast focus styles (2px ring with accent color)
- Semantic button element with `aria-label`

**Styling:**
- Tailwind CSS utility classes
- Terminal aesthetic (monospace fonts, border-based design)
- Gradient header with metadata display
- Custom mesh background for code area

---

#### NotesGrid

**Purpose:** Grid display for notes collection with card-based layout and detail view.

**File:** `src/components/NotesGrid.tsx` (221 lines)

**Key Features:**
- Responsive grid layout (1 column mobile → 3 columns desktop)
- Card-based note display with hover effects
- Click to open detailed note view
- Optional video section (YouTube embed or HTML5 video)
- Code block processing with CodeBlock integration
- Citation count display
- Back navigation from detail view

**Props Interface:**

```typescript
interface NotesGridProps {
  notes: Note[];      // Array of note objects
  videoUrl?: string;  // Optional video URL
  videoTitle?: string; // Optional video title
}

interface Note {
  id: string;            // Unique note ID
  title: string;         // Note title
  description: string;   // Short description/excerpt
  citations?: number;    // Number of citations
  items?: string[];      // Related items
  url?: string;          // Note URL
  content?: string;      // Full HTML content
}
```

**Usage Example:**

```html
<div data-island="NotesGrid" data-props='{
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "videoTitle": "Introduction to Note-Taking",
  "notes": [
    {
      "id": "1",
      "title": "Effective Note-Taking Strategies",
      "description": "Learn proven techniques for better retention",
      "citations": 12,
      "content": "<p>Full note content with HTML...</p>"
    },
    {
      "id": "2",
      "title": "Digital vs Analog Notes",
      "description": "Comparing different note-taking methods",
      "citations": 8,
      "content": "<p>Detailed comparison...</p>"
    }
  ]
}'></div>
```

**Dependencies:** CodeBlock component (for code in note content)

**Video Support:**
- YouTube URLs (automatic embed conversion)
- HTML5 video (MP4, WebM)

---

#### NotebookGuide

**Purpose:** Guide/tutorial assistance component with content generation suggestions.

**File:** `src/components/NotebookGuide.tsx` (112 lines)

**Key Features:**
- Content generation buttons (FAQ, Study Guide, Timeline, etc.)
- Suggested questions list
- Collapsible chat interface
- Click questions to populate chat input

**Props Interface:**

```typescript
interface NotebookGuideProps {
  suggestedQuestions?: string[];        // Array of suggested questions
  onGenerateContent?: (type: string) => void;  // Content generation callback
}
```

**Usage Example:**

```html
<div data-island="NotebookGuide" data-props='{
  "suggestedQuestions": [
    "What are the main concepts covered?",
    "How does this relate to previous topics?",
    "What are the practical applications?"
  ]
}'></div>
```

**Content Types:**
- FAQ
- Study Guide
- Timeline
- Briefing Doc
- Table of Contents

---

#### HelloGarden

**Purpose:** Minimal demo/test component showcasing island functionality.

**File:** `src/components/HelloGarden.tsx` (13 lines)

**Key Features:**
- Simple greeting message
- Terminal aesthetic styling
- Animated status indicator

**Props Interface:**

```typescript
interface HelloGardenProps {
  name?: string;  // Name to display (default: "Gardener")
}
```

**Usage Example:**

```html
<div data-island="HelloGarden" data-props='{"name": "Developer"}'></div>
```

**Purpose:** Development testing and island architecture demonstration

---

## Theming System

### CSS Variable Architecture

All components use CSS variables for theming, defined in `tailwind.config.js`:

**Core Variables:**

```css
:root {
  /* Colors */
  --foreground: ...;     /* Primary text color */
  --background: ...;     /* Page background */
  --surface: ...;        /* Card/component background */
  --accent: ...;         /* Primary accent color */
  --border: ...;         /* Border color */
  --muted: ...;          /* Secondary text color */

  /* Charts */
  --chart-1: ...;
  --chart-2: ...;
  --chart-3: ...;
  --chart-4: ...;
  --chart-5: ...;

  /* Typography */
  --font-mono: 'Mononoki', 'Hack', monospace;
  --font-sans: system-ui, sans-serif;
  --font-prose: Georgia, serif;
}

.dark {
  /* Dark mode overrides */
  --foreground: ...;
  --background: ...;
  /* ... other variables */
}
```

### Theme Switching

**Automatic Detection:**

Components detect theme changes using the MutationObserver pattern:

```typescript
useEffect(() => {
  const updateTheme = () => {
    setCurrentTheme(getSyntaxTheme());
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' &&
          mutation.attributeName === 'class') {
        updateTheme();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  return () => observer.disconnect();
}, []);
```

**How It Works:**
1. Observer watches `<html>` element for class changes
2. When `dark` class is added/removed, callback fires
3. Component updates theme state
4. Re-renders with new theme

**Used By:**
- CodeBlock (syntax themes)
- MermaidViewer (diagram colors)
- MermaidModal (diagram colors)

### Terminal Aesthetic Guidelines

**Typography:**
- Monospace fonts (Mononoki, Hack) for code and UI elements
- Use `font-mono` utility class: `className="font-mono"`

**Colors:**
- High contrast for accessibility (WCAG AA minimum)
- Border-based design (1px solid borders)
- Accent color for interactive elements
- Muted colors for secondary text

**Borders:**
- Use `border-border` utility: `className="border border-border"`
- Rounded corners with `rounded-lg` or `rounded-md`

**Spacing:**
- Consistent padding: `p-4`, `px-4 py-2`
- Gap utilities for flex/grid: `gap-2`, `gap-4`

**Example Component Styling:**

```tsx
<div className="bg-surface border border-border rounded-lg p-4 my-4">
  <h3 className="text-foreground font-mono text-sm mb-3">
    Terminal Header
  </h3>
  <p className="text-muted text-xs">
    Secondary content with muted color
  </p>
  <button className="
    px-3 py-1.5
    bg-accent text-white
    rounded border border-accent
    hover:bg-accent/80
    font-mono text-xs
  ">
    Action
  </button>
</div>
```

### Component Styling Patterns

**Tailwind Utility Classes (Preferred):**

```tsx
<div className="bg-surface border border-border rounded-lg p-4">
  Content
</div>
```

**CSS Variables for Dynamic Values:**

```tsx
<div style={{
  background: 'var(--surface)',
  borderColor: 'var(--border)',
  color: 'var(--foreground)'
}}>
  Content
</div>
```

**Inline Styles for Computed Values:**

```tsx
<div style={{
  transform: `translateX(-${currentSlide * 100}%)`,
  background: `linear-gradient(to right,
    var(--accent) 0%,
    var(--accent) ${progress}%,
    var(--border) ${progress}%,
    var(--border) 100%)`
}}>
  Content
</div>
```

**Custom CSS for Animations:**

```tsx
<style>{`
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`}</style>
```

---

## Development Guide

### Adding a New Component

**Step 1: Create Component File**

```bash
touch src/components/MyNewComponent.tsx
```

**Step 2: Write Component with TypeScript**

```typescript
import React from 'react';

interface MyNewComponentProps {
  title: string;
  description?: string;
}

const MyNewComponent: React.FC<MyNewComponentProps> = ({
  title,
  description
}) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h2 className="text-lg font-bold text-foreground mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-muted text-sm">{description}</p>
      )}
    </div>
  );
};

export default MyNewComponent;
```

**Step 3: Register in `main.tsx`**

```typescript
// Add import at top
const MyNewComponent = React.lazy(() =>
  import('./components/MyNewComponent')
);

// Add to registry object
const components: Record<string, React.ComponentType<any>> = {
  // ... existing components
  MyNewComponent,
};
```

**Step 4: Use in Jekyll**

```html
<div data-island="MyNewComponent" data-props='{
  "title": "Hello from Jekyll",
  "description": "This is a new component"
}'></div>
```

**Step 5: Build and Test**

```bash
npm run build
bundle exec jekyll serve
# Visit http://localhost:4000
```

### Testing Workflow

**Local Development:**

```bash
# Terminal 1: Watch component changes
npm run dev

# Terminal 2: Jekyll server
bundle exec jekyll serve --livereload
```

**Browser Console Debugging:**

The island system logs helpful debug messages:

```javascript
[Garden] Found 3 islands to mount
[Garden] Attempting to mount island: CodeBlock
[Garden] Successfully rendered island: CodeBlock
[Garden] Component "InvalidName" not found in registry
```

**React DevTools:**

Install React DevTools browser extension to:
- Inspect component props
- View component hierarchy
- Debug state changes
- Profile performance

### Debugging Tips

**Check Island Mounting:**

Open browser console and look for `[Garden]` logs. You should see:
- Number of islands found
- Each island being mounted
- Success/failure messages

**Verify Props JSON:**

In browser console after page load:

```javascript
document.querySelectorAll('[data-island]').forEach(el => {
  console.log(
    'Island:', el.getAttribute('data-island'),
    'Props:', el.getAttribute('data-props')
  );
});
```

**Test Without JavaScript:**

Disable JavaScript in browser to verify progressive enhancement:
- Page should still render static content
- Forms should use native HTML fallbacks
- Links should work without JS

**Common Issues:**

- **Component not rendering:** Check registry in `main.tsx`, verify exact name match
- **Props not working:** Validate JSON syntax, check for smart quotes in Jekyll output
- **Theme not updating:** Ensure MutationObserver is implemented correctly
- **Build errors:** Check TypeScript types, verify all imports

---

## Best Practices

### Component Design

**Do:**
- ✅ Keep components focused on single responsibility
- ✅ Use TypeScript interfaces for all props
- ✅ Provide sensible default prop values
- ✅ Handle empty/error states gracefully
- ✅ Use CSS variables for all colors
- ✅ Follow terminal aesthetic guidelines

**Don't:**
- ❌ Create tightly coupled components
- ❌ Hardcode values that should be props
- ❌ Skip error boundaries for risky operations
- ❌ Use inline styles for static values (use Tailwind)
- ❌ Ignore accessibility requirements

### Accessibility Checklist

- ✅ **Semantic HTML**: Use `<button>`, `<nav>`, `<main>`, etc.
- ✅ **Keyboard Navigation**: All interactive elements accessible via Tab
- ✅ **ARIA Labels**: `aria-label`, `aria-labelledby` where needed
- ✅ **ARIA Roles**: `role="region"`, `role="navigation"`, etc.
- ✅ **Focus Management**: Visible focus indicators with 2px offset
- ✅ **Screen Reader Support**: ARIA live regions for dynamic content
- ✅ **Color Contrast**: WCAG AA minimum (4.5:1 for normal text)
- ✅ **Alternative Text**: Images have `alt` attributes

**Example: Accessible Button**

```tsx
<button
  onClick={handleClick}
  disabled={isDisabled}
  className="
    px-4 py-2
    bg-accent text-white
    rounded border border-accent
    hover:bg-accent/80
    focus:outline-none
    focus:ring-2
    focus:ring-accent
    focus:ring-offset-2
    disabled:opacity-30
    disabled:cursor-not-allowed
  "
  aria-label="Submit form"
  title="Click to submit"
>
  Submit
</button>
```

### Performance Optimization

**React.memo() for Expensive Renders:**

```typescript
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  // Complex rendering logic
  return <div>{/* ... */}</div>;
});
```

**useCallback() for Stable Functions:**

```typescript
const handleClick = useCallback(() => {
  // Handler logic
}, [/* dependencies */]);
```

**useMemo() for Computed Values:**

```typescript
const highlightedCode = useMemo(
  () => (
    <SyntaxHighlighter language={language}>
      {code}
    </SyntaxHighlighter>
  ),
  [code, language]
);
```

**React.lazy() for Code Splitting:**

```typescript
const HeavyComponent = React.lazy(() =>
  import('./components/HeavyComponent')
);
```

**Debounce/Throttle Event Handlers:**

```typescript
const handleSearch = useMemo(
  () => debounce((query: string) => {
    // Search logic
  }, 300),
  []
);
```

### Theme Integration

**Always use CSS variables:**

```tsx
// ✅ Good
<div style={{ color: 'var(--foreground)' }}>Text</div>

// ❌ Bad
<div style={{ color: '#333' }}>Text</div>
```

**Implement MutationObserver for theme changes:**

```typescript
useEffect(() => {
  const observer = new MutationObserver(() => {
    // Update theme state
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  return () => observer.disconnect();
}, []);
```

**Test in both modes:**

- Verify colors in dark mode
- Verify colors in light mode
- Check contrast ratios
- Test all interactive states (hover, focus, active)

---

## Troubleshooting

### Component Not Rendering

**Symptom:** Island `<div>` remains empty, no content appears.

**Possible Causes:**

1. **Not in registry**
   - **Solution:** Add component to `main.tsx` registry
   - **Check:** Verify component is imported and in `components` object

2. **Name mismatch**
   - **Solution:** Ensure `data-island` attribute exactly matches registry key (case-sensitive)
   - **Example:** `data-island="CodeBlock"` must match registry key `CodeBlock`

3. **JavaScript not loaded**
   - **Solution:** Verify `garden-widgets.js` is included in page
   - **Check:** View page source, look for `<script src="...garden-widgets.js">`

4. **React error**
   - **Solution:** Check browser console for error messages
   - **Debug:** Look for red error text in console

5. **Suspense fallback stuck**
   - **Solution:** Component may have import error, check bundle build

**Debug Steps:**

```bash
# Check browser console for [Garden] logs
# Look for: "Component 'X' not found in registry"

# Verify bundle is built
ls -la assets/js/garden-widgets.js

# Check bundle size (should be > 100KB)
du -h assets/js/garden-widgets.js
```

---

### Props Not Working

**Symptom:** Component renders but props are `undefined` or have wrong values.

**Possible Causes:**

1. **Invalid JSON**
   - **Solution:** Validate JSON with online tool, check for trailing commas
   - **Example:** `{"key": "value",}` is invalid (trailing comma)

2. **Smart quotes**
   - **Solution:** Jekyll may convert straight quotes to smart quotes
   - **Check:** View HTML source, look for `&#8220;` entities
   - **Fix:** Registry sanitizes automatically, but verify in source

3. **Missing required props**
   - **Solution:** Verify all required props are provided
   - **Check:** Component TypeScript interface for required fields

4. **Type mismatch**
   - **Solution:** Ensure passed values match TypeScript interface types
   - **Example:** Passing `"123"` string when number expected

**Debug Steps:**

```javascript
// In browser console after page load:
document.querySelectorAll('[data-island]').forEach(el => {
  console.log(
    'Island:', el.getAttribute('data-island'),
    'Props:', el.getAttribute('data-props')
  );
});

// Test JSON parsing
try {
  const props = JSON.parse(el.getAttribute('data-props'));
  console.log('Parsed successfully:', props);
} catch (e) {
  console.error('Parse failed:', e.message);
}
```

---

### Theme Not Updating

**Symptom:** Component doesn't respond to dark/light mode changes.

**Possible Causes:**

1. **No MutationObserver**
   - **Solution:** Implement MutationObserver pattern from CodeBlock.tsx
   - **Code:** See "Theme Switching" section above

2. **Static theme**
   - **Solution:** Use CSS variables instead of hardcoded colors
   - **Example:** Replace `color: '#333'` with `color: 'var(--foreground)'`

3. **Observer disconnected**
   - **Solution:** Check cleanup in `useEffect` return function
   - **Verify:** Observer should disconnect on unmount

4. **Wrong target**
   - **Solution:** Observe `document.documentElement`, not other elements
   - **Example:** `observer.observe(document.documentElement, ...)`

**Example Fix (from CodeBlock.tsx:36-59):**

```typescript
useEffect(() => {
  const updateTheme = () => {
    setCurrentTheme(getSyntaxTheme());
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' &&
          mutation.attributeName === 'class') {
        updateTheme();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  return () => observer.disconnect();
}, []);
```

---

### Build Errors

**Symptom:** `npm run build` fails with TypeScript errors.

**Possible Causes:**

1. **Missing types**
   - **Solution:** Install `@types/*` packages
   - **Example:** `npm install --save-dev @types/react @types/d3`

2. **Import errors**
   - **Solution:** Check file paths and extensions
   - **Example:** Use `.tsx` extension for TypeScript React files

3. **Type errors**
   - **Solution:** Verify interface definitions match usage
   - **Check:** Ensure all props match interface

4. **Syntax errors**
   - **Solution:** Check for unclosed brackets, missing semicolons
   - **Tool:** Use ESLint or editor linter

**Debug Steps:**

```bash
# Check TypeScript compilation without building
npx tsc --noEmit

# Check for import issues
npm run build 2>&1 | grep "Cannot find module"

# Verify dependencies
npm list react react-dom typescript
```

---

### Jekyll Integration Issues

**Symptom:** Component works in development but fails in production.

**Possible Causes:**

1. **Path issues**
   - **Solution:** Use absolute paths for assets
   - **Example:** `/assets/videos/demo.mp4` not `../videos/demo.mp4`

2. **Build order**
   - **Solution:** Ensure `npm build` runs before `jekyll build`
   - **Workflow:**
     ```bash
     npm run build
     bundle exec jekyll build
     ```

3. **Props serialization**
   - **Solution:** Check liquid `jsonify` filter output
   - **Debug:** Add `{{ videoProps }}` to see raw output

4. **Cache issues**
   - **Solution:** Clear Jekyll cache
   - **Command:** `bundle exec jekyll clean && bundle exec jekyll build`

---

## API Reference

### Utility Functions

#### `getSyntaxTheme()`

**File:** `src/utils/syntaxTheme.ts` (116 lines)

**Purpose:** Returns appropriate Prism theme based on current dark/light mode.

**Usage:**

```typescript
import { getSyntaxTheme } from '../utils/syntaxTheme';

const theme = getSyntaxTheme();
```

**Behavior:**
- Detects `dark` class on `<html>` element
- Returns dark theme if present, light theme otherwise
- Returns theme object compatible with react-syntax-highlighter

---

### Component Dependency Matrix

| Component | React | TypeScript | D3 | Mermaid | Prism | HLS.js |
|-----------|-------|------------|-----|---------|-------|--------|
| VideoPlayer | ✅ | ✅ | ❌ | ❌ | ❌ | Optional |
| AudioPlayer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| MermaidViewer | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| MermaidModal | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| GraphView | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| KnowledgebaseCarousel | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| CodeBlock | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| NotesGrid | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| SearchCmdK | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| NotebookGuide | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| HelloGarden | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### External Dependencies

**Core:**
- `react` (18.x): UI library
- `react-dom` (18.x): DOM rendering
- `typescript` (5.x): Type safety

**Syntax Highlighting:**
- `react-syntax-highlighter` (15.x): Code syntax highlighting
- Includes Prism themes (dark/light)

**Visualization:**
- `d3` (7.x): Data visualization and SVG manipulation
- `mermaid` (10.x): Diagram generation from text

**Media:**
- `hls.js` (optional): HLS video streaming support (not currently used)

**Build Tools:**
- `esbuild`: Fast JavaScript bundler
- `tailwindcss`: Utility-first CSS framework

---

### Island Architecture APIs

**Data Attributes:**

```typescript
// Required
data-island: string  // Component name (must match registry)

// Optional
data-props: string   // JSON object with props
```

**Registry API:**

```typescript
const components: Record<string, React.ComponentType<any>> = {
  ComponentName: React.lazy(() => import('./components/ComponentName'))
};
```

**Mount Function:**

```typescript
mountIslands(): void
// Scans DOM for [data-island] elements and hydrates with React
// Called automatically on DOMContentLoaded
```

**Enhancement Functions:**

```typescript
enhanceCodeBlocks(): void
// Finds Rouge-generated code blocks (div.language-*.highlighter-rouge)
// Replaces with CodeBlock islands
// Re-mounts islands after replacement

enhanceMermaidDiagrams(): void
// Finds mermaid.ink image tags (img.mermaid)
// Decodes base64 diagram code from URL
// Replaces with MermaidViewer islands
// Re-mounts islands after replacement
```

---

## Contributing

When adding new components or modifying existing ones:

1. **Follow TypeScript interfaces** for type safety
2. **Use CSS variables** for all theming
3. **Implement accessibility** features (ARIA, keyboard nav)
4. **Add error handling** for edge cases
5. **Test in both themes** (dark/light mode)
6. **Update this README** with component documentation

---

## License

This component library is part of the b08x.github.io digital garden project.

---

**Last Updated:** 2026-01-03
**Component Count:** 11
**Total Lines of Code:** 2,558
**Architecture:** Island-based progressive enhancement
