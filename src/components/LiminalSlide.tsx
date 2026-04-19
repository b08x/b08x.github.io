import React, { useMemo, useEffect, useRef } from 'react';

export interface SlideData {
  title: string;
  subtitle?: string;
  author?: string;
  content?: string;
  tags?: string[];
  date?: string;
}

interface LiminalSlideProps {
  slideData: SlideData;
  isActive: boolean;
  currentFragmentIndex: number;
  onFragmentsDetected: (count: number) => void;
}

const LiminalSlide: React.FC<LiminalSlideProps> = ({ 
  slideData, 
  isActive, 
  currentFragmentIndex,
  onFragmentsDetected 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Pre-process content to handle fragment markers if they exist as text
  const processedContent = useMemo(() => {
    if (!slideData.content) return '';
    let processed = slideData.content;
    
    // Pattern: <tag>...</tag>{: .fragment} or similar
    const tagPattern = /<([a-z0-9]+)([^>]*)>([\s\S]*?)\{:\s*\.fragment\s*\}([\s\S]*?)<\/\1>/gi;
    processed = processed.replace(tagPattern, (match, tag, attrs, before, after) => {
      const newAttrs = attrs.includes('class="')
        ? attrs.replace('class="', 'class="fragment ')
        : `${attrs} class="fragment"`;
      return `<${tag}${newAttrs}>${before}${after}</${tag}>`;
    });

    return processed;
  }, [slideData.content]);

  // Detect fragments and notify parent
  useEffect(() => {
    if (isActive && contentRef.current) {
      const fragments = contentRef.current.querySelectorAll('.fragment');
      onFragmentsDetected(fragments.length);
    }
  }, [isActive, processedContent, onFragmentsDetected]);

  // Sync fragment visibility
  useEffect(() => {
    if (isActive && contentRef.current) {
      const fragments = contentRef.current.querySelectorAll('.fragment');
      fragments.forEach((frag, i) => {
        if (i < currentFragmentIndex) {
          frag.classList.add('visible');
        } else {
          frag.classList.remove('visible');
        }
      });
    }
  }, [isActive, currentFragmentIndex]);

  if (!isActive) return null;

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-liminal-bg p-8 md:p-12 liminal-slide-container">
      <style>{`
        .liminal-slide-container {
          animation: fadeIn 0.7s ease-out forwards;
        }
        .fragment {
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .fragment.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .macro-typography {
          animation: slideUpScale 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .metadata-section {
          opacity: 0;
          animation: fadeInDown 1s ease-out 0.3s forwards;
        }
        .footer-section {
          opacity: 0;
          animation: fadeIn 1s ease-out 0.5s forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUpScale {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {/* Top Section: Metadata */}
      <div className="max-w-5xl w-full mx-auto flex justify-between items-start metadata-section">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] md:text-xs text-white/30 uppercase tracking-[0.2em]">
            {slideData.author || 'SYNC_NOTES'}
          </span>
          {slideData.date && (
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.1em]">
              {slideData.date}
            </span>
          )}
        </div>
        {slideData.tags && (
          <div className="flex gap-4">
            {slideData.tags.map((tag, i) => (
              <span key={i} className="font-mono text-[10px] text-white/30 uppercase tracking-widest border-b border-white/10 pb-1">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Middle Section: Macro Typography */}
      <div className="max-w-5xl w-full mx-auto flex-grow flex flex-col justify-center gap-8 py-20 macro-typography">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9] md:leading-[0.85] selection:bg-white selection:text-black">
          {slideData.title}
        </h1>
        {slideData.subtitle && (
          <p className="text-xl md:text-2xl lg:text-3xl text-white/50 font-sans tracking-tight max-w-2xl leading-relaxed">
            {slideData.subtitle}
          </p>
        )}
        {slideData.content && (
          <div 
            ref={contentRef}
            className="mt-4 text-white/40 font-mono text-sm md:text-base max-w-3xl leading-relaxed opacity-80" 
            dangerouslySetInnerHTML={{ __html: processedContent }} 
          />
        )}
      </div>

      {/* Bottom Section: Aesthetic Line */}
      <div className="max-w-5xl w-full mx-auto border-t border-white/5 pt-8 footer-section">
        <div className="w-12 h-[1px] bg-accent/50" />
      </div>
    </div>
  );
};

export default LiminalSlide;
