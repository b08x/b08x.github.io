# SFL Engine: Hardening RAG Against Context Poisoning
## Article Series Outline

### The Big Picture

Standard RAG retrieves text by semantic similarity and hands it to the LLM as context. But language carries two simultaneous payloads: **facticity** (what happened) and **interpretation** (how it's framed). A clause like *"Everyone agrees this migration is catastrophic!"* contains a factual claim wrapped in persuasive framing. The LLM absorbs the stance along with the facts.

SFL Engine separates these payloads at the storage layer, then filters the rhetorical characteristics *before* they reach the LLM's context window. The defense is structural, not behavioral.

---

### Article 1: Why Your RAG Pipeline Has a Security Gap
**~1,500 words, ~80 lines code**

The problem. What context poisoning looks like. Why prompt-level defenses fail. The architectural insight: separate what was said from how it was said. Overview of the two-pass pipeline. No code yet — just the mental model and a diagram.

**Key concepts**: Facticity vs. interpretation, context poisoning, rhetorical firewall, payload separation.

---

### Article 2: Setting Up Your Agent Orchestration Layer
**~1,800 words, ~150 lines code**

Build the RubyLLM agent patterns that will orchestrate the SFL pipeline. Sequential chains for the two-pass flow. Routing for query classification. Parallel analysis for multi-dimensional annotation. Fan-out/fan-in for the retrieval + filter stage. Evaluator-optimizer for annotation quality.

**Key concepts**: RubyLLM::Agent, composition patterns, Async fibers, tool definitions.

---

### Article 3: Pass 1 — The spaCy Sidecar
**~1,500 words, ~100 lines code**

Syntactic parsing via subprocess. Extracting clause boundaries, process types (material, mental, relational, verbal, behavioral, existential), participants, and circumstances. Ruby ↔ Python communication over stdin/stdout. Deterministic, rule-based, fast.

**Key concepts**: Subprocess sidecar, clause segmentation, process type taxonomy, Dry::Struct contracts.

---

### Article 4: Pass 2 — LLM Annotation
**~1,500 words, ~100 lines code**

Semantic annotation via ruby_llm. Classifying mood (declarative, interrogative, imperative, exclamative), modality weight (0–1 certainty scalar), tenor (formality register), and speaker attitude (social proof, authority, emotional, neutral). Per-task model configuration.

**Key concepts**: RubyLLM chat, structured output, modality scoring, per-task LLM config.

---

### Article 5: Storage — Sequel, pgvector, and Payload Separation
**~1,500 words, ~120 lines code**

Why payloads live in separate tables. Ideational table: processes, participants, circumstances. Interpersonal table: mood, modality, tenor, attitude. Embedding generation and storage. Independent indexing and filtering. Migration patterns.

**Key concepts**: Sequel models, pgvector extension, HNSW indexes, payload isolation.

---

### Article 6: Retrieval — Hybrid Search with Stance Filters
**~1,800 words, ~130 lines code**

The HybridRetriever: vector similarity + keyword search via Reciprocal Rank Fusion. Scalar stance filters that exclude clauses matching structural fingerprints of cognitive distortion. Combining retrieval quality with rhetorical safety.

**Key concepts**: RRF, pg_search, cosine similarity, stance filters, cognitive distortion taxonomy.

---

### Article 7: Wiring It All Together
**~1,500 words, ~100 lines code**

The complete pipeline: Pass 1 → Pass 2 → Store → Retrieve → Filter → LLM. CLI interface via exe/sfl-analyze. Falcon API endpoint. GUI via glimmer-dsl-libui. End-to-end testing.

**Key concepts**: Pipeline orchestration, Falcon streaming, CLI design, integration testing.

---

## Series Statistics

| Article | Words | Lines Code | New Concepts |
|---------|-------|------------|--------------|
| 1. Why Your RAG Has a Security Gap | ~1,500 | ~80 | Problem framing, mental model |
| 2. Agent Orchestration | ~1,800 | ~150 | RubyLLM patterns, composition |
| 3. Pass 1: spaCy Sidecar | ~1,500 | ~100 | Subprocess, clause parsing |
| 4. Pass 2: LLM Annotation | ~1,500 | ~100 | Structured output, modality |
| 5. Storage Layer | ~1,500 | ~120 | pgvector, payload separation |
| 6. Retrieval + Filters | ~1,800 | ~130 | RRF, stance filters |
| 7. Wiring It Together | ~1,500 | ~100 | Full pipeline, API, CLI |
| **Total** | **~11,100** | **~780** | |

---

## Dependencies Between Articles

```
Article 1 (Problem)
    ↓
Article 2 (Agent Patterns)
    ↓
Article 3 (Pass 1) ← Article 2
    ↓
Article 4 (Pass 2) ← Article 2
    ↓
Article 5 (Storage) ← Article 3, 4
    ↓
Article 6 (Retrieval) ← Article 5
    ↓
Article 7 (Full Pipeline) ← All
```

Each article is self-contained but builds on prior context. A reader can start at any point with the code examples, but the series reads linearly for full understanding.
