import React from 'react';
import { createRoot } from 'react-dom/client';

// Import components
import HelloGarden from './components/HelloGarden';

const components: Record<string, React.ComponentType<any>> = {
  HelloGarden,
};

const mountIslands = () => {
  const islands = document.querySelectorAll('[data-island]');
  
  islands.forEach((container) => {
    const componentName = container.getAttribute('data-island');
    if (componentName && components[componentName]) {
      const Component = components[componentName];
      const props = JSON.parse(container.getAttribute('data-props') || '{}');
      
      const root = createRoot(container);
      root.render(<Component {...props} />);
    }
  });
};

// Mount on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountIslands);
} else {
  mountIslands();
}
