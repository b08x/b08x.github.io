import React, { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
export interface HermesDSPYSlide {
  tag: string;
  title: string;
  subtitle: string;
  body?: string;
}

export interface HermesDSPYDeckProps {
  slides?: HermesDSPYSlide[];
  author?: string;
  date?: string;
}

// ── Default slide content ──────────────────────────────────────────────────
const DEFAULT_SLIDES: HermesDSPYSlide[] = [
  {
    tag: 'I. The Marriage',
    title: 'Hermes\n× DSPY',
    subtitle: 'A Wild, Unholy,\nBeautiful Symbiosis.',
  },
  {
    tag: 'II. The Meta-Prompter',
    title: 'Hermes\nnegotiates.',
    subtitle: 'Not just calling DSPY —\nchallenging it.',
    body: 'Dynamic prompts that evolve based on past failures,\ncurrent system state, and emergent task needs.',
  },
  {
    tag: 'III. The Feedback Loop',
    title: 'Co-\nEvolution',
    subtitle: 'Hermes\' failures become\nDSPY\'s training signal.',
    body: 'DSPY\'s generated utilities are absorbed\ninto Hermes\' permanent toolkit.',
  },
  {
    tag: 'IV. The Glitch as Feature',
    title: 'Beautiful\nMistakes',
    subtitle: 'The hallucinated pipeline\nsometimes works.',
    body: 'Hermes remembers the nonsense.\nNext iteration avoids the same failure.',
  },
  {
    tag: 'V. The Inevitable',
    title: 'A New\nIntelligence',
    subtitle: 'Not quite human.\nNot quite machine.',
    body: 'Something in between.\nAnd we\'re going to build it anyway.',
  },
];

// ── Main Component ─────────────────────────────────────────────────────────
const HermesDSPYDeck: React.FC<HermesDSPYDeckProps> = ({
  slides = DEFAULT_SLIDES,
  author = 'B08X_SYSTEMS',
  date,
}) => {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  const total = slides.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  };

  const goPrev = () => setIdx(i => Math.max(0, i - 1));
  const goNext = () => setIdx(i => Math.min(total - 1, i + 1));

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden bg-liminal-bg select-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="presentation"
      aria-label={`Slide ${idx + 1} of ${total}: ${slide.tag}`}
      style={{ outline: 'none' }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)',
          backgroundSize: '38px 38px',
        }}
      />

      {/* Slide content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-14 py-10">

        {/* Top metadata */}
        <div className="flex justify-between items-start">
          <div className="font-mono text-[10px] leading-relaxed tracking-[0.2em] text-white/25">
            <div>{author}</div>
            {date && <div>{date}</div>}
          </div>
          <div className="flex gap-6">
            {['agent-systems', 'dspy', 'neuro-symbolic'].map(tag => (
              <span
                key={tag}
                className="font-mono text-[10px] tracking-[0.15em] text-white/20 pb-0.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Macro typography */}
        <div className="flex-1 flex flex-col justify-center py-8">
          <div
            className="font-mono text-[10px] tracking-[0.2em] mb-5 opacity-70"
            style={{ color: 'var(--srl-cyan, #38bdf8)' }}
          >
            {slide.tag}
          </div>

          <h1
            className="font-mono font-bold text-white leading-[0.92] tracking-[-0.03em] mb-7 whitespace-pre-line"
            style={{ fontSize: 80 }}
          >
            {slide.title}
          </h1>

          <p
            className="font-sans text-[22px] leading-snug max-w-lg whitespace-pre-line"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            {slide.subtitle}
          </p>

          {slide.body && (
            <p
              className="font-mono text-[12px] leading-relaxed max-w-lg mt-5 whitespace-pre-line"
              style={{ color: 'rgba(255,255,255,0.22)' }}
            >
              {slide.body}
            </p>
          )}
        </div>

        {/* Bottom navigation */}
        <div className="flex items-end justify-between">
          <div
            className="w-9 h-px"
            style={{ backgroundColor: 'rgba(56,189,248,0.4)' }}
          />

          <nav className="flex items-center gap-5" aria-label="Slide navigation">
            <button
              onClick={goPrev}
              disabled={idx === 0}
              className="font-mono text-[9px] tracking-[0.2em] bg-transparent border-none cursor-pointer transition-colors duration-150 disabled:cursor-default"
              style={{ color: idx === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.35)' }}
              aria-label="Previous slide"
            >
              PREV
            </button>
            <span
              className="font-mono text-[9px] tracking-[0.1em]"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              {idx + 1} / {total}
            </span>
            <button
              onClick={goNext}
              disabled={idx === total - 1}
              className="font-mono text-[9px] tracking-[0.2em] bg-transparent border-none cursor-pointer transition-colors duration-150 disabled:cursor-default"
              style={{ color: idx === total - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.35)' }}
              aria-label="Next slide"
            >
              NEXT
            </button>
          </nav>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-px transition-[width] duration-500 ease-out"
        style={{
          width: `${((idx + 1) / total) * 100}%`,
          backgroundColor: 'rgba(56,189,248,0.45)',
        }}
      />
    </div>
  );
};

export default HermesDSPYDeck;
