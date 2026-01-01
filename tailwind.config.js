module.exports = {
  darkMode: 'class',
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_notes/*.md',
    './_pages/*.md',
    './src/**/*.{ts,tsx}',
    './*.html',
  ],
  theme: {
    extend: {
      // ===================================
      // TERMINAL AESTHETIC FOUNDATION
      // ===================================
      fontFamily: {
        mono: ['var(--font-mono)', 'Courier New', 'Courier', 'monospace'],
        prose: ['var(--font-prose)', 'Courier New', 'Courier', 'monospace'],
        sans: ['var(--font-prose)', 'Courier New', 'Courier', 'monospace'],
      },

      colors: {
        // Core theme colors (from _theme-variables.scss)
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',

        // Extended palette
        card: 'var(--card)',
        popover: 'var(--popover)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        destructive: 'var(--destructive)',

        // Legacy mappings for backwards compatibility
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-code': 'var(--bg-code)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'link-base': 'var(--link-base)',
        'link-hover': 'var(--link-hover)',

        // Chart colors
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
      },

      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        DEFAULT: 'var(--radius)',
      },

      transitionDuration: {
        fast: 'var(--transition-fast)',
        DEFAULT: 'var(--transition-base)',
        slow: 'var(--transition-slow)',
      },

      // ===================================
      // UNIFIED LAYOUT SYSTEM CONSTRAINTS
      // ===================================

      // Custom Max-Width Values for 3-Tier Layout System
      maxWidth: {
        // Tier 1: Wide Content Layouts (notebook, wiki with 3-columns)
        'notebook': '1800px',           // notebook.html - specialized wide layout
        'wiki-3col': '1536px',          // wiki.html - 3-column mode (desktop XL)

        // Tier 2: Standard Content Layouts (2-column, single-column)
        'content-2col': '1280px',       // 2-column layouts (wiki on desktop, page-sidebar)
        'content': '896px',             // Standard content width (terminal-note, page)

        // Tier 3: Compact Content Layouts
        'compact': '768px',             // Mobile-first narrow content

        // Responsive Container Overrides
        'screen-2xl': '1536px',         // 2xl breakpoint container
        'screen-xl': '1280px',          // xl breakpoint container
        'screen-lg': '1024px',          // lg breakpoint container
        'screen-md': '768px',           // md breakpoint container
        'screen-sm': '640px',           // sm breakpoint container
      },

      // Custom Width Values from SASS Constraints
      width: {
        // Sidebar Widths (from _page-sidebar.scss and layouts)
        'sidebar-sm': '256px',          // 16rem - wiki left nav
        'sidebar-md': '280px',          // notebook right sidebar
        'sidebar-lg': '320px',          // terminal-note sidebar, notebook left sidebar
        'sidebar-xl': '380px',          // notebook left sidebar XL breakpoint

        // Fluid Sidebar (percentage-based)
        'sidebar-fluid': '20%',         // Fluid sidebar width

        // Special Widths
        'scrollbar': '6px',             // Custom scrollbar width
        'icon-sm': '16px',              // Small icon (callouts)
        'icon-md': '20px',              // Medium icon (callouts)
      },

      // Custom Height Values
      height: {
        'scrollbar': '8px',             // Scrollbar thumb height
        'icon-sm': '16px',              // Small icon height
        'icon-md': '20px',              // Medium icon height
      },

      // Grid Template Columns for Terminal Layouts
      gridTemplateColumns: {
        // 3-Column Layouts (wiki.html desktop XL)
        'terminal-3col': '256px 1fr 256px',           // Balanced 3-column
        'terminal-3col-lg': '300px 1fr 300px',        // Larger sidebars

        // Notebook Specialized Grids
        'notebook-base': '320px 1fr 280px',           // Desktop (lg) - default
        'notebook-xl': '380px 1fr 320px',             // Desktop XL - wider sidebars

        // 2-Column Layouts (page-sidebar, wiki tablet)
        'terminal-2col': '1fr 320px',                 // Content + right sidebar
        'terminal-2col-reverse': '320px 1fr',         // Left sidebar + content

        // Flexible 2-Column (for responsive)
        'terminal-2col-fluid': '1fr 25%',             // Content + fluid sidebar
      },

      // Custom Z-Index Scale (Layer Management)
      zIndex: {
        'base': '1',                    // Base content layer
        'sticky': '10',                 // Sticky sidebars and headers
        'dropdown': '20',               // Dropdown menus
        'modal': '100',                 // SearchCmdK modal
        'overlay': '110',               // GraphView overlay
        'toast': '120',                 // Toast notifications
      },

      // Custom Min/Max Height for Sidebars
      minHeight: {
        'sidebar': 'calc(100vh - 3rem)',   // Sidebar minimum height
      },

      maxHeight: {
        'sidebar': 'calc(100vh - 3rem)',   // Sticky sidebar max height
        'sidebar-sticky': 'calc(100vh - 4rem)', // page-sidebar.scss constraint
        'image': '75vh',                   // Image max height from _style.scss
      },

      // Animation Keyframes for Loading States
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },

      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      // Custom Aspect Ratios (notebook video embeds)
      aspectRatio: {
        'video': '16 / 9',
      },

      // Scrollbar Styling Utilities
      scrollbarWidth: {
        'thin': 'thin',
        'none': 'none',
      },
    }
  },

  // ===================================
  // VARIANTS & PLUGINS
  // ===================================
  variants: {
    extend: {
      // Enable print utilities for _print.scss migration
      display: ['print'],
      visibility: ['print'],
      margin: ['print'],
      padding: ['print'],
      fontSize: ['print'],

      // Enable dark mode variants
      backgroundColor: ['dark', 'hover', 'focus'],
      textColor: ['dark', 'hover', 'focus'],
      borderColor: ['dark', 'hover', 'focus'],
    },
  },

  plugins: [
    require('@tailwindcss/typography'),

    // Custom Plugin: Scrollbar Utilities (Tailwind v4 compatible)
    function ({ addUtilities }) {
      const scrollbarUtilities = {
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
        '.scrollbar-none': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',  /* IE and Edge */
        },
        '.scrollbar-terminal': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'rgba(156, 163, 175, 0.3) transparent',
        },
      };
      addUtilities(scrollbarUtilities);
    },
  ],
};
