import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

// Import components dynamically
const HelloGarden = React.lazy(() => import('./components/HelloGarden'));
const GraphView = React.lazy(() => import('./components/GraphView'));
const SearchCmdK = React.lazy(() => import('./components/SearchCmdK'));

const components: Record<string, React.ComponentType<any>> = {
  HelloGarden,
  GraphView,
  SearchCmdK,
};

const mountIslands = () => {
  const islands = document.querySelectorAll('[data-island]');

  islands.forEach((container) => {
    const componentName = container.getAttribute('data-island');
    if (componentName && components[componentName]) {
      const Component = components[componentName];
      const props = JSON.parse(container.getAttribute('data-props') || '{}');

      const root = createRoot(container, {
        onUncaughtError: (error, errorInfo) => {
          console.error('[Garden] React Error:', error, errorInfo);
        }
      });
      root.render(
        <Suspense fallback={null}>
          <Component {...props} />
        </Suspense>
      );
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountIslands);
} else {
  mountIslands();
}