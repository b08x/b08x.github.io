import React, { useState, useEffect, useRef } from 'react';

interface MinimapNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MinimapProps {
  // No props - subscribes to canvas events
}

const CanvasMinimap: React.FC<MinimapProps> = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [nodes, setNodes] = useState<MinimapNode[]>([]);
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Minimap dimensions
  const MINIMAP_WIDTH = 200;
  const MINIMAP_HEIGHT = 150;
  const MINIMAP_SCALE = 0.1; // Scale down factor for minimap

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail && e.detail.nodes) {
        setNodes(e.detail.nodes);
      }
    };

    const handleScaleUpdate = () => {
      if (window.canvasAPI) {
        setScale(window.canvasAPI.getScale());
        setPanOffset(window.canvasAPI.getPanOffset());
      }
    };

    window.addEventListener('canvas:dataUpdate', handleUpdate);

    // Poll for scale/pan updates (canvas doesn't emit these separately yet)
    const interval = setInterval(handleScaleUpdate, 100);

    // Initial load
    if (window.canvasAPI) {
      const data = window.canvasAPI.getCanvasData();
      setNodes(data.nodes || []);
      setScale(window.canvasAPI.getScale());
      setPanOffset(window.canvasAPI.getPanOffset());
    }

    return () => {
      window.removeEventListener('canvas:dataUpdate', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT);

    // Calculate bounding box of all nodes
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(node => {
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x + node.width);
      minY = Math.min(minY, node.y);
      maxY = Math.max(maxY, node.y + node.height);
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    // Calculate scale to fit content in minimap
    const scaleX = (MINIMAP_WIDTH - 20) / contentWidth;
    const scaleY = (MINIMAP_HEIGHT - 20) / contentHeight;
    const minimapScale = Math.min(scaleX, scaleY);

    // Center offset
    const offsetX = (MINIMAP_WIDTH - contentWidth * minimapScale) / 2 - minX * minimapScale;
    const offsetY = (MINIMAP_HEIGHT - contentHeight * minimapScale) / 2 - minY * minimapScale;

    // Draw nodes
    ctx.fillStyle = 'rgba(52, 152, 219, 0.3)'; // accent color with transparency
    ctx.strokeStyle = 'rgba(52, 152, 219, 0.8)';
    ctx.lineWidth = 1;

    nodes.forEach(node => {
      const x = node.x * minimapScale + offsetX;
      const y = node.y * minimapScale + offsetY;
      const w = node.width * minimapScale;
      const h = node.height * minimapScale;

      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
    });

    // Draw viewport rectangle
    const viewportWidth = window.innerWidth / scale;
    const viewportHeight = window.innerHeight / scale;
    const viewportX = (-panOffset.x / scale) * minimapScale + offsetX;
    const viewportY = (-panOffset.y / scale) * minimapScale + offsetY;
    const viewportW = viewportWidth * minimapScale;
    const viewportH = viewportHeight * minimapScale;

    ctx.strokeStyle = 'rgba(52, 152, 219, 1)'; // accent color
    ctx.lineWidth = 2;
    ctx.strokeRect(viewportX, viewportY, viewportW, viewportH);
    ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
    ctx.fillRect(viewportX, viewportY, viewportW, viewportH);

  }, [nodes, scale, panOffset]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-30 px-3 py-2 bg-surface border-2 border-border text-accent font-mono text-xs uppercase hover:border-accent hover:text-foreground transition-colors"
        aria-label="Show Minimap"
      >
        Map
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-30 bg-background border-2 border-border p-2 font-mono shadow-2xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-accent text-xs uppercase tracking-wider">Overview</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted hover:text-accent text-lg leading-none px-1"
          aria-label="Hide Minimap"
        >
          ×
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={MINIMAP_WIDTH}
        height={MINIMAP_HEIGHT}
        className="bg-surface border border-border"
      />
      <div className="text-muted text-[10px] mt-1 text-center">
        Zoom: {(scale * 100).toFixed(0)}%
      </div>
    </div>
  );
};

export default CanvasMinimap;
