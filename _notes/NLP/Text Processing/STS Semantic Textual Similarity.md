---
layout: note
title: STS (Semantic Textual Similarity)
subtitle: 
category:
  - NLP
tags:
  - text-processing
links:
---
## STS (Semantic Textual Similarity)

Comparison of sentence pairs. We may want to identify patterns in datasets, but this is most often used for benchmarking. Assesses logical coherence of requests in conversational context. Do they (the requests) maintain logical coherence in relation to the previous conversational context?

Suggested Sequence for Semantic Segmentation:

1. Use Generative Grammar to create an ideal pattern.
2. Apply Functional Grammar to check fulfillment of function.
3. Use Cognitive Grammar to verify meaning representation adequacy.
4. Identify meronyms and holonyms for structural composition understanding.
5. Consider Pragmatics for real-world context.


Each pair is assigned one of three labels:

- **0** — _entailment_, e.g. the `premise` suggests the `hypothesis`.
- **1** — _neutral_, the `premise` and `hypothesis` could both be true, but they are not necessarily related.
- **2** — _contradiction_, the `premise` and `hypothesis` contradict each other.

