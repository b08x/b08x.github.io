---
deck_id: sfl-engine-architectural-lineage
order: 5
eyebrow: "4 / 6 — Existential Philosophy"
title: "Facticity vs. Interpretation"
tags: [sartre, ideational, interpersonal]
---
### Origin

Sartre distinguished **facticity** (the objective givens) from **interpretation** (the narrative imposed on them). A situation is never just its facts — but the facts and the story are separable, even though natural language experiences them as one.

### Engineering Translation

The engine physically separates the ideational payload (facticity) from the interpersonal payload (imposed narrative) — separate tables, never fused at storage time. The `ContextSynthesizer` presents these as labeled, separable fields: *"material process; participants: migration, failure"* alongside *"mood: declarative; modality: 0.85; attitude: social_proof"* — not "Every expert agrees the migration is failing!"

**What it gives the system:** a structural mechanism for de-fanging parahuman manipulation — the model must work to reconstruct fused meaning from labeled fields.
{: .fragment}
