---
title: Custom tools
description: "Tools are MCP-compatible function definitions that your agent can call at runtime. GitAgent Workbench generates tool schemas as part of the agent package, and the serializer ensures they use the correct format for `gitagent validate`."
permalink: /docs/gitagent-workbench/custom-tools/
doc_set: gitagent-workbench
source_path: docs/custom-tools.md
nav_order: 3
toc: true
generated_by: sync-docs.sh
nav_prev:
  title: Agent design patterns
  url: /docs/gitagent-workbench/agent-patterns/
nav_next:
  title: Architecture overview
  url: /docs/gitagent-workbench/architecture/
---

## Tool Definition Schema

Every tool is defined as a YAML file with three required fields:

```yaml
name: read_file
description: Read the contents of a file from the local filesystem
input_schema:
  type: object
  properties:
    path:
      type: string
      description: Absolute path to the file
  required:
    - path
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier for the tool |
| `description` | string | What the tool does, used by the agent to decide when to call it |
| `input_schema` | object | JSON Schema defining the tool's parameters |

### The `input_schema` vs `parameters` Gotcha

**This is the most common serialization error.** Tools MUST use `input_schema`, NOT `parameters`:

```yaml
# CORRECT - MCP-compatible format
input_schema:
  type: object
  properties:
    query:
      type: string

# WRONG - will fail gitagent validate
parameters:
  type: object
  properties:
    query:
      type: string
```

If you use `parameters`, `gitagent validate` will fail with: `"Referenced tool X not found"`.

## How Tools Are Generated

### Via the Wizard

When you add tools in the Capabilities step of the wizard:

1. You define a name and description
2. The serializer generates a default `input_schema` with a generic `input` parameter
3. The tool YAML is written to `tools/<name>.yaml` in the export ZIP

### Via the Generation Pipeline

The `GEN_TOOLS` step uses the AI model to generate tool definitions based on your agent's capabilities and skills. The model produces tool objects that the serializer converts to YAML.

### Manual Definition

You can also define tools directly in your workspace configuration. The serializer respects existing `input_schema` values and only applies defaults when none is provided.

## Common Tool Patterns

### File Operations

```yaml
name: read_file
description: Read file contents
input_schema:
  type: object
  properties:
    path:
      type: string
      description: File path to read
    encoding:
      type: string
      enum: [utf-8, base64]
      default: utf-8
  required: [path]
```

### API Calls

```yaml
name: fetch_weather
description: Get current weather for a location
input_schema:
  type: object
  properties:
    location:
      type: string
      description: City name or coordinates
    units:
      type: string
      enum: [metric, imperial]
      default: metric
  required: [location]
```

### Data Transformations

```yaml
name: parse_csv
description: Parse CSV data into structured records
input_schema:
  type: object
  properties:
    data:
      type: string
      description: Raw CSV string
    delimiter:
      type: string
      default: ","
    has_header:
      type: boolean
      default: true
  required: [data]
```

## Tool Constraints

- Tool names must be unique within an agent package
- Tool names should use snake_case (e.g., `read_file`, not `readFile`)
- The `input_schema` must be valid JSON Schema (draft 2020-12 or earlier)
- Tools are stored as individual YAML files in the `tools/` directory
- The manifest's `tools` array must reference every tool defined in `tools/`
