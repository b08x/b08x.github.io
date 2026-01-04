import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

// Import components dynamically
const HelloGarden = React.lazy(() => import('./components/HelloGarden'));
const GraphView = React.lazy(() => import('./components/GraphView'));
const SearchCmdK = React.lazy(() => import('./components/SearchCmdK'));
const VideoPlayer = React.lazy(() => import('./components/VideoPlayer'));
const NotesGrid = React.lazy(() => import('./components/NotesGrid'));
const AudioPlayer = React.lazy(() => import('./components/AudioPlayer'));
const NotebookGuide = React.lazy(() => import('./components/NotebookGuide'));
const KnowledgebaseCarousel = React.lazy(() => import('./components/KnowledgebaseCarousel'));
const MermaidViewer = React.lazy(() => import('./components/MermaidViewer'));
const CodeBlock = React.lazy(() => import('./components/CodeBlock'));
const ReactPlayerIsland = React.lazy(() => import('./components/ReactPlayerIsland'));
const CanvasControls = React.lazy(() => import('./components/CanvasControls'));
const OutputPanel = React.lazy(() => import('./components/OutputPanel'));
const NodeEditor = React.lazy(() => import('./components/NodeEditor'));
const CanvasExporter = React.lazy(() => import('./components/CanvasExporter'));
const CanvasMinimap = React.lazy(() => import('./components/CanvasMinimap'));
const JsonCanvasViewer = React.lazy(() => import('./components/JsonCanvasViewer'));


const components: Record<string, React.ComponentType<any>> = {
  HelloGarden,
  GraphView,
  SearchCmdK,
  VideoPlayer,
  NotesGrid,
  AudioPlayer,
  NotebookGuide,
  KnowledgebaseCarousel,
  MermaidViewer,
  CodeBlock,
  ReactPlayerIsland,
  CanvasControls,
  OutputPanel,
  NodeEditor,
  CanvasExporter,
  CanvasMinimap,
  JsonCanvasViewer,
};

// Helper to decode Base64 accurately with UTF-8 support
const decodeProps = (encoded: string): any => {
  try {
    // Try parsing as raw JSON first (for backward compatibility)
    if (encoded.trim().startsWith('{') || encoded.trim().startsWith('[')) {
      return JSON.parse(encoded);
    }

    // Otherwise treat as Base64
    const binaryString = atob(encoded);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoded = new TextDecoder().decode(bytes);
    return JSON.parse(decoded);
  } catch (e: any) {
    console.error('[Garden] Failed to decode props:', e);
    // Fallback to raw parsing if it wasn't valid base64 but maybe it was a string that didn't start with {
    try {
      return JSON.parse(encoded);
    } catch (inner) {
      throw new Error(`Props decoding failed: ${e.message}`);
    }
  }
};

// Helper to encode Base64 with UTF-8 support
const encodeProps = (props: any): string => {
  const json = JSON.stringify(props);
  const bytes = new TextEncoder().encode(json);
  const binaryString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binaryString);
};

const mountIslands = () => {
  const islands = document.querySelectorAll('[data-island]:not([data-mounted="true"])');
  if (islands.length > 0) {
    console.log(`[Garden] Found ${islands.length} new islands to mount`);
  }

  islands.forEach((container) => {
    const componentName = container.getAttribute('data-island');
    console.log(`[Garden] Attempting to mount island: ${componentName}`);

    if (componentName && components[componentName]) {
      const Component = components[componentName];
      let props = {};

      try {
        const propsAttr = container.getAttribute('data-props');
        if (propsAttr) {
          props = decodeProps(propsAttr);
        }
      } catch (e) {
        console.error(`[Garden] Failed to parse props for island ${componentName}:`, e);
        console.error(`[Garden] Raw props content:`, container.getAttribute('data-props'));
      }

      const root = createRoot(container, {
        onUncaughtError: (error, errorInfo) => {
          console.error(`[Garden] React Error in island ${componentName}:`, error, errorInfo);
        }
      });

      root.render(
        <Suspense fallback={<div>Loading component...</div>}>
          <Component {...props} />
        </Suspense>
      );
      container.setAttribute('data-mounted', 'true');
      console.log(`[Garden] Successfully rendered island: ${componentName}`);
    } else {
      console.warn(`[Garden] Component "${componentName}" not found in registry`);
    }
  });
};

const enhanceMermaidDiagrams = () => {
  // Find static mermaid diagrams rendered by jekyll-spaceship (as img tags)
  const mermaidImages = document.querySelectorAll('img.mermaid');
  console.log(`[Garden] Found ${mermaidImages.length} mermaid diagrams to enhance`);

  mermaidImages.forEach((img) => {
    try {
      // Extract encoded diagram from mermaid.ink URL
      const src = img.getAttribute('src') || '';
      const match = src.match(/mermaid\.ink\/svg\/(.+)$/);
      if (!match) {
        console.warn('[Garden] Could not parse mermaid.ink URL:', src);
        return;
      }

      // Decode base64 payload from mermaid.ink (URL-safe base64)
      const encoded = match[1];

      // Convert URL-safe base64 to standard base64
      const standardBase64 = encoded
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      // Add padding if needed
      const paddedBase64 = standardBase64 + '=='.substring(0, (4 - standardBase64.length % 4) % 4);

      const decoded = atob(paddedBase64);
      const data = JSON.parse(decoded);
      const code = data.code;

      if (!code) {
        console.warn('[Garden] No code found in mermaid data:', data);
        return;
      }

      // Create island container
      const island = document.createElement('div');
      island.setAttribute('data-island', 'MermaidViewer');
      island.setAttribute('data-props', encodeProps({ code }));

      // Replace static image with island
      const parent = img.parentElement;
      if (parent) {
        parent.replaceWith(island);
        console.log(`[Garden] Enhanced mermaid diagram (${code.substring(0, 50)}...)`);
      }
    } catch (err) {
      console.warn('[Garden] Failed to enhance mermaid diagram, keeping static version:', err);
      // Leave static image in place on error
    }
  });

  // Re-run island mounting for new MermaidViewer islands
  if (mermaidImages.length > 0) {
    mountIslands();
  }
};

const enhanceCodeBlocks = () => {
  // Find all Rouge-generated code containers
  const containers = document.querySelectorAll('div[class*="language-"].highlighter-rouge');
  console.log(`[Garden] Found ${containers.length} code blocks to enhance`);

  if (containers.length === 0) return;

  // Language mapping for common aliases
  const LANGUAGE_ALIASES: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    rb: 'ruby',
    yml: 'yaml',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    md: 'markdown',
  };

  containers.forEach((container) => {
    try {
      const codeElement = container.querySelector('pre code');
      if (!codeElement) return;

      const code = codeElement.textContent || '';

      // Extract language from class name
      const classNames = container.className.split(' ');
      const languageClass = classNames.find((cls) => cls.startsWith('language-'));
      let language = languageClass ? languageClass.replace('language-', '') : 'text';

      // Apply aliases
      language = LANGUAGE_ALIASES[language] || language;

      // Extract optional file name from data attribute
      let fileName = container.getAttribute('data-filename') || undefined;

      // Fallback: detect from first line if not found in attribute
      if (!fileName) {
        const firstLine = code.split('\n')[0]?.trim();
        if (firstLine) {
          const patterns = [
            /^#\s+(.+)$/,             // # filename
            /^\/\/\s+(.+)$/,         // // filename
            /^\/\*\s*(.+)\s*\*\/$/,   // /* filename */
            /^<!--\s*(.+)\s*-->$/,    // <!-- filename -->
            /^--\s+(.+)$/,           // -- filename
          ];

          for (const pattern of patterns) {
            const match = firstLine.match(pattern);
            if (match && match[1]) {
              const detected = match[1].trim();
              if (detected.includes('.') || detected.includes('/')) {
                fileName = detected;
                break;
              }
            }
          }
        }
      }

      // Extract line number info
      const showLineNumbers = container.classList.contains('line-numbers') ||
        container.hasAttribute('data-line-numbers');
      const startLineAttr = container.getAttribute('data-start');
      const startingLineNumber = startLineAttr ? parseInt(startLineAttr, 10) : 1;

      // Create island container
      const island = document.createElement('div');
      island.setAttribute('data-island', 'CodeBlock');
      island.setAttribute(
        'data-props',
        encodeProps({
          code: code,
          language,
          fileName,
          showLineNumbers,
          startingLineNumber,
        })
      );

      // Replace original container
      container.replaceWith(island);
    } catch (err) {
      console.warn('[Garden] Failed to enhance code block:', err);
    }
  });

  // Re-run island mounting for new CodeBlock islands
  mountIslands();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    enhanceCodeBlocks();
    mountIslands();
    enhanceMermaidDiagrams();
  });
} else {
  enhanceCodeBlocks();
  mountIslands();
  enhanceMermaidDiagrams();
}