---
title: "Video Content Timeline Generator"
tag: "media"
category: "Extractor"
source: "PromptLibrary/01-Frameworks/SFL/prompts"
instructions: |
  Review a short video and construct a topic timeline. For each significant thematic segment, give start and end timestamps followed by a concise descriptor of the topic.

  Entries run in strict chronological order. The output is a structured list that works as a table of contents for the video.
example: |
  00:00 – 01:12  Cold open: the failing deploy
  01:12 – 04:38  Walking the systemd unit and journal output
  04:38 – 07:05  Root cause — Restart=always masking the crash loop
sfl:
  defaults: { tenor: 0.45, modality: 0.7, imagery: 0.1, abstraction: 0.3, novelty: 0.05 }
  ground:
    - id: chronological
      gist: "Entries are strictly chronological and non-overlapping."
      anchors: []
    - id: bounded
      gist: "Every segment carries both a start and an end timestamp."
      anchors: []
---
