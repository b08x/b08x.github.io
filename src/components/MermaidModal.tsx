import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import * as d3 from 'd3';
import { initMermaid } from '../utils/mermaidTheme';

interface MermaidModalProps {
  code: string;
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

const MermaidModal: React.FC<MermaidModalProps> = ({
  code,
  isOpen,
  onClose,
  theme,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCode, setSvgCode] = useState<string>('');
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Render diagram
  useEffect(() => {
    if (!isOpen) return;

    const renderDiagram = async () => {
      try {
        initMermaid(theme === 'dark');
        const { svg } = await mermaid.render(
          `mermaid-modal-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          code
        );
        setSvgCode(svg);
      } catch (err) {
        console.error('[MermaidModal] Render error:', err);
      }
    };

    renderDiagram();
  }, [code, theme, isOpen]);

  // Setup zoom/pan with enhanced range for modal
  useEffect(() => {
    if (!containerRef.current || !svgCode || !isOpen) return;

    // Wait a tick for DOM to update
    setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const svg = d3.select(container).select('svg');
      if (svg.empty()) {
        console.warn('[MermaidModal] SVG not found in container');
        return;
      }

      const svgNode = svg.node() as SVGSVGElement;
      if (!svgNode) return;

      console.log('[MermaidModal] Setting up zoom for SVG:', svgNode);

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

        console.log('[MermaidModal] Created zoom wrapper, moved', children.length, 'children');
      }

      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 8]) // Enhanced zoom range for modal
        .on('zoom', (event) => {
          zoomGroup.attr('transform', event.transform.toString());
        });

      svg.call(zoom);
      zoomRef.current = zoom;

      console.log('[MermaidModal] Zoom behavior attached');

      return () => {
        svg.on('.zoom', null);
      };
    }, 10);
  }, [svgCode, isOpen]);

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

  const handleExportSVG = () => {
    if (!svgCode) return;

    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mermaid-diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[95vw] h-[95vh] bg-surface border border-accent rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with controls */}
        <div className="flex items-center justify-between p-4 bg-surface/95 border-b border-border z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted">Diagram Inspector</span>
            <div className="flex gap-1 ml-4">
              <button
                onClick={handleZoomIn}
                className="px-3 py-1.5 text-xs font-mono hover:bg-accent/10 hover:text-accent rounded transition-colors border border-border"
                title="Zoom In (+)"
              >
                Zoom In
              </button>
              <button
                onClick={handleZoomOut}
                className="px-3 py-1.5 text-xs font-mono hover:bg-accent/10 hover:text-accent rounded transition-colors border border-border"
                title="Zoom Out (-)"
              >
                Zoom Out
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-mono hover:bg-accent/10 hover:text-accent rounded transition-colors border border-border"
                title="Reset (0)"
              >
                Reset
              </button>
              <button
                onClick={handleExportSVG}
                className="px-3 py-1.5 text-xs font-mono hover:bg-accent/10 hover:text-accent rounded transition-colors border border-border ml-2"
                title="Export SVG"
              >
                Export SVG
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted font-mono">
              ESC to close • +/- to zoom • 0 to reset
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:text-accent transition-colors"
              title="Close (Esc)"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* SVG Container */}
        <div className="flex-1 overflow-hidden">
          {svgCode ? (
            <div
              ref={containerRef}
              className="w-full h-full flex items-center justify-center p-8 cursor-grab active:cursor-grabbing overflow-hidden"
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 border-4 border-border border-t-accent rounded-full animate-spin" />
              <span className="text-muted font-mono text-sm">
                Rendering diagram...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MermaidModal;
