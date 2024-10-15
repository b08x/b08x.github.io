---
toc: true
tags:
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: homev2
title: index
date created: Sunday, July 14th 2024, 10:53:59 pm
date modified: Friday, August 2nd 2024, 5:01:10 am
---

{% for post in site.posts limit:10 %}
   <div class="post-preview">
   <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
   <h2><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h2>

   {% if post.badges %}
   {% for badge in post.badges %}
   <span class="badge badge-{{ badge.type }}">{{ badge.tag }}</span>
   {% endfor %}
   {% endif %}
   <blockquote> {{ post.abstract | split:'<!--more-->' | first }}</blockquote>
   {% if post.abstract contains '<!--more-->' %}
      <a href="{{ site.baseurl }}{{ post.url }}">read more</a>
   {% endif %}
   </div>
   <hr>
{% endfor %}


---

## notes

{% for note in site.notes  %}{% capture this_year %}{{ note.date | date: "%Y" }}{% endcapture %}{% capture next_year %}{{ note.previous.date | date: "%Y" }}{% endcapture %}

{% if forloop.first %}<h2 class="c-archives__year" id="{{ this_year }}-ref">{{this_year}}</h2>
<ul class="c-archives__list">{% endif %}
<li class="c-archives__item">
  {{ note.date | date: "%b %-d, %Y" }}: <a href="{{ note.url | prepend: site.baseurl }}">{{ note.title }}</a>
  </li>{% if forloop.last %}</ul>{% else %}{% if this_year != next_year %}
</ul>
<h2 class="c-archives__year" id="{{ next_year }}-ref">{{next_year}}</h2>
<ul class="c-archives__list">{% endif %}{% endif %}{% endfor %}
