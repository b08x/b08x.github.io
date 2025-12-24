/**
 * Page Sidebar Interactive Module
 * Handles ScrollSpy, state persistence, media interactions
 * Performance: Intersection Observer for ScrollSpy (O(1) per scroll)
 */

class PageSidebar {
  constructor() {
    this.STORAGE_KEY = 'page-sidebar-state';
    this.sidebar = document.getElementById('page-sidebar');
    this.tocList = document.getElementById('toc-list');
    this.audio = document.getElementById('page-audio');
    this.headings = [];
    this.observer = null;

    this.init();
  }

  /**
   * Initialize all sidebar functionality
   * Complexity: O(n) where n is number of headings
   */
  init() {
    if (!this.sidebar) {
      console.warn('Page sidebar not found (id="page-sidebar")');
      return;
    }

    this.setupSidebarToggle();
    this.generateTOC();
    this.setupScrollSpy();
    this.setupMediaControls();
    this.restoreSidebarState();
  }

  /**
   * Generate Table of Contents from page headings
   * Complexity: O(n) where n is number of h2/h3 elements
   */
  generateTOC() {
    if (!this.tocList) return;

    const main = document.querySelector('main .prose');
    if (!main) {
      console.warn('Main prose container not found');
      return;
    }

    this.headings = Array.from(main.querySelectorAll('h2, h3'));

    if (this.headings.length === 0) {
      const tocWidget = this.tocList.closest('.toc-widget');
      if (tocWidget) tocWidget.style.display = 'none';
      return;
    }

    this.headings.forEach((heading, index) => {
      // Generate ID if missing
      if (!heading.id) {
        heading.id = this.generateHeadingId(heading.textContent, index);
      }

      // Create TOC list item
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent;
      a.dataset.headingId = heading.id;

      // Add class for h3 indentation
      if (heading.tagName === 'H3') {
        a.classList.add('toc-h3');
      }

      // Smooth scroll on click
      a.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', `#${heading.id}`);
      });

      li.appendChild(a);
      this.tocList.appendChild(li);
    });
  }

  /**
   * Generate unique heading ID from text
   * Complexity: O(m) where m is length of heading text
   */
  generateHeadingId(text, index) {
    const base = text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${base}-${index}`;
  }

  /**
   * Setup ScrollSpy using Intersection Observer
   * Complexity: O(n) setup, O(1) per scroll event
   */
  setupScrollSpy() {
    if (this.headings.length === 0 || !this.tocList) return;

    const options = {
      rootMargin: '-100px 0px -66%',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tocLink = this.tocList.querySelector(
            `a[data-heading-id="${entry.target.id}"]`
          );

          // Remove active from all links
          this.tocList.querySelectorAll('a').forEach(a => a.classList.remove('active'));

          // Add active to current link
          if (tocLink) {
            tocLink.classList.add('active');
          }
        }
      });
    }, options);

    // Observe all headings
    this.headings.forEach(heading => this.observer.observe(heading));
  }

  /**
   * Setup sidebar toggle for mobile
   * Complexity: O(1)
   */
  setupSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const content = document.getElementById('sidebar-content');

    if (!toggleBtn || !content) return;

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;

      // Update ARIA and visibility
      toggleBtn.setAttribute('aria-expanded', newState);
      content.style.display = newState ? 'block' : 'none';

      // Rotate chevron icon
      const icon = toggleBtn.querySelector('svg');
      if (icon) {
        icon.style.transform = newState ? 'rotate(0deg)' : 'rotate(180deg)';
      }

      // Persist state
      localStorage.setItem(this.STORAGE_KEY, newState ? 'expanded' : 'collapsed');
    });
  }

  /**
   * Restore sidebar state from localStorage
   * Complexity: O(1)
   */
  restoreSidebarState() {
    const state = localStorage.getItem(this.STORAGE_KEY);
    if (!state) return;

    const toggleBtn = document.getElementById('sidebar-toggle');
    const content = document.getElementById('sidebar-content');

    if (!toggleBtn || !content) return;

    const isExpanded = state === 'expanded';
    toggleBtn.setAttribute('aria-expanded', isExpanded);
    content.style.display = isExpanded ? 'block' : 'none';

    const icon = toggleBtn.querySelector('svg');
    if (icon) {
      icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
    }
  }

  /**
   * Setup all media controls
   * Complexity: O(n) where n is number of media elements
   */
  setupMediaControls() {
    this.setupAudioSpeed();
    this.setupTimestampJumps();
    this.setupVideoLazyLoad();
  }

  /**
   * Setup audio playback speed control
   * Complexity: O(1)
   */
  setupAudioSpeed() {
    if (!this.audio) return;

    const speedControl = document.getElementById('speed-control');
    if (!speedControl) return;

    speedControl.addEventListener('change', (e) => {
      this.audio.playbackRate = parseFloat(e.target.value);
    });
  }

  /**
   * Setup timestamp jump buttons
   * Complexity: O(n) where n is number of timestamps
   */
  setupTimestampJumps() {
    if (!this.audio) return;

    document.querySelectorAll('.timestamp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const timeStr = btn.dataset.time;
        const seconds = this.parseTimestamp(timeStr);

        this.audio.currentTime = seconds;
        this.audio.play().catch(err => {
          console.warn('Autoplay prevented by browser:', err);
        });
      });
    });
  }

  /**
   * Parse timestamp string to seconds
   * Supports: "MM:SS", "HH:MM:SS", or raw seconds
   * Complexity: O(1)
   */
  parseTimestamp(timeStr) {
    if (!timeStr) return 0;

    if (timeStr.includes(':')) {
      const parts = timeStr.split(':').map(Number);
      if (parts.length === 2) {
        // MM:SS format
        return parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        // HH:MM:SS format
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
    }

    // Raw seconds
    return parseInt(timeStr, 10) || 0;
  }

  /**
   * Setup video lazy loading
   * Complexity: O(n) where n is number of videos
   */
  setupVideoLazyLoad() {
    document.querySelectorAll('.video-thumbnail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const embedId = btn.dataset.embedId;
        const videoIndex = btn.dataset.videoIndex;
        const platform = btn.closest('.video-item').dataset.videoPlatform;
        const container = document.getElementById(`video-${videoIndex}`);

        if (!container || !this.validateEmbedId(embedId)) {
          console.error('Invalid video configuration');
          return;
        }

        // Create iframe
        const iframe = this.createVideoEmbed(platform, embedId);

        // Replace thumbnail with iframe
        container.innerHTML = '';
        container.appendChild(iframe);
        container.classList.remove('hidden');
        btn.style.display = 'none';
      });
    });
  }

  /**
   * Validate embed ID to prevent XSS
   * Complexity: O(m) where m is length of embed ID
   */
  validateEmbedId(embedId) {
    // Only allow alphanumeric, hyphens, and underscores
    return /^[\w-]+$/.test(embedId);
  }

  /**
   * Create video embed iframe
   * Complexity: O(1)
   */
  createVideoEmbed(platform, embedId) {
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '200';
    iframe.style.borderRadius = 'var(--radius-md)';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');

    // Set source based on platform
    if (platform === 'youtube') {
      iframe.src = `https://www.youtube.com/embed/${embedId}?autoplay=1`;
    } else if (platform === 'vimeo') {
      iframe.src = `https://player.vimeo.com/video/${embedId}?autoplay=1`;
    } else {
      console.warn(`Unsupported video platform: ${platform}`);
      iframe.src = '';
    }

    return iframe;
  }

  /**
   * Cleanup observers on destroy
   * Complexity: O(1)
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pageSidebar = new PageSidebar();
  });
} else {
  // DOMContentLoaded already fired
  window.pageSidebar = new PageSidebar();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PageSidebar;
}
