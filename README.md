# Syncopated Notes

A hybrid digital garden built with **Jekyll** (Static) and **React** (Interactive Islands), featuring a dark terminal aesthetic and bidirectional linking for knowledge management.

![Terminal Theme](https://img.shields.io/badge/theme-dark%20terminal-ff6600)
![Jekyll](https://img.shields.io/badge/jekyll-4.3+-red)
![React](https://img.shields.io/badge/react-19-61DAFB)
![esbuild](https://img.shields.io/badge/build-esbuild-FFCF00)
![Tailwind CSS](https://img.shields.io/badge/tailwind-4.x-38bdf8)

## 🏗️ Architecture: The Static-Dynamic Hybrid

This project uses a **"React Islands"** architecture to balance SEO/Speed (Static) with deep interactivity (Dynamic).

*   **Static Core (Jekyll):** All content, navigation, and layout are pre-rendered HTML. 100% SEO-friendly, zero JS needed to read.
*   **Dynamic Islands (React):** Specific interactive widgets are hydrated into the page on demand.
    *   **Knowledge Graph:** D3.js interactive visualization (`src/components/GraphView.tsx`).
    *   **Command Palette:** Global search via `Cmd+K` (`src/components/SearchCmdK.tsx`).

### Data Bridge
Jekyll generates static JSON endpoints at build time, which React components fetch to hydrate their state:
*   `/graph.json`: Full node/edge list for the Knowledge Graph.
*   `/search.json`: Lightweight index for the Command Palette.

## 🚀 Quick Start

### Prerequisites
*   Ruby 3.3+ (managed via RVM)
*   Node.js 20+

### Development (Unified)
Run the Jekyll server and the React bundler in parallel:

```bash
npm run dev
```

*   **Jekyll:** Served at `http://localhost:4000`
*   **React:** Watched via `esbuild` (rebuilds `assets/js/dist/garden-widgets.js` on change)

### Production Build

```bash
npm run build
```

This runs:
1.  `npm run build:js` (Compiles React to a single bundle)
2.  `bundle exec jekyll build` (Generates the static site)

## 🎨 Theme & Design System

**Aesthetic:** "Cyber-Brutalist Terminal"
*   **Font:** JetBrains Mono (UI) + Inter (Prose)
*   **Colors:** `#0a0a0a` (Background) / `#ff6600` (Accent)

**Tailwind v4:**
The project uses Tailwind CSS v4. Configuration is in `tailwind.config.js` and scans both Liquid templates (`_layouts`) and React components (`src`).

## ✨ Features

### Interactive (React)
*   **Knowledge Graph:** Zoomable, force-directed graph of all notes.
*   **Command Palette (`Cmd+K`):** Instant fuzzy search across all notes and projects.

### Core (Jekyll)
*   **Bidirectional Linking:** `[[Note Title]]` syntax support.
*   **Obsidian Callouts:** Support for `> [!NOTE]` blocks.
*   **Smart TOC:** Intersection Observer-based table of contents.
*   **Code Copy:** Automatic copy buttons for all code blocks.

## 📂 Directory Structure

```
b08x.github.io/
├── _notes/                  # Content (Markdown)
├── _layouts/                # HTML Shells
│   ├── default.html         # Base layout (includes JS bundle)
│   └── terminal-note.html   # Main reading layout
├── src/                     # React Source Code
│   ├── components/          # React Components (Graph, Search)
│   └── main.tsx             # Island Mount Logic
├── assets/
│   └── js/dist/             # Compiled JS Output (Git-tracked)
├── graph.json               # Generated Data Endpoint
├── search.json              # Generated Data Endpoint
└── package.json             # Build Scripts (esbuild)
```

## 🛠️ Adding New Islands

1.  Create a component in `src/components/MyWidget.tsx`.
2.  Register it in `src/main.tsx`:
    ```typescript
    import MyWidget from './components/MyWidget';
    const components = { ..., MyWidget };
    ```
3.  Embed it in any Liquid file:
    ```html
    <div data-island="MyWidget" data-props='{"title": "Hello"}'></div>
    ```

## 📄 License

Source code is available under the [MIT license](LICENSE.md).