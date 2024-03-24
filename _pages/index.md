---
id: index
aliases:
  - Welcome!
tags: 
layout: graph
permalink: /index
title: Home
---


# syncopated notes

<strong>Recently updated notes</strong>
<ul>
  {% assign recent_items = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for item in recent_items limit: 25 %}
    <li>
      {{ item.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ item.url }}">{{ item.title }}</a>
    </li>
  {% endfor %}
</ul>