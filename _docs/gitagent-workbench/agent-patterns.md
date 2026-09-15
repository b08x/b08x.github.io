---
title: Agent design patterns
description: "This guide covers best practices for designing agents with GitAgent Workbench."
permalink: /docs/gitagent-workbench/agent-patterns/
doc_set: gitagent-workbench
source_path: docs/agent-patterns.md
nav_order: 2
toc: true
generated_by: sync-docs.sh
nav_prev:
  title: Getting started
  url: /docs/gitagent-workbench/
nav_next:
  title: Custom tools
  url: /docs/gitagent-workbench/custom-tools/
---

## Choosing a Structure Type

The structure type determines which components the generation pipeline creates. Choose based on your agent's complexity needs:

| Type | Components Generated | Best For |
|------|---------------------|----------|
| `minimal` | Soul, Rules | Simple assistants, quick prototypes |
| `standard` | Soul, Rules, Instructions, Skills, Tools | Most production agents |
| `full` | Everything + Workflows + Examples | Complex multi-step agents |
| `data-analyst` | Standard + data-specific patterns | Data analysis and reporting |
| `web-scraper` | Standard + extraction patterns | Web scraping and content extraction |
| `researcher` | Standard + research patterns | Research and information gathering |
| `inheritance` | Extends existing agent configs | Building on existing agents |
| `multi-repo` | Distributed agent configs | Agents spanning multiple repositories |
| `monorepo` | Multi-agent in single repo | Coordinated agent teams |

### When to Use Each

- **minimal**: Start here for experimentation. You can always upgrade later.
- **standard**: The default choice. Includes enough structure for most use cases.
- **full**: Use when you need workflows (multi-step orchestration) or example outputs for few-shot learning.
- **Domain-specific** (`data-analyst`, `web-scraper`, `researcher`): Use when the agent has a focused domain. These include pre-configured skills and tools for the domain.
- **Composition** (`inheritance`, `multi-repo`, `monorepo`): Use when building agent systems rather than individual agents.

## Agent Composition Patterns

### Inheritance

Extend an existing agent configuration to specialize it:

```
base-agent/
├── agent.yaml
├── SOUL.md
├── RULES.md
└── skills/
    └── base-skill/

specialized-agent/
├── agent.yaml      # Extends base, overrides specific fields
├── SOUL.md         # Domain-specific identity
└── skills/
    └── specialized-skill/
```

### Multi-Agent Coordination

Use sub-agents for delegation:

```yaml
# In agent.yaml
delegation:
  mode: conditional
  agents:
    - code-writer
    - reviewer
```

Each sub-agent gets its own `agents/<name>/` directory with its own manifest, soul, rules, and tools.

### Monorepo Pattern

Multiple agents sharing a repository:

```
/
├── agents/
│   ├── planner/
│   ├── executor/
│   └── reviewer/
├── shared-skills/
└── shared-tools/
```

## Skill Design Patterns

### Single Responsibility

Each skill should do one thing well:

```yaml
# Good: focused skill
name: code_review
description: Review code for quality issues

# Bad: unfocused skill
name: dev_tools
description: Everything a developer needs
```

### Skill Composition

Skills can reference other skills' tools:

```yaml
name: deploy_pipeline
description: Build, test, and deploy
allowed-tools:
  - run_tests
  - build_artifact
  - push_to_registry
```

### Reference Documents

Skills can include reference documents for context:

```
skills/
└── code_review/
    ├── SKILL.md
    ├── references/
    │   ├── style-guide.md
    │   └── common-issues.md
    ├── templates/
    │   └── review-template.md
    └── examples/
        ├── good-review.md
        └── bad-review.md
```

## Compliance and Risk Tiers

Risk tiers affect which compliance components are generated:

| Risk Tier | Duties Generated | Supervision | Review Cadence |
|-----------|-----------------|-------------|----------------|
| `low` | No | `none` or `advisory` | `annual` |
| `standard` | Yes | `conditional` | `quarterly` |
| `high` | Yes | `always` | `monthly` |
| `critical` | Yes | `always` | `daily` |

### Segregation of Duties

For `standard` risk and above, you can define roles with specific permissions and a conflict matrix:

```yaml
compliance:
  segregation_of_duties:
    roles:
      - name: developer
        permissions: [read, write, test]
      - name: reviewer
        permissions: [read, approve]
    conflict_matrix:
      - roles: [developer, reviewer]
        reason: Same person cannot write and approve code
    enforcement_mode: strict
```

## Common Pitfalls

### 1. Missing YAML Frontmatter in Skills

Skills MUST have YAML frontmatter. The orchestrator generates only the body; the serializer adds the `---` block. If you manually create skills, include frontmatter:

```yaml
---
name: my_skill
description: What this skill does
---

# My Skill

Instructions here...
```

### 2. Wrong Tool Schema Key

Always use `input_schema`, never `parameters`. See [Custom Tools](/docs/gitagent-workbench/custom-tools/) for details.

### 3. Over-Generating

Don't use `full` structure when `standard` suffices. Extra components mean more tokens during generation and a larger agent package. Start minimal and add complexity as needed.

### 4. Ignoring Risk Tiers

Setting `critical` risk tier generates strict compliance requirements. Only use it when your agent actually needs that level of oversight.

### 5. Skipping Validation

Always run `gitagent validate` on your exported package before deployment. The built-in validator catches missing frontmatter, incorrect tool schemas, and manifest inconsistencies.
