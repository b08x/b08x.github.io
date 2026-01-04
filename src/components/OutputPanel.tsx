import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface OutputPanelProps {
  // No props - subscribes to canvas events
}

const OutputPanel: React.FC<OutputPanelProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [canvasData, setCanvasData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });

  useEffect(() => {
    const handleToggle = () => setIsVisible(prev => !prev);
    const handleUpdate = (e: any) => setCanvasData(e.detail);

    window.addEventListener('canvas:toggleOutput', handleToggle);
    window.addEventListener('canvas:dataUpdate', handleUpdate);

    // Initial data load
    if (window.canvasAPI) {
      setCanvasData(window.canvasAPI.getCanvasData());
    }

    return () => {
      window.removeEventListener('canvas:toggleOutput', handleToggle);
      window.removeEventListener('canvas:dataUpdate', handleUpdate);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(canvasData, null, 2));
      console.log('[Canvas] Copied to clipboard');
    } catch (err) {
      console.error('[Canvas] Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(canvasData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-20 right-4 w-96 max-h-[600px] bg-background border-2 border-border z-50 flex flex-col font-mono shadow-2xl"
      role="dialog"
      aria-label="Canvas JSON Output"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
        <span className="text-accent text-xs uppercase tracking-wider">JSON Canvas</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted hover:text-accent text-2xl leading-none"
          aria-label="Close Output Panel"
        >
          ×
        </button>
      </div>

      <div className="flex-grow overflow-auto p-4 bg-surface">
        <SyntaxHighlighter
          language="json"
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            fontSize: '0.75rem',
          }}
        >
          {JSON.stringify(canvasData, null, 2)}
        </SyntaxHighlighter>
      </div>

      <div className="flex gap-2 px-4 py-2 border-t border-border bg-surface">
        <button
          onClick={handleCopy}
          className="flex-1 px-3 py-1 bg-surface border border-border text-accent text-xs uppercase hover:border-accent hover:text-foreground transition-colors"
          aria-label="Copy JSON to Clipboard"
        >
          Copy
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 px-3 py-1 bg-surface border border-border text-accent text-xs uppercase hover:border-accent hover:text-foreground transition-colors"
          aria-label="Download JSON File"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default OutputPanel;
