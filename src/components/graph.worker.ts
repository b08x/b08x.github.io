import * as d3 from 'd3';

// Re-defining interfaces to avoid dependencies on React components
interface Node extends d3.SimulationNodeDatum {
    id: string;
    path: string;
    label: string;
}

interface Edge extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
}

interface WorkerInput {
    nodes: Node[];
    edges: Edge[];
    width: number;
    height: number;
    ticks: number;
}

self.onmessage = (event: MessageEvent<WorkerInput>) => {
    try {
        const { nodes, edges, width, height, ticks } = event.data;
        console.log('[GraphWorker] Received data:', { nodes: nodes.length, edges: edges.length, width, height, ticks });

        // Simulation Setup
        const simulation = d3.forceSimulation<Node>(nodes)
            .force('link', d3.forceLink<Node, Edge>(edges).id(d => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(80));

        // Helper to check if a node is isolated (no connections)
        const isNodeIsolated = (id: string) =>
            !edges.some(e =>
                (typeof e.source === 'string' ? e.source === id : (e.source as Node).id === id) ||
                (typeof e.target === 'string' ? e.target === id : (e.target as Node).id === id)
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

        // Run simulation
        console.log('[GraphWorker] Running simulation ticks...');
        for (let i = 0; i < ticks; i++) {
            simulation.tick();
        }
        console.log('[GraphWorker] Simulation complete.');

        console.log('[GraphWorker] Mapping edges...');
        // Send results back
        // Map sources/targets to IDs if they were objects
        const processedEdges = edges.map(e => ({
            ...e,
            source: typeof e.source === 'string' ? e.source : (e.source as Node).id,
            target: typeof e.target === 'string' ? e.target : (e.target as Node).id
        }));

        console.log('[GraphWorker] Sending message back to main thread...');
        self.postMessage({ nodes, edges: processedEdges });
        console.log('[GraphWorker] Message sent.');
    } catch (error) {
        console.error('[GraphWorker] Error:', error);
        self.postMessage({ error: error instanceof Error ? error.message : String(error) });
    }
};
