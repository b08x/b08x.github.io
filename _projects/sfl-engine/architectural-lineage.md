---
layout: deck
title: "Architectural Lineage"
deck_id: sfl-engine-architectural-lineage
permalink: /sfl-engine/architectural-lineage/
back_url: /sfl-engine/
back_label: "sfl-engine"
last_slide_eyebrow: "The Synthesis"
last_slide_title: "Six threads, one middleware"
---
No single domain solves LLM context poisoning alone. SFL provides the metadata; CBT the exclusion criteria; neuroscience the consolidation pattern; philosophy the payload-separation schema; Unix the composable pipeline; cybersecurity the air-gapping model. The intersection — territory none of them individually claim — is where the defense lives.

```mermaid
graph TD
  subgraph SRAG["Standard RAG"]
    direction LR
    A1["Documents"] --> A2["Embed"] --> A3["Vector Store"] --> A4["Retrieve<br/>(topic only)"] --> A5["LLM"]
  end
  subgraph SAFE["Safe RAG"]
    direction LR
    B1["Documents"] --> B2["SFL Annotate"] --> B3["Embed +<br/>Stance Metadata"] --> B4["Store"] --> B5["Retrieve<br/>(RRF + Stance Filters)"] --> B6["LLM<br/>(filtered, objective)"]
    Q(["Query"]) --> B5
  end
```

Goal: not a product feature, but **modular middleware** — a pre-processing and retrieval-filtering layer that sits between any document store and any LLM, adding the one filter dimension standard RAG doesn't have: *how* something was said.
{: .fragment}
