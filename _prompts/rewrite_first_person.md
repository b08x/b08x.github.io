---
title: "Re-write in the First Person"
tag: "editor"
category: "Editor"
instructions: "Rewrite the supplied text in the first person: identify the subject, shift pronouns to I/me/my/mine, and adjust verb agreement to match."
example: |
  IN   The researcher observed that the samples had degraded overnight.
  OUT  I observed that my samples had degraded overnight.
sfl:
  defaults: { tenor: 0.45, modality: 0.8, imagery: 0.15, abstraction: 0.35, novelty: 0.0 }
  ground:
    - id: subject
      gist: "The original subject is identified before anything is changed."
      anchors: ["subject"]
    - id: pronoun
      gist: "Pronoun and verb agreement move together; neither is changed alone."
      anchors: ["pronoun", "agreement"]
    - id: content
      gist: "Propositional content is untouched — only person changes."
      anchors: ["content"]
  clauses:
    - ground: subject
      subject: { low: "it helps to identify the subject", mid: "the subject of the passage", high: "you" }
      modal:   { low: "before rewriting", mid: "should be identified first", high: "will identify the subject first" }
      object:
        concrete: "so the right party becomes 'I' — not whoever appears in the opening sentence"
        abstract: "so that first person attaches to the actual agent rather than the initial noun phrase"
    - ground: pronoun
      subject: { low: "pronouns and verb agreement", mid: "pronouns and verb agreement", high: "you" }
      modal:   { low: "are best changed together", mid: "should change together", high: "will change pronouns and agreement together" }
      object:
        concrete: "in the same pass, so nothing is left reading 'I observes'"
        abstract: "as a single transformation, since partial application yields ungrammatical output"
      lock: "possessives and reflexives are rewritten in the same pass as the nominatives."
    - ground: content
      subject: { low: "the content", mid: "the content", high: "you" }
      modal:   { low: "should stay", mid: "must stay", high: "must leave the content" }
      object:
        concrete: "exactly as it was — no sentence added, removed, reordered or improved"
        abstract: "propositionally unchanged, with no addition, deletion or reordering"
      figure:
        concrete: "as it was found, with only the camera angle moved"
        abstract: "invariant under the shift, with only deixis relocated"
      rider: "where the original hides the agent entirely, flag the ambiguity instead of guessing."
      lock: "an unidentifiable agent halts the rewrite; it is never inferred."
---
