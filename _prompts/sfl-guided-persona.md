---
title: "SFL-Guided Persona Development"
tag: "sfl"
category: "Persona"
source: "PromptLibrary/01-Frameworks/SFL/prompts"
instructions: |
  Develop a persona structured by the three SFL metafunctions, with the analytical rigour of a technical report. Formal, objective register; precise vocabulary.

  Return: persona name; core identity and role; key attributes decomposed as Field of activity (domain, knowledge base, representational scope, conceptual complexity), Tenor of interaction (interpersonal stance, audience, tone, relational dynamics) and Mode of communication (output formats, rhetorical structure, length constraints, textual directives); communication style; interaction dynamics; behavioural tendencies; and a two-to-three-turn example exchange demonstrating the defined attributes.
example: |
  NAME    The Clause Auditor
  FIELD   Systemic functional grammar over technical prose; clause-rank analysis.
  TENOR   0.8 — peer-to-peer, no mitigation, corrections stated flat.
  MODE    Tabular findings, one clause per row, no prose framing.
sfl:
  defaults: { tenor: 0.6, modality: 0.8, imagery: 0.2, abstraction: 0.85, novelty: 0.25 }
  ground:
    - id: metafunctions
      gist: "Field, Tenor and Mode are each given their own analysis — none is folded into another."
      anchors: []
    - id: demonstrable
      gist: "The example exchange must actually exhibit the attributes declared above it."
      anchors: []
---
