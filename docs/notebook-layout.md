# Notebook Layout

The notebook layout provides a responsive, three-column layout inspired by NotebookLM, featuring interactive React island components for rich content presentation.

## Layout Structure

The notebook layout consists of three main areas:

1. **Left Sidebar (Source Guide)**: Summary and key topics
2. **Main Content**: Video, notes grid, and custom content
3. **Right Sidebar (Notebook Guide)**: Interactive tools, audio player, and chat

### Responsive Behavior

- **Desktop (>1024px)**: Three-column layout with sticky sidebars
- **Tablet (768px-1023px)**: Stacked single-column layout
- **Mobile (<768px)**: Full-width single-column layout

## Usage

To use the notebook layout, create a new note or page with the following front matter:

```yaml
---
layout: notebook
title: "Your Page Title"

# Source Guide (Left Sidebar)
summary: "A brief summary of your content..."
key_topics:
  - Topic 1
  - Topic 2
  - Topic 3

# Video Section (Main Content)
video_url: "https://www.youtube.com/watch?v=VIDEO_ID"
video_title: "Video Title"

# Audio Player (Right Sidebar)
audio_url: "/assets/audio/your-audio.mp3"
audio_title: "Audio Overview Title"

# Suggested Questions (Right Sidebar)
suggested_questions:
  - "Question 1?"
  - "Question 2?"
  - "Question 3?"

# Notes Grid (Main Content)
notes:
  - id: "note1"
    title: "Note Title"
    description: "Brief description"
    items:
      - "Bullet point 1"
      - "Bullet point 2"
    citations: 4
  - id: "note2"
    title: "Another Note"
    description: "Description"
    citations: 3
---

Your markdown content goes here. This will appear in the main content area
below the notes grid.
```

## Features

### Interactive React Components

The layout uses React "islands" for interactive functionality:

1. **NotesGrid**:
   - Selectable note cards
   - "Add note" and "Select all" actions
   - Responsive grid layout (1-3 columns)

2. **AudioPlayer**:
   - Custom audio controls
   - Playback speed control (0.75x - 2x)
   - Progress bar with seeking
   - Time display

3. **NotebookGuide**:
   - Content generation buttons (FAQ, Study Guide, etc.)
   - Suggested questions
   - Interactive chat interface

### Video Support

The layout supports both YouTube and direct video URLs:

- **YouTube**: Use full YouTube URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`)
- **Direct Video**: Use path to MP4 file (e.g., `/assets/videos/video.mp4`)

### Notes Format

Each note in the `notes` array should have:

- `id` (required): Unique identifier
- `title` (required): Note title
- `description` (required): Brief description
- `items` (optional): Array of bullet points
- `citations` (optional): Number of citations

## Styling

The layout uses Tailwind CSS classes and automatically adapts to light/dark themes through the site's existing theme system.

### Custom Styling

You can add custom styles in your page's front matter or in the content:

```yaml
---
layout: notebook
custom_css: |
  .custom-class {
    /* your styles */
  }
---
```

## Examples

See `_notes/nlp-ai-notebook-example.md` for a complete working example.

## Tips

1. **Keep summaries concise**: Aim for 2-3 paragraphs in the summary
2. **Limit key topics**: 3-7 topics work best visually
3. **Notes grid**: 6-9 notes provide good visual balance
4. **Suggested questions**: 3-5 questions are ideal
5. **Mobile consideration**: All sidebars stack on mobile, so order matters

## Troubleshooting

### React components not loading

1. Ensure JavaScript bundle is built: `npm run build:js`
2. Check browser console for errors
3. Verify `garden-widgets.js` is loaded in `_layouts/default.html`

### Notes grid not displaying

1. Verify `notes` array in front matter is valid YAML
2. Each note must have `id`, `title`, and `description`
3. Check browser console for JSON parsing errors

### Responsive layout issues

1. Clear browser cache
2. Rebuild site: `bundle exec jekyll build`
3. Check Tailwind CSS compilation
