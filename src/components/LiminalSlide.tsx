import React from 'react';

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
}

const LiminalSlide: React.FC<LiminalSlideProps> = ({ slideData, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-liminal-bg p-8 md:p-12 transition-opacity duration-500 ease-in-out">
      {/* Top Section: Metadata */}
      <div className="max-w-5xl w-full mx-auto flex justify-between items-start">
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
      <div className="max-w-5xl w-full mx-auto flex-grow flex flex-col justify-center gap-8 py-20">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9] md:leading-[0.85]">
          {slideData.title}
        </h1>
        {slideData.subtitle && (
          <p className="text-xl md:text-2xl lg:text-3xl text-white/50 font-sans tracking-tight max-w-2xl leading-relaxed">
            {slideData.subtitle}
          </p>
        )}
        {slideData.content && (
          <div className="mt-4 text-white/40 font-mono text-sm md:text-base max-w-3xl leading-relaxed opacity-80" 
               dangerouslySetInnerHTML={{ __html: slideData.content }} />
        )}
      </div>

      {/* Bottom Section: Aesthetic Line */}
      <div className="max-w-5xl w-full mx-auto border-t border-white/5 pt-8">
        <div className="w-12 h-[1px] bg-accent/50" />
      </div>
    </div>
  );
};

export default LiminalSlide;
