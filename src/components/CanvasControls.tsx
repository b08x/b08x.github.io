import React from 'react';

interface CanvasControlsProps {
  // No props needed - uses window.canvasAPI
}

// Extend Window interface to include canvasAPI
declare global {
  interface Window {
    canvasAPI?: {
      getScale: () => number;
      getPanOffset: () => { x: number; y: number };
      getCanvasData: () => any;
      zoomIn: () => void;
      zoomOut: () => void;
      resetView: () => void;
      updateCanvas: (data: any) => void;
    };
  }
}

const CanvasControls: React.FC<CanvasControlsProps> = () => {
  const handleZoomIn = () => window.canvasAPI?.zoomIn();
  const handleZoomOut = () => window.canvasAPI?.zoomOut();
  const handleReset = () => window.canvasAPI?.resetView();
  const handleToggleOutput = () => {
    window.dispatchEvent(new CustomEvent('canvas:toggleOutput'));
  };

  return (
    <div id="controls" className="fixed bottom-4 right-4 z-30 flex flex-col gap-2">
      <button
        onClick={handleToggleOutput}
        className="px-4 py-2 bg-surface border-2 border-border text-accent font-mono text-xs uppercase hover:border-accent hover:text-foreground transition-colors"
        aria-label="Toggle JSON Output Panel"
      >
        Toggle Output
      </button>
      <button
        onClick={handleZoomOut}
        className="px-4 py-2 bg-surface border-2 border-border text-accent font-mono text-xs uppercase hover:border-accent hover:text-foreground transition-colors"
        aria-label="Zoom Out"
      >
        Zoom Out
      </button>
      <button
        onClick={handleZoomIn}
        className="px-4 py-2 bg-surface border-2 border-border text-accent font-mono text-xs uppercase hover:border-accent hover:text-foreground transition-colors"
        aria-label="Zoom In"
      >
        Zoom In
      </button>
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-surface border-2 border-border text-accent font-mono text-xs uppercase hover:border-accent hover:text-foreground transition-colors"
        aria-label="Reset View"
      >
        Reset
      </button>
    </div>
  );
};

export default CanvasControls;
