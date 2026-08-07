---
title: Status and roadmap
description: "What runs today, what's decided but unbuilt, and what's deliberately parked."
permalink: /docs/ris-assist/roadmap/
doc_set: ris-assist
source_path: docs/BACKLOG.md
nav_order: 5
toc: true
prev:
  title: Commands
  url: /docs/ris-assist/commands/
next:
  title: Order lifecycle
  url: /docs/ris-assist/order-lifecycle/
---

The project is **pre-alpha**, in its foundation phase: scaffold, site-profile schema, persona spec, and the governance approvals that gate publication.

That label is doing real work. Documentation tends to describe a project in the present tense whether or not the present tense is earned, so this page separates three things a reader otherwise cannot tell apart: what runs, what is decided but unbuilt, and what is parked on purpose.

## What runs today

| Capability | State |
|---|---|
| `/setup` interview and edit modes | Working; see known gaps below |
| `/triage` clarification and routing | Working |
| `/kb-draft` in manual mode | Working — paste a worklog, get a draft |
| `/downtime` with generic templates | Working |
| `/comms-tune` template shaping | Working |
| `/explain` and the onboarding path | Working |

Everything above operates against a site profile you build locally. With no profile, skills fall back to generic templates labelled *not yet tuned to this site* rather than guessing at your environment.

## Decided but unbuilt

These are settled design decisions with no implementation behind them yet. They are not open questions.

**Connected knowledge mode.** `/kb-draft` currently drafts for you to paste. Reading resolved incidents and submitting articles directly requires a ServiceNow MCP connection, which is blocked on access rather than on design. Gap detection and stale-article flagging are blocked on the same thing — in manual mode they work by asking you rather than by scanning a knowledge base the skill cannot see.

**ADR backfill.** Eight architectural decisions are recorded in the [index](/docs/ris-assist/decisions/); individual records are still being written up. The decisions were made in design, not retrofitted — but only [ADR-0008](/docs/ris-assist/adr-0008-separate-forensics-plugin/) exists as a full record so far.

## Parked on purpose

**Message forensics — HL7 message parsing — is a separate plugin, not a missing feature here.**

It waits on two things: data access, and a symbolic parse layer underneath it. Shipping a model-interpreted version in the meantime would be the exact behaviour this project argues against — a language model freestyle-parsing pipe-delimited clinical data is the failure mode the whole design exists to avoid.

The reasoning is in [ADR-0008](/docs/ris-assist/adr-0008-separate-forensics-plugin/); parked work is tracked in [FORENSICS-BACKLOG.md](https://github.com/b08x/ris_assist/blob/main/docs/FORENSICS-BACKLOG.md).

> This is the one place where "not yet" and "not ever, here" are easy to confuse. Forensics will exist. It will not exist inside this plugin.
{: .callout .info}

## Known gaps

Found by running the plugin against a real environment rather than by design review:

- **The `systems` schema is single-site.** A practice supporting many facilities across several PACS platforms cannot be represented cleanly, and `/setup` will ask you how to model it rather than deciding. See [site profile setup](/docs/ris-assist/site-profile/).
- **The interview does not checkpoint.** A long `/setup` session that ends early writes nothing. Answers given are lost.
- **Conflicting answers are not cross-checked.** If a late answer contradicts something recorded earlier in the same interview, the contradiction is not currently surfaced.
- **Deferred questions are not tracked.** Items postponed during an interview live in the conversation, not in the profile, so `edit` mode cannot resurface them.

## How this is developed

Developed in collaboration with Claude, and that process is published rather than hidden. Decision records capture why it is built this way, including rejected alternatives. [Guardrails](/docs/ris-assist/guardrails/) documents the specific failure modes the collaboration is checked against — design and drafting are co-developed; behaviour rules and published claims are validated by a human before release.
