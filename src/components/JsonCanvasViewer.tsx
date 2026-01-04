import React, { useEffect, useState } from 'react';
// @ts-ignore
import { Canvas } from 'react-jsoncanvas/index';

interface JsonCanvasViewerProps {
  url: string;
}

const JsonCanvasViewer: React.FC<JsonCanvasViewerProps> = ({ url }) => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        // Transform data to match react-jsoncanvas expectation
        setContent({
          initialNodes: data.nodes || [],
          edges: data.edges || []
        });
      })
      .catch(err => console.error("Failed to load canvas data:", err));
  }, [url]);

  if (!content) {
    return (
      <div className="flex items-center justify-center w-full h-full text-emerald-400 font-mono">
        Loading System Map...
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative" style={{ minHeight: '80vh' }}>
       <Canvas content={content} />
    </div>
  );
};

export default JsonCanvasViewer;
