# src/components/ - React Islands

18 React components using island architecture for progressive enhancement.

## STRUCTURE

```
components/
├── __tests__/              # Component tests (minimal)
├── VideoPlayer.tsx         # HLS video with segments/transcript (410 LOC)
├── KnowledgebaseCarousel.tsx # H2-based content carousel (498 LOC)
├── MermaidViewer.tsx       # Interactive diagrams zoom/pan (280 LOC)
├── MermaidModal.tsx        # Fullscreen diagram modal (249 LOC)
├── GraphView.tsx           # D3 force-directed graph (254 LOC)
├── CodeBlock.tsx           # Syntax highlight + copy (224 LOC)
├── NotesGrid.tsx           # Grid display with detail (221 LOC)
├── SearchCmdK.tsx          # Command palette search (153 LOC)
├── AudioPlayer.tsx         # Audio with waveform (144 LOC)
├── NotebookGuide.tsx       # Guide/tutorial (112 LOC)
├── JsonCanvasViewer.tsx    # Canvas file viewer
├── Canvas*.tsx             # Canvas system (Controls, Exporter, Minimap)
├── OutputPanel.tsx         # Canvas output panel
├── NodeEditor.tsx          # Canvas node editor
├── ReactPlayerIsland.tsx   # react-player wrapper
└── HelloGarden.tsx         # Demo component (13 LOC)
```

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Add new component | Create `.tsx`, register in `../main.tsx` | Follow lazy-load pattern |
| Video playback | `VideoPlayer.tsx` | HLS via react-player |
| Syntax highlighting | `CodeBlock.tsx` | react-syntax-highlighter |
| Diagrams | `MermaidViewer.tsx` | Mermaid library + zoom/pan |
| Graph visualization | `GraphView.tsx` | D3 force simulation |
| Search | `SearchCmdK.tsx` | Cmd/Ctrl+K trigger |
| Canvas system | `JsonCanvasViewer.tsx` + `Canvas*.tsx` | react-jsoncanvas |

## CONVENTIONS

**Component Pattern:**
```typescript
// Default export, lazy-loadable
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // Theme detection via MutationObserver on document.documentElement.class
  // CSS variables for colors (never hardcode)
  return <div className="...">...</div>;
};
export default MyComponent;
```

**Theme Sync:** Components must observe `class` changes on `<html>` element for dark/light mode.

**Props Interface:** Define `interface Props {}` at top of file. Support both JSON and Base64 `data-props`.

## ANTI-PATTERNS

- **NEVER** use synchronous imports - always `React.lazy()`
- **NEVER** hardcode colors - use CSS variables (`--foreground`, `--accent`, etc.)
- **NEVER** skip error boundaries in complex components
- **AVOID** direct DOM manipulation outside useEffect

## DEPENDENCIES

- `react`, `react-dom` (v19)
- `d3` - GraphView
- `mermaid` - MermaidViewer
- `react-player` - VideoPlayer, ReactPlayerIsland
- `react-syntax-highlighter` - CodeBlock
- `react-jsoncanvas` - JsonCanvasViewer
- `react-markdown`, `rehype-*`, `remark-*` - Markdown rendering
