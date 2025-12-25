/**
 * Terminal TOC Web Component
 * Interactive table of contents with Intersection Observer
 * Uses Shadow DOM for style encapsulation
 */
class TerminalToc extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
    // Wait for DOM to be ready before setting up observer
    setTimeout(() => this.setupIntersectionObserver(), 100);
  }

  render() {
    const mainContent = document.querySelector('#main-content');
    if (!mainContent) {
      this.shadowRoot.innerHTML = '<p style="color: #888888; font-size: 0.875rem;">No headings found</p>';
      return;
    }

    const headings = mainContent.querySelectorAll('h2[id], h3[id]');
    if (headings.length === 0) {
      this.shadowRoot.innerHTML = '<p style="color: #888888; font-size: 0.875rem;">No headings found</p>';
      return;
    }

    const tocItems = Array.from(headings).map(h => {
      const isH3 = h.tagName === 'H3';
      return `
        <li>
          <a href="#${h.id}"
             class="toc-link ${isH3 ? 'toc-h3' : ''}"
             data-target="${h.id}">
            ${h.textContent}
          </a>
        </li>
      `;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          position: sticky;
          top: 1.5rem;
        }

        .toc-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #888888;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .toc-link {
          display: block;
          font-size: 0.8125rem;
          color: #888888;
          text-decoration: none;
          border-left: 2px solid transparent;
          padding-left: 1rem;
          padding-top: 0.375rem;
          padding-bottom: 0.375rem;
          margin-bottom: 0.25rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toc-link:hover {
          color: #e5e5e5;
          border-left-color: #333333;
        }

        .toc-link.active {
          color: #ff6600;
          border-left-color: #ff6600;
          font-weight: 500;
        }

        .toc-h3 {
          padding-left: 2rem;
          font-size: 0.75rem;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      </style>

      <div class="toc-title">On This Page</div>
      <ul class="toc-list">${tocItems}</ul>
    `;

    // Add click handlers for smooth scrolling
    this.shadowRoot.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Update URL hash without jumping
          history.pushState(null, null, `#${targetId}`);
        }
      });
    });
  }

  setupIntersectionObserver() {
    const mainContent = document.querySelector('#main-content');
    if (!mainContent) return;

    const headings = mainContent.querySelectorAll('h2[id], h3[id]');
    if (headings.length === 0) return;

    // Configuration for the observer
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when heading is in top 30% of viewport
      threshold: 0
    };

    // Create the observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          this.setActiveLink(id);
        }
      });
    }, observerOptions);

    // Observe all headings
    headings.forEach(heading => observer.observe(heading));

    // Set initial active state based on hash
    if (window.location.hash) {
      const initialId = window.location.hash.substring(1);
      this.setActiveLink(initialId);
    }
  }

  setActiveLink(targetId) {
    const links = this.shadowRoot.querySelectorAll('.toc-link');
    links.forEach(link => {
      const linkTargetId = link.getAttribute('data-target');
      if (linkTargetId === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Define the custom element
customElements.define('terminal-toc', TerminalToc);
