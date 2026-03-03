import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import MediaControlBar from './MediaControlBar';

interface PresentationIslandProps {
    slides: string[];
    isPdf?: boolean;
}

const PresentationIsland: React.FC<PresentationIslandProps> = ({ slides = [], isPdf = false }) => {
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

    // Pre-process slides to inject fragment classes
    const processedSlides = useMemo(() => {
        console.log("[Presentation] Pre-processing slides...");
        return slides.map((slide, i) => {
            let processed = slide;

            // Pattern: <tag>content{: .fragment }</tag>
            // We capture the tag name and the content to reconstruct it with the class
            // Updated regex to be more permissive with characters inside tags
            const tagPattern = /<([a-z0-9]+)([^>]*)>([\s\S]*?)\{:\s*\.fragment\s*\}([\s\S]*?)<\/\1>/gi;
            processed = processed.replace(tagPattern, (match, tag, attrs, before, after) => {
                const newAttrs = attrs.includes('class="')
                    ? attrs.replace('class="', 'class="fragment ')
                    : `${attrs} class="fragment"`;
                console.log(`[Presentation] Found fragment in <${tag}> on slide ${i + 1}`);
                return `<${tag}${newAttrs}>${before}${after}</${tag}>`;
            });

            // Pattern: item{: .fragment } (lonely markers in text)
            const orphanPattern = /([^>]+)\{:\s*\.fragment\s*\}/g;
            processed = processed.replace(orphanPattern, (match, content) => {
                console.log(`[Presentation] Found orphan fragment on slide ${i + 1}`);
                return `<span class="fragment">${content}</span>`;
            });

            return processed;
        });
    }, [slides]);

    // Fragment detection logic
    useEffect(() => {
        if (!slideRef.current) return;

        // Collect processed fragments
        const fragmentList = Array.from(slideRef.current.querySelectorAll('.fragment')) as HTMLElement[];
        console.log(`[Presentation] Slide ${currentSlideIndex + 1} initialized with ${fragmentList.length} fragments`);

        setTotalFragments(fragmentList.length);
        setCurrentFragmentIndex(0); // Reset for new slide

        fragmentList.forEach(fragment => {
            fragment.classList.remove('visible');
        });
    }, [currentSlideIndex, processedSlides]);

    const nextSlide = useCallback(() => {
        if (currentFragmentIndex < totalFragments) {
            setCurrentFragmentIndex(prev => prev + 1);
        } else {
            setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
        }
    }, [currentFragmentIndex, totalFragments, slides.length]);

    const prevSlide = useCallback(() => {
        if (currentFragmentIndex > 0) {
            setCurrentFragmentIndex(prev => prev - 1);
        } else {
            setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
        }
    }, [currentFragmentIndex, slides.length]);

    // Synchronize visibility of fragments with state
    useEffect(() => {
        if (!slideRef.current) return;
        const fragments = slideRef.current.querySelectorAll('.fragment');
        console.log(`[Presentation] Syncing visibility: ${currentFragmentIndex} fragments revealed`);
        fragments.forEach((fragment, i) => {
            if (i < currentFragmentIndex) {
                fragment.classList.add('visible');
            } else {
                fragment.classList.remove('visible');
            }
        });
    }, [currentFragmentIndex, currentSlideIndex]);

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
                    visibility: hidden !important;
                    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out !important;
                }
                .fragment.visible {
                    opacity: 1 !important;
                    visibility: visible !important;
                }
            `}</style>
            <main className="flex-grow flex items-center justify-center overflow-hidden">
                <div
                    ref={slideRef}
                    key={currentSlideIndex}
                    className={`w-full h-full flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${isPdf ? '' : 'max-w-5xl max-h-full px-8 py-12 md:px-16 md:py-16 prose prose-invert prose-lg md:prose-2xl overflow-y-auto scrollbar-terminal'
                        }`}
                    dangerouslySetInnerHTML={{ __html: processedSlides[currentSlideIndex] }}
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
