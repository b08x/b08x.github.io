import React, { useState, useEffect, useCallback, useRef } from 'react';
import LiminalSlide, { SlideData } from './LiminalSlide';
import PaginationBadge from './PaginationBadge';

interface LiminalDeckIslandProps {
  slides: SlideData[];
}

const LiminalDeckIsland: React.FC<LiminalDeckIslandProps> = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFragmentIndex, setCurrentFragmentIndex] = useState(0);
  const [totalFragments, setTotalFragments] = useState(0);
  
  const lastScrollTime = useRef(0);
  const touchStart = useRef<number | null>(null);

  const totalSlides = slides.length;

  const goToNext = useCallback(() => {
    if (currentFragmentIndex < totalFragments) {
      setCurrentFragmentIndex(prev => prev + 1);
    } else if (currentIndex < totalSlides - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentFragmentIndex(0);
      setTotalFragments(0); // Will be reset by the new slide
    }
  }, [currentIndex, currentFragmentIndex, totalFragments, totalSlides]);

  const goToPrev = useCallback(() => {
    if (currentFragmentIndex > 0) {
      setCurrentFragmentIndex(prev => prev - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      // We don't easily know the total fragments of the previous slide 
      // without storing them, so for simplicity we just go to the start of previous slide.
      // Alternatively, we could default to "all fragments visible" but that's complex.
      setCurrentFragmentIndex(0); 
    }
  }, [currentIndex, currentFragmentIndex]);

  const handleFragmentsDetected = useCallback((count: number) => {
    setTotalFragments(count);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter' || event.key === 'n') {
        goToNext();
      } else if (event.key === 'ArrowLeft' || event.key === 'p' || event.key === 'Backspace') {
        goToPrev();
      } else if (event.key === 'Home') {
        setCurrentIndex(0);
        setCurrentFragmentIndex(0);
      } else if (event.key === 'End') {
        setCurrentIndex(totalSlides - 1);
        setCurrentFragmentIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, totalSlides]);

  // Mouse wheel navigation
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < 800) return; // Debounce

      if (Math.abs(event.deltaY) > 50) {
        if (event.deltaY > 0) {
          goToNext();
        } else {
          goToPrev();
        }
        lastScrollTime.current = now;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [goToNext, goToPrev]);

  // Touch support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStart.current = null;
  };

  if (!slides || slides.length === 0) {
    return (
      <div className="min-h-screen w-full bg-liminal-bg flex items-center justify-center font-mono text-white/20">
        NO_SLIDES_FOUND
      </div>
    );
  }

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden bg-liminal-bg selection:bg-accent/30 selection:text-white"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Grid Pattern (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="relative z-10 h-full w-full">
        {slides.map((slide, index) => (
          <LiminalSlide 
            key={index} 
            slideData={slide} 
            isActive={index === currentIndex}
            currentFragmentIndex={currentFragmentIndex}
            onFragmentsDetected={handleFragmentsDetected}
          />
        ))}
      </div>

      <PaginationBadge current={currentIndex + 1} total={totalSlides} />
      
      {/* Progress Bar (Subtle) */}
      <div className="fixed bottom-0 left-0 h-[1px] bg-accent/30 transition-all duration-500 ease-out z-50"
           style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }} />

      {/* Visual Navigation Hints (Optional/Subtle) */}
      <div className="fixed bottom-8 left-8 md:bottom-12 md:left-12 z-50 flex gap-4 pointer-events-none opacity-20 hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={goToPrev} 
          disabled={currentIndex === 0 && currentFragmentIndex === 0}
          className={`font-mono text-[10px] uppercase tracking-widest text-white transition-colors pointer-events-auto ${(currentIndex === 0 && currentFragmentIndex === 0) ? 'opacity-20' : 'hover:text-accent'}`}
        >
          PREV
        </button>
        <button 
          onClick={goToNext} 
          disabled={currentIndex === totalSlides - 1 && currentFragmentIndex === totalFragments}
          className={`font-mono text-[10px] uppercase tracking-widest text-white transition-colors pointer-events-auto ${(currentIndex === totalSlides - 1 && currentFragmentIndex === totalFragments) ? 'opacity-20' : 'hover:text-accent'}`}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default LiminalDeckIsland;
