/**
 * Knowledgebase Paginator
 * Splits content by H2 tags and creates a carousel/pagination experience.
 */

document.addEventListener('DOMContentLoaded', () => {
    const rawContent = document.getElementById('kb-raw-content');
    const carouselInner = document.getElementById('kb-carousel-inner');
    const toc = document.getElementById('kb-toc');
    const prevBtn = document.getElementById('kb-prev');
    const nextBtn = document.getElementById('kb-next');
    const pagination = document.getElementById('kb-pagination');

    if (!rawContent || !carouselInner) return;

    // 1. Fragment the content
    const sections = [];
    let currentSection = null;

    // Move all children of raw content into sections based on H2
    Array.from(rawContent.children).forEach(child => {
        if (child.tagName === 'H2' || (sections.length === 0 && !currentSection)) {
            currentSection = document.createElement('div');
            currentSection.className = 'kb-section prose prose-lg font-prose';
            sections.push(currentSection);
        }
        currentSection.appendChild(child.cloneNode(true));
    });

    // Clear and append fragmented sections
    carouselInner.innerHTML = '';
    sections.forEach(section => carouselInner.appendChild(section));

    // 2. Initialize State
    let currentIndex = 0;
    const totalSections = sections.length;

    // 3. Build Sidebar TOC and Pagination Dots
    sections.forEach((section, index) => {
        const h2 = section.querySelector('h2');
        const title = h2 ? h2.textContent : `Section ${index + 1}`;

        // TOC Link
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'kb-nav-link';
        link.textContent = title;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            goToSection(index);
        });
        toc.appendChild(link);

        // Pagination Dot
        const dot = document.createElement('div');
        dot.className = 'kb-dot';
        dot.addEventListener('click', () => goToSection(index));
        pagination.appendChild(dot);
    });

    // 4. Navigation Logic
    function updateUI() {
        // Slide carousel
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update Buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalSections - 1;

        // Update TOC Active State
        document.querySelectorAll('.kb-nav-link').forEach((link, i) => {
            link.classList.toggle('active', i === currentIndex);
        });

        // Update Dots
        document.querySelectorAll('.kb-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Scroll to top of content area
        document.getElementById('kb-carousel-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function goToSection(index) {
        if (index < 0 || index >= totalSections) return;
        currentIndex = index;
        updateUI();
    }

    prevBtn.addEventListener('click', () => goToSection(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSection(currentIndex + 1));

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToSection(currentIndex - 1);
        if (e.key === 'ArrowRight') goToSection(currentIndex + 1);
    });

    // Initial UI state
    updateUI();
});
