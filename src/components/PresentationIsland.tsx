import React, { useState, useEffect, useCallback } from 'react';
import MediaControlBar from './MediaControlBar';

interface PresentationIslandProps {
    slides: string[];
}

const PresentationIsland: React.FC<PresentationIslandProps> = ({ slides = [] }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight' || event.key === ' ') {
                event.preventDefault();
                nextSlide();
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                prevSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    return (
        <div className="h-full w-full flex flex-col bg-background text-foreground relative overflow-hidden">
            <main className="flex-grow flex items-center justify-center p-4">
                <div
                    key={currentSlideIndex}
                    className="w-full max-w-5xl px-8 py-12 prose prose-invert overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-terminal bg-surface/50 rounded-lg border border-border/50 shadow-2xl transition-all duration-300 ease-in-out"
                    dangerouslySetInnerHTML={{ __html: slides[currentSlideIndex] }}
                />
            </main>

            {/* Media Control Bar - Persistent outside slide iteration */}
            <MediaControlBar />

            {/* Progress Indicator */}
            <div className="fixed top-4 right-6 font-mono text-xs text-muted z-50">
                {currentSlideIndex + 1} / {slides.length}
            </div>
        </div>
    );
};

export default PresentationIsland;
