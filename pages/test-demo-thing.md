---
layout: liminal-deck
title: test demo thing
permalink: "/test-demo-thing/"
slides:
- title: INTRODUCING CONVOWORKBENCH
  subtitle: A unified in-browser conversation workbench for Claude & ChatGPT exports
  author: B08X_SYSTEMS
  date: '2023-10-05'
  tags:
  - TOOLING
  - CONVERSATIONS
  - GRAPHQL
  content: "<p class='text-xl font-bold text-gray-900'>No server. No database. No
    CLI.</p><p class='text-lg text-gray-700 mt-4'>Everything runs in-browser with
    zero dependencies.</p>"
- title: UNIFIED CONVERSATION GRAPH
  subtitle: Import & merge conversation exports into a queryable GraphQL interface
  author: B08X_SYSTEMS
  date: '2023-10-05'
  tags:
  - GRAPHQL
  - DATA
  - INTEGRATION
  content: "<ul class='list-disc list-inside text-lg text-gray-800 space-y-2'><li>Claude:
    <code class='bg-gray-100 p-1 rounded'>conversations.json</code>, <code class='bg-gray-100
    p-1 rounded'>projects.json</code>, <code class='bg-gray-100 p-1 rounded'>memories.json</code></li><li>ChatGPT:
    <code class='bg-gray-100 p-1 rounded'>conversations.json</code></li><li>Browser-native
    GraphQL queries</li></ul>"
- title: HUMAN-IN-THE-LOOP RATING
  subtitle: Evaluate conversations for correctness, tone, and format
  author: B08X_SYSTEMS
  date: '2023-10-05'
  tags:
  - UX
  - QUALITY
  - FEEDBACK
  content: "<ul class='list-disc list-inside text-lg text-gray-800 space-y-2'><li>UI-driven
    rating system (matching screenshots)</li><li>Metrics: correctness, tone, format
    adherence</li><li>Persistent session-based feedback</li></ul>"
- title: TRAJECTORY SUMMARIES & SKILL DISTILLATION
  subtitle: Compile rated conversations into transferable gitagent skills
  author: B08X_SYSTEMS
  date: '2023-10-05'
  tags:
  - AUTOMATION
  - SKILLS
  - YAML
  content: "<ul class='list-disc list-inside text-lg text-gray-800 space-y-2'><li>Generate
    <code class='bg-gray-100 p-1 rounded'>SKILL.md</code> files (kebab-case)</li><li>YAML/JSON
    keys in <code class='bg-gray-100 p-1 rounded'>snake_case</code></li><li>Compatible
    with gitagent workflows</li></ul>"
- title: CONSTRAINTS & COMPLIANCE
  subtitle: Security, formatting, and provider rules
  author: B08X_SYSTEMS
  date: '2023-10-05'
  tags:
  - SECURITY
  - STANDARDS
  - API
  content: "<ul class='list-disc list-inside text-lg text-gray-800 space-y-2'><li>API
    keys in <code class='bg-gray-100 p-1 rounded'>sessionStorage</code> only</li><li>OpenRouter
    as CORS-safe provider</li><li>No <code class='bg-gray-100 p-1 rounded'>generateObject</code>
    — use <code class='bg-gray-100 p-1 rounded'>generateText + Output.object()</code></li></ul>"
---
