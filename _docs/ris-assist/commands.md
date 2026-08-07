---
title: Commands
description: "Six slash commands over four skills — what each one is for and what it produces."
permalink: /docs/ris-assist/commands/
doc_set: ris-assist
source_path: plugins/ris-assist/commands/
nav_order: 4
toc: true
prev:
  title: Site profile setup
  url: /docs/ris-assist/site-profile/
next:
  title: Status and roadmap
  url: /docs/ris-assist/roadmap/
---

Every command speaks through the same [analyst persona](/docs/ris-assist/persona-spec/) and reads the same site profile. None of them execute anything.

## `/triage`

Differential-driven ticket clarification. Asks the **one most discriminating question at a time** until the ticket is routable, then produces an artifact with scope, timeline, differential, confidence marks, and a recommended queue.

Use it when a vague ticket arrives, when you're deciding where something goes, when you need to justify a severity, or when you're assembling an escalation package.

The stopping rule is deliberate: it stops at routability, not at question exhaustion. Once the ticket can be routed correctly, further questions are someone else's time.

> Triggers on phrasings like "where should this go", "is this worth paging someone", "the study won't open".
{: .callout .tip}

## `/kb-draft`

Turns a resolved ticket or worklog into a knowledge base article in your site's template — or a generic KCS-shaped one if the profile doesn't define its own.

Capture happens at resolution time, while the context still exists. That is the entire argument: a quarterly documentation sprint never happens.

Three behaviours worth knowing:

- The **Cause** section carries an explicit confidence mark — `confirmed`, `likely`, or `possible` — and it is never omitted to make the article read more authoritatively than the worklog supports.
- Anything that would improve the article but isn't in the worklog goes in a **separate suggestions block**, never merged into the body.
- Reproduction steps are never invented. If the worklog doesn't have them, the article says so.

## `/downtime`

Drafts a service-impact notification for a chosen audience and channel. Also handles major-incident cadence updates, vendor tickets, change narratives, and shift turnover.

The unit of configuration is event class × audience × channel, not a fixed template. A single outage needs different messages for radiologists (where to read from), technologists (which paper process to start), and leadership (how big this is) — and required fields are never invented to fill a template slot.

`/comms-tune` shapes those templates: variants, audiences, channels, required fields, and house voice.

## `/explain`

Explains a domain concept at the depth asked for, or runs a sequenced onboarding path for analysts new to the account.

Generic domain claims come from the plugin's own references — the [explainers](/docs/ris-assist/order-lifecycle/) published here are those same files. Site-specific claims come from your profile, and the two are never blended: if you ask how *your* site accessions a multi-region CT order, that's a profile question, and if the profile doesn't answer it, the response says so.

## `/setup` and `/comms-tune`

Configuration rather than daily use. `/setup` builds and edits the [site profile](/docs/ris-assist/site-profile/); `/comms-tune` builds and adjusts notification templates.

## What none of them do

- Execute replays, resends, or any state-changing operation
- Handle identified PHI
- Parse HL7 messages — that is a [separate plugin](/docs/ris-assist/adr-0008-separate-forensics-plugin/)
- Make patient-safety-adjacent calls — those are flagged, packaged, and handed to a human

Full statement in [non-goals](/docs/ris-assist/non-goals/).
