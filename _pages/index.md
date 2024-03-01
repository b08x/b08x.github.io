---
id: index
aliases:
  - Welcome!
tags: 
layout: home
permalink: /index
title: Home
---

<div class="xs">

<strong>Recently updated items</strong>
<ul>
  {% assign recent_items = site.items | sort: "last_modified_at_timestamp" | reverse %}
  {% for item in recent_items limit: 25 %}
  {% if item.layout == 'article' %}
    <li>
      {{ item.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ item.url }}">{{ item.title }}</a>
    </li>
  {% endif %}

  {% endfor %}
</ul>

<ul>
  {% assign recent_items = site.items | sort: "last_modified_at_timestamp" | reverse %}
  {% for item in recent_items limit: 10 %}
  {% if item.layout == 'page' %}
    <li>
      {{ item.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ item.url }}">{{ item.title }}</a>
    </li>
  {% endif %}
  {% if item.layout == 'project' %}
    <li>
      {{ item.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ item.url }}">{{ item.title }}</a>
    </li>
  {% endif %}
  {% if item.layout == 'note' %}
    <li>
      {{ item.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ item.url }}">{{ item.title }}</a>
    </li>
  {% endif %}

  {% endfor %}
</ul>
</div>

<div class="xs">
<strong>Recently updated items</strong>

<ul>
  {% assign recent_items = site.items | sort: "last_modified_at_timestamp" | reverse %}
  {% for item in recent_items limit: 10 %}
  {% if item.layout == 'item' %}
    <li>
      {{ item.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ item.url }}">{% if item.category %}{{ item.category }} - {% endif %}{{ item.title }}</a>
    </li>
  {% endif %}
  {% endfor %}
</ul>

</div>

  {% for post in paginator.posts %}
  <h1><a href="{{ post.url }}">{{ post.title }}</a></h1>
  <p class="author">
    <span class="date">{{ post.date }}</span>
  </p>
  <p class="content">{{ post.excerpt }}</p>
  {% endfor %}

  <div class="pagination">
    {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path }}" class="previous">Previous</a>
    {% else %}
    <span class="previous">Previous</span>
    {% endif %}
    {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path }}" class="next">Next</a>
    {% else %}
    <span class="next">Next</span>
    {% endif %}
  </div>
