---
deck_id: sfl-engine-architectural-lineage
order: 3
eyebrow: "2 / 6 — Psychology"
title: "Cognitive Behavioral Therapy"
tags: [distortions, stance-filtering]
---
### Origin

Aaron Beck's CBT identifies **cognitive distortions** — emotional reasoning, hyperbolic extremes, mind reading — as recognizable, classifiable linguistic patterns, not just bad arguments.

### Engineering Translation

Retrieval applies scalar filters on the interpersonal payload: high `min_modality` excludes hedged or speculative text; high `min_tenor` excludes informal, emotionally charged register; mood filtering excludes exclamative/imperative pressure. The system doesn't diagnose distortions — it detects their *structural fingerprints* and excludes them before the LLM ever sees them.

**What it gives the system:** a programmatic defense against manipulative text that works on metadata, not on semantics.
{: .fragment}
