---
layout: distill
permalink: /repositories/
title: repositories
description: Things I Tinker With.
nav: true
nav_order: 4
---

{% if site.data.repositories.github_repos %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo platform="github" %}
  {% endfor %}
</div>
{% endif %}

{% if site.data.repositories.gitlab_repos %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.gitlab_repos %}
    {% include repository/repo.liquid repository=repo platform="gitlab" %}
  {% endfor %}
</div>
{% endif %}
