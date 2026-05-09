import React, { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
export interface EntangledNode {
  title: string;
  date: string;
  sim: number;
  recall: number;
  entropy: number;
  url?: string;
}

export interface SRLRightPaneProps {
  nodes?: EntangledNode[];
  expandGraph?: boolean;
}

// ── Topology SVG minimap ───────────────────────────────────────────────────
interface TopoNode {
  x: number; y: number; r: number; color: string; pulse: boolean;
}

const TOPO_NODES: TopoNode[] = [
  { x: 100, y: 80,  r: 9, color: 'var(--srl-cyan)',    pulse: true  },
  { x: 168, y: 50,  r: 6, color: 'var(--srl-cyan)',    pulse: false },
  { x: 42,  y: 48,  r: 6, color: 'var(--srl-emerald)', pulse: false },
  { x: 172, y: 118, r: 5, color: 'var(--srl-emerald)', pulse: false },
  { x: 58,  y: 120, r: 4, color: 'var(--muted)',        pulse: false },
  { x: 128, y: 148, r: 4, color: 'var(--muted)',        pulse: false },
  { x: 210, y: 82,  r: 3, color: 'var(--muted)',        pulse: false },
  { x: 28,  y: 88,  r: 3, color: 'var(--muted)',        pulse: false },
  { x: 140, y: 28,  r: 3, color: 'var(--muted)',        pulse: false },
];

const TOPO_EDGES: [number, number][] = [
  [0,1],[0,2],[0,3],[0,4],[1,6],[1,8],[2,5],[3,4],[2,7],
];

const TopologyMap: React.FC<{ expanded: boolean }> = ({ expanded }) => {
  const h = expanded ? 180 : 120;
  return (
    <div
      className="border-t shrink-0"
      style={{ borderColor: 'var(--srl-border2)', backgroundColor: '#050505' }}
    >
      <div
        className="px-2.5 py-1.5 border-b font-mono text-[9px] text-muted tracking-[0.15em] uppercase"
        style={{ borderColor: 'var(--srl-border2)' }}
      >
        Local Topology · 72h recall
      </div>
      <svg
        width="100%"
        viewBox={`0 0 240 ${h}`}
        style={{ display: 'block', height: h }}
        aria-label="Local knowledge graph topology"
        role="img"
      >
        {TOPO_EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={TOPO_NODES[a].x} y1={TOPO_NODES[a].y}
            x2={TOPO_NODES[b].x} y2={TOPO_NODES[b].y}
            stroke="var(--border)" strokeWidth={0.8} opacity={0.5}
          />
        ))}
        {TOPO_NODES.map((n, i) => (
          <g key={i}>
            {n.pulse && (
              <circle cx={n.x} cy={n.y} r={n.r + 4} fill="none"
                stroke={n.color} strokeWidth={0.8} opacity={0.3}>
                <animate attributeName="r"
                  values={`${n.r + 3};${n.r + 10};${n.r + 3}`}
                  dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity"
                  values="0.3;0;0.3"
                  dur="2.8s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              cx={n.x} cy={n.y} r={n.r}
              fill={n.color} opacity={n.pulse ? 1 : 0.45}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

// ── Node Card ──────────────────────────────────────────────────────────────
const NodeCard: React.FC<{ node: EntangledNode; compact?: boolean }> = ({ node, compact }) => {
  const [hovered, setHovered] = useState(false);
  const simColor =
    node.sim > 0.90 ? 'var(--srl-cyan)'
    : node.sim > 0.80 ? 'var(--srl-emerald)'
    : 'var(--muted)';

  return (
    <a
      href={node.url ?? '#'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderColor: hovered ? 'var(--border)' : 'var(--srl-border2)',
        backgroundColor: hovered ? 'rgba(56,189,248,0.04)' : 'transparent',
      }}
      className="block p-2 border mb-0.5 transition-all duration-150 no-underline"
    >
      <div className="flex items-start gap-1.5 mb-1">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0 mt-[3px] transition-shadow duration-150"
          style={{
            backgroundColor: simColor,
            boxShadow: hovered ? `0 0 5px ${simColor}` : 'none',
          }}
        />
        <span
          className="font-mono text-[10px] leading-snug transition-colors duration-150"
          style={{ color: hovered ? 'var(--foreground)' : 'var(--muted)' }}
        >
          {node.title}
        </span>
      </div>
      {!compact && (
        <div className="flex gap-3 pl-3 font-mono text-[9px]">
          <span style={{ color: simColor }}>sim {node.sim.toFixed(2)}</span>
          <span className="text-muted">rec {node.recall}</span>
          <span style={{ color: node.entropy > 0.5 ? 'var(--srl-rose)' : 'var(--muted)' }}>
            ent {node.entropy.toFixed(2)}
          </span>
        </div>
      )}
    </a>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const DEFAULT_NODES: EntangledNode[] = [
  { title: 'Neuro-Symbolic RAG Hybrid Design', date: '2026-04-12', sim: 0.96, recall: 21, entropy: 0.29 },
  { title: 'DSPY Tool Adaptation Patterns',    date: '2026-04-19', sim: 0.91, recall: 14, entropy: 0.33 },
  { title: 'Graph Ontology — Ansible Infra',   date: '2026-02-07', sim: 0.87, recall: 9,  entropy: 0.41 },
  { title: 'SFL Prompt Analysis — Flaws',      date: '2026-01-08', sim: 0.81, recall: 6,  entropy: 0.55 },
  { title: 'Context Drift Apocalypse (Notes)', date: '2026-03-22', sim: 0.74, recall: 3,  entropy: 0.63 },
];

const SRLRightPane: React.FC<SRLRightPaneProps> = ({
  nodes = DEFAULT_NODES,
  expandGraph = false,
}) => {
  return (
    <aside
      className="w-[232px] shrink-0 border-l border-border flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--srl-bg-deep)' }}
      aria-label="Associative Insight Pane"
    >
      <div
        className="px-2.5 py-3.5 border-b font-mono text-[9px] text-muted tracking-[0.2em] uppercase shrink-0"
        style={{ borderColor: 'var(--srl-border2)' }}
      >
        Associative Insight
      </div>

      {/* Node list */}
      <div
        className={`p-2 scrollbar-thin ${expandGraph ? 'overflow-hidden' : 'flex-1 overflow-y-auto'}`}
      >
        <div
          className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] font-bold mb-2.5"
          style={{ color: 'var(--srl-cyan)' }}
        >
          <span>⦿</span>
          <span>Entangled Nodes</span>
        </div>
        {nodes.map((n, i) => (
          <NodeCard
            key={i}
            node={n}
            compact={expandGraph && i > 2}
          />
        ))}
      </div>

      {/* Topology minimap — pinned to bottom */}
      <TopologyMap expanded={expandGraph} />
    </aside>
  );
};

export default SRLRightPane;
