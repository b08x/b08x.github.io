---
layout: page
title: Home
id: home
permalink: /
---


<strong>Recently updated:</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes limit: 5 %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — {{ note.categories[1] }}: <a class="post-link" href="{{ note.url | relative_url }}">{{ note.title }}</a>
    </li>
  {% endfor %}
</ul>



<style>
  .wrapper {
    max-width: 80%;
  }
</style>
