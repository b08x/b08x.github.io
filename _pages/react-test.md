---
layout: content-layout
title: React Integration Test
permalink: /react-test/
---

# React Integration Test

This page tests the integration of React "Islands" within the Jekyll static site.

{% assign hello_props = '{"name": "Gemini Explorer"}' | from_json %}
{% capture placeholder %}<p>Loading React component...</p>{% endcapture %}
{% include island.html name="HelloGarden" props=hello_props placeholder=placeholder %}

If you see a box with "Hello, Gemini Explorer" above, the integration is successful.
