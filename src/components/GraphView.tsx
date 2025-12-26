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
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: window.innerHeight * 0.6
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 3. Render D3 Graph
  useEffect(() => {
    if (!data || !svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear for re-render

    const { width, height } = dimensions;
    // Clone data to prevent D3 from mutating the state directly on re-renders
    const nodes = data.nodes.map(d => ({ ...d }));
    const edges = data.edges.map(d => ({ ...d }));

    // Helper to calculate node weight
    const getNodeSize = (id: string) => {
      const connections = edges.filter(e =>
        (typeof e.source === 'string' ? e.source === id : e.source.id === id) ||
        (typeof e.target === 'string' ? e.target === id : e.target.id === id)
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

    // Simulation Setup
    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Edge>(edges).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(80));

    // Helper to check if a node is isolated (no connections)
    const isNodeIsolated = (id: string) =>
      !edges.some(e =>
        (typeof e.source === 'string' ? e.source === id : e.source.id === id) ||
        (typeof e.target === 'string' ? e.target === id : e.target.id === id)
      );

    // Position isolated nodes in a circle around the edge
    const isolatedNodes = nodes.filter(n => isNodeIsolated(n.id));
    if (isolatedNodes.length > 0) {
      const radius = Math.min(width, height) / 2.5;
      const angleStep = (2 * Math.PI) / isolatedNodes.length;
      isolatedNodes.forEach((node, i) => {
        node.fx = width / 2 + radius * Math.cos(i * angleStep);
        node.fy = height / 2 + radius * Math.sin(i * angleStep);
      });
    }


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

    simulation.on('tick', () => {
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
    });

    // Run simulation
    for (let i = 0; i < TICKS; i++) simulation.tick();

  }, [dimensions, data]);

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center border border-red-500 rounded-lg bg-red-900/10 text-red-500 font-mono">
        Error loading graph: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div ref={containerRef} className="w-full h-96 bg-surface animate-pulse flex items-center justify-center border border-border rounded-lg">
        <span className="text-muted font-mono">Loading Graph Data...</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full bg-surface border border-border rounded-lg overflow-hidden my-8">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="cursor-move"
      />
    </div>
  );
};

export default GraphView;