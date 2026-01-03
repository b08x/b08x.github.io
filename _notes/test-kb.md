---
layout: knowledgebase
title: "Project Development Guide"
description: "A comprehensive guide to development and documentation standards blending ServiceNow and User Documentation styles."
resources:
  - title: "API Documentation"
    url: "/api-docs"
  - title: "Design System"
    url: "/design-system"
---

# do headings here count

## Introduction to the System

This knowledgebase layout is designed for detail without sacrificing readability. We use a carousel-style pagination to break long documents into manageable chunks.

Use the sidebar on the left or the controls below to navigate between sections.

## Visual Documentation

Images and screencasts are essential for technical documentation. Here is how they are styled in this layout:

<div class="kb-media">
  <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D" alt="Development Environment Mockup">
  <div class="kb-media-caption">
    <strong>Figure 1:</strong> A typical modern development environment integration.
  </div>
</div>

## Multimedia Integration

We also support audio and video for walkthroughs:

<div class="kb-audio-container">
  <p class="text-sm font-bold mb-2">Listen to the feature overview:</p>
  <audio controls class="w-full">
    <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>
</div>

## Code Examples

Here's how to implement a simple React component:

```javascript
import React from 'react';

const HelloWorld = () => {
  return <h1>Hello, World!</h1>;
};

export default HelloWorld;
```

And here's a Python example:

```python
def fibonacci(n):
    """Generate Fibonacci sequence up to n."""
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a+b
    print()

fibonacci(100)
```

## Best Practices

Documentation should be updated alongside code changes. Our goal is to provide a "ServiceNow" level of detail with "Apple" level of polish.

1. **Detail**: Include every step.
2. **Context**: Why are we doing this?
3. **Verification**: How do we know it works?

Here's how to verify your setup with a bash command:

```bash
#!/bin/bash
# Check system dependencies
command -v node >/dev/null 2>&1 || { echo "Node.js required"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm required"; exit 1; }
echo "All dependencies installed!"
```
