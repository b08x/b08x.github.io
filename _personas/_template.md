---
# ─────────────────────────────────────────────────────────────────────────────
# PERSONA TEMPLATE — copy to create a new profile:
#
#   cp _personas/_template.md _personas/<slug>.md
#
# The leading underscore keeps this file out of the build (it never renders,
# never appears on /about/personas/, and contributes nothing to /tags/ or
# /categories/). Replace every PLACEHOLDER value, then drop keys you don't need
# (blocks and sections are optional; specs are the "Spec" card). The body stays
# empty — everything renders from front matter.
#
# Contract (see AGENTS.md → Personas):
#   specs    [{label, value}]              rows in the Spec card
#   blocks   [{title, items}]              grid cards; item = string or {name, note};
#                                          a note WITHOUT a space right-aligns (permissions),
#                                          a note WITH a space stacks under the name
#   sections [{title, prompt, note}]       prompt = verbatim source excerpt (kept in a
#                                          <pre>, wrapping enabled); note = annotation (markdown)
# Attribution: a post can claim this persona with `author: <slug>` in its front matter.
# ─────────────────────────────────────────────────────────────────────────────
title: "PLACEHOLDER NAME"
monogram: "PH"
role: "PLACEHOLDER — one-line function, e.g. documentation-crafting agent"
description: "PLACEHOLDER — two or three sentences on what this persona does and how it is built. Not a bio: state the pipeline, not the personality."
tags: [placeholder]
categories: [agents]
specs:
  - label: "Harness"
    value: "PLACEHOLDER — e.g. mistral vibe / skill (SKILL.md)"
  - label: "Safety"
    value: "PLACEHOLDER — e.g. destructive"
  - label: "Config"
    value: "PLACEHOLDER — path to the agent config file"
  - label: "Prompt"
    value: "PLACEHOLDER — path to the system prompt file"
blocks:
  - title: "Tools"
    items:
      - name: "read_file"
        note: "always"
      - name: "write_file"
        note: "ask"
      - name: "PLACEHOLDER · other-tool"
        note: "available"
  - title: "Skills"
    items:
      - "PLACEHOLDER-skill-one"
      - "PLACEHOLDER-skill-two"
  - title: "Subagents"
    items:
      - name: "PLACEHOLDER-scout"
        note: "declared · what it gathers, what it returns"
      - name: "generic child"
        note: "name only · what it inherits"
sections:
  - title: "Identity"
    prompt: |
      PLACEHOLDER — verbatim excerpt from the source prompt (3–10 lines).
      Copy it exactly: excerpts are checked against the source file, never
      paraphrased.
    note: |
      PLACEHOLDER — what this section is doing, in markdown. Bold the load-bearing
      commitment, e.g. **the operational rule this section installs.**
  - title: "Operating method"
    prompt: |
      PLACEHOLDER — another verbatim excerpt: the delegation, evidence or
      workflow section of the prompt.
    note: |
      PLACEHOLDER — the mechanism, stated technically: inputs, bounds, and what
      triggers the fallback.
---
