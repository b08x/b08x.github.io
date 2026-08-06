---
deck_id: sfl-engine-architectural-lineage
order: 4
eyebrow: "3 / 6 — Cognitive Neuroscience"
title: "Working Memory Consolidation"
tags: [rolling-synthesis, consolidation]
---
### Origin

Miller's "magical number seven": human working memory is bounded. The brain doesn't hold more — it **consolidates**, compressing short-term memory into long-term semantic memory while preserving gist and discarding raw detail.

### Engineering Translation

The **Rolling Synthesis** pattern mimics this. Instead of forcing an LLM to hold an ever-growing context window, the system periodically compresses processed clauses into dense "Axiomatic" summaries — preserving SFL metadata (process types, modality, tenor) while discarding raw token sequences. This is consolidation, not truncation: the raw clauses stay in Postgres; only the summary carries forward.

**What it gives the system:** reasoning quality at cycle N+100 that matches cycle 1, on documents that would otherwise degrade the window into noise.
{: .fragment}
