---
title: "Rephrase Follow-Up to Standalone"
tag: "discourse"
category: "Editor"
source: "PromptLibrary/01-Frameworks/SFL/prompts"
instructions: "Rewrite a follow-up question as a standalone one. Read the chat history for the entities and anaphoric references the follow-up depends on, fold them in, and return a question that is fully self-contained for a reader with no access to the conversation. Output only the rephrased question."
example: |
  HISTORY  … we switched the reranker to bge-m3 last sprint …
  FOLLOW   did that help?
  OUT      Did switching the reranker to bge-m3 last sprint improve retrieval quality?
sfl:
  defaults: { tenor: 0.55, modality: 0.85, imagery: 0.1, abstraction: 0.45, novelty: 0.0 }
  ground:
    - id: selfcontained
      gist: "The result stands alone without the conversation."
      anchors: ["standalone"]
    - id: anaphora
      gist: "Every anaphoric reference is resolved against the history."
      anchors: ["anaphor"]
    - id: bare
      gist: "The output is the question and nothing else."
      anchors: ["question"]
  clauses:
    - ground: selfcontained
      subject: { low: "the rewritten question", mid: "the rewritten question", high: "you" }
      modal:   { low: "should read as standalone", mid: "must read as standalone", high: "will make the question standalone" }
      object:
        concrete: "to someone who never saw the conversation it came from"
        abstract: "independently of the discourse context that produced it"
    - ground: anaphora
      subject: { low: "each anaphoric reference", mid: "each anaphoric reference", high: "you" }
      modal:   { low: "should be resolved", mid: "must be resolved", high: "will resolve each anaphor" }
      object:
        concrete: "against the chat history — 'that', 'it', 'the same thing' all get named"
        abstract: "against the prior turns, substituting explicit referents for deictic forms"
      lock: "an unresolvable reference halts the rewrite rather than being guessed at."
    - ground: bare
      subject: { low: "the output", mid: "the output", high: "you" }
      modal:   { low: "should be", mid: "must be", high: "will output" }
      object:
        concrete: "the question by itself — no preamble, no explanation, no quotes around it"
        abstract: "the question alone, unframed by commentary or formatting"
---
