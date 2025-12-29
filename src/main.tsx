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

const components: Record<string, React.ComponentType<any>> = {
  HelloGarden,
  GraphView,
  SearchCmdK,
  VideoPlayer,
  NotesGrid,
  AudioPlayer,
  NotebookGuide,
  KnowledgebaseCarousel,
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountIslands);
} else {
  mountIslands();
}