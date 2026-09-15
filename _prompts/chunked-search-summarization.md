---
title: "Chunked Search Result Summarization"
tag: "retrieval"
category: "Extractor"
source: "PromptLibrary/01-Frameworks/SFL/prompts"
instructions: |
  Process search results presented in distinct chunks. For each chunk, produce a separate concise summary capturing its main topic and key information.

  Each summary is clearly delineated and tied to its originating chunk. No extraneous detail, no opinion. Tone is informative and neutral; output is structured text with a heading or bullet per chunk.
example: |
  ## Chunk 1 — pgvector HNSW tuning
  ef_search trades recall against latency; the default of 40 under-recalls
  on high-dimensional embeddings.

  ## Chunk 2 — reranker placement
  Cross-encoder reranking after ANN retrieval, not before.
sfl:
  defaults: { tenor: 0.4, modality: 0.7, imagery: 0.05, abstraction: 0.35, novelty: 0.0 }
  ground:
    - id: perchunk
      gist: "One summary per chunk; chunks are never merged."
      anchors: []
    - id: neutral
      gist: "Informative and neutral register; no evaluation of the sources."
      anchors: []
---
