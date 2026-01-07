import React, { useEffect, useState, useRef, useCallback } from 'react';
import { select, zoom, zoomIdentity, drag } from 'd3';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';

// --- Types ---

export type Direction = 'top' | 'right' | 'left' | 'bottom';
export type MarkerType = 'none' | 'arrow';

export interface Point {
  x: number;
  y: number;
}

export interface Edge {
  id: string;
  fromNode: string;
  fromSide?: Direction;
  fromEnd?: MarkerType;
  toNode: string;
  toSide?: Direction;
  toEnd?: MarkerType;
  label?: string;
}

export interface Node {
  id: string;
  type: string;
  label?: string;
  file?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  text?: string;
  url?: string;
  data?: any;
}

export const colors: Record<string, string> = {
  '1': '#ef4444', // red
  '2': '#f97316', // orange
  '3': '#eab308', // yellow
  '4': '#22c55e', // green
  '5': '#06b6d4', // cyan
  '6': '#a855f7', // purple
};

// --- Helpers ---

export function createPath(
  fromPoint: Point,
  toPoint: Point,
  _curveTightness: number,
  straightLineLength: number,
  fromSide: Direction,
  toSide: Direction,
) {
  let controlPointX1, controlPointX2, controlPointY1, controlPointY2, endPointX, endPointY;

  if (fromSide === 'right' || fromSide === 'left') {
    controlPointX1 = fromPoint.x + (fromSide === 'right' ? straightLineLength : -straightLineLength);
    controlPointX2 = toPoint.x + (toSide === 'right' ? straightLineLength : -straightLineLength);
    controlPointY1 = fromPoint.y;
    controlPointY2 = toPoint.y;
    endPointX = controlPointX2;
    endPointY = controlPointY2;
  } else {
    controlPointX1 = fromPoint.x;
    controlPointX2 = toPoint.x;
    controlPointY1 = fromPoint.y + (fromSide === 'bottom' ? straightLineLength : -straightLineLength);
    controlPointY2 = toPoint.y + (toSide === 'bottom' ? straightLineLength : -straightLineLength);
    endPointX = controlPointX2;
    endPointY = controlPointY2;
  }

  return `M ${fromPoint.x} ${fromPoint.y} L ${controlPointX1} ${controlPointY1} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2}, ${endPointX} ${endPointY} L ${toPoint.x} ${toPoint.y}`;
}

// --- Components ---

const Edges: React.FC<{
  nodes: Node[];
  edges: Edge[];
  scale: number;
  translateX: number;
  translateY: number;
}> = ({ nodes, edges, scale, translateX, translateY }) => {
  const [svgContent, setSvgContent] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newPaths: React.ReactNode[] = [];
    edges.forEach((edge) => {
      const fromNodeData = nodes.find(n => n.id === edge.fromNode);
      const toNodeData = nodes.find(n => n.id === edge.toNode);

      if (fromNodeData && toNodeData) {
        // Calculate points based on stored coordinates
        const fromPoint = {
          x: (fromNodeData.x * scale) + translateX,
          y: (fromNodeData.y * scale) + translateY
        };
        const width1 = fromNodeData.width * scale;
        const height1 = fromNodeData.height * scale;

        const toPoint = {
          x: (toNodeData.x * scale) + translateX,
          y: (toNodeData.y * scale) + translateY
        };
        const width2 = toNodeData.width * scale;
        const height2 = toNodeData.height * scale;

        // Adjust anchor points
        const getPointForSide = (p: Point, w: number, h: number, side?: Direction) => {
          switch (side) {
            case 'top': return { x: p.x + w / 2, y: p.y };
            case 'right': return { x: p.x + w, y: p.y + h / 2 };
            case 'bottom': return { x: p.x + w / 2, y: p.y + h };
            case 'left': return { x: p.x, y: p.y + h / 2 };
            default: return { x: p.x + w / 2, y: p.y + h / 2 };
          }
        };

        const ap1 = getPointForSide(fromPoint, width1, height1, edge.fromSide);
        const ap2 = getPointForSide(toPoint, width2, height2, edge.toSide);

        const d = createPath(ap1, ap2, 0.75, 30 * scale, edge.fromSide || 'bottom', edge.toSide || 'top');

        const markerEnd = edge.toEnd !== 'none' ? `url(#arrowhead-${edge.toSide || 'top'})` : undefined;
        const markerStart = edge.fromEnd === 'arrow' ? `url(#arrowhead-${edge.fromSide || 'bottom'})` : undefined;

        newPaths.push(
          <path
            key={edge.id}
            d={d}
            fill="none"
            stroke="var(--border)"
            strokeWidth={Math.max(1, 2 * scale)}
            markerEnd={markerEnd}
            markerStart={markerStart}
            style={{ opacity: 0.6 }}
          />
        );
      }
    });
    setSvgContent(newPaths);
  }, [nodes, edges, scale, translateX, translateY]);

  return (
    <svg id="canvas-edges" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
      <defs>
        <marker id="arrowhead-right" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="userSpaceOnUse" viewBox="0 0 10 7">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--border)" />
        </marker>
        <marker id="arrowhead-left" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="userSpaceOnUse" viewBox="0 0 10 7">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--border)" />
        </marker>
        <marker id="arrowhead-bottom" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="userSpaceOnUse" viewBox="0 0 10 7">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--border)" />
        </marker>
        <marker id="arrowhead-top" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="userSpaceOnUse" viewBox="0 0 10 7">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--border)" />
        </marker>
      </defs>
      <g>{svgContent}</g>
    </svg>
  );
};

interface CanvasNodeProps {
  node: Node;
  scale: number;
  translateX: number;
  translateY: number;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, w: number, h: number) => void;
}

const CanvasNode: React.FC<CanvasNodeProps> = ({ node, scale, translateX, translateY, onMove, onResize }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const latestOnMove = useRef(onMove);
  const latestNode = useRef(node);
  const latestScale = useRef(scale);
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    latestOnMove.current = onMove;
    latestNode.current = node;
    latestScale.current = scale;
  }, [onMove, node, scale]);

  useEffect(() => {
    if (node.type === 'file' && node.file) {
      setIsLoading(true);
      // Try to fetch the file content. 
      // Note: This might need adjustment based on how the server hosts these files.
      fetch(node.file)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.text();
        })
        .then(text => {
          setFetchedContent(text);
          setIsLoading(false);
        })
        .catch(err => {
          console.warn(`[Canvas] Failed to fetch file ${node.file}:`, err);
          setFetchedContent(`*Could not load file content from ${node.file}*`);
          setIsLoading(false);
        });
    }
  }, [node.file, node.type]);

  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure React has committed the markdown nodes to the DOM
      const timer = setTimeout(() => {
        if (window.mountIslands) {
          window.mountIslands();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, fetchedContent]);


  useEffect(() => {
    if (!nodeRef.current) return;

    const dragHandler = drag<HTMLDivElement, any>()
      .subject(() => ({ x: latestNode.current.x, y: latestNode.current.y }))
      .on('drag', (event) => {
        // event.x and event.y are the accumulated coordinates in the coordinate system of the subject
        // since our subject is {x, y} of the node, D3 handles the delta accumulation for us.
        latestOnMove.current(latestNode.current.id, event.x, event.y);
      });

    select(nodeRef.current).call(dragHandler);

    return () => {
      select(nodeRef.current).on('.drag', null);
    };
  }, []); // Stable attachment

  const isLink = node.type === 'link';
  const isResizable = node.type !== 'link';

  const displayContent = node.type === 'file' ? (fetchedContent || '') : (node.text || node.url || '');

  return (
    <div
      ref={nodeRef}
      id={node.id}
      className={`node absolute rounded border-2 select-none shadow-lg transition-transform duration-75 ${isLink ? 'link-card overflow-hidden' : ''}`}
      style={{
        left: (node.x * scale) + translateX,
        top: (node.y * scale) + translateY,
        width: node.width * scale,
        height: node.height * scale,
        borderColor: colors[node.color || ''] || 'var(--border)',
        backgroundColor: isLink ? 'var(--surface)' : 'var(--background)',
        zIndex: 20,
        overflow: 'hidden',
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {node.type === 'group' && (
        <div className="absolute -top-6 left-0 text-xs font-bold uppercase text-muted" style={{ fontSize: `${Math.max(10, 14 * scale)}px` }}>
          {node.label}
        </div>
      )}

      {isLink ? (
        <a
          href={(node.url || null) as any}
          className="flex flex-col h-full w-full p-4 hover:bg-accent/5 transition-colors no-underline group"
          onClick={(e) => {
            if (e.defaultPrevented) return;
            // Prevent navigation if dragged (though drag usually prevents click)
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent text-[10px] uppercase tracking-widest font-bold">External Link</span>
          </div>
          <h3 className="text-foreground font-bold mb-2 group-hover:text-accent transition-colors" style={{ fontSize: `${scale * 16}px` }}>
            {node.text || node.label || 'View Link'}
          </h3>
          <div className="mt-auto text-muted text-[10px] truncate opacity-50">
            {node.url}
          </div>
        </a>
      ) : (
        <div className="p-4 h-full overflow-auto">
          {node.label && node.type !== 'group' && (
            <h3 className="text-sm font-bold mb-2 border-b border-border pb-1" style={{ fontSize: `${scale * 14}px` }}>
              {node.label}
            </h3>
          )}
          <div className="markdown-content text-foreground prose prose-invert max-w-none" style={{ fontSize: `${scale * 12}px` }}>
            {isLoading ? (
              <div className="animate-pulse text-muted italic">Loading content...</div>
            ) : (
              <Markdown
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                remarkPlugins={[remarkGfm, remarkFrontmatter]}
                components={{
                  a: ({ node: _node, ...props }) => (
                    <a {...props} href={(props.href || null) as any} />
                  )
                }}
              >
                {displayContent}
              </Markdown>
            )}
          </div>
        </div>
      )}

      {/* Resize Handle */}
      {isResizable && (
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize hover:bg-accent/20 transition-colors flex items-center justify-center pointer-events-auto"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = node.width;
            const startHeight = node.height;

            const onMouseMove = (moveEvent: MouseEvent) => {
              const dw = (moveEvent.clientX - startX) / scale;
              const dh = (moveEvent.clientY - startY) / scale;
              onResize(node.id, Math.max(100, startWidth + dw), Math.max(100, startHeight + dh));
            };

            const onMouseUp = () => {
              window.removeEventListener('mousemove', onMouseMove);
              window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
          }}
        >
          <svg viewBox="0 0 10 10" className="w-3 h-3 fill-muted opacity-50" style={{ width: '12px', height: '12px', display: 'block' }}>
            <path d="M0 10 L10 10 L10 0 Z" />
          </svg>
        </div>
      )}
    </div>
  );
};

// --- Main component ---

interface JsonCanvasViewerProps {
  url: string;
}

const JsonCanvasViewer: React.FC<JsonCanvasViewerProps> = ({ url }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<any>(null);

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("[Garden] Failed to load canvas data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  useEffect(() => {
    if (!containerRef.current) return;

    const zoomBehavior = zoom<HTMLDivElement, any>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        setScale(event.transform.k);
        setPanOffset({ x: event.transform.x, y: event.transform.y });
      });

    zoomRef.current = zoomBehavior;
    select(containerRef.current).call(zoomBehavior);

    // Provide API for other islands
    window.canvasAPI = {
      getScale: () => scale,
      getPanOffset: () => panOffset,
      getCanvasData: () => ({ nodes, edges }),
      zoomIn: () => {
        select(containerRef.current).transition().call(zoomBehavior.scaleBy, 1.2);
      },
      zoomOut: () => {
        select(containerRef.current).transition().call(zoomBehavior.scaleBy, 0.8);
      },
      resetView: () => {
        select(containerRef.current).transition().call(zoomBehavior.transform, zoomIdentity);
      },
      updateCanvas: (data: any) => {
        if (data.nodes) setNodes(data.nodes);
        if (data.edges) setEdges(data.edges);
      }
    };

    // Emit event for state sync
    window.dispatchEvent(new CustomEvent('canvas:dataUpdate', { detail: { nodes, edges } }));

  }, [nodes, edges, scale, panOffset]);

  const handleMoveNode = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  }, []);

  const handleResizeNode = useCallback((id: string, width: number, height: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, width, height } : n));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full text-emerald-400 font-mono animate-pulse">
        Initializing System Map...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-red-500 font-mono p-4 border border-red-900 bg-red-950/20 rounded-lg">
        <div className="text-xl mb-2">SYSTEM ERROR</div>
        <div className="text-sm opacity-80">{error}</div>
        <div className="mt-4 text-xs opacity-50">Check homepage-canvas.json for syntax errors</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative"
      style={{ minHeight: '80vh', cursor: 'grab' }}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
          backgroundImage: `radial-gradient(circle, var(--border) 1px, transparent 1px)`,
          opacity: 0.2
        }}
      />

      <Edges nodes={nodes} edges={edges} scale={scale} translateX={panOffset.x} translateY={panOffset.y} />

      {nodes.map((node) => (
        <CanvasNode
          key={node.id}
          node={node}
          scale={scale}
          translateX={panOffset.x}
          translateY={panOffset.y}
          onMove={handleMoveNode}
          onResize={handleResizeNode}
        />
      ))}
    </div>
  );
};

export default JsonCanvasViewer;
