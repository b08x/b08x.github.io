---
layout: home
title: Home
id: home
permalink: /
---

# Welcome! 🌱

<p class="py-4 px-2 text-left text-foreground opacity-80 italic">
  A collection of observations tied together with context
</p>

<h3 class="text-lg font-bold text-foreground mb-4">Current Projects:</h3>

<h3 class="text-lg font-bold text-foreground mb-4">Recently updated notes</h3>

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes limit: 5 %}
    <li class="mb-2 text-foreground/90">
      <span class="text-foreground/70 font-mono">{{ note.last_modified_at | date: "%Y-%m-%d" }}</span> — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endfor %}
</ul>

<style>
  .wrapper {
    max-width: 46em;
  }
</style>
