---
deck_id: sfl-engine-architectural-lineage
order: 7
eyebrow: "6 / 6 — Cybersecurity"
title: "The Rhetorical Firewall"
tags: [air-gapping, sanitization]
---
### Origin

Two infosec concepts: **air gapping** — isolating a critical system from untrusted input — and **data sanitization** — stripping harmful content before it enters a trusted system.

### Engineering Translation

The scalar stance filters act as a firewall gate *before* the LLM's context window, not after. Clauses that fail the filter never enter the synthesis prompt — the model never sees them. This is semantic air gapping (isolation) and semantic sanitization (the facts pass through; the persuasion is filtered and labeled separately) at once.

**What it gives the system:** a defense that doesn't depend on the LLM's cooperation — structural, not behavioral. It removes manipulative content from the channel before the model can be influenced by it.
{: .fragment}
