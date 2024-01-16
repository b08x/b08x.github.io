---
id: index
aliases:
  - Welcome!
tags: []
layout: home
permalink: /
title: Home
---

# Welcome!

<p style="border-radius: 4px;">
  Take a look at the <span style="font-weight: bold">[[graph]]</span> 
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
  {% if note.layout == 'dox' %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endif %}
  {% if note.layout == 'vidpreview' %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endif %}
  {% if note.layout == 'project' %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endif %}
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

