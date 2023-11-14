---
layout: home
title: Home
id: home
permalink: /
---

# Welcome!


<p style="border-radius: 4px;">
  Take a look at <span style="font-weight: bold">[[graph]]</span> to get started on your exploration.
</p>


<strong>Recently updated pages</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes limit: 25 %}
  {% if note.layout == 'page' %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endif %}
  {% endfor %}
</ul>

<strong>Recently updated projects</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes limit: 25 %}
  {% if note.layout == 'project' %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endif %}
  {% endfor %}
</ul>

<strong>Recently updated folders</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes limit: 25 %}
  {% if note.layout == 'folder' %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
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
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{% if note.category %}{{ note.category }} - {% endif %}{{ note.title }}</a>
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

