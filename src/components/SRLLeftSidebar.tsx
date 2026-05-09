import React, { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
export interface SRLLeftSidebarProps {
  activeDomain: string | null;
  onDomainChange: (domain: string | null) => void;
  activeRegister: string;
  onRegisterChange: (register: string) => void;
  activeMode: string | null;
  onModeChange: (mode: string | null) => void;
  tenorLevel: number;
  onTenorChange: (level: number) => void;
}

// ── Constants ──────────────────────────────────────────────────────────────
const FIELD_DOMAINS = [
  'Neuro-Symbolic Integration',
  'Linux Audio Phase Mgmt',
  'Ansible Infrastructure',
  'Linguistic Theory',
  'Ruby LLM Tooling',
  'Graph Ontology',
];

const TENOR_REGISTERS = ['Architectural', 'Heuristic', 'Experimental'];

const MODE_AFFORDANCES = [
  { label: 'Screencast', icon: '▶', key: 'screencast' },
  { label: 'Code Flux',  icon: '⌨', key: 'codeflux'  },
  { label: 'Canvas',     icon: '◈', key: 'canvas'    },
];

// ── Sub-components ─────────────────────────────────────────────────────────
interface TunerItemProps {
  label: string;
  color: string; // CSS color value, e.g. 'var(--srl-cyan)'
  active: boolean;
  onClick: () => void;
}

const TunerItem: React.FC<TunerItemProps> = ({ label, color, active, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderLeftColor: active ? color : hovered ? `${color}88` : 'var(--srl-border2)',
        backgroundColor: active ? `${color}0a` : hovered ? `${color}05` : 'transparent',
        color: active ? color : hovered ? 'var(--foreground)' : 'var(--muted)',
      }}
      className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer border-l-2 transition-all duration-150 font-mono text-[11px] leading-snug outline-none focus-visible:ring-1 focus-visible:ring-accent"
    >
      <span className="flex-1">{label}</span>
      {active && (
        <span
          className="w-1 h-1 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  );
};

interface SectionLabelProps {
  color: string;
  children: React.ReactNode;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ color, children }) => (
  <div
    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] font-bold mb-2.5"
    style={{ color }}
  >
    <span
      className="w-1.5 h-1.5 rounded-full shrink-0"
      style={{ backgroundColor: color }}
    />
    {children}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const SRLLeftSidebar: React.FC<SRLLeftSidebarProps> = ({
  activeDomain, onDomainChange,
  activeRegister, onRegisterChange,
  activeMode, onModeChange,
  tenorLevel, onTenorChange,
}) => {
  return (
    <aside
      className="w-[210px] shrink-0 border-r border-border flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--srl-bg-deep)' }}
      aria-label="SFL Controller"
    >
      {/* Header */}
      <div className="px-3 py-3.5 border-b font-mono text-[9px] text-muted tracking-[0.2em] uppercase shrink-0"
           style={{ borderColor: 'var(--srl-border2)' }}>
        SFL Controller
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-3.5 space-y-1">

        {/* FIELD — Ideational */}
        <div className="px-2.5 pb-2">
          <SectionLabel color="var(--srl-cyan)">Field</SectionLabel>
          {FIELD_DOMAINS.map(d => (
            <TunerItem
              key={d} label={d} color="var(--srl-cyan)"
              active={activeDomain === d}
              onClick={() => onDomainChange(activeDomain === d ? null : d)}
            />
          ))}
        </div>

        <div className="border-t mx-0" style={{ borderColor: 'var(--srl-border2)' }} />

        {/* TENOR — Interpersonal */}
        <div className="px-2.5 py-2">
          <SectionLabel color="var(--srl-rose)">Tenor</SectionLabel>

          {/* Register pills */}
          <div className="flex gap-1 mb-3">
            {TENOR_REGISTERS.map(r => (
              <button
                key={r}
                onClick={() => onRegisterChange(r)}
                style={{
                  borderColor: activeRegister === r ? 'var(--srl-rose)' : 'var(--border)',
                  backgroundColor: activeRegister === r ? 'var(--srl-rose-muted)' : 'transparent',
                  color: activeRegister === r ? 'var(--srl-rose)' : 'var(--muted)',
                }}
                className="flex-1 py-1 font-mono text-[9px] border rounded-none cursor-pointer transition-all duration-150 leading-none tracking-[0.04em]"
              >
                {r}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="flex justify-between font-mono text-[9px] text-muted mb-1">
            <span>LOW</span><span>HIGH</span>
          </div>
          <input
            type="range" min={0} max={100} value={tenorLevel}
            onChange={e => onTenorChange(Number(e.target.value))}
            className="w-full cursor-pointer"
            style={{ accentColor: 'var(--srl-rose)' }}
            aria-label="Tenor register level"
          />
          <div
            className="font-mono text-[9px] text-right mt-1"
            style={{ color: 'var(--srl-rose)' }}
          >
            {tenorLevel < 30 ? 'raw' : tenorLevel > 70 ? 'architectural' : 'heuristic'}
          </div>
        </div>

        <div className="border-t" style={{ borderColor: 'var(--srl-border2)' }} />

        {/* MODE — Textual */}
        <div className="px-2.5 py-2">
          <SectionLabel color="var(--srl-emerald)">Mode</SectionLabel>
          {MODE_AFFORDANCES.map(m => (
            <TunerItem
              key={m.key}
              label={`${m.icon}  ${m.label}`}
              color="var(--srl-emerald)"
              active={activeMode === m.key}
              onClick={() => onModeChange(activeMode === m.key ? null : m.key)}
            />
          ))}
        </div>

      </div>
    </aside>
  );
};

export default SRLLeftSidebar;
