module.exports = {
  content:[
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_notes/*.md',
    './_pages/*.md',
    './*.html',
  ],
  theme: {
    extend: {}
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
}