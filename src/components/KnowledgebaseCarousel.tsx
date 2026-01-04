import React, { useState, useEffect, useRef, useCallback } from 'react';
import CodeBlock from './CodeBlock';
import { extractCodeBlocks, hasCodeBlocks, replaceCodeBlocksWithIslands } from '../utils/codeProcessor';

/**
 * Represents a single slide in the knowledgebase carousel
 */
interface Slide {
  id: string;
  title: string;
  content: string;
}

/**
 * Props for the KnowledgebaseCarousel component
 */
interface KnowledgebaseCarouselProps {
  contentElementId?: string; // ID of hidden element containing content
  content?: string; // HTML string from Jekyll {{ content }} (fallback)
  initialSlide?: number; // Start at specific slide (from URL hash)
}

/**
 * Decode HTML entities in a string
 * Handles entities like &lt; &gt; &amp; &quot; etc.
 *
 * This is necessary because Jekyll's jsonify filter encodes HTML entities
 * for JSON safety, but we need actual HTML tags for DOM parsing.
 */
const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

/**
 * KnowledgebaseCarousel Component
 *
 * A fully accessible, keyboard-navigable carousel for knowledgebase content.
 * Parses HTML content by H2 tags to create slides, provides smooth animations,
 * and integrates with the sidebar TOC.
 *
 * Usage:
 * <div
 *   data-island="KnowledgebaseCarousel"
 *   data-props='{"content": "<html content>"}'
 * />
 */
const KnowledgebaseCarousel: React.FC<KnowledgebaseCarouselProps> = ({
  contentElementId,
  content,
  initialSlide = 0
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get content from hidden element if contentElementId is provided
  const getContent = useCallback((): string => {
    if (contentElementId) {
      const element = document.getElementById(contentElementId);
      if (element) {
        return element.innerHTML;
      }
    }
    return content || '';
  }, [contentElementId, content]);

  /**
   * Parse HTML content into individual slides based on H2 tags
   */
  const parseSlides = useCallback((html: string): Slide[] => {
    // Decode HTML entities (necessary when content comes from Jekyll)
    const decodedHTML = decodeHTMLEntities(html);

    const parser = new DOMParser();
    const doc = parser.parseFromString(decodedHTML, 'text/html');

    // Get all H2 elements as section markers
    const headings = Array.from(doc.querySelectorAll('h2'));

    if (headings.length === 0) {
      // If no H2 tags, treat entire content as single slide
      return [{
        id: 'slide-0',
        title: 'Content',
        content: html
      }];
    }

    const slides: Slide[] = [];

    headings.forEach((heading, index) => {
      const slideDiv = document.createElement('div');
      const slideId = `slide-${index}`;

      // Add the heading
      slideDiv.appendChild(heading.cloneNode(true));

      // Collect all content until the next H2 or end
      let currentElement = heading.nextElementSibling;
      while (currentElement && currentElement.tagName !== 'H2') {
        slideDiv.appendChild(currentElement.cloneNode(true));
        currentElement = currentElement.nextElementSibling;
      }

      slides.push({
        id: slideId,
        title: heading.textContent?.trim() || `Section ${index + 1}`,
        content: slideDiv.innerHTML
      });
    });

    return slides;
  }, []);

  /**
   * Process slide content to extract code blocks and render them with CodeBlock component
   * Returns array of content segments: either HTML strings or CodeBlock components
   */
  const processSlideContent = useCallback((html: string): React.ReactNode[] => {
    console.log('[KB Carousel] Processing slide content, length:', html.length);
    console.log('[KB Carousel] Has code blocks:', hasCodeBlocks(html));

    if (!hasCodeBlocks(html)) {
      // No code blocks, render as-is with dangerouslySetInnerHTML
      return [
        <div
          key="content-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ];
    }

    // Extract code blocks
    const codeBlocks = extractCodeBlocks(html);
    console.log('[KB Carousel] Extracted code blocks:', codeBlocks.length, codeBlocks);

    if (codeBlocks.length === 0) {
      // No code blocks found, render as-is
      return [
        <div
          key="content-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ];
    }

    // Parse original HTML to find and replace code blocks
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const contentNodes: React.ReactNode[] = [];
    let codeBlockIndex = 0;

    // Find all code containers
    const codeContainers = Array.from(doc.querySelectorAll('div[class*="language-"]'));

    codeContainers.forEach((container, idx) => {
      const block = codeBlocks[codeBlockIndex];
      if (block) {
        // Create a marker element to replace the code container
        const marker = doc.createElement('div');
        marker.setAttribute('data-code-block-marker', String(codeBlockIndex));
        container.replaceWith(marker);
        codeBlockIndex++;
      }
    });

    // Split HTML by markers and create React nodes
    const htmlString = doc.body.innerHTML;
    const parts = htmlString.split(/<div data-code-block-marker="(\d+)"><\/div>/);

    console.log('[KB Carousel] HTML parts:', parts.length);

    parts.forEach((part, idx) => {
      if (idx % 2 === 0) {
        // Regular HTML content
        if (part.trim()) {
          contentNodes.push(
            <div
              key={`html-${idx}`}
              dangerouslySetInnerHTML={{ __html: part }}
            />
          );
        }
      } else {
        // Code block marker index
        const blockIdx = parseInt(part, 10);
        const block = codeBlocks[blockIdx];
        if (block) {
          console.log('[KB Carousel] Rendering CodeBlock:', block.language);
          contentNodes.push(
            <CodeBlock
              key={`code-${blockIdx}`}
              code={block.code}
              language={block.language}
              fileName={block.fileName}
              showLineNumbers={false}
            />
          );
        }
      }
    });

    console.log('[KB Carousel] Content nodes created:', contentNodes.length);
    return contentNodes;
  }, []);

  /**
   * Initialize slides from content
   */
  useEffect(() => {
    const htmlContent = getContent();
    const parsed = parseSlides(htmlContent);
    setSlides(parsed);
    slideRefs.current = new Array(parsed.length).fill(null);

    // Check for URL hash to determine initial slide
    const hash = window.location.hash.slice(1);
    if (hash) {
      const slideIndex = parsed.findIndex(slide => slide.id === hash);
      if (slideIndex !== -1) {
        setCurrentSlide(slideIndex);
      }
    }

    // Dispatch event to let TOC know slides are ready
    window.dispatchEvent(new CustomEvent('kb-slides-ready', {
      detail: { slides: parsed }
    }));
  }, [getContent, parseSlides]);

  /**
   * Navigate to a specific slide
   */
  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= slides.length || index === currentSlide) {
      return;
    }

    setIsTransitioning(true);
    setCurrentSlide(index);

    // Update URL hash
    window.history.replaceState(null, '', `#${slides[index].id}`);

    // Dispatch custom event for TOC synchronization
    window.dispatchEvent(new CustomEvent('kb-slide-change', {
      detail: {
        slideIndex: index,
        slideId: slides[index].id,
        slideTitle: slides[index].title
      }
    }));

    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);

    // Announce to screen readers
    const announcement = `Navigated to ${slides[index].title}, section ${index + 1} of ${slides.length}`;
    announceToScreenReader(announcement);
  }, [currentSlide, slides]);

  /**
   * Navigate to previous slide
   */
  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide]);

  /**
   * Navigate to next slide
   */
  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, slides.length, goToSlide]);

  /**
   * Keyboard navigation handler
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not focused on input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'h': // Vim-style navigation
          e.preventDefault();
          handlePrev();
          break;
        case 'ArrowRight':
        case 'l': // Vim-style navigation
          e.preventDefault();
          handleNext();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(slides.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, goToSlide, slides.length]);

  /**
   * Listen for TOC clicks to navigate to slides
   */
  useEffect(() => {
    const handleTocClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { slideIndex } = customEvent.detail;
      if (typeof slideIndex === 'number') {
        goToSlide(slideIndex);
      }
    };

    window.addEventListener('kb-toc-click', handleTocClick);
    return () => window.removeEventListener('kb-toc-click', handleTocClick);
  }, [goToSlide]);

  /**
   * Announce content to screen readers
   */
  const announceToScreenReader = (message: string) => {
    const liveRegion = document.getElementById('kb-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  };

  /**
   * Dispatch TOC generation event when slides are ready
   */
  useEffect(() => {
    if (slides.length > 0) {
      window.dispatchEvent(new CustomEvent('kb-slides-ready', {
        detail: {
          slides: slides.map((slide, index) => ({
            id: slide.id,
            title: slide.title,
            index
          }))
        }
      }));

      // Set initial active slide
      goToSlide(currentSlide);
    }
  }, [slides, currentSlide, goToSlide]);

  if (slides.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-surface border border-border rounded-lg p-8 text-center">
          <span className="text-muted font-mono text-sm">Loading knowledgebase...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={carouselRef}
      className="relative overflow-hidden flex-grow flex flex-col"
      role="region"
      aria-label="Knowledgebase carousel"
      aria-live="polite"
    >
      {/* Screen reader live region for announcements */}
      <div
        id="kb-live-region"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Carousel slides container */}
      <div className="relative flex-grow overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          role="list"
          aria-label={`${slides.length} content sections`}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              ref={el => slideRefs.current[index] = el}
              className="w-full flex-shrink-0 px-4 overflow-y-auto"
              role="listitem"
              aria-label={`Section ${index + 1}: ${slide.title}`}
              aria-hidden={index !== currentSlide}
            >
              <div className="prose prose-lg font-prose max-w-none">
                {processSlideContent(slide.content)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation controls */}
      <nav
        className="flex items-center justify-between mt-auto pt-8 border-t border-border bg-background z-10"
        aria-label="Carousel navigation"
      >
        {/* Previous button */}
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0 || isTransitioning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          aria-label={`Previous section: ${currentSlide > 0 ? slides[currentSlide - 1].title : 'None'}`}
          title="Previous section (Arrow Left or H)"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-mono text-sm">Previous</span>
        </button>

        {/* Pagination dots */}
        <div
          className="flex items-center gap-2"
          role="navigation"
          aria-label="Slide pagination"
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
                index === currentSlide
                  ? 'bg-accent w-8 h-2'
                  : 'bg-muted hover:bg-accent/50 w-2 h-2'
              }`}
              aria-label={`Go to section ${index + 1}: ${slide.title}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
              title={slide.title}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1 || isTransitioning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          aria-label={`Next section: ${currentSlide < slides.length - 1 ? slides[currentSlide + 1].title : 'None'}`}
          title="Next section (Arrow Right or L)"
        >
          <span className="font-mono text-sm">Next</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>

      {/* Progress indicator */}
      <div
        className="text-center text-xs font-mono text-muted mt-4"
        aria-live="polite"
      >
        Section {currentSlide + 1} of {slides.length}
      </div>
    </div>
  );
};

export default KnowledgebaseCarousel;
