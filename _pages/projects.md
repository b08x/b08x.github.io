---
layout: base-shell
title: Projects
subtitle: Showcase your projects with a hero image (16 x 9)
permalink: /projects
---

<div class="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
  
  <header class="mb-12 border-b border-border pb-8">
    <h1 class="text-3xl md:text-4xl font-mono font-bold mb-4 text-foreground">
      {{ page.title }}
    </h1>
    <p class="text-lg text-foreground/75 font-prose">
      {{ page.subtitle }}
    </p>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

    <div class="flex flex-col border border-border bg-surface rounded-lg overflow-hidden group">
      
      <div class="aspect-video w-full bg-muted/20 overflow-hidden">
        <img src="/path/to/image.jpg" alt="Google" class="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-base" />
      </div>
      
      <div class="flex flex-col flex-1 p-6">
        <h2 class="text-xl font-mono font-bold text-foreground mb-3 mt-0">A Search Engine</h2>
        <p class="font-prose text-muted text-sm leading-relaxed flex-1 mb-6">
          What if you could look up any information in the world? Webpages, images, videos and more.
        </p>
        
        <a href="#" class="inline-flex items-center gap-2 text-accent font-mono text-sm font-semibold hover:text-link-hover transition-colors mt-auto">
          Learn more 
          <span class="group-hover:translate-x-1 transition-transform duration-fast">→</span>
        </a>
      </div>
    </div>
    </div>
</div>
