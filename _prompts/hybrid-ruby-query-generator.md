---
title: "Hybrid Semantic Query Generator — Ruby"
tag: "retrieval"
category: "Generator"
source: "PromptLibrary/01-Frameworks/SFL/prompts"
instructions: |
  Generate five distinct but semantically related search queries against a hybrid vector store holding Ruby code examples and programming guides.

  Synthesize a user query describing a problem or goal with an uploaded code file supplying context, and formulate queries that explore different facets of the problem. Optimize for hybrid search — each query should carry keyword purchase as well as semantic shape. Vary them enough to surface disparate material, but keep every one inside the scope of the original intent and the code context.

  Output the five queries as a list of strings, nothing else.
example: |
  [
    "ActiveRecord connection pool checkin from a non-owning fiber",
    "Sequel thread-affine connection ownership async",
    "ruby connection pool leak ensure block wrong thread",
    "fiber scheduler database connection checkout semantics",
    "diagnosing pool exhaustion under Async::Task in Ruby"
  ]
sfl:
  defaults: { tenor: 0.55, modality: 0.8, imagery: 0.1, abstraction: 0.55, novelty: 0.4 }
  ground:
    - id: five
      gist: "Exactly five queries, each distinct from the others."
      anchors: []
    - id: inscope
      gist: "Every query stays within the original intent and the supplied code context."
      anchors: []
    - id: hybrid
      gist: "Each query carries both keyword and semantic purchase."
      anchors: []
---
