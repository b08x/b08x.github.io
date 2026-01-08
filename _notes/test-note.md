---
layout: note
title: "Test Note Layout"
last_modified_at: 2025-12-26
picture: logo001.jpg
---

# Centered Note Test

This is a test of the updated `note` layout. It should be centered on the page and occupy roughly 80% of the width.

## Content Section 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Content Section 2

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```javascript
console.log("This should also be centered");
```


---

## React Photo View Lightbox

Single image with zoom:
{% picture react-lightbox logo001.jpg --alt Logo %}

---

Gallery with multiple images:
{% picture react-lightbox logo001.jpg --picture data-gallery="demo" --alt Logo-1 %}
{% picture react-lightbox image.jpg --picture data-gallery="demo" --alt Image-2 %}