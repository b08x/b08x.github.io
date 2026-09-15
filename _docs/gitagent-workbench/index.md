---
title: Getting started
description: "GitAgent Workbench is a visual development environment for building production-ready AI agents. It provides a guided, multi-step wizard to configure agent identity, capabilities, model selection, compliance frameworks, and deployment structures, then exports complete agent packages as downloadable ZIP archives."
permalink: /docs/gitagent-workbench/
doc_set: gitagent-workbench
source_path: docs/getting-started.md
nav_order: 1
toc: true
generated_by: sync-docs.sh
nav_next:
  title: Agent design patterns
  url: /docs/gitagent-workbench/agent-patterns/
---

## Agent Concepts

At its core, GitAgent Workbench manages an **AgentWorkspace** — a structured configuration that defines everything an AI agent needs to operate:

- **Manifest** (`agent.yaml`) — Metadata: name, version, description, dependencies, compliance settings
- **Soul** (`SOUL.md`) — The agent's core identity, personality, and mission
- **Rules** (`RULES.md`) — Behavioral boundaries and operational constraints
- **Prompt** (`PROMPT.md`) — System prompt for non-minimal structures
- **Skills** — Reusable capability modules with their own instructions, references, and templates
- **Tools** — MCP-compatible function definitions the agent can call
- **Workflows** — Multi-step orchestration patterns for complex tasks
- **Knowledge** — Documents the agent can reference at runtime

The application supports **9 structure types** that determine which components are generated: `minimal`, `standard`, `full`, `data-analyst`, `web-scraper`, `researcher`, `inheritance`, `multi-repo`, and `monorepo`.

## Prerequisites

- **Node.js 20+** and npm
- An API key for at least one supported AI provider:
  - Anthropic (`ANTHROPIC_API_KEY`)
  - OpenAI (`OPENAI_API_KEY`)
  - Google Gemini (`GOOGLE_API_KEY` or `GEMINI_API_KEY`)
  - Mistral (`MISTRAL_API_KEY`)
  - Groq (`GROQ_API_KEY`)
  - Ollama (local, set `OLLAMA_BASE_URL`)
  - OpenRouter (`OPENROUTER_API_KEY`)

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd gitagent-workbench

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Creating Your First Agent

1. **Enter the Wizard** — Click "Create New Agent" to start the configuration flow
2. **Identity** — Name your agent, set its version and description
3. **Capabilities** — Define skills, tools, and workflows
4. **Model** — Select an AI provider and model for generation
5. **Compliance** — Set risk tier, supervision mode, and review cadence
6. **Structure** — Choose the complexity level (start with `standard`)
7. **Review** — Confirm your configuration
8. **Generate** — The AI pipeline creates all agent files
9. **Export** — Download the complete agent package as a ZIP

## Key Concepts

### Skills vs Tools

**Skills** are high-level capabilities with instructions, references, and templates. They tell the agent *how* to do something. Example: "Code Review" skill with guidelines for reviewing pull requests.

**Tools** are low-level function definitions (MCP-compatible) that the agent can call. They tell the agent *what* it can execute. Example: "read_file" tool that reads a file from disk.

### The Generation Pipeline

When you click "Generate", the orchestrator runs a sequential pipeline of up to 12 steps, conditionally executed based on your structure type:

1. Sanitize inputs (truncate oversized context)
2. Generate YAML manifest
3. Define agent soul
4. Generate instructions (rules, prompt, duties)
5. Configure runtime
6. Generate skills
7. Draft knowledge docs
8. Define tool schemas
9. Configure sub-agents (if any)
10. Plan workflows (full structure only)
11. Generate examples (full structure only)
12. Final validation

### Export Format

The exported ZIP contains a complete, valid agent package:

```
agent.yaml          # Manifest with dependencies and compliance
SOUL.md             # Agent identity
RULES.md            # Behavioral rules
PROMPT.md           # System prompt (non-minimal)
skills/             # Skill directories with SKILL.md files
tools/              # Tool YAML definitions (MCP-compatible input_schema)
workflows/          # Workflow YAML files
knowledge/          # Knowledge documents with index
memory/             # Memory configuration
config/             # Runtime configuration
```

## Next Steps

- [Custom Tools](/docs/gitagent-workbench/custom-tools/) — Learn how to define and use tools in your agents
- [Agent Patterns](/docs/gitagent-workbench/agent-patterns/) — Best practices for agent design
- [API Reference](/docs/gitagent-workbench/api-reference/) — Server API endpoint documentation
- [Architecture](/docs/gitagent-workbench/architecture/) — System overview and data flow
- [Troubleshooting](/docs/gitagent-workbench/troubleshooting/) — Common issues and solutions
