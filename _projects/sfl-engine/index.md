---
permalink: /sfl-engine/
title: "SFL Engine"
description: "Stance-filtered RAG for LLM security — separates what was said from how it was said, then filters the how before it reaches the model."
status: "Active"
timeframe: "2025 — present"
tags: [ruby, rag, security, llm]
links:
  - label: "github.com/b08x/sfl-engine"
    url: "https://github.com/b08x/sfl-engine"
  - label: "architectural lineage (deck)"
    url: "/sfl-engine/architectural-lineage/"
    internal: true
---

## Problem

Standard RAG retrieves text by semantic similarity and hands it to the LLM as one fused object. But language carries two payloads at once: **facticity** (what happened) and **interpretation** (the persuasion, emotion, and rhetorical stance wrapped around it). *"Everyone agrees this migration is catastrophic!"* contains a factual claim wrapped in a persuasive frame — social proof, hyperbolic modality, declarative pressure. Standard RAG can't see the seam. The LLM absorbs the stance along with the facts.

Prompt-level defenses ("don't be manipulated") fail structurally: the instruction competes with adversarial content on the same channel.

## Approach

SFL Engine applies an MVC-like separation at the data layer, borrowed from Systemic Functional Linguistics' metafunctions:

- **Ideational payload** — processes, participants, circumstances: what happened.
- **Interpersonal payload** — mood, modality, tenor, attitude: how it was said.

A two-pass pipeline extracts and separates them before storage:

```
Input → Pass 1 (spaCy) → Pass 2 (LLM) → Store (Postgres + pgvector)
                         ↓
                   Ideational Payload    → facts, process types, participants
                   Interpersonal Payload → mood, modality, tenor, attitude
                         ↓
                   Retrieve (RRF + Scalar Stance Filters)
                         ↓
                   LLM receives: facts without persuasion
```

Pass 1 (spaCy, subprocess sidecar) is rule-based syntactic parsing — clause boundaries, process types, participants. Pass 2 (LLM, via `ruby_llm`) is semantic annotation — mood, modality weight, tenor, attitude. Retrieval merges vector similarity and keyword search via Reciprocal Rank Fusion, then applies scalar stance filters that exclude clauses matching structural fingerprints of cognitive distortion — before the context window is assembled. This is the **Rhetorical Firewall**: not a claim that manipulation is removed, but a deterministic boundary that keeps rhetorical metadata from being treated as inseparable factual context.

The synthesis is composite, not single-discipline — SFL for the metadata, CBT's distortion taxonomy for the filters, Unix philosophy for the two-pass composability, cybersecurity's air-gapping model for the firewall framing.

## Outcome

Phases 0–5 of the rebuild are implemented: two-pass pipeline, Postgres/pgvector storage, hybrid retrieval, unified analysis engine, boot composition root, CLI, and HTTP API. The system design was assessed with the SIFT protocol at **78/100** — suitable for continued development and controlled internal use, not yet unconditionally production-ready. All P0 (blocking/security/data-integrity) findings from that assessment are fixed and closed: transactionally atomic clause review, sanitized API error responses, a pinned toolchain, opt-in Docker auto-start, and a containerized API service.

This remains a research-oriented engineering artifact, not a validated outcome study — no external corpus has yet established that stance filtering improves LLM reasoning outcomes or adversarial robustness in practice.
