import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import * as d3 from 'd3';
import { initMermaid } from '../utils/mermaidTheme';
import MermaidModal from './MermaidModal';

interface MermaidViewerProps {
  code: string;
  allowModal?: boolean;
}

const MermaidViewer: React.FC<MermaidViewerProps> = ({
  code,
  allowModal = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCode, setSvgCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [showControls, setShowControls] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Detect theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Render diagram
  useEffect(() => {
    const renderDiagram = async () => {
      try {
        initMermaid(isDark);
        const { svg } = await mermaid.render(
          `mermaid-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          code
        );
        setSvgCode(svg);
        setError(null);
      } catch (err) {
        console.error('[MermaidViewer] Render error:', err);
        setError(err instanceof Error ? err.message : 'Render failed');
      }
    };

    renderDiagram();
  }, [code, isDark]);

  // Setup zoom/pan
  useEffect(() => {
    if (!containerRef.current || !svgCode) return;

    // Wait a tick for DOM to update
    setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      // Select SVG from the svg-content div
      const svg = d3.select(container).select('.svg-content svg');
      if (svg.empty()) {
        console.warn('[MermaidViewer] SVG not found in container');
        return;
      }

      const svgNode = svg.node() as SVGSVGElement;
      if (!svgNode) return;

      // Ensure SVG fills container properly
      svg.style('width', '100%')
         .style('height', 'auto')
         .style('display', 'block');

      console.log('[MermaidViewer] Setting up zoom for SVG:', svgNode);

      // Wrap all SVG content in a transformable group
      let zoomGroup = svg.select('g.zoom-wrapper');

      if (zoomGroup.empty()) {
        // Get all current children
        const children = Array.from(svgNode.children);

        // Create zoom wrapper group
        zoomGroup = svg.append('g')
          .attr('class', 'zoom-wrapper');

        // Move all children into the group
        children.forEach(child => {
          zoomGroup.node()?.appendChild(child);
        });

        console.log('[MermaidViewer] Created zoom wrapper, moved', children.length, 'children');
      }

      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 4])
        .on('zoom', (event) => {
          zoomGroup.attr('transform', event.transform.toString());
        });

      svg.call(zoom);
      zoomRef.current = zoom;

      console.log('[MermaidViewer] Zoom behavior attached');

      return () => {
        svg.on('.zoom', null);
      };
    }, 10);
  }, [svgCode]);

  // Zoom control handlers
  const handleZoomIn = () => {
    if (!containerRef.current || !zoomRef.current) return;
    const svg = d3.select(containerRef.current).select('svg');
    svg.transition().duration(300).call(zoomRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!containerRef.current || !zoomRef.current) return;
    const svg = d3.select(containerRef.current).select('svg');
    svg.transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
  };

  const handleReset = () => {
    if (!containerRef.current || !zoomRef.current) return;
    const svg = d3.select(containerRef.current).select('svg');
    svg
      .transition()
      .duration(300)
      .call(zoomRef.current.transform, d3.zoomIdentity);
  };

  // Error state
  if (error) {
    return (
      <div className="p-4 border border-red-500 rounded bg-red-900/10 text-red-500 font-mono text-sm my-4">
        <strong>Mermaid Error:</strong> {error}
      </div>
    );
  }

  // Loading state
  if (!svgCode) {
    return (
      <div className="p-8 bg-surface border border-border rounded-lg animate-pulse flex flex-col items-center justify-center gap-4 my-4">
        <div className="w-16 h-16 border-4 border-border border-t-accent rounded-full animate-spin" />
        <span className="text-muted font-mono text-sm">
          Rendering diagram...
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="mermaid-viewer relative bg-surface border border-border rounded-lg p-4 my-4 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Controls Overlay */}
        {showControls && (
          <div className="absolute top-2 right-2 flex gap-2 bg-surface/95 border border-border rounded p-1 shadow-lg z-10 pointer-events-none">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-accent/10 hover:text-accent rounded transition-colors pointer-events-auto"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-accent/10 hover:text-accent rounded transition-colors pointer-events-auto"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM7 10h6"
                />
              </svg>
            </button>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-accent/10 hover:text-accent rounded transition-colors pointer-events-auto"
              title="Reset View"
              aria-label="Reset View"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            {allowModal && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 hover:bg-accent/10 hover:text-accent rounded transition-colors border-l border-border ml-1 pl-3 pointer-events-auto"
                title="Expand Full Screen"
                aria-label="Expand Full Screen"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* SVG Content */}
        <div
          className="svg-content w-full min-h-[300px]"
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </div>

      {/* Full-Screen Modal */}
      {allowModal && (
        <MermaidModal
          code={code}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          theme={isDark ? 'dark' : 'light'}
        />
      )}
    </>
  );
};

export default MermaidViewer;
