// Persisted light/dark switch.
// Any [data-theme-toggle] element becomes a switch; state is shared
// across pages via localStorage. The class itself is applied before
// first paint by the inline snippet in _includes/head.html.
(() => {
  const KEY = 'syncopated-theme';

  const read = () => {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  };
  const write = (v) => {
    try { localStorage.setItem(KEY, v); } catch (e) { /* private mode */ }
  };

  let mode = read()
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const apply = () => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    const glyph = mode === 'dark' ? '◑' : '◐';
    const label = mode === 'dark' ? 'Switch to parchment' : 'Switch to night';
    document.querySelectorAll('[data-theme-toggle]').forEach((el) => {
      el.textContent = glyph;
      el.setAttribute('title', label);
      el.setAttribute('aria-label', label);
    });
  };

  const toggle = () => {
    mode = mode === 'dark' ? 'light' : 'dark';
    write(mode);
    apply();
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-theme-toggle]')) { e.preventDefault(); toggle(); }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
