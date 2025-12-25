module.exports = {
  content:[
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
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        prose: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        bg: '#0a0a0a',
        surface: '#111111',
        border: '#333333',
        foreground: '#e5e5e5',
        muted: '#888888',
        accent: '#ff6600',
      },
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
}