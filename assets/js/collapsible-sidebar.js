/**
 * Collapsible Sidebar Manager
 * Handles sidebar toggle with localStorage persistence and smooth animations
 * Performance: O(1) toggle and state management
 */

class CollapsibleSidebar {
  constructor() {
    this.STORAGE_KEY = 'collapsible-sidebar-state';
    this.sidebar = null;
    this.toggleButton = null;
    this.mainContent = null;

    this.initialize();
  }

  /**
   * Initialize sidebar system
   * Complexity: O(1)
   */
  initialize() {
    this.sidebar = document.getElementById('right-sidebar');
    this.toggleButton = document.getElementById('sidebar-toggle');
    this.mainContent = document.getElementById('main-content');

    if (!this.sidebar || !this.toggleButton) {
      console.warn('Collapsible sidebar elements not found');
      return;
    }

    this.setupToggleButton();
    this.restoreSidebarState();
    this.setupKeyboardShortcuts();
  }

  /**
   * Setup toggle button click handler
   * Complexity: O(1)
   */
  setupToggleButton() {
    this.toggleButton.addEventListener('click', () => {
      this.toggleSidebar();
    });
  }

  /**
   * Toggle sidebar open/closed
   * Complexity: O(1)
   */
  toggleSidebar() {
    const isCurrentlyOpen = !this.sidebar.classList.contains('collapsed');
    const newState = !isCurrentlyOpen;

    this.setSidebarState(newState);
  }

  /**
   * Set sidebar to specific state (open/closed)
   * @param {boolean} isOpen - true to open, false to close
   * Complexity: O(1)
   */
  setSidebarState(isOpen) {
    // Use requestAnimationFrame to batch DOM updates
    requestAnimationFrame(() => {
      if (isOpen) {
        this.sidebar.classList.remove('collapsed');
        this.toggleButton.classList.add('sidebar-open');
        if (this.mainContent) {
          this.mainContent.classList.add('sidebar-open');
        }
      } else {
        this.sidebar.classList.add('collapsed');
        this.toggleButton.classList.remove('sidebar-open');
        if (this.mainContent) {
          this.mainContent.classList.remove('sidebar-open');
        }
      }

      // Update ARIA attributes for accessibility
      this.toggleButton.setAttribute('aria-expanded', isOpen.toString());
      this.toggleButton.setAttribute(
        'aria-label',
        isOpen ? 'Close sidebar' : 'Open sidebar'
      );

      // Persist state to localStorage
      localStorage.setItem(this.STORAGE_KEY, isOpen ? 'open' : 'closed');

      // Dispatch custom event for components that need to react
      window.dispatchEvent(new CustomEvent('sidebarchange', {
        detail: { isOpen }
      }));
    });
  }

  /**
   * Restore sidebar state from localStorage
   * Priority: localStorage > default (open)
   * Complexity: O(1)
   */
  restoreSidebarState() {
    const storedState = localStorage.getItem(this.STORAGE_KEY);

    // Default to open if no stored preference
    const isOpen = storedState === null || storedState === 'open';

    // Set initial state without animation
    this.sidebar.style.transition = 'none';
    if (this.mainContent) {
      this.mainContent.style.transition = 'none';
    }

    this.setSidebarState(isOpen);

    // Re-enable transitions after initial state is set
    requestAnimationFrame(() => {
      this.sidebar.style.transition = '';
      if (this.mainContent) {
        this.mainContent.style.transition = '';
      }
    });
  }

  /**
   * Setup keyboard shortcuts for accessibility
   * Complexity: O(1)
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Toggle sidebar with Ctrl/Cmd + B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        this.toggleSidebar();
      }

      // Close sidebar with Escape key
      if (e.key === 'Escape') {
        const isOpen = !this.sidebar.classList.contains('collapsed');
        if (isOpen) {
          this.setSidebarState(false);
        }
      }
    });
  }

  /**
   * Get current sidebar state
   * Returns: boolean (true if open, false if closed)
   * Complexity: O(1)
   */
  isOpen() {
    return !this.sidebar.classList.contains('collapsed');
  }

  /**
   * Open sidebar programmatically
   * Complexity: O(1)
   */
  open() {
    this.setSidebarState(true);
  }

  /**
   * Close sidebar programmatically
   * Complexity: O(1)
   */
  close() {
    this.setSidebarState(false);
  }

  /**
   * Cleanup method (if needed for SPA navigation)
   * Complexity: O(1)
   */
  destroy() {
    // Remove event listeners if needed
    // Currently using simple addEventListener, so no cleanup needed
  }
}

// Initialize sidebar manager on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.collapsibleSidebar = new CollapsibleSidebar();
  });
} else {
  // DOMContentLoaded already fired
  window.collapsibleSidebar = new CollapsibleSidebar();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CollapsibleSidebar;
}
