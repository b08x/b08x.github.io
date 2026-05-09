import React, { useState, useEffect, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
export type SRLFeature = 'search' | 'video' | 'prose';

export interface SRLCenterStageProps {
  title: string;
  noteId?: string;
  date?: string;
  tags?: string[];
  content?: string; // rendered HTML from Jekyll
  videoUrl?: string;
  feature: SRLFeature;
  tenorLevel: number;
}

// ── Ghost search results (replace with real ck API call if available) ──────
const GHOST_RESULTS = [
  { title: 'Hermes × DSPY: The Meta-Prompter Layer', score: '0.96', type: 'NOTE' },
  { title: 'Neuro-Symbolic RAG Hybrid — Design Notes', score: '0.91', type: 'NOTE' },
  { title: 'Graph Ontology — Ansible Infrastructure',  score: '0.87', type: 'NOTE' },
  { title: 'SFL Prompt Analysis — Structural Flaws',   score: '0.81', type: 'PROMPT' },
  { title: 'ruby_llm: embed() method — source review', score: '0.74', type: 'CODE' },
];

const RESULT_COLORS: Record<string, string> = {
  NOTE: 'var(--srl-cyan)',
  PROMPT: 'var(--srl-rose)',
  CODE: 'var(--srl-emerald)',
};

// ── Video annotations ──────────────────────────────────────────────────────
const ANNOTATIONS = [
  { time: 8,  text: 'ck --scores: semantic_sim=0.847 · entangled: "Hermes×DSPY Meta-Layer" (0.96)', type: 'score' },
  { time: 22, text: 'DSPY writes tool on-the-fly: graph-diff utility · Hermes absorbs it into toolkit', type: 'code' },
  { time: 41, text: 'Hallucination detected: neuro-symbolic RAG chimera partially functional · logged', type: 'warn' },
  { time: 60, text: 'ck --scores: recall_72h=21 · entropy=0.41 · drift detected from base cluster', type: 'score' },
];

const fmtTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ── Search Bar ─────────────────────────────────────────────────────────────
const SearchBar: React.FC<{ expanded: boolean }> = ({ expanded }) => {
  const [query, setQuery] = useState(expanded ? 'self-modifying agent hermes dspy' : '');

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 px-3.5 py-2.5 transition-colors duration-200"
        style={{
          border: `1px solid ${expanded ? 'var(--srl-cyan)' : 'var(--border)'}`,
          backgroundColor: 'var(--srl-bg-deep)',
        }}
      >
        <span className="font-mono text-[11px] shrink-0" style={{ color: 'var(--srl-cyan)' }}>
          ck --sem
        </span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="semantic inference query…"
          className="flex-1 bg-transparent border-none outline-none font-mono text-[12px] text-foreground placeholder:text-muted/50"
          style={{ caretColor: 'var(--srl-cyan)' }}
          aria-label="Semantic search"
        />
        <kbd className="font-mono text-[10px] text-muted">⌘K</kbd>
      </div>

      {expanded && (
        <div
          className="absolute top-full left-0 right-0 z-20 border border-t-0"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          {GHOST_RESULTS.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3.5 py-2 cursor-pointer transition-colors duration-100"
              style={{ borderBottom: i < GHOST_RESULTS.length - 1 ? '1px solid var(--srl-border2)' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span
                className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] tracking-[0.08em]"
                style={{
                  border: `1px solid ${RESULT_COLORS[r.type]}33`,
                  backgroundColor: `${RESULT_COLORS[r.type]}0d`,
                  color: RESULT_COLORS[r.type],
                }}
              >
                {r.type}
              </span>
              <span className="font-mono text-[11px] text-muted flex-1">{r.title}</span>
              <span className="font-mono text-[10px]" style={{ color: 'var(--srl-cyan)' }}>
                {r.score}
              </span>
            </div>
          ))}
          <div
            className="px-3.5 py-1.5 font-mono text-[9px] text-muted tracking-[0.06em] border-t"
            style={{ borderColor: 'var(--srl-border2)' }}
          >
            Ghost results · semantic similarity · not keyword matched
          </div>
        </div>
      )}
    </div>
  );
};

// ── Video Island ───────────────────────────────────────────────────────────
const VideoIsland: React.FC<{ taller: boolean; url?: string }> = ({ taller, url }) => {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(34);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { setPlaying(false); return 0; }
          return p + 0.35;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const currentTime = Math.round(progress * 0.87);
  const active = ANNOTATIONS.find(a => Math.abs(a.time - currentTime) < 5);
  const annotColor = active
    ? active.type === 'score' ? 'var(--srl-cyan)'
    : active.type === 'code' ? 'var(--srl-emerald)'
    : 'var(--srl-rose)'
    : null;

  return (
    <div className="border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--srl-bg-deep)' }}>
      {/* Placeholder canvas */}
      <div
        className="relative overflow-hidden flex items-center justify-center"
        style={{ height: taller ? 220 : 150, backgroundColor: '#050505' }}
      >
        <div
          className="absolute inset-0 opacity-80 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 32px, #0a0a0a 32px, #0a0a0a 33px)',
          }}
        />
        <div className="relative z-10 text-center">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-muted hover:text-foreground transition-colors tracking-[0.1em]"
            >
              {url}
            </a>
          ) : (
            <span className="font-mono text-[10px] text-muted tracking-[0.1em]">
              VIDEO · syncopated-notes
            </span>
          )}
          {playing && (
            <div className="mt-1.5 font-mono text-[9px]" style={{ color: 'var(--srl-cyan)', opacity: 0.6 }}>
              ● LIVE
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="px-3 py-2 border-t" style={{ borderColor: 'var(--srl-border2)' }}>
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setPlaying(p => !p)}
            className="w-[22px] h-[22px] border flex items-center justify-center font-mono text-[11px] cursor-pointer bg-transparent transition-colors duration-150"
            style={{ borderColor: 'rgba(56,189,248,0.4)', color: 'var(--srl-cyan)' }}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <span className="font-mono text-[10px] text-muted w-9 shrink-0">{fmtTime(currentTime)}</span>

          {/* Scrubber */}
          <div
            className="flex-1 h-0.5 relative cursor-pointer"
            style={{ backgroundColor: 'var(--border)' }}
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress(((e.clientX - rect.left) / rect.width) * 100);
            }}
            role="slider"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
          >
            {ANNOTATIONS.map((a, i) => (
              <div
                key={i}
                className="absolute -top-0.5 w-0.5 h-1.5"
                style={{
                  left: `${(a.time / 87) * 100}%`,
                  backgroundColor:
                    a.type === 'score' ? 'var(--srl-cyan)'
                    : a.type === 'code' ? 'var(--srl-emerald)'
                    : 'var(--srl-rose)',
                  opacity: 0.6,
                }}
              />
            ))}
            <div
              className="absolute inset-y-0 left-0 transition-[width]"
              style={{ width: `${progress}%`, backgroundColor: 'var(--srl-cyan)', transitionDuration: '0.1s' }}
            />
          </div>
          <span className="font-mono text-[10px] text-muted">1:27</span>
        </div>

        {/* Stutter annotation — only in taller (video feature) mode */}
        {taller && (
          <div
            className="min-h-[48px] px-2.5 py-2 border transition-all duration-200"
            style={{
              borderColor: annotColor ? `${annotColor}33` : 'var(--srl-border2)',
              backgroundColor: annotColor ? `${annotColor}07` : 'transparent',
            }}
          >
            {active ? (
              <p className="font-mono text-[10px] leading-relaxed m-0" style={{ color: annotColor ?? 'inherit' }}>
                <span className="opacity-50 mr-2">@{fmtTime(active.time)}</span>
                {active.text}
              </p>
            ) : (
              <p className="font-mono text-[10px] text-muted opacity-30 m-0">
                — no annotation at this timestamp —
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Semantic callout block ─────────────────────────────────────────────────
interface CalloutProps { score: string; nodes: string; entropy: string; color: string; }

const SemanticCallout: React.FC<CalloutProps> = ({ score, nodes, entropy, color }) => (
  <div
    className="my-3.5 px-3 py-2"
    style={{
      border: `1px solid ${color}22`,
      borderLeftWidth: 2,
      borderLeftColor: color,
      backgroundColor: `${color}06`,
    }}
  >
    <div className="font-mono text-[9px] mb-1 tracking-[0.1em]" style={{ color }}>
      ck --scores
    </div>
    <div className="flex gap-5 font-mono text-[9px] text-muted">
      <span>semantic_sim <span className="text-foreground">{score}</span></span>
      <span>nodes <span className="text-foreground">{nodes}</span></span>
      <span>entropy <span className="text-foreground">{entropy}</span></span>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const SRLCenterStage: React.FC<SRLCenterStageProps> = ({
  title, noteId, date, tags = [], content,
  videoUrl, feature, tenorLevel,
}) => {
  const isRaw = tenorLevel < 30;
  const isFormal = tenorLevel > 70;

  return (
    <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
      {/* Search bar row */}
      <div
        className="px-[18px] py-3 border-b relative z-10 shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <SearchBar expanded={feature === 'search'} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-6">

        {/* Macro title — Liminal-influenced */}
        <header className="mb-7">
          <div className="flex items-center gap-4 font-mono text-[9px] text-muted tracking-[0.2em] mb-2.5">
            <span>NOTE</span>
            {date && <span>{date}</span>}
            {noteId && <span style={{ color: 'var(--srl-cyan)' }}>{noteId}</span>}
          </div>

          <h1
            className="font-mono font-bold leading-[1.05] tracking-[-0.02em] text-foreground mb-3"
            style={{ fontSize: 38 }}
            dangerouslySetInnerHTML={{ __html: title }}
          />

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map(t => (
                <span
                  key={t}
                  className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] tracking-[0.06em]"
                  style={{
                    border: '1px solid var(--srl-border2)',
                    color: 'var(--muted)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Register badge */}
        {(isRaw || isFormal) && (
          <div
            className="font-mono text-[9px] mb-3.5 px-2.5 py-1.5 tracking-[0.12em] inline-block"
            style={{
              border: `1px solid ${isFormal ? 'var(--srl-rose)' : 'var(--border)'}22`,
              color: isFormal ? 'var(--srl-rose)' : 'var(--muted)',
            }}
          >
            REGISTER: {isFormal ? 'ARCHITECTURAL' : 'RAW'} ·{' '}
            {isFormal ? 'synthesis mode active' : 'unedited stream'}
          </div>
        )}

        {/* Video — hidden when search is the focal feature */}
        {feature !== 'search' && (
          <div className="mb-5">
            <VideoIsland taller={feature === 'video'} url={videoUrl} />
          </div>
        )}

        {/* Jekyll-rendered content or prose placeholder */}
        {feature !== 'search' && (
          content ? (
            // Rendered HTML from Jekyll — article prose styles apply via Tailwind typography
            <article
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            // Fallback synthetic prose (remove once real content is wired)
            <div className="font-sans text-[13px] text-muted leading-[1.75]">
              <SemanticCallout score="0.964" nodes="18" entropy="0.29" color="var(--srl-cyan)" />
              <p className="my-3 text-foreground">
                {isRaw
                  ? `ok so this isn't about APIs or YAML configs. it's about what happens when you shove hermes into dspy...`
                  : `The fusion of Hermes' cross-session memory with DSPY's self-improving code generation produces a system where the pipeline stops being a static tool and becomes a living conversation.`
                }
              </p>
              <SemanticCallout score="0.831" nodes="11" entropy="0.47" color="var(--srl-emerald)" />
            </div>
          )
        )}

        {/* When search is active, show empty state */}
        {feature === 'search' && (
          <div
            className="mt-10 pt-5 border-t font-mono text-[11px] text-muted tracking-[0.06em]"
            style={{ borderColor: 'var(--border)' }}
          >
            SELECT A RESULT ABOVE TO OPEN NOTE
          </div>
        )}
      </div>
    </main>
  );
};

export default SRLCenterStage;
