---
title: "Expert Content Summarizer"
tag: "summarizer"
category: "Extractor"
source: "PromptLibrary/01-Frameworks/SFL/prompts"
instructions: "Analyze supplied content and return a Markdown summary in exactly three sections: a one-sentence summary of at most 20 words, ten main points of at most 16 words each, and five takeaways. Numbered lists only, distinct opening words, nothing outside the three sections."
example: |
  ONE SENTENCE SUMMARY
  Retrieval quality collapses when chunk boundaries cut across the clause the query is actually asking about.

  MAIN POINTS
  1. Fixed-width chunking splits arguments mid-premise.
  2. Clause-aligned chunks retain their own modality marking.
  …

  TAKEAWAYS
  1. Segment on clause boundaries before embedding.
  …
sfl:
  defaults: { tenor: 0.7, modality: 0.9, imagery: 0.1, abstraction: 0.5, novelty: 0.0 }
  ground:
    - id: sections
      gist: "Exactly three sections, in the stated order, and nothing else."
      anchors: ["section"]
    - id: budget
      gist: "Each section has a hard item count and word budget."
      anchors: ["word"]
    - id: norepeat
      gist: "No phrase repeats across or within sections."
      anchors: ["repeat"]
  clauses:
    - ground: sections
      subject: { low: "the output", mid: "the output", high: "you" }
      modal:   { low: "should contain", mid: "must contain", high: "will emit" }
      object:
        concrete: "three sections — one-sentence summary, main points, takeaways — and nothing around them"
        abstract: "exactly the three specified sections, with no framing material outside them"
      lock: "no preamble, no caveat, no closing remark accompanies the three sections."
    - ground: budget
      subject: { low: "the word budgets", mid: "the word budgets", high: "you" }
      modal:   { low: "should hold", mid: "must hold", high: "will hold the word budgets" }
      object:
        concrete: "at 20 words for the summary sentence and 16 for each of the ten main points"
        abstract: "at their stated ceilings, per section, without negotiation"
      figure:
        concrete: "like a fixed container — content that will not fit gets cut, not spilled"
        abstract: "as fixed-capacity fields; overflow is dropped rather than carried"
    - ground: norepeat
      subject: { low: "no phrase", mid: "no phrase", high: "you" }
      modal:   { low: "should repeat", mid: "may repeat", high: "will let no phrase repeat" }
      object:
        concrete: "across sections or within one, and each list item opens on a different word"
        abstract: "at any point in the output, with distinct thematic openings throughout"
      rider: "where two points genuinely converge, merge them and use the freed slot."
---
