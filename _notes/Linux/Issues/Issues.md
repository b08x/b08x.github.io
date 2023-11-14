---
title: Issues
layout: note
links:
  - "[[Linux]]"
---


TODO: sync with gh issues

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes limit: 25 %}
  {% if note.status == "ongoing" %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endif %}
  {% endfor %}
</ul>