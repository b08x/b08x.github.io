import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import KnowledgebaseCarousel from '../KnowledgebaseCarousel';

/**
 * Unit Test Structure for KnowledgebaseCarousel Component
 *
 * To run these tests, ensure you have the following dependencies:
 * - @testing-library/react
 * - @testing-library/jest-dom
 * - jest
 * - @types/jest
 *
 * Install with: npm install --save-dev @testing-library/react @testing-library/jest-dom jest @types/jest
 *
 * Run tests with: npm test
 */

describe('KnowledgebaseCarousel', () => {
  const mockContent = `
    <h2>Introduction</h2>
    <p>This is the introduction section.</p>
    <h2>Getting Started</h2>
    <p>This section covers getting started.</p>
    <h2>Advanced Topics</h2>
    <p>Advanced topics are discussed here.</p>
  `;

  beforeEach(() => {
    // Clear any previous URL hash
    window.location.hash = '';
  });

  describe('Rendering', () => {
    test('renders loading state initially', () => {
      render(<KnowledgebaseCarousel content="" />);
      expect(screen.getByText(/loading knowledgebase/i)).toBeInTheDocument();
    });

    test('parses content into slides correctly', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        expect(screen.getByText(/introduction/i)).toBeInTheDocument();
      });
    });

    test('renders navigation controls', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      });
    });

    test('renders pagination dots matching slide count', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        const dots = screen.getAllByRole('button', { name: /go to section/i });
        expect(dots).toHaveLength(3); // 3 H2 sections in mockContent
      });
    });

    test('displays section counter', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        expect(screen.getByText(/section 1 of 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    test('previous button is disabled on first slide', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        const prevButton = screen.getByRole('button', { name: /previous/i });
        expect(prevButton).toBeDisabled();
      });
    });

    test('next button navigates to next slide', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next section: getting started/i });
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/section 2 of 3/i)).toBeInTheDocument();
      });
    });

    test('next button is disabled on last slide', async () => {
      render(<KnowledgebaseCarousel content={mockContent} initialSlide={2} />);

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).toBeDisabled();
      });
    });

    test('pagination dots navigate to correct slide', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        const thirdDot = screen.getByRole('button', { name: /go to section 3: advanced topics/i });
        fireEvent.click(thirdDot);
      });

      await waitFor(() => {
        expect(screen.getByText(/section 3 of 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    test('arrow right key navigates to next slide', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        fireEvent.keyDown(window, { key: 'ArrowRight' });
      });

      await waitFor(() => {
        expect(screen.getByText(/section 2 of 3/i)).toBeInTheDocument();
      });
    });

    test('arrow left key navigates to previous slide', async () => {
      render(<KnowledgebaseCarousel content={mockContent} initialSlide={1} />);

      await waitFor(() => {
        fireEvent.keyDown(window, { key: 'ArrowLeft' });
      });

      await waitFor(() => {
        expect(screen.getByText(/section 1 of 3/i)).toBeInTheDocument();
      });
    });

    test('home key navigates to first slide', async () => {
      render(<KnowledgebaseCarousel content={mockContent} initialSlide={2} />);

      await waitFor(() => {
        fireEvent.keyDown(window, { key: 'Home' });
      });

      await waitFor(() => {
        expect(screen.getByText(/section 1 of 3/i)).toBeInTheDocument();
      });
    });

    test('end key navigates to last slide', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        fireEvent.keyDown(window, { key: 'End' });
      });

      await waitFor(() => {
        expect(screen.getByText(/section 3 of 3/i)).toBeInTheDocument();
      });
    });

    test('vim-style h key navigates to previous slide', async () => {
      render(<KnowledgebaseCarousel content={mockContent} initialSlide={1} />);

      await waitFor(() => {
        fireEvent.keyDown(window, { key: 'h' });
      });

      await waitFor(() => {
        expect(screen.getByText(/section 1 of 3/i)).toBeInTheDocument();
      });
    });

    test('vim-style l key navigates to next slide', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        fireEvent.keyDown(window, { key: 'l' });
      });

      await waitFor(() => {
        expect(screen.getByText(/section 2 of 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('URL Hash Integration', () => {
    test('updates URL hash when navigating', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        expect(window.location.hash).toBe('#slide-1');
      });
    });

    test('starts at slide from URL hash', async () => {
      window.location.hash = '#slide-2';
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        expect(screen.getByText(/section 3 of 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('Event Dispatching', () => {
    test('dispatches kb-slides-ready event on mount', async () => {
      const handleSlidesReady = jest.fn();
      window.addEventListener('kb-slides-ready', handleSlidesReady);

      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        expect(handleSlidesReady).toHaveBeenCalled();
      });

      window.removeEventListener('kb-slides-ready', handleSlidesReady);
    });

    test('dispatches kb-slide-change event when navigating', async () => {
      const handleSlideChange = jest.fn();
      window.addEventListener('kb-slide-change', handleSlideChange);

      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        expect(handleSlideChange).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: expect.objectContaining({
              slideIndex: 1,
              slideId: 'slide-1',
              slideTitle: expect.any(String)
            })
          })
        );
      });

      window.removeEventListener('kb-slide-change', handleSlideChange);
    });

    test('listens for kb-toc-click event to navigate', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        window.dispatchEvent(new CustomEvent('kb-toc-click', {
          detail: { slideIndex: 2, slideId: 'slide-2' }
        }));
      });

      await waitFor(() => {
        expect(screen.getByText(/section 3 of 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('has appropriate ARIA labels', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        expect(screen.getByRole('region', { name: /knowledgebase carousel/i })).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: /carousel navigation/i })).toBeInTheDocument();
      });
    });

    test('screen reader live region exists', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        const liveRegion = document.getElementById('kb-live-region');
        expect(liveRegion).toBeInTheDocument();
        expect(liveRegion).toHaveAttribute('role', 'status');
        expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      });
    });

    test('navigation buttons have focus indicators', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).toHaveClass('focus:ring-2', 'focus:ring-accent');
      });
    });

    test('pagination dots indicate current slide', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        const firstDot = screen.getByRole('button', { name: /go to section 1/i });
        expect(firstDot).toHaveAttribute('aria-current', 'true');
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles content with no H2 tags', async () => {
      const contentWithoutH2 = '<p>Just a paragraph.</p>';
      render(<KnowledgebaseCarousel content={contentWithoutH2} />);

      await waitFor(() => {
        expect(screen.getByText(/section 1 of 1/i)).toBeInTheDocument();
      });
    });

    test('handles empty content gracefully', () => {
      render(<KnowledgebaseCarousel content="" />);
      expect(screen.getByText(/loading knowledgebase/i)).toBeInTheDocument();
    });

    test('prevents navigation beyond boundaries', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        const prevButton = screen.getByRole('button', { name: /previous/i });
        fireEvent.click(prevButton); // Already on first slide
      });

      // Should still be on first slide
      expect(screen.getByText(/section 1 of 3/i)).toBeInTheDocument();
    });

    test('disables navigation during transitions', async () => {
      render(<KnowledgebaseCarousel content={mockContent} />);

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);

        // Immediately try to click again during transition
        fireEvent.click(nextButton);
      });

      // Allow transition to complete
      await waitFor(() => {
        expect(screen.getByText(/section 2 of 3/i)).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });
});
