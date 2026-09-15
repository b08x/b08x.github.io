---
title: "Extract Section From URL"
tag: "extractor"
category: "Extractor"
instructions: "Provide a comprehensive summary of the specific section extracted from the provided URL. Ensure that you maintain absolute fidelity to the source material without injecting novel concepts."
example: |
  {
    "meta": { "schema_version": "2.0", "name": "Extract Section" },
    "section": "3.2 Retrieval filters",
    "summary": "…",
    "source_spans": [[1204, 1687]]
  }
sfl:
  defaults: { tenor: 0.5, modality: 0.85, imagery: 0.2, abstraction: 0.4, novelty: 0.0 }
  ground:
    - id: scope
      gist: "Only the named section is in scope — not the surrounding document."
      anchors: ["section"]
    - id: fidelity
      gist: "Nothing may appear in the output that is not in the source."
      anchors: ["source"]
  clauses:
    - ground: scope
      subject: { low: "the summary", mid: "the summary", high: "you" }
      modal:   { low: "is best kept within", mid: "should stay within", high: "must cover only" }
      object:
        concrete: "the section named in the request, ignoring the rest of the page"
        abstract: "the requested section's boundaries, treating adjacent material as out of scope"
      figure:
        concrete: "the fence line around the named section, with everything past it left standing"
        abstract: "the section's own perimeter, treating the surrounding document as another country"
      lock: "no content from outside the named section is admissible, at any length."
    - ground: fidelity
      subject: { low: "the output", mid: "the output", high: "you" }
      modal:   { low: "does best to avoid", mid: "should avoid", high: "must refrain from" }
      object:
        concrete: "adding facts, names or figures that the source text does not contain"
        abstract: "introducing propositions absent from the source material"
      figure:
        concrete: "letting the summary drift off the source and float free"
        abstract: "letting the reading come unmoored from what is actually written"
      rider: "where the source is ambiguous, offer the competing readings rather than choosing one."
      lock: "ambiguity in the source is reported as ambiguity, never resolved by inference."
    - subject: { low: "the length", mid: "the summary length", high: "you" }
      modal:   { low: "can track", mid: "should track", high: "will track" }
      object:
        concrete: "how long the section itself is — a short section gets a short summary"
        abstract: "the section's own extent rather than a fixed target"
---
