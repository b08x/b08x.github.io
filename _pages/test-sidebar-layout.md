---
layout: page-sidebar
title: "Test Page with Sidebar"
description: "This is a test page demonstrating the responsive sidebar layout with all widgets: TOC, audio player, video embeds, and references."
permalink: /test-sidebar-layout
toc: true
audio_file: "/assets/audio/jazzyfrenchy.mp3"
audio_timestamps:
  - time: "0:30"
    description: "Introduction to the topic"
  - time: "1:45"
    description: "Main content explanation"
  - time: "3:20"
    description: "Conclusion and next steps"
videos:
  - title: "Getting Started Tutorial"
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ"
    platform: "youtube"
    embed_id: "dQw4w9WgXcQ"
  - title: "Advanced Features"
    url: "https://vimeo.com/76979871"
    platform: "vimeo"
    embed_id: "76979871"
sources:
  - title: "Official Documentation"
    url: "https://jekyllrb.com/docs/"
    type: "documentation"
  - title: "Jekyll GitHub Repository"
    url: "https://github.com/jekyll/jekyll"
    type: "github"
  - title: "Tailwind CSS Documentation"
    url: "https://tailwindcss.com/docs"
    type: "documentation"
  - title: "CSS Custom Properties Guide"
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties"
    type: "article"
---

## Introduction

This test page demonstrates the responsive Page with Sidebar layout for Jekyll. The sidebar contains several interactive widgets including a Table of Contents with ScrollSpy, audio player with speed controls, lazy-loaded video embeds, and reference links.

### Key Features

The layout includes the following features:

- **Responsive Design**: Adapts from mobile (vertical stack) to desktop (side-by-side) at the lg breakpoint
- **Sticky Sidebar**: Sidebar remains visible while scrolling on desktop
- **Table of Contents**: Auto-generated from h2 and h3 headings with active section highlighting
- **Media Widgets**: Audio and video players with interactive controls
- **References**: External resource links with type-based icons

## ScrollSpy Demonstration

This section helps demonstrate the ScrollSpy functionality. As you scroll through the page, the Table of Contents in the sidebar should highlight the currently visible section.

### Subsection One

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### Subsection Two

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Audio Player Testing

The sidebar contains an audio player with the following features:

- HTML5 native controls
- Playback speed adjustment (0.75x to 2x)
- Timestamp jump buttons for quick navigation

Try adjusting the speed and clicking the timestamp buttons to test the functionality.

### Sample Content for Scroll

This content helps create enough vertical space to test the sticky sidebar behavior and ScrollSpy functionality properly.

## Video Player Testing

The sidebar includes lazy-loaded video embeds:

- Click the thumbnail to load the iframe
- Supports YouTube and Vimeo platforms
- Autoplay on load
- Validates embed IDs to prevent XSS

### More Sample Content

Additional content to ensure sufficient page length for testing the scroll behavior and sidebar sticky positioning.

## References and Sources

The sidebar displays external references with type-based icons:

- **Documentation**: Book icon
- **GitHub**: Code icon
- **Articles**: Document icon
- **Websites**: Globe icon

## Edge Cases Testing

This section helps test various edge cases:

### Empty State Test

If you remove all widget data from the front matter, the sidebar displays a message indicating no content is configured.

### Duplicate Headings

The TOC generation handles duplicate heading text by appending unique index numbers to the generated IDs.

### Mobile Responsiveness

On mobile devices (< 1024px):

- Sidebar appears below the main content
- Collapsible toggle button controls visibility
- State persists in localStorage

### Theme Compatibility

All widgets use CSS custom properties and should adapt seamlessly to light/dark theme changes.

## Conclusion

This test page demonstrates all features of the responsive Page with Sidebar layout. The implementation follows Jekyll best practices and integrates cleanly with the existing theme system.

### Final Subsection

Thank you for testing the sidebar layout. Please report any issues or unexpected behavior for further refinement.
