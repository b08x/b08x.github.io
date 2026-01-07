import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  path: string;
  label: string;
}

interface Edge extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

const GraphView: React.FC = () => {
  const [data, setData] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedData, setCalculatedData] = useState<{ nodes: Node[], edges: Edge[] } | null>(null);


  // Constants
  const MINIMAL_NODE_SIZE = 8;
  const MAX_NODE_SIZE = 12;
  const ACTIVE_RADIUS_FACTOR = 1.5;
  const STROKE = 1;
  const FONT_SIZE = 14;
  const TICKS = 200;
  const FONT_BASELINE = 25;
  const MAX_LABEL_LENGTH = 30;

  // 1. Fetch Data
  useEffect(() => {
    console.log('[GraphView] Starting fetch for /graph.json');
    fetch('/graph.json')
      .then(res => {
        console.log('[GraphView] Response received:', res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text(); // Get text first to debug parsing
      })
      .then(text => {
        console.log('[GraphView] Data length:', text.length);
        try {
          const json = JSON.parse(text);
          setData(json);
        } catch (e) {
          throw new Error('Invalid JSON response');
        }
      })
      .catch(err => {
        console.error("[GraphView] Fetch failed:", err);
        setError(err.message);
      });
  }, []);

  // 2. Handle Resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          setDimensions({
            width: entry.contentRect.width,
            height: window.innerHeight * 0.6
          });
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // 3. Render D3 Graph
  useEffect(() => {
    if (!data || !svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear for re-render

    const { width, height } = dimensions;

    // Clear previous simulation results and show loading
    setIsCalculating(true);

    // Initialize worker if not exists
    if (!workerRef.current) {
      console.log('[GraphView] Initializing worker...');
      workerRef.current = new Worker('/assets/js/dist/graph.worker.js');
    }

    const worker = workerRef.current;

    worker.onmessage = (event) => {
      console.log('[GraphView] Worker message received:', event.data);
      const { nodes: calculatedNodes, edges: calculatedEdges, error: workerError } = event.data;

      if (workerError) {
        console.error('[GraphView] Worker reported error:', workerError);
        setError(workerError);
        setIsCalculating(false);
        return;
      }

      setCalculatedData({ nodes: calculatedNodes, edges: calculatedEdges });
      setIsCalculating(false);
    };

    worker.onerror = (err) => {
      console.error('[GraphView] Worker error:', err);
      setError(`Worker error: ${err.message || 'Unknown error'}`);
      setIsCalculating(false);
    };

    console.log('[GraphView] Posting data to worker...', { nodeCount: data.nodes.length, edgeCount: data.edges.length });

    worker.postMessage({
      nodes: data.nodes.map(d => ({ ...d })),
      edges: data.edges.map(d => ({ ...d })),
      width,
      height,
      ticks: TICKS
    });

    return () => {
      // Clear message handlers
      if (workerRef.current) {
        workerRef.current.onmessage = null;
        workerRef.current.onerror = null;
      }
    };
  }, [dimensions, data]);

  // Handle Rendering separately
  useEffect(() => {
    if (calculatedData && svgRef.current && !isCalculating) {
      console.log('[GraphView] Rendering graph with calculated data');
      renderGraph(calculatedData.nodes, calculatedData.edges);
    }
  }, [calculatedData, dimensions, isCalculating]);

  // Clean up worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        console.log('[GraphView] Terminating worker on unmount');
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const renderGraph = (nodes: Node[], edges: Edge[]) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear for re-render

    const { width, height } = dimensions;

    // Helper to calculate node weight
    const getNodeSize = (id: string) => {
      const connections = edges.filter(e =>
        (typeof e.source === 'string' ? e.source === id : (e.source as Node).id === id) ||
        (typeof e.target === 'string' ? e.target === id : (e.target as Node).id === id)
      ).length;
      let weight = 3 * Math.sqrt(connections + 1);
      return Math.max(MINIMAL_NODE_SIZE, Math.min(MAX_NODE_SIZE, weight));
    };

    const g = svg.append('g');

    // Zoom Handling
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Helper to check if a node is isolated (no connections)
    const isNodeIsolated = (id: string) =>
      !edges.some(e =>
        (typeof e.source === 'string' ? e.source === id : (e.source as Node).id === id) ||
        (typeof e.target === 'string' ? e.target === id : (e.target as Node).id === id)
      );


    // Links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', 'var(--border)')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', STROKE);

    // Nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', d => getNodeSize(d.id))
      .attr('fill', d => window.location.pathname.includes(d.path) ? 'var(--accent)' : 'var(--muted)')
      .attr('stroke', d => isNodeIsolated(d.id) ? 'var(--accent)' : 'none')
      .attr('stroke-width', d => isNodeIsolated(d.id) ? 2 : 0)
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        window.location.href = d.path;
      });

    // Labels
    const label = g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text(d => d.label.length > MAX_LABEL_LENGTH ? d.label.substring(0, MAX_LABEL_LENGTH) + '...' : d.label)
      .attr('font-size', FONT_SIZE)
      .attr('font-family', 'var(--font-mono)')
      .attr('fill', 'var(--foreground)')
      .attr('text-anchor', 'middle')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        window.location.href = d.path;
      });

    // Hover Effects
    node.on('mouseover', function (event, d) {
      const neighbors = new Set([d.id]);
      edges.forEach(e => {
        const sId = typeof e.source === 'string' ? e.source : e.source.id;
        const tId = typeof e.target === 'string' ? e.target : e.target.id;
        if (sId === d.id) neighbors.add(tId);
        if (tId === d.id) neighbors.add(sId);
      });

      node.style('opacity', n => neighbors.has(n.id) ? 1 : 0.2);
      label.style('opacity', n => neighbors.has(n.id) ? 1 : 0.2);
      link.style('opacity', l => {
        const sId = typeof l.source === 'string' ? l.source : l.source.id;
        const tId = typeof l.target === 'string' ? l.target : l.target.id;
        return sId === d.id || tId === d.id ? 1 : 0.1;
      });
      d3.select(this).attr('r', getNodeSize(d.id) * ACTIVE_RADIUS_FACTOR);
    }).on('mouseout', function (event, d) {
      node.style('opacity', 1);
      label.style('opacity', 1);
      link.style('opacity', 0.6);
      d3.select(this).attr('r', getNodeSize(d.id));
    });

    // Initial Ticks (Removed as we run them in the worker)
    // for (let i = 0; i < TICKS; i++) simulation.tick();

    // Position elements
    link
      .attr('x1', d => (d.source as Node).x!)
      .attr('y1', d => (d.source as Node).y!)
      .attr('x2', d => (d.target as Node).x!)
      .attr('y2', d => (d.target as Node).y!);

    node
      .attr('cx', d => d.x!)
      .attr('cy', d => d.y!);

    label
      .attr('x', d => d.x!)
      .attr('y', d => d.y! - FONT_BASELINE);
  };

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center border border-red-500 rounded-lg bg-red-900/10 text-red-500 font-mono">
        Error loading graph: {error}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-surface border border-border rounded-lg overflow-hidden relative min-h-[300px]">

      {(isCalculating || !data) && (
        <div className="absolute inset-0 z-10 bg-surface/50 backdrop-blur-sm flex items-center justify-center">
          <span className="text-muted font-mono animate-pulse">
            {!data ? 'Loading Graph Data...' : 'Calculating Graph Positions...'}
          </span>
        </div>
      )}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className={`cursor-move transition-opacity duration-300 ${isCalculating ? 'opacity-20' : 'opacity-100'}`}
      />
    </div>
  );
};

export default GraphView;