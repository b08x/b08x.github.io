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
};

const mountIslands = () => {
  const islands = document.querySelectorAll('[data-island]');
  console.log(`[Garden] Found ${islands.length} islands to mount`);

  islands.forEach((container) => {
    const componentName = container.getAttribute('data-island');
    console.log(`[Garden] Attempting to mount island: ${componentName}`);

    if (componentName && components[componentName]) {
      const Component = components[componentName];
      let props = {};

      try {
        const propsAttr = container.getAttribute('data-props');
        if (propsAttr) {
          // Replace potential smart quotes if they crept in
          const sanitizedProps = propsAttr
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[\u2018\u2019]/g, "'");
          props = JSON.parse(sanitizedProps);
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
      island.setAttribute('data-props', JSON.stringify({ code }));

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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    mountIslands();
    enhanceMermaidDiagrams();
  });
} else {
  mountIslands();
  enhanceMermaidDiagrams();
}