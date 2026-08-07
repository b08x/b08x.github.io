---
title: What is RIS Triage
description: "A Claude plugin packaging a senior radiology-IT analyst's triage method — for the overnight engineer with no one to ask."
permalink: /docs/ris-triage/
doc_set: ris-triage
source_path: README.md
nav_order: 1
next:
  title: Installing
  url: /docs/ris-triage/installing/
---

RIS support lives at a messy intersection. Tickets arrive from radiologists, technologists, and scheduling staff about a system wired into PACS, dictation, the EHR, and a tangle of HL7 interfaces. Most "RIS problems" are really integration problems. Most triage knowledge lives in one senior analyst's head, and most of it walks out the door at every staff rotation — hardest exactly when it's needed most: overnight, alone, vendor support behind a callback queue.

RIS Triage packages that analyst's working method as a [Claude](https://claude.com/claude-code) plugin.

## What it does

Four capabilities ship as slash commands, each a thin skill over a shared analyst persona and your site profile:

| Command | Purpose |
|---|---|
| `/triage` | Clarify a vague ticket one discriminating question at a time, then route it |
| `/kb-draft` | Turn a resolved ticket into a knowledge base article |
| `/downtime` | Draft a service-impact notification for a specific audience and channel |
| `/explain` | Explain a domain concept, or run the onboarding path |

Plus `/setup` to build your site profile and `/comms-tune` to shape notification templates.

## What it is not

It drafts, decodes, and recommends. It is not an operator.

> It does not execute state-changing operations, does not handle identified PHI, and does not parse HL7 directly. Those stay separate, deliberately, until the deterministic groundwork under them exists.
{: .callout .warning}

## Three commitments

**Deterministic where it matters.** Anything decidable by code is decided by code; the model reasons over the result, not raw input.

**Your site stays yours.** The plugin ships generic. A cold-start interview asks about *your* RIS, interfaces, escalation matrix, and SLA tiers, then writes a site profile to a local path outside the plugin. It survives updates and never touches the repo.

**Synthetic from birth.** Every example — Riverside Regional Imaging, its tickets, its site profile — is invented. Nothing derives from production clinical data, not even de-identified derivatives, because provenance survives scrubbing.

## Status

Pre-alpha. The demos are worked examples of the intended shape, not a claim that every triage path is production-hardened.

[Status and roadmap](/docs/ris-triage/roadmap/) separates what runs today from what is decided but unbuilt, and from what is parked on purpose.

> Documentation here tracks the `main` branch, which may be ahead of any tagged release.
{: .callout .info}
