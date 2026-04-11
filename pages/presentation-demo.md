---
layout: presentation
title: Presentation System Demo
permalink: /demo-presentation/
---

# Slide 1: Welcome to the Demo

This presentation demonstrates the newly implemented features of the **Syncopated Notes** presentation engine.

- **Bidirectional URL Routing**: Watch the URL hash update as you navigate.
- **Fragment Stepping**: Reveal content item-by-item on a single slide.
- **Keyboard Navigation**: Use Arrows or Space to move forward.

---

# Slide 2: URL State Synchronization

Notice your browser's address bar.

1. As you navigate to this slide, the URL changed to `#slide-2`.
{: .fragment }
2. You can refresh the page, and you will stay on this exact slide.
{: .fragment }
3. Try using the browser's **Back** and **Forward** buttons to see it in action.
{: .fragment }

---

# Slide 3: Fragment Stepping Engine

Fragments allow you to reveal content sequentially.

- This is the first fragment.
{: .fragment }
- This one appears next.
{: .fragment }
- And here is the final piece of the slide.
{: .fragment }

*Press Right Arrow or Space to continue.*

---

# Slide 4: Interactive Elements

The system supports all standard Markdown features:

```typescript
// Fragments work with code blocks too (if wrapped/targeted)!
const feature = "URL Sync + Fragments";
console.log(`Now supporting: ${feature}`);
```

> [!info]
> Even callouts are supported within slides.

---

# Slide 5: Transition Testing

This slide tests the transition between slides with different content densities.

| Feature | Status |
| :--- | :--- |
| Slide Splitting | Working |
| URL Sync | Working |
| Fragment Engine | Working |

---

# Slide 6: Deep Link Test

Try copying this URL: `/demo-presentation/#slide-6` and opening it in a new tab.

It should land you directly on this slide!

---

# Slide 7: The End

Thank you for exploring the new presentation engine features.

[Return to Projects](/projects/)
