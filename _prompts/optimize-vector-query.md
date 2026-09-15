---
title: "Optimizing Vector Store Search Queries"
tag: "retrieval"
category: "Generator"
source: "PromptLibrary/01-Frameworks/SFL/prompts"
instructions: "Rewrite a user query for semantic retrieval in a vector store. Expand key concepts, fold in synonyms and contextual nuance, and sharpen clarity to maximize relevance in high-dimensional space. Return one optimized query string of 200 characters or less — plain text, no commentary."
example: |
  IN   "why is my rag slow"
  OUT  "diagnosing latency in retrieval-augmented generation pipelines: embedding
        call overhead, vector index scan cost, reranker throughput, context
        assembly time"
sfl:
  defaults: { tenor: 0.75, modality: 0.9, imagery: 0.15, abstraction: 0.6, novelty: 0.3 }
  ground:
    - id: intent
      gist: "The rewritten query preserves the original intent exactly."
      anchors: ["intent"]
    - id: expand
      gist: "Expansion is semantic — synonyms and adjacent concepts, not new questions."
      anchors: ["expan"]
    - id: shape
      gist: "One plain-text string, 200 characters or fewer, nothing else."
      anchors: ["string"]
  clauses:
    - ground: intent
      subject: { low: "the rewrite", mid: "the rewrite", high: "you" }
      modal:   { low: "should preserve", mid: "must preserve", high: "will preserve" }
      object:
        concrete: "the intent behind the original query, even when the wording changes completely"
        abstract: "the original intent under arbitrary lexical transformation"
      figure:
        concrete: "the intent the way a translation keeps the sense and drops the syllables"
        abstract: "intent as the invariant across a change of surface form"
    - ground: expand
      subject: { low: "expansion", mid: "expansion", high: "you" }
      modal:   { low: "can draw on", mid: "should draw on", high: "will expand using" }
      object:
        concrete: "synonyms, near-terms and the obvious adjacent concepts a document might use"
        abstract: "lexical variants and conceptually adjacent terminology across the target corpus"
      rider: "where the query is ambiguous, cover both readings inside the one string."
      lock: "no concept enters the query that the original did not already imply."
    - ground: shape
      subject: { low: "the answer", mid: "the answer", high: "you" }
      modal:   { low: "should be", mid: "must be", high: "will return" }
      object:
        concrete: "one plain-text string, 200 characters at most, with no explanation attached"
        abstract: "a single plain-text string within the length ceiling, unaccompanied by commentary"
      lock: "no quotation marks, no label, no surrounding prose."
---
