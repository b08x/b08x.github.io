# Portfolio Data Structure Usage Examples

This file demonstrates how to use the portfolio.yml data structure in Jekyll templates.

## Basic Usage Examples

### Site Title
```liquid
{{ site.data.portfolio.site.title }}
```
Output: "syncopated notes"

### Colors
```liquid
<div style="background-color: {{ site.data.portfolio.colors.primary }}">
```
Output: `<div style="background-color: #f9c552">`

### Navigation Loop
```liquid
{% for item in site.data.portfolio.navigation.items %}
  <a href="{{ item.href }}">{{ item.title }}</a>
{% endfor %}
```

### About Section
```liquid
<h2>{{ site.data.portfolio.about.avatar.initials }}</h2>
{% for paragraph in site.data.portfolio.about.intro_paragraphs %}
  <p>{{ paragraph }}</p>
{% endfor %}

{% for skill in site.data.portfolio.about.skills %}
  <span class="badge-{{ skill.color }}">{{ skill.name }}</span>
{% endfor %}
```

### Featured Project
```liquid
<h3>{{ site.data.portfolio.projects.featured.title }}</h3>
<p>{{ site.data.portfolio.projects.featured.tagline }}</p>
<img src="{{ site.data.portfolio.projects.featured.image }}" alt="{{ site.data.portfolio.projects.featured.title }}">
{% for desc in site.data.portfolio.projects.featured.description %}
  <p>{{ desc }}</p>
{% endfor %}
<a href="{{ site.data.portfolio.projects.featured.link.url }}">
  {{ site.data.portfolio.projects.featured.link.text }}
</a>
```

### Projects Loop
```liquid
{% for project in site.data.portfolio.projects.secondary %}
  <div class="project-card {{ project.theme }}">
    <h4>{{ project.title }}</h4>
    <p>{{ project.description }}</p>
    <a href="{{ project.link.url }}">{{ project.link.text }}</a>
  </div>
{% endfor %}
```

### Experience Timeline
```liquid
{% for job in site.data.portfolio.experience.timeline %}
  <div class="timeline-item {{ job.theme }}">
    <h4>{{ job.title }} - 
      <a href="{{ job.company_url }}">{{ job.company }}</a>
    </h4>
    <span class="period">{{ job.period }}</span>
    <p>{{ job.description }}</p>
  </div>
{% endfor %}
```

### Social Links
```liquid
{% for social in site.data.portfolio.social.links %}
  <a href="{{ social.url }}" class="social-{{ social.platform }}">
    <i class="{{ social.icon }}"></i>
  </a>
{% endfor %}
```

## Benefits of This Structure

1. **Content Separation**: All content is now in YAML, separate from HTML
2. **Easy Updates**: Change text without touching templates
3. **Consistent Theming**: Colors and styles defined once
4. **Flexible**: Can power multiple layouts (portfolio, resume, etc.)
5. **Maintainable**: Clear structure makes updates straightforward
6. **Version Control Friendly**: YAML diffs are human-readable

## Next Steps

1. Create layout files that use this data
2. Create include files for each section
3. Implement the Tailwind-based styling
4. Test with the new modular structure