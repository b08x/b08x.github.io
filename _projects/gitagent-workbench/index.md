---
permalink: /gitagent-workbench/
title: "GitAgent Workbench"
description: "A visual development environment for AI agents — a guided wizard for identity, capabilities, models, and compliance that exports a complete, validated agent package."
status: "Alpha"
timeframe: "2026"
tags: [typescript, react, agents, ai, tool]
links:
  - label: "github.com/b08x/gitagent-workbench"
    url: "https://github.com/b08x/gitagent-workbench"
  - label: "documentation"
    url: "/docs/gitagent-workbench/"
    internal: true
---

## Problem

Hand-authoring an AI agent package means getting a lot of interlocking pieces right at once: `agent.yaml`, `SOUL.md`, `RULES.md`, skill definitions, MCP-compatible tool schemas, workflows, knowledge docs — each with its own shape, and no single place to see how a change to one ripples into the rest. Tool schemas in particular have a specific, easy-to-miss requirement (`input_schema`, not `parameters`) that a hand-written file will quietly get wrong.

## Approach

GitAgent Workbench is a guided wizard — Identity → Capabilities → Model → Compliance → Structure → Review — that builds a central `AgentWorkspace` state as you go, validated at each step with Zod schemas. The **structure type** you choose (`minimal`, `standard`, `full`, or a domain-specific preset like `data-analyst` or `web-scraper`) determines which of a 12-step generation pipeline actually runs, from manifest and identity generation through skills, tools, and — for `full` structures — multi-step workflows and example outputs.

Generation calls out to one of seven AI provider integrations (Anthropic, OpenAI, Google, Mistral, Groq, Ollama, OpenRouter) with retry logic and a local-synthesis fallback if a provider call fails. Once generation completes, a serializer packages everything into a downloadable ZIP: stripping null values, adding YAML frontmatter to skill files, and normalizing tool schemas to the format `gitagent validate` expects.

An optional sidecar, the local context backend, adds hybrid RAG over your existing agent configs — chunking with tiktoken, storing in SQLite with FTS5 (BM25) and sqlite-vec, and merging keyword and vector results with Reciprocal Rank Fusion — so generation can be grounded in context you already have rather than starting from a blank page.

## Status

Alpha. The wizard, the 12-step generation pipeline, and ZIP export are implemented end-to-end. The local context backend's embedding generation is still TODO in the project's own docs — retrieval falls back to keyword search until that lands.
