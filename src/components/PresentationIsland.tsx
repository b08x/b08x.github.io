import React, { useState, useEffect, useCallback, useRef } from 'react';
import MediaControlBar from './MediaControlBar';

interface PresentationIslandProps {
    slides: string[];
}

const PresentationIsland: React.FC<PresentationIslandProps> = ({ slides = [] }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(() => {
        if (typeof window !== 'undefined' && window.location.hash) {
            const hash = window.location.hash;
            if (hash.startsWith('#slide-')) {
                const index = parseInt(hash.replace('#slide-', ''), 10) - 1;
                return isNaN(index) || index < 0 || index >= slides.length ? 0 : index;
            }
        }
        return 0;
    });

    const slideRef = useRef<HTMLDivElement>(null);
    const [currentFragmentIndex, setCurrentFragmentIndex] = useState(0);
    const [totalFragments, setTotalFragments] = useState(0);

    // Sync URL hash when slide changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = `#slide-${currentSlideIndex + 1}`;
            if (window.location.hash !== hash) {
                window.history.pushState(null, '', hash);
            }
        }
    }, [currentSlideIndex]);

    // Handle initial hash change Native browser back/forward sync
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash && hash.startsWith('#slide-')) {
                const index = parseInt(hash.replace('#slide-', ''), 10) - 1;
                if (!isNaN(index) && index >= 0 && index < slides.length) {
                    setCurrentSlideIndex(index);
                }
            } else if (hash === '') {
                setCurrentSlideIndex(0);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [slides.length]);

    // Fragment detection logic
    useEffect(() => {
        if (!slideRef.current) return;

        // 1. Collect standard fragments
        let fragmentList = Array.from(slideRef.current.querySelectorAll('.fragment')) as HTMLElement[];

        // 2. Fallback: Find elements containing literal "{: .fragment }" marker
        const walker = document.createTreeWalker(slideRef.current, NodeFilter.SHOW_TEXT, null);
        let node: Node | null = walker.nextNode();
        const textNodesToUpdate: { node: Text, parent: HTMLElement }[] = [];

        while (node) {
            if (node.nodeValue && node.nodeValue.includes('{: .fragment }')) {
                const parent = node.parentElement;
                if (parent) {
                    textNodesToUpdate.push({ node: node as Text, parent });
                }
            }
            node = walker.nextNode();
        }

        textNodesToUpdate.forEach(({ node, parent }) => {
            node.nodeValue = node.nodeValue!.replace(/\{:\s*\.fragment\s*\}/g, '');
            if (!parent.classList.contains('fragment')) {
                parent.classList.add('fragment');
                if (!fragmentList.includes(parent)) {
                    fragmentList.push(parent);
                }
            }
        });

        setTotalFragments(fragmentList.length);
        setCurrentFragmentIndex(0); // Reset index for new slide

        fragmentList.forEach(fragment => {
            // Remove any leftover visibility classes and ensure base fragment class
            fragment.classList.remove('visible');
            fragment.classList.add('fragment');
        });
    }, [currentSlideIndex, slides.length]); // Use slides.length instead of slides to avoid infinite re-renders

    const nextSlide = useCallback(() => {
        if (currentFragmentIndex < totalFragments && slideRef.current) {
            const fragments = slideRef.current.querySelectorAll('.fragment');
            const fragment = fragments[currentFragmentIndex] as HTMLElement;
            if (fragment) {
                fragment.classList.add('visible');
            }
            setCurrentFragmentIndex(prev => prev + 1);
        } else {
            setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
        }
    }, [currentFragmentIndex, totalFragments, slides.length]);

    const prevSlide = useCallback(() => {
        if (currentFragmentIndex > 0 && slideRef.current) {
            const fragments = slideRef.current.querySelectorAll('.fragment');
            const fragment = fragments[currentFragmentIndex - 1] as HTMLElement;
            if (fragment) {
                fragment.classList.remove('visible');
            }
            setCurrentFragmentIndex(prev => prev - 1);
        } else {
            setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
        }
    }, [currentFragmentIndex, slides.length]);

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
            <style>{`
                .fragment {
                    opacity: 0 !important;
                    transition: opacity 0.3s ease-in-out !important;
                }
                .fragment.visible {
                    opacity: 1 !important;
                }
            `}</style>
            <main className="flex-grow flex items-center justify-center overflow-hidden">
                <div
                    ref={slideRef}
                    key={currentSlideIndex}
                    className="w-full max-w-5xl max-h-full px-8 py-12 md:px-16 md:py-16 prose prose-invert prose-lg md:prose-2xl overflow-y-auto scrollbar-terminal transition-all duration-300 ease-in-out"
                    dangerouslySetInnerHTML={{ __html: slides[currentSlideIndex] }}
                />
            </main>

            {/* Media Control Bar - Persistent outside slide iteration */}
            <MediaControlBar />

            {/* Progress Indicator */}
            <div className="fixed top-4 right-6 font-mono text-xs text-muted z-50">
                {currentSlideIndex + 1} / {slides.length}
                {totalFragments > 0 && ` (Fragment: ${currentFragmentIndex}/${totalFragments})`}
            </div>
        </div>
    );
};

export default PresentationIsland;
