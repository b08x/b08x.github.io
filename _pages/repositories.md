---
layout: page
permalink: /repositories/
title: repositories
description: Edit the `_data/repositories.yml` to include your GitHub and GitLab profiles and repositories.
nav: true
nav_order: 4
---

## GitHub Users

{% if site.data.repositories.github_users %}
<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for user in site.data.repositories.github_users %}
    {% include repository/repo_user.liquid username=user platform="github" %}
  {% endfor %}
</div>

---

{% if site.repo_trophies.enabled %}
{% for user in site.data.repositories.github_users %}
{% if site.data.repositories.github_users.size > 1 %}
  <h4>{{ user }}</h4>
{% endif %}
  <div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% include repository/repo_trophies.liquid username=user %}
  </div>

---

{% endfor %}
{% endif %}
{% endif %}

## GitLab Users

{% if site.data.repositories.gitlab_users %}
<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for user in site.data.repositories.gitlab_users %}
    {% include repository/repo_user.liquid username=user platform="gitlab" %}
  {% endfor %}
</div>

---
{% endif %}

## GitHub Repositories

{% if site.data.repositories.github_repos %}
<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo platform="github" %}
  {% endfor %}
</div>
{% endif %}

## GitLab Repositories

{% if site.data.repositories.gitlab_repos %}
<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.gitlab_repos %}
    {% include repository/repo.liquid repository=repo platform="gitlab" %}
  {% endfor %}
</div>
{% endif %}
