/**
 * Theme Management System
 * Handles theme switching with localStorage persistence
 * Performance: O(1) theme resolution and switching
 */

class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'preferred-theme';
    this.DARK_CLASS = 'dark';
    this.htmlElement = document.documentElement;
    this.toggleButton = null;

    this.initialize();
  }

  /**
   * Initialize theme system
   * Priority: .dark class > localStorage > prefers-color-scheme > default (light)
   * Complexity: O(1)
   */
  initialize() {
    const theme = this.resolveTheme();
    this.applyTheme(theme);
    this.setupToggleButton();
    this.watchSystemPreference();
  }

  /**
   * Resolve theme based on priority hierarchy
   * Returns: 'light' | 'dark'
   * Complexity: O(1)
   */
  resolveTheme() {
    // Priority 1: Explicit class already set
    if (this.htmlElement.classList.contains(this.DARK_CLASS)) {
      return 'dark';
    }

    // Priority 2: Stored preference
    const storedTheme = localStorage.getItem(this.STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    // Priority 3: OS preference (dark mode)
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // Priority 4: Default to light
    return 'light';
  }

  /**
   * Apply theme to document
   * Complexity: O(1) - Single class toggle triggers CSS cascade
   */
  applyTheme(theme) {
    // Use requestAnimationFrame to batch DOM updates
    requestAnimationFrame(() => {
      if (theme === 'dark') {
        this.htmlElement.classList.add(this.DARK_CLASS);
      } else {
        this.htmlElement.classList.remove(this.DARK_CLASS);
      }

      localStorage.setItem(this.STORAGE_KEY, theme);

      // Dispatch custom event for components that need to react
      window.dispatchEvent(new CustomEvent('themechange', {
        detail: { theme }
      }));
    });
  }

  /**
   * Toggle between light and dark themes
   * Complexity: O(1)
   */
  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    return newTheme;
  }

  /**
   * Setup theme toggle button functionality
   * Complexity: O(1)
   */
  setupToggleButton() {
    this.toggleButton = document.getElementById('theme-toggle');

    if (!this.toggleButton) {
      console.warn('Theme toggle button not found (id="theme-toggle")');
      return;
    }

    this.toggleButton.addEventListener('click', () => {
      const newTheme = this.toggleTheme();
      this.updateToggleButtonState(newTheme);
    });

    // Set initial button state
    const currentTheme = this.htmlElement.getAttribute(this.ATTRIBUTE) || 'dark';
    this.updateToggleButtonState(currentTheme);
  }

  /**
   * Update toggle button appearance
   * Complexity: O(1)
   */
  updateToggleButtonState(theme) {
    if (!this.toggleButton) return;

    const icon = this.toggleButton.querySelector('.icon');
    if (icon) {
      // Rotate icon for visual feedback
      icon.style.transform = theme === 'light' ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    // Update ARIA label for accessibility
    this.toggleButton.setAttribute('aria-label',
      `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`
    );
  }

  /**
   * Watch for OS theme preference changes
   * Complexity: O(1) event listener registration
   */
  watchSystemPreference() {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    darkModeQuery.addEventListener('change', (e) => {
      // Only apply if user hasn't set explicit preference
      const hasExplicitPreference = localStorage.getItem(this.STORAGE_KEY);
      if (!hasExplicitPreference) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateToggleButtonState(newTheme);
      }
    });
  }

  /**
   * Get current theme
   * Returns: 'light' | 'dark'
   * Complexity: O(1)
   */
  getCurrentTheme() {
    return this.htmlElement.classList.contains(this.DARK_CLASS) ? 'dark' : 'light';
  }

  /**
   * Force specific theme (for testing/debugging)
   * Complexity: O(1)
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.error(`Invalid theme: ${theme}. Must be 'light' or 'dark'.`);
      return;
    }
    this.applyTheme(theme);
    this.updateToggleButtonState(theme);
  }
}

// Initialize theme manager on DOMContentLoaded
// Prevents FOUC by ensuring theme is set before body render
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
  });
} else {
  // DOMContentLoaded already fired
  window.themeManager = new ThemeManager();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
