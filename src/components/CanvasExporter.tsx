import React, { useRef } from 'react';

const CanvasExporter: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (window.canvasAPI) {
          window.canvasAPI.updateCanvas(data);
          console.log('[Canvas] Successfully imported canvas data');
        }
      } catch (err) {
        console.error('[Canvas] Failed to import canvas:', err);
        alert('Failed to import canvas file. Please check the file format.');
      }
    };
    reader.onerror = () => {
      console.error('[Canvas] Failed to read file');
      alert('Failed to read file.');
    };
    reader.readAsText(file);

    // Reset input so the same file can be selected again
    event.target.value = '';
  };

  const handleExport = () => {
    if (!window.canvasAPI) {
      console.error('[Canvas] canvasAPI not available');
      return;
    }

    const data = window.canvasAPI.getCanvasData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canvas-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('[Canvas] Canvas exported successfully');
  };

  return (
    <div className="fixed top-4 right-4 z-30 flex gap-2">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-surface border-2 border-border text-accent font-mono text-xs uppercase hover:border-accent hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Import Canvas from File"
      >
        Import
      </button>
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-surface border-2 border-border text-accent font-mono text-xs uppercase hover:border-accent hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Export Canvas to File"
      >
        Export
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.canvas"
        onChange={handleImport}
        className="hidden"
        aria-label="File Upload Input"
      />
    </div>
  );
};

export default CanvasExporter;
