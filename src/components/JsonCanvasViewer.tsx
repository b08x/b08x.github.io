import React, { useEffect, useState, useRef, useCallback } from 'react';
import { select, zoom, zoomIdentity, drag } from 'd3';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';

// --- Types based on JSON Canvas Spec 1.0 ---

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
  color?: string;
}

export interface Node {
  id: string;
  type: 'text' | 'file' | 'link' | 'group';
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  // text node
  text?: string;
  // file node
  file?: string;
  subpath?: string;
  // link node
  url?: string;
  // group node
  label?: string;
  background?: string;
  backgroundStyle?: 'cover' | 'fill' | 'repeat';
}

export const colors: Record<string, string> = {
  '1': 'var(--red, #ef4444)',
  '2': 'var(--orange, #f97316)',
  '3': 'var(--yellow, #eab308)',
  '4': 'var(--green, #22c55e)',
  '5': 'var(--cyan, #06b6d4)',
  '6': 'var(--purple, #a855f7)',
};

// --- Helpers ---

export function createPath(
  fromPoint: Point,
  toPoint: Point,
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

        const d = createPath(ap1, ap2, 30 * scale, edge.fromSide || 'bottom', edge.toSide || 'top');

        const strokeColor = colors[edge.color || ''] || 'var(--border)';
        const markerEnd = edge.toEnd !== 'none' ? `url(#arrowhead-${edge.toSide || 'top'})` : undefined;

        newPaths.push(
          <g key={edge.id}>
            <path
              d={d}
              fill="none"
              stroke={strokeColor}
              strokeWidth={Math.max(1, 2 * scale)}
              markerEnd={markerEnd}
              style={{ opacity: 0.6 }}
            />
            {edge.label && (
              <text
                x={(ap1.x + ap2.x) / 2}
                y={(ap1.y + ap2.y) / 2}
                fill="var(--foreground)"
                style={{ fontSize: `${Math.max(8, 12 * scale)}px`, pointerEvents: 'none' }}
                textAnchor="middle"
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      }
    });
    setSvgContent(newPaths);
  }, [nodes, edges, scale, translateX, translateY]);

  return (
    <svg id="canvas-edges" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
      <defs>
        {['top', 'right', 'bottom', 'left'].map(side => (
          <marker key={side} id={`arrowhead-${side}`} markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="userSpaceOnUse" viewBox="0 0 10 7">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--border)" />
          </marker>
        ))}
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
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (node.type === 'file' && node.file && !node.text) {
      setIsLoading(true);
      const filePath = node.file.startsWith('/') ? node.file : `/${node.file}`;
      fetch(filePath)
        .then(res => res.ok ? res.text() : Promise.reject(res.statusText))
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
  }, [node.file, node.type, node.text]);

  useEffect(() => {
    if (!nodeRef.current) return;
    const dragHandler = drag<HTMLDivElement, any>()
      .subject(() => ({ x: node.x, y: node.y }))
      .on('drag', (event) => {
        onMove(node.id, event.x, event.y);
      });
    select(nodeRef.current).call(dragHandler);
    return () => { select(nodeRef.current).on('.drag', null); };
  }, [node.id, node.x, node.y, onMove]);

  const displayContent = node.text || fetchedContent || '';
  const nodeColor = colors[node.color || ''] || 'var(--border)';

  return (
    <div
      ref={nodeRef}
      id={node.id}
      className={`node absolute rounded-md border border-border bg-surface select-none shadow-sm transition-transform duration-75 overflow-hidden flex flex-col`}
      style={{
        left: (node.x * scale) + translateX,
        top: (node.y * scale) + translateY,
        width: node.width * scale,
        height: node.height * scale,
        borderColor: nodeColor,
        zIndex: node.type === 'group' ? 5 : 20,
        cursor: 'grab',
      }}
    >
      {/* Node Header */}
      <div className="px-3 py-1 border-b border-border bg-surface/50 text-[10px] font-mono text-muted uppercase tracking-wider flex justify-between items-center">
        <span>{node.type}</span>
        {node.label && <span className="font-bold text-accent">{node.label}</span>}
      </div>

      <div className="p-3 h-full overflow-auto text-foreground font-sans">
        {node.type === 'link' ? (
          <a href={node.url} className="text-accent hover:underline break-all" target="_blank" rel="noopener noreferrer">
            {node.url}
          </a>
        ) : (
          <div className="markdown-content prose prose-invert max-w-none" style={{ fontSize: `${scale * 12}px` }}>
            {isLoading ? (
              <div className="animate-pulse text-muted italic">Loading...</div>
            ) : (
              <Markdown
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                remarkPlugins={[remarkGfm, remarkFrontmatter]}
              >
                {displayContent}
              </Markdown>
            )}
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-accent/20 flex items-center justify-center"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const startX = e.clientX;
          const startY = e.clientY;
          const startW = node.width;
          const startH = node.height;
          const onMouseMove = (m: MouseEvent) => {
            onResize(node.id, Math.max(50, startW + (m.clientX - startX) / scale), Math.max(50, startH + (m.clientY - startY) / scale));
          };
          const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
          };
          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
        }}
      >
        <div className="w-2 h-2 border-r-2 border-b-2 border-muted/50" />
      </div>
    </div>
  );
};

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
      .then(res => res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`))
      .then(data => {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.toString());
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
    
    window.canvasAPI = {
      getScale: () => scale,
      getPanOffset: () => panOffset,
      getCanvasData: () => ({ nodes, edges }),
      zoomIn: () => select(containerRef.current as any).transition().call(zoomBehavior.scaleBy as any, 1.2),
      zoomOut: () => select(containerRef.current as any).transition().call(zoomBehavior.scaleBy as any, 0.8),
      resetView: () => select(containerRef.current as any).transition().call(zoomBehavior.transform as any, zoomIdentity),
      updateCanvas: (data: any) => { if (data.nodes) setNodes(data.nodes); if (data.edges) setEdges(data.edges); }
    };
  }, [nodes, edges, scale, panOffset]);

  if (loading) return <div className="flex items-center justify-center w-full h-full text-accent font-mono animate-pulse">Initializing Overhauled Canvas...</div>;
  if (error) return <div className="flex flex-col items-center justify-center w-full h-full text-red-500 font-mono p-4 border border-red-500/50 bg-red-500/10 rounded-md"><div>SYSTEM ERROR</div><div className="text-xs">{error}</div></div>;

  return (
    <div ref={containerRef} className="w-full h-full bg-background border border-border rounded-md relative cursor-grab overflow-hidden min-h-[600px]">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundSize: `${20 * scale}px ${20 * scale}px`, backgroundPosition: `${panOffset.x}px ${panOffset.y}px`, backgroundImage: `radial-gradient(circle, var(--border) 1px, transparent 1px)`, opacity: 0.1 }} />
      <Edges nodes={nodes} edges={edges} scale={scale} translateX={panOffset.x} translateY={panOffset.y} />
      {nodes.map(node => (
        <CanvasNode key={node.id} node={node} scale={scale} translateX={panOffset.x} translateY={panOffset.y} 
          onMove={(id, x, y) => setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n))}
          onResize={(id, width, height) => setNodes(prev => prev.map(n => n.id === id ? { ...n, width, height } : n))}
        />
      ))}
    </div>
  );
};

export default JsonCanvasViewer;
