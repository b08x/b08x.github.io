/**
 * Scroll-Up Navigation Header
 *
 * Auto-hiding header that shows on scroll-up, hides on scroll-down.
 * Uses requestAnimationFrame for optimal performance.
 *
 * @module scroll-header
 */

(function () {
  'use strict';

  // Configuration
  const SCROLL_THRESHOLD = 80; // Minimum scroll distance before hiding (px)
  const HEADER_ID = 'site-header';
  const HIDDEN_CLASS = 'header-hidden';

  // State management
  let lastScrollY = window.scrollY;
  let ticking = false;

  // Get header element
  const header = document.getElementById(HEADER_ID);

  // Guard: Exit if header doesn't exist
  if (!header) {
    console.warn(`[scroll-header] Element with id="${HEADER_ID}" not found`);
    return;
  }

  /**
   * Updates header visibility based on scroll position and direction
   * Called via requestAnimationFrame for optimal performance
   */
  function updateHeaderVisibility() {
    const currentScrollY = window.scrollY;

    // Always show header near top of page
    if (currentScrollY < SCROLL_THRESHOLD) {
      header.classList.remove(HIDDEN_CLASS);
    }
    // Scrolling down - hide header
    else if (currentScrollY > lastScrollY) {
      header.classList.add(HIDDEN_CLASS);
    }
    // Scrolling up - show header
    else {
      header.classList.remove(HIDDEN_CLASS);
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  /**
   * Requests an animation frame update if one isn't already pending
   * This throttles the scroll event handler for better performance
   */
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderVisibility);
      ticking = true;
    }
  }

  // Initialize: Add scroll event listener with passive flag for performance
  window.addEventListener('scroll', requestTick, { passive: true });

  // Optional: Log initialization in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[scroll-header] Initialized with threshold:', SCROLL_THRESHOLD + 'px');
  }

})();
