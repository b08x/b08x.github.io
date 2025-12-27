module.exports = {
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
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
}