import React, { useState, useEffect, useCallback } from 'react';
import LiminalSlide, { SlideData } from './LiminalSlide';
import PaginationBadge from './PaginationBadge';

interface LiminalDeckIslandProps {
  slides: SlideData[];
}

const LiminalDeckIsland: React.FC<LiminalDeckIslandProps> = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = slides.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1 < totalSlides ? prev + 1 : prev));
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter' || event.key === 'n') {
        goToNext();
      } else if (event.key === 'ArrowLeft' || event.key === 'p' || event.key === 'Backspace') {
        goToPrev();
      } else if (event.key === 'Home') {
        setCurrentIndex(0);
      } else if (event.key === 'End') {
        setCurrentIndex(totalSlides - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, totalSlides]);

  if (!slides || slides.length === 0) {
    return (
      <div className="min-h-screen w-full bg-liminal-bg flex items-center justify-center font-mono text-white/20">
        NO_SLIDES_FOUND
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-liminal-bg selection:bg-accent/30 selection:text-white">
      {/* Background Grid Pattern (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="relative z-10">
        {slides.map((slide, index) => (
          <LiminalSlide 
            key={index} 
            slideData={slide} 
            isActive={index === currentIndex} 
          />
        ))}
      </div>

      <PaginationBadge current={currentIndex + 1} total={totalSlides} />
      
      {/* Visual Navigation Hints (Optional/Subtle) */}
      <div className="fixed bottom-8 left-8 md:bottom-12 md:left-12 z-50 flex gap-4 pointer-events-none opacity-20 hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={goToPrev} 
          disabled={currentIndex === 0}
          className={`font-mono text-[10px] uppercase tracking-widest text-white transition-colors pointer-events-auto ${currentIndex === 0 ? 'opacity-20' : 'hover:text-accent'}`}
        >
          PREV
        </button>
        <button 
          onClick={goToNext} 
          disabled={currentIndex === totalSlides - 1}
          className={`font-mono text-[10px] uppercase tracking-widest text-white transition-colors pointer-events-auto ${currentIndex === totalSlides - 1 ? 'opacity-20' : 'hover:text-accent'}`}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default LiminalDeckIsland;
