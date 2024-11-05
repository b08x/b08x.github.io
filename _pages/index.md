---
layout: page
title: Home
id: home
permalink: /
---

# Hello! 🌱

<p style="padding: 3em 0.5em; border-radius: 4px;">
  Composite experiments in the field of generative AI.
  <br>
  <br>
  In the context of being alive!
</p>

<strong>Recently updated notes:</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes limit: 5 %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="post-link" href="{{ note.url | relative_url }}">{{ note.title }}</a>
    </li>
  {% endfor %}
</ul>

---


<style>
  .wrapper {
    max-width: --webkit-fill-available;
  }
</style>
