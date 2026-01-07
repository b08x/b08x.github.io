---
layout: content-layout
title: React Integration Test
permalink: /react-test/
---

# React Integration Test

This page tests the integration of React "Islands" within the Jekyll static site.

{% capture hello_props %}{ "name": "Gemini Explorer" }{% endcapture %}
<div data-island="HelloGarden" data-props='{{ hello_props | base64_encode }}'>
  <!-- React will mount here -->
  <p>Loading React component...</p>
</div>

If you see a box with "Hello, Gemini Explorer" above, the integration is successful.
