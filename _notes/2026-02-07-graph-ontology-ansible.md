---
title: "Graph Ontology for Ansible Automation"
last_updated: "Monday, February 2nd 2026, 12:54:08 pm"
tags:
 - natural-language-processing
 - prompt-engineering
 - generative-ai
layout: note
---

# Technical Specification: High-Fidelity Graph Ontology for Ansible Automation

## 1. Architectural Mandate: The Shift to Cognitive Infrastructure

The enterprise automation landscape has reached a terminal velocity where Infrastructure as Code (IaC), managed as "flat text," creates a cognitive ceiling. Linear YAML parsing is insufficient for reasoning across thousands of roles and disparate repositories. Traditional Vector RAG is architecturally inadequate for this domain; while semantic search can locate a code snippet, it remains blind to Ansible's execution logic, variable precedence, and host-scoping mechanics. This blind spot leads to "context isolation" and the generation of syntactically correct but functionally broken automation.

This specification mandates a transition to **Cognitive Infrastructure** through a high-fidelity Graph Ontology. We are establishing a "structural memory" that maps the semantic intent of automation to its physical execution dependencies. By utilizing a **Ruby-centric, Local-First stack** (`ruby_llm`, `pgvector`, `FalkorDB`, and `Ramalama`), we enable **Deep Reasoning**. This allows AI agents to navigate the mechanics of infrastructure with the precision of a Principal Architect, transforming static repositories into dynamic, queryable knowledge assets.

## 2. Node Taxonomy: Atomic Entities of the Ansible Domain

Granular node typing is non-negotiable for resolving variable precedence and execution scope. Without these distinctions, the reasoning engine cannot distinguish between a default value and a shadowed host-specific override.

|   |   |   |
|---|---|---|
|Node Type|Critical Properties|Reasoning Value (Architectural Question)|
|**Collection**|`namespace`, `version`, `path`|"Which automation units are impacted by a vulnerability in `community.general` v8.0?"|
|**Role**|`path`, `author`, `min_ansible_version`|"What is the blast radius of refactoring the `common` role across the fleet?"|
|**Playbook**|`path`, `yaml_content`|"Which high-level orchestration workflows are currently utilizing deprecated modules?"|
|**Play**|`name`, `hosts_targeted`, `serial`|"How is the execution logic partitioned across production vs. staging host groups?"|
|**Task**|`module`, `yaml_content`, `is_loop`|"Does this task satisfy the idempotency requirements for the target state?"|
|**Variable**|`name`, `value`, `is_secret`|"Where is this configuration defined, and is it being shadowed by a higher-precedence source?"|
|**Module**|`name`, `namespace`, `version`|"Perform cross-repo impact analysis for an upcoming module deprecation."|
|**InventoryGroup**|`name`, `parent_group`|"What is the logical hierarchy and inheritance path for this environment's configuration?"|
|**Host**|`hostname`, `ip_address`, `platform`|"Which specific physical/virtual targets are exposed to this playbook's changes?"|

### Variable Subtypes and Precedence Logic

To solve the "Shadowing" problem, the system must differentiate variables by source. Precedence is resolved by traversing edges from the `Host` node upward through `InventoryGroup` and `Play` nodes to determine the winning value:

* **DefaultVar**: Baseline values in `defaults/main.yml` (Lowest precedence).
* **GroupVar**: Variables derived from inventory hierarchies via `ansible-inventory`.
* **HostVar**: Variables assigned to individual targets.
* **PlayVar**: Variables explicitly defined in plays or via `set_fact` (Highest precedence).

## 3. Edge Taxonomy: Mapping Structural and Functional Dependencies

The semantic integrity of the graph depends on explicit, directional relationship labels. These edges facilitate recursive traversal, allowing the system to trace a variable from its definition to its consumption across the entire dependency tree.

### 3.1 Structural Composition

These edges map the parent-child hierarchies of the repository:

* `(:Collection)-[:COMPOSED_OF]->(:Role)`
* `(:Playbook)-[:COMPOSED_OF]->(:Play)`
* `(:Play)-[:COMPOSED_OF]->(:Task)`
* `(:Role)-[:COMPOSED_OF]->(:Task)`

### 3.2 Dependency & Flow

These edges model runtime requirements and hard dependencies:

* `(:Play)-[:CALLS]->(:Role)`: Runtime invocation.
* `(:Role)-[:DEPENDS_ON]->(:Role)`: Hard dependencies defined in `meta/main.yml`.
* `(:Task)-[:USES]->(:Module)`: Mandatory for technical debt auditing. This allows the "Auditor" agent to flag tasks using unauthorized or deprecated modules across the entire graph.

### 3.3 Data Flow & Scope

Modeling configuration consumption is critical for preventing "undefined variable" hallucinations:

* `(:Role)-[:DEFINES]->(:Variable)`: Default configuration provided by the role.
* `(:Task)-[:USES]->(:Variable)`: Specific data requirements for execution, often extracted from Jinja2 templates.

### 3.4 Logical Analysis

These relationships enable the detection of architectural anti-patterns. The system must implement a detection phase to identify:

* **Circular Dependencies**: Identified by the pattern `(r:Role)-[:DEPENDS_ON*]->(r)`.
* **Orphaned Code**: Nodes of type `Role` or `Task` with no incoming `[:CALLS]` or `[:COMPOSED_OF]` edges.
* **Shadowed Variables**: Identifying multiple `[:DEFINES]` edges for the same variable name across different precedence levels.

## 4. Modeling Complex Control Structures and Logic

Standard YAML parsers lose the dynamic execution logic of Ansible. To achieve high fidelity, we must explicitly model control flow within the graph.

* **Loops**: Tasks utilizing `loop` or `with_items` are flagged with `is_loop: true`. An `[:ITERATES_OVER]` edge must be constructed connecting the **Task** to the specific **Variable** node being iterated.
* **Conditionals**: The `when` clause is stored as a node property. The system establishes a `[:GOVERNED_BY]` edge between the **Task** and the **Variable** determining the execution path, allowing for predictive execution modeling.
* **Jinja2 Variable Extraction**: This is the "critical link." The ingestion pipeline must utilize **AST-based parsing (Tree-sitter)** or rigorous Regexp to identify every `{{ var }}` within task arguments. Every extracted variable must be linked via a `[:USES]` relationship. This ensures that the system can validate variable coverage before any code is dispatched for execution.

## 5. Ingestion Pipeline & The "Coarse-to-Fine" Retrieval Strategy

The ingestion pipeline maintains the "Ground Truth" by synchronizing the code repository with the graph.

### 5.1 The Ingestion Process

1. **Static Analysis**: Utilize `ansible-content-parser` (running in a `Ramalama` container) to generate structured `ftdata.jsonl`.
2. **Inventory Parsing**: Execute `ansible-inventory --list --export` to populate `InventoryGroup` and `Host` nodes with actual infrastructure data.
3. **Graph Construction**: A Ruby-based `GraphImporter` maps the JSONL objects to **FalkorDB**, establishing the node and edge types defined above. Use **Delta Processing** (via `git diff`) to ensure atomic, incremental updates.
4. **Vectorization**: Generate embeddings for Task and Role descriptions using a local LLM via `Ramalama`. Store these in **pgvector**, linked to FalkorDB via the `graph_node_id`.

### 5.2 The Reasoning Engine (Model Context Protocol)

The system utilizes **Model Context Protocol (MCP)** through `ruby_llm-mcp` to expose the graph to the AI agents. The retrieval follows a **Coarse-to-Fine** logic:

* **Coarse Retrieval (Semantic Search)**: The `Agent::Navigator` performs a similarity search in `pgvector` to find "anchor" nodes (e.g., finding roles related to "Hardened Nginx").
* **Fine Retrieval (Structural Expansion)**: Using the `graph_node_id`, the system performs a multi-hop Cypher traversal in **FalkorDB** to retrieve the narrative context—including parent roles, required variables, and dependency chains.

This architecture transforms a static, flat repository into a dynamic knowledge asset. By grounding the LLM in the structural reality of the graph, we enable autonomous infrastructure management that is both architecturally sound and contextually aware.
