---
layout: page
title: Home
id: home
permalink: /
---

# Welcome!

<p style="padding: 1em 1em; background: #5f5f5f; border-radius: 4px;">
  Take a look at <span style="font-weight: bold">[[Syncopated]]</span> to get started on your exploration.
</p>


<strong>Recently updated articles</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes limit: 25 %}
  {% if note.layout == 'article' %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endif %}
  {% endfor %}
</ul>

<strong>Recently updated projects</strong>

<ul>
  {% assign recent_pages = site.pages | sort: "last_modified_at_timestamp" | reverse %}
  {% for page in recent_pages limit: 25 %}
  {% if page.layout == 'project' %}
    <li>
      {{ page.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ page.url }}">{{ page.title }}</a>
    </li>
  {% endif %}
  {% endfor %}
</ul>

<strong>Recently updated notes</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes limit: 25 %}
  {% if note.layout == 'note' %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endif %}
  {% endfor %}
</ul>

<style>
  .wrapper {
    max-width: 46em;
    display: flex;
    flex-direction: column;
  }
</style>

<p>Knowledge Graph:</p>

{% include notes_graph.html %}
