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
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentFragmentIndex, setCurrentFragmentIndex] = useState(0);
    const [totalFragments, setTotalFragments] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const lastScrollTime = useRef(0);

    // Touch support state
    const touchStart = useRef<number | null>(null);

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
            const tagPattern = /<([a-z0-9]+)([^>]*)>([\s\S]*?)\{:\s*\.fragment\s*\}([\s\S]*?)<\/\1>/gi;
            processed = processed.replace(tagPattern, (match, tag, attrs, before, after) => {
                const newAttrs = attrs.includes('class="')
                    ? attrs.replace('class="', 'class="fragment ')
                    : `${attrs} class="fragment"`;
                return `<${tag}${newAttrs}>${before}${after}</${tag}>`;
            });

            const orphanPattern = /([^>]+)\{:\s*\.fragment\s*\}/g;
            processed = processed.replace(orphanPattern, (match, content) => {
                return `<span class="fragment">${content}</span>`;
            });

            return processed;
        });
    }, [slides]);

    // Fragment detection logic
    useEffect(() => {
        if (!slideRef.current) return;

        const fragmentList = Array.from(slideRef.current.querySelectorAll('.fragment')) as HTMLElement[];
        setTotalFragments(fragmentList.length);
        setCurrentFragmentIndex(0);

        fragmentList.forEach(fragment => {
            fragment.classList.remove('visible');
        });

        // Intersection Observer for scroll-triggered animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible-observer');
                }
            });
        }, { threshold: 0.1 });

        const animatableElements = slideRef.current.querySelectorAll('p, h1, h2, h3, li, img, pre');
        animatableElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [currentSlideIndex, processedSlides]);

    const nextSlide = useCallback(() => {
        if (currentFragmentIndex < totalFragments) {
            setCurrentFragmentIndex(prev => prev + 1);
        } else if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        }
    }, [currentFragmentIndex, totalFragments, currentSlideIndex, slides.length]);

    const prevSlide = useCallback(() => {
        if (currentFragmentIndex > 0) {
            setCurrentFragmentIndex(prev => prev - 1);
        } else if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    }, [currentFragmentIndex, currentSlideIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const { key } = event;
            if (key === 'ArrowRight' || key === ' ' || key === 'PageDown') {
                event.preventDefault();
                nextSlide();
            } else if (key === 'ArrowLeft' || key === 'PageUp') {
                event.preventDefault();
                prevSlide();
            } else if (key === 'Home') {
                event.preventDefault();
                setCurrentSlideIndex(0);
                setCurrentFragmentIndex(0);
            } else if (key === 'End') {
                event.preventDefault();
                setCurrentSlideIndex(slides.length - 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide, slides.length]);

    // Mouse wheel navigation
    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            const now = Date.now();
            if (now - lastScrollTime.current < 800) return; // Debounce

            if (Math.abs(event.deltaY) > 50) {
                if (event.deltaY > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                lastScrollTime.current = now;
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [nextSlide, prevSlide]);

    // Touch navigation
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart.current === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart.current - touchEnd;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        touchStart.current = null;
    };

    // Synchronize visibility of fragments with state
    useEffect(() => {
        if (!slideRef.current) return;
        const fragments = slideRef.current.querySelectorAll('.fragment');
        fragments.forEach((fragment, i) => {
            if (i < currentFragmentIndex) {
                fragment.classList.add('visible');
            } else {
                fragment.classList.remove('visible');
            }
        });
    }, [currentFragmentIndex, currentSlideIndex]);

    // 3D Tilt Effect
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current || !slideRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth) - 0.5;
        const yPos = (clientY / innerHeight) - 0.5;
        
        slideRef.current.style.transform = `perspective(1000px) rotateY(${xPos * 4}deg) rotateX(${-yPos * 4}deg)`;
    };

    const handleMouseLeave = () => {
        if (slideRef.current) {
            slideRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        }
    };

    // Particles system
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Array<{ x: number, y: number, vx: number, vy: number, size: number }> = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        createParticles();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Cursor trail
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [trailPos, setTrailPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setTrailPos(cursorPos);
        }, 80);
        return () => clearTimeout(timeout);
    }, [cursorPos]);

    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const toggleBGM = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleExit = () => {
        window.location.href = window.location.pathname.replace(/\/$/, '') || '/';
    };

    return (
        <div 
            ref={containerRef}
            className="h-screen w-screen flex flex-col bg-background text-foreground relative overflow-hidden select-none cursor-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <audio ref={audioRef} src="/assets/audio/jazzyfrenchy.mp3" loop />
            <canvas 
                ref={canvasRef} 
                className="fixed inset-0 pointer-events-none z-0 opacity-50"
            />

            <style>{`
                .fragment {
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .fragment.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .visible-observer {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .progress-bar-inner {
                    transition: width 0.3s ease-out;
                }
                .nav-dot {
                    transition: all 0.2s ease-in-out;
                }
                .nav-dot.active {
                    transform: scale(1.5);
                    background-color: var(--accent);
                }
                .custom-cursor {
                    width: 8px;
                    height: 8px;
                    background: var(--accent);
                    border-radius: 50%;
                    position: fixed;
                    pointer-events: none;
                    z-index: 10000;
                    transform: translate(-50%, -50%);
                }
                .cursor-trail {
                    width: 32px;
                    height: 32px;
                    border: 1px solid var(--accent);
                    border-radius: 50%;
                    position: fixed;
                    pointer-events: none;
                    z-index: 9999;
                    transform: translate(-50%, -50%);
                    transition: all 0.1s ease-out;
                    opacity: 0.3;
                }
                main {
                    transform-style: preserve-3d;
                }
                .control-btn {
                    pointer-events: auto;
                    transition: all 0.2s ease-in-out;
                    opacity: 0.5;
                }
                .control-btn:hover {
                    opacity: 1;
                    color: var(--accent);
                    background: var(--surface);
                }
            `}</style>
            
            {/* Custom Cursor */}
            <div 
                className="custom-cursor" 
                style={{ left: cursorPos.x, top: cursorPos.y }}
            />
            <div 
                className="cursor-trail" 
                style={{ left: trailPos.x, top: trailPos.y }}
            />

            {/* Exit Link */}
            <button
                onClick={handleExit}
                className="fixed top-4 left-6 z-[60] control-btn font-mono text-sm px-3 py-1 border border-border bg-background/50 backdrop-blur-md"
                title="Return to Site"
            >
                [ EXIT_PRESENTATION ]
            </button>

            <main className="flex-grow flex items-center justify-center overflow-hidden z-10">
                <div
                    ref={slideRef}
                    key={currentSlideIndex}
                    className={`w-full h-full flex flex-col items-center justify-center transition-transform duration-200 ease-out ${
                        isPdf ? '' : 'max-h-full px-8 py-12 md:px-16 md:py-16 prose prose-invert prose-lg md:prose-2xl overflow-y-auto scrollbar-terminal'
                    }`}
                    style={{ maxWidth: '100vw' }}
                    dangerouslySetInnerHTML={{ __html: processedSlides[currentSlideIndex] }}
                />
            </main>

            {/* Navigation Dots */}
            <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlideIndex(i)}
                        className={`nav-dot w-2 h-2 rounded-full border border-border ${
                            i === currentSlideIndex ? 'active bg-accent' : 'bg-surface'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* Progress Bar Container */}
            <div className="fixed bottom-0 left-0 w-full h-1.5 bg-surface/30 z-[70]">
                <div 
                    className="progress-bar-inner h-full bg-accent shadow-[0_0_10px_var(--accent)]"
                    style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
                />
            </div>

            {/* Top Right Controls Group */}
            <div className="fixed top-4 right-6 flex items-center gap-4 z-[60]">
                <button
                    onClick={toggleBGM}
                    className="control-btn font-mono text-xs px-2 py-1 border border-border bg-background/50 backdrop-blur-md"
                >
                    {isPlaying ? '[x] BGM' : '[ ] BGM'}
                </button>
                <div className="font-mono text-xs text-muted bg-background/50 backdrop-blur-sm px-2 py-1 border border-border">
                    {currentSlideIndex + 1} / {slides.length}
                    {totalFragments > 0 && ` (FRAG: ${currentFragmentIndex}/${totalFragments})`}
                </div>
            </div>
        </div>
    );
};

export default PresentationIsland;
