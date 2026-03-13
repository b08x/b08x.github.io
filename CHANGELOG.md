## [unreleased]

### 🚀 Features

- Add VideoPlayer component and example page for interactive video tutorials.
- Add responsive notebook layout with React island components
- Add collapsible sidebar layout with demo page
- Switch to a light theme with updated color palette, typography, spacing, and transition variables.
- Implement dark mode with new theme variables, Tailwind configuration, and theme manager updates, and correct a video URL.
- Replaced claude.md with agent-organizer
- Implement unified shell component architecture, consolidate layouts, and add new wiki content with a dedicated generator.
- Add Omega-13 wiki and development documentation, remove backup files, and update site configurations.
- Refactor wiki page generation to use numbered slugs with pagination and add new Voice-to-SSML project page.
- Introduce NLP AI notebook example and enable graph visualization for wiki and notebook pages.
- Implement single note detail view in NotesGrid, replacing multi-select functionality.
- Integrate video display into the NotesGrid React component, receiving video data via props.
- Process notebook content as Markdown before JSON output
- Refactor callout styling for terminal theme unification and design token usage, and add a callout test file.
- Add new wiki layout and refine callout styling.
- Add repository links and convert local source file paths to GitHub URLs across wiki pages.
- Add Mermaid dependency and components for diagram rendering
- Add zoom, pan, and download capabilities to Mermaid diagrams and update rendering logic.
- Add new notes, refactor wiki generation with a new script and disabled plugin, and update Jekyll build commands.
- Add new wikilinks to an NLP notebook, update the notes graph with new edges, and refactor the wiki page generator to always enrich data but conditionally generate files.
- Add `CodeBlock` component with dynamic syntax highlighting and theme switching.
- Enable word wrapping for code blocks and update garden widget components.
- Implement auto-hiding header that reveals on scroll-up.
- Added Mononoki and Hack fonts, add new project pages, and include a new note.
- Enhance main README with detailed overview, features, and installation, and add a new components README.
- Add projects page, enhance wiki page layout with source context and related pages, and update styling and content.
- Add Base64 encoding/decoding for React component props via new Jekyll filter and JS.
- Add HelloGarden component and update build artifacts.
- Improve CodeBlock component styling and simplify its structure
- Update React references and integrate react-icons library.
- Update CodeBlock component and rebuild garden-widgets bundle.
- Enhance code blocks with automatic indentation and filename detection, update copy functionality, and refine callout styling.
- Add Jekyll plugin and React component for embedding videos via react-player.
- Add subtitle and enhanced tag display to terminal layout, update last modified date format, and restructure a note's title and permalink.
- *(canvas)* Implement interactive canvas system
- Offload D3 graph simulation to a web worker for improved responsiveness.
- Improve CodeBlock component styling and simplify its structure
- Update React references and integrate react-icons library.
- Update CodeBlock component and rebuild garden-widgets bundle.
- Enhance code blocks with automatic indentation and filename detection, update copy functionality, and refine callout styling.
- Add Jekyll plugin and React component for embedding videos via react-player.
- Add subtitle and enhanced tag display to terminal layout, update last modified date format, and restructure a note's title and permalink.
- *(canvas)* Implement interactive canvas system
- *(canvas)* Implement interactive canvas system
- *(canvas)* Overhaul JsonCanvasViewer and cleanup legacy assets
- Implement dynamic content fetching for canvas file nodes, introduce dedicated link card rendering, and create a new welcome page.
- Enable Liquid rendering within canvas JSON data and enhance canvas viewer with error handling and styling.
- *(ui)* Add notes page and update terminal layouts
- Automatically fit canvas content to screen on load, remove unused UI components, and adjust homepage canvas element positions.
- Add responsive mode to JsonCanvasViewer, disabling pan/zoom/drag/resize and adjusting node layout on smaller screens.
- Update omega-13 docs, wiki layout, and add resources
- *(layouts)* Enhance sidebar logic and add default note configuration
- *(wiki)* Improve page generation and navigation display
- *(config)* Setup jekyll-picture-tag
- *(assets)* Add lightbox2 library and reorganize images
- Integrate lightbox and update content layouts
- *(ui)* Integrate react-photo-view with global provider
- *(content)* Add Leia pipeline demo and cleanup notes
- *(layout)* Redesign note layout with left-side TOC
- *(content)* Update natural pacing protocol note and refine layout widths
- *(layout)* Add mobile navigation drawer with responsive grid system
- *(prompts)* Add PromptFlowDiagram and migrate pacing protocol
- *(prompts)* Implement YAML-driven prompt flow visualization and layout
- Introduce a presentation system with a dedicated layout, interactive slides, and media controls.
- *(presentation)* Expand slide container to full width and refine splitting logic
- Implement URL hash synchronization for slides and fragment stepping with a new presentation demo.
- Pre-process presentation slides to inject fragment classes and centralize fragment visibility logic.
- *(presentation)* Add PDF-to-slides generator and layout
- *(presentation)* Enhance PresentationIsland with interactive features and UI refinements
- *(canvas)* Overhaul system with server-side processing and Spec 1.0 compliance

### 🐛 Bug Fixes

- Correct CSS load order for proper cascade
- *(lightbox)* Add markup type to preset and correct liquid tag syntax

### 💼 Other

- *(deps)* Bump rouge from 4.6.1 to 4.7.0
- *(deps)* Bump nokogiri from 1.18.10 to 1.19.0
- Update compiled JS bundle and its source map.

### 🚜 Refactor

- Update JavaScript bundling and knowledge base section styling.
- Migrate wiki structure to directory-based index pages and add an AI agent workflow definition.
- Migrate styling to use semantic CSS utility classes for improved theming.
- Centralize theme initialization to client-side JavaScript and update resolution priority.
- Standardize wiki page navigation and display with numbered slugs.
- Reduce `garden-widgets.js` bundle size and update CI build commands.
- Consolidate layout system by removing default and wiki-layout, updating pages to use new base layouts, and enhancing terminal-layout sidebar functionality.
- Remove `show_graph` metadata from wiki pages and generation scripts.
- *(graphview)* Relocate to canvas homepage as movable node
- Consolidate CSS build pipeline to single output path
- *(css)* Migrate code block styles from SASS to Tailwind
- Migrate callout styles to `tailwind.css`, delete various archived SASS files, and add `todo.md`.
- Extract component styles from tailwind.css into dedicated files and add todo.md
- Remove misleading 'terminal' nomenclature
- *(knowledgebase)* Switch to base-shell layout and update carousel styling
- *(layouts)* Migrate wiki layout to base-shell
- *(assets)* Replace jquery lightbox with react component
- *(layouts)* Remove collapsible sidebar and simplify layout structure
- *(presentation)* Remove experimental 3D tilt and custom cursor effects
- Update the PDF source path in the slide generator plugin.
- *(layout)* Optimize DOM structure and enforce design tokens
- *(ui)* Harmonize theme tokens and viewport handling

### 📚 Documentation

- Enhance README with comprehensive architecture documentation
- Layout adjustments and index updates.
- Remove outdated development documentation, including migration plans and executive summaries.
- Add comprehensive documentation to wiki generation script, update about and wikis page content, and refine hero section display logic.
- Add AGENTS.md documentation for components, plugins, layouts, and includes.
- Remove Claude dispatch protocol documentation and update agent-related files.
- Expand styling details to describe high-contrast IDE theme implementation.
- Update layout documentation to reflect a consolidated inheritance hierarchy, reduced layout count, and improved UI/UX consistency.
- Update README with increased counts for React components, Jekyll plugins, and layout templates, and refined documentation description.
- Add knowledge base documents for `_sass` and `src/utils` directories, and a CSS architecture refactoring plan.
- Updated `README.md` to reference new `AGENTS.md` documentation.
- Update deployment instructions to recommend GitHub Pages and remove Netlify configuration and related files.
- Add JavaScript and CSS architecture documentation.
- Add documentation links for assets/js and assets/css.
- Update implementation session state - all phases complete
- Update AGENTS.md files to reflect refactoring changes
- *(AGENTS.md)* Update project metadata, file structure, and build notes
- Sync knowledge base, add CHANGELOG.md and ansible ontology note
- *(wikis)* Add SFL Prompt Studio V2 documentation
- *(project)* Initialize and update AGENTS.md documentation across subsystems

### ⚡ Performance

- Self-host JetBrains Mono and Inter fonts
- Enable JavaScript code splitting with esbuild

### 🎨 Styling

- Add responsive horizontal padding to navigation, headers, and footers, and refactor the terminal note layout container.
- Add responsive container classes to main content and adjust sidebar's minimum width.
- Adjust text color opacity in multiple components and layouts for improved readability.
- Adjust code block border radius to use `--radius-sm` variable.
- Adjust code block border radius to use `--radius-sm` variable.
- *(layout)* Update main content column span and clean up sidebar markup
- *(ui)* Standardize design tokens and improve accessibility

### ⚙️ Miscellaneous Tasks

- Remove old note layout and refine Jekyll build configuration by adjusting included and excluded files.
- Remove the Jekyll react-player plugin files.
- Setup implementation session for refactor
- Remove commented-out Sass variable definitions
- Remove planning files and refine aesthetic nomenclature
- *(config)* Expand jekyll exclude list and update AGENTS metadata
- Remove DashboardIsland component and its layout, updating related documentation and island registry.

### ◀️ Revert

- Remove code splitting - excessive network overhead
## [1.2.0] - 2025-12-26

### 🚀 Features

- Introduce Omega-13 wiki content with dedicated layout, data, and navigation updates.
- Implement a new paginated knowledgebase layout with dedicated styling and JavaScript.
- Refactor content layouts to use utility classes for centering and padding, and add cache-busting to compiled CSS.

### 🚜 Refactor

- Rework page layouts with a flexible container, add comprehensive styling for Mermaid diagrams and lists, and update gitignore.

### 🎨 Styling

- Use single quotes for compiled CSS link path
## [1.1.0] - 2025-12-25

### 🚀 Features

- Implement dark terminal theme for digital garden
- Introduce React component islands built with Vite for dynamic content.
- *(core)* Switch to esbuild and add React islands (Graph, Search)
- Add Containerfile, docker-compose.yml, CLAUDE.md, LICENSE, and README.md to Jekyll's include list.

### 🚜 Refactor

- *(ui)* Reorganize terminal layout and sidebar TOC
- Document hybrid Jekyll/React architecture, update build commands, and streamline CI workflow to use `npm run build` with npm caching.

### 📚 Documentation

- Comprehensive README with dark terminal theme and stack documentation
