---
deck_id: sfl-engine-architectural-lineage
order: 6
eyebrow: "5 / 6 — Unix Philosophy"
title: "Do One Thing Well"
tags: [two-pass, dry-struct, composability]
---
### Origin

McIlroy's original Unix principle: small, composable programs communicating through clean, standardized data formats. Complex systems are built by piping simple programs together.

### Engineering Translation

The **Two-Pass architecture** is a Unix pipe with type safety. Pass 1 (spaCy) does syntax; Pass 2 (LLM) does semantic annotation. Neither shares state, neither calls the other, both can run independently. `Dry::Struct` type contracts validate every payload at the boundary — a malformed Pass 1 output can't silently corrupt Pass 2.

**What it gives the system:** a pipeline where each stage can be tested, cached, replaced, and scaled independently — `--pass1-only`, `--resume`, a swappable front end.
{: .fragment}
