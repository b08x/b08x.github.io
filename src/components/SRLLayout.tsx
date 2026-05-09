import React, { useState, useEffect } from 'react';
import SRLLeftSidebar from './SRLLeftSidebar';
import SRLCenterStage, { SRLFeature } from './SRLCenterStage';
import SRLRightPane, { EntangledNode } from './SRLRightPane';

// ── Types ──────────────────────────────────────────────────────────────────
export interface SRLLayoutProps {
  // Content
  title: string;
  noteId?: string;
  date?: string;
  tags?: string[];
  content?: string;       // rendered HTML from Jekyll {{ content | jsonify }}
  videoUrl?: string;

  // SRL state (set from Jekyll front matter)
  feature?: SRLFeature;          // 'search' | 'video' | 'prose'
  tenorLevel?: number;           // 0–100
  activeDomain?: string;
  activeMode?: string;

  // Right pane
  entangledNodes?: EntangledNode[];
  expandGraph?: boolean;
}

// ── CSS custom properties injected once ───────────────────────────────────
// These extend _theme-variables.scss without touching it.
// Add this block to your compiled CSS or a <style> tag in base-shell.html
// instead if you prefer not to inject at runtime.
const SRL_CSS_VARS = `
  :root {
    --srl-cyan:     #38bdf8;
    --srl-rose:     #fb7185;
    --srl-emerald:  #34d399;
    --srl-bg-deep:  #0d0d0d;
    --srl-border2:  #161616;
    --srl-rose-muted: rgba(251,113,133,0.12);
  }
`;

let cssInjected = false;
function injectSRLVars() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.id = 'srl-css-vars';
  style.textContent = SRL_CSS_VARS;
  document.head.appendChild(style);
  cssInjected = true;
}

// ── Status Footer ──────────────────────────────────────────────────────────
const StatusFooter: React.FC<{ tenorLevel: number }> = ({ tenorLevel }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 4000);
    return () => clearInterval(t);
  }, []);

  const reg =
    tenorLevel < 30 ? 'RAW'
    : tenorLevel > 70 ? 'ARCHITECTURAL'
    : 'HEURISTIC';

  return (
    <footer
      className="h-[26px] flex items-center px-3.5 gap-6 font-mono text-[9px] text-muted shrink-0 border-t"
      style={{ backgroundColor: '#050505', borderColor: 'var(--border)' }}
      aria-label="Vault status"
    >
      <span style={{ color: 'var(--srl-emerald)' }}>● VAULT</span>
      <span>nodes <span className="text-foreground/70">847</span></span>
      <span>edges <span className="text-foreground/70">2,341</span></span>
      <span>ck <span className="text-foreground/70">2026-04-27</span></span>
      <span>
        register{' '}
        <span style={{ color: 'var(--srl-rose)' }}>{reg}</span>
      </span>
      <span
        className="transition-colors duration-500"
        style={{ color: tick % 2 === 0 ? 'var(--foreground)' : 'var(--muted)' }}
      >
        entropy <span>0.34</span>
      </span>
      <span className="flex-1" />
      <span>SRL v2.1</span>
    </footer>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const SRLLayout: React.FC<SRLLayoutProps> = ({
  title,
  noteId,
  date,
  tags = [],
  content,
  videoUrl,
  feature: featureProp = 'prose',
  tenorLevel: tenorProp = 45,
  activeDomain: domainProp = null,
  activeMode: modeProp = null,
  entangledNodes,
  expandGraph = false,
}) => {
  // Inject CSS vars on mount
  useEffect(() => { injectSRLVars(); }, []);

  const [activeDomain, setActiveDomain] = useState<string | null>(domainProp);
  const [activeRegister, setActiveRegister] = useState('Heuristic');
  const [activeMode, setActiveMode] = useState<string | null>(modeProp);
  const [tenorLevel, setTenorLevel] = useState(tenorProp);

  // Allow parent (e.g. Tweaks panel) to override tenorLevel
  useEffect(() => { setTenorLevel(tenorProp); }, [tenorProp]);

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden bg-liminal-bg"
      data-srl-layout="true"
    >
      {/* ── Top bar ── */}
      <div
        className="h-[34px] flex items-center px-4 gap-3.5 shrink-0 border-b"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <span
          className="font-mono text-[12px] font-bold tracking-[0.05em]"
          style={{ color: 'var(--srl-cyan)' }}
        >
          SRL
        </span>
        <span className="font-mono text-[10px] text-muted tracking-[0.08em]">
          syncopated-research-ledger
        </span>
        <div className="flex-1" />

        {activeDomain && (
          <span
            className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] tracking-[0.08em]"
            style={{
              border: '1px solid rgba(56,189,248,0.2)',
              backgroundColor: 'rgba(56,189,248,0.08)',
              color: 'var(--srl-cyan)',
            }}
          >
            {activeDomain}
          </span>
        )}
        {activeMode && (
          <span
            className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] tracking-[0.08em]"
            style={{
              border: '1px solid rgba(52,211,153,0.2)',
              backgroundColor: 'rgba(52,211,153,0.08)',
              color: 'var(--srl-emerald)',
            }}
          >
            {activeMode}
          </span>
        )}
      </div>

      {/* ── Three-column body ── */}
      <div className="flex-1 flex overflow-hidden">
        <SRLLeftSidebar
          activeDomain={activeDomain}
          onDomainChange={setActiveDomain}
          activeRegister={activeRegister}
          onRegisterChange={setActiveRegister}
          activeMode={activeMode}
          onModeChange={setActiveMode}
          tenorLevel={tenorLevel}
          onTenorChange={setTenorLevel}
        />

        <SRLCenterStage
          title={title}
          noteId={noteId}
          date={date}
          tags={tags}
          content={content}
          videoUrl={videoUrl}
          feature={featureProp}
          tenorLevel={tenorLevel}
        />

        <SRLRightPane
          nodes={entangledNodes}
          expandGraph={expandGraph}
        />
      </div>

      <StatusFooter tenorLevel={tenorLevel} />
    </div>
  );
};

export default SRLLayout;
