---
layout: collapsible-sidebar
title: "Collapsible Sidebar Demo"
permalink: /collapsible-sidebar-demo/
sidebar_title: "Navigation"
sidebar_link: "/"
poster: "/assets/images/demo-background.jpg"
# Uncomment to test with video:
# video:
#   webm: "/assets/videos/demo.webm"
#   mp4: "/assets/videos/demo.mp4"
show_mask: false
---

## Welcome to the Sidebar

This is a demonstration of the **collapsible sidebar layout**. The sidebar can be toggled open and closed using:

- The toggle button in the top-right corner
- Keyboard shortcut: `Ctrl+B` (or `Cmd+B` on Mac)
- Press `Esc` to close the sidebar

### Features

- **Persistent State**: Your sidebar preference is saved in localStorage
- **Smooth Animations**: CSS transitions for a polished experience
- **Responsive Design**: Adapts to mobile and desktop screens
- **Accessible**: Full ARIA attributes and keyboard navigation
- **Theme-Aware**: Uses CSS custom properties from your theme

### Navigation Links

- [Home](/)
- [About](/about/)
- [Projects](/projects/)
- [Knowledge Base](/kb/)

### Usage

To use this layout in your pages, add to your front matter:

```yaml
---
layout: collapsible-sidebar
sidebar_title: "Your Title"
sidebar_link: "/your-link/"
poster: "/path/to/background.jpg"
# Optional video:
video:
  webm: "/path/to/video.webm"
  mp4: "/path/to/video.mp4"
---
```

The sidebar content comes from your page's main content (markdown body), while the main area can display a background image or video.

---

**Built with**: Jekyll + CSS Custom Properties + Vanilla JavaScript
