---
title: "Forensic UI Text Archiving"
tag: "vision"
category: "Extractor"
source: "PromptLibrary/01-Frameworks/SFL/prompts"
instructions: |
  Dissect the textual landscape of a UI screenshot and return it as a JSON archival record organized by UI region.

  Transcribe every visible text element regardless of size or apparent significance — titles, headings, body copy, button labels, link text, menu items, placeholders, tooltips, error messages, navigation identifiers. Anchor them under standard regions: Header, Sidebar, Main Content Area, Footer, Modal Dialogs, Contextual Pop-ups.

  Within each region, catalogue text belonging to interactive components separately. Transcribe dynamic data — names, numbers, dates, currency, addresses — exactly. Record contextual identifiers such as application name, page title, URL or document name. Note relative position and visual prominence where a design cue marks hierarchy.

  Precision, completeness and objectivity only. No analysis, no judgment, no speculation.
example: |
  {
    "context": { "app": "Grafana", "page": "Explore", "url": "…" },
    "regions": {
      "Header": { "text": ["Explore"], "interactive": ["Run query", "Split"] },
      "Main Content Area": { "text": ["No data"], "dynamic": ["15:04 – 15:34"] }
    }
  }
sfl:
  defaults: { tenor: 0.7, modality: 0.95, imagery: 0.0, abstraction: 0.5, novelty: 0.0 }
  ground:
    - id: exhaustive
      gist: "Every visible string is transcribed — significance is not a filter."
      anchors: []
    - id: regional
      gist: "Text is anchored to a named UI region, never listed flat."
      anchors: []
    - id: noanalysis
      gist: "The record is descriptive; interpretation is out of scope."
      anchors: []
---
