---
deck_id: sfl-engine-architectural-lineage
order: 2
eyebrow: "1 / 6 — Linguistics"
title: "Systemic Functional Linguistics"
tags: [halliday, metafunctions, payload-separation]
---
### Origin

Michael Halliday's SFL treats language as a system of choices. Every clause carries three simultaneous meanings — **Ideational** (what happened), **Interpersonal** (the speaker's stance), **Textual** (how it's organized).

### Engineering Translation

The metafunctions become extractable JSON metadata. Pass 1 classifies process type (material, mental, relational, verbal...). Pass 2 annotates mood, modality, tenor, attitude. Ideational and interpersonal payloads live in `separate tables`, independently indexable and filterable — the structural foundation the rest of the system builds on.

**What it gives the system:** the ability to ask not just "what is this about?" but "how was this said?" — and filter on the answer.
{: .fragment}
