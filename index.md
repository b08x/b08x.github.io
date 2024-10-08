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
   <h2><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h2>
   <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span><br>
   {% if post.badges %}
   {% for badge in post.badges %}
   <span class="badge badge-{{ badge.type }}">{{ badge.tag }}</span>
   {% endfor %}
   {% endif %}
   {{ post.excerpt | split:'<!--more-->' | first }}
   {% if post.excerpt contains '<!--more-->' %}
      <a href="{{ site.baseurl }}{{ post.url }}">read more</a>
   {% endif %}
   </div>
   <hr>
{% endfor %}
