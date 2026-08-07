---
title: Site profile setup
description: "The cold-start interview — what it asks, where the answers go, and why unknowns stay unknown."
permalink: /docs/ris-triage/site-profile/
doc_set: ris-triage
source_path: plugins/ris-triage/skills/setup/SKILL.md
nav_order: 3
toc: true
prev:
  title: Installing
  url: /docs/ris-triage/installing/
next:
  title: Commands
  url: /docs/ris-triage/commands/
---

The plugin ships generic. Everything site-specific — your systems, your interface names, your escalation chain, your severity labels — comes from a profile built by interviewing you once.

## Where it lives, and why

The profile is written to a local path **you specify**, outside the plugin directory.

Installed plugins are copied to a cache directory that gets replaced on update. A profile stored inside the plugin would be destroyed on every upgrade, and would risk site-specific detail reaching the repository. So `/setup` asks where to write before it asks anything else, and confirms the path back before writing.

> If `/setup` proposes a path without asking you, that is a bug worth reporting. The interview is specified to ask first and assume no default, because the right location varies by host environment.
{: .callout .warning}

## What the interview covers

Eight sections, walked one question at a time, each answer confirmed before moving on:

1. **Site name** — used in drafts and headers only; never a distribution target
2. **Systems** — RIS, PACS, EHR, dictation, interface engine, worklist
3. **Interfaces** — named links between systems, and what breaks when each is down
4. **Identifier formats** — the shape of an accession number, MRN, ticket reference
5. **Escalation matrix** — tier by tier, until the answer is "vendor" or "that's the end"
6. **SLA tiers** — your severity labels first, then what qualifies for each
7. **Downtime procedures** — what staff actually do when PACS or RIS is down
8. **Audiences** — who exists, then separately, who is reachable overnight

Step 3 is the one that pays off most in triage. "What happens when this interface is down" becomes the `criticality` field, and that is the text a differential branch cites later.

## Bring a document instead of typing

Any section whose answer is a list — systems, escalation tiers, SLA tiers, audiences — can be supplied as a file. An inventory spreadsheet, a CMDB export, an on-call schedule.

Structured input is read as rows and columns rather than as prose. But a pasted document is an input to confirm, not a shortcut past confirmation: the mapping onto schema fields is shown back to you field by field, because a spreadsheet typo propagates exactly like a misheard word.

## Unknowns stay unknown

The interview never invents a system name, interface name, distribution list, procedure name, or approval chain.

Two answers are treated as complete rather than as gaps to fill:

- **"I don't know"** — recorded as unknown, and surfaced again in `edit` mode
- **"We don't distinguish that"** — recorded as such, and *not* asked again

This matters more than it sounds. A profile with honest gaps produces skills that say "no escalation path is recorded for this" — which is actionable. A profile with plausible filler produces skills that confidently name the wrong person at 3am.

## Editing later

`/setup` has three modes:

| Mode | Use |
|---|---|
| `interview` | First run — the full sequence above |
| `edit` | Change one field without re-interviewing anything else |
| `review` | Report which fields are populated, empty, or likely needed soon |

Review mode never auto-fills. It tells you where the holes are and leaves them to you.

## Multi-site environments

The schema's `systems` section is a flat inventory of role and product. If you support many facilities across several PACS platforms — a teleradiology practice, an imaging group with multiple health-system contracts — that flat shape will not represent your environment cleanly, and the interview will ask you how you want it modelled rather than deciding for you.

> This is a known limitation rather than a designed behaviour. If it bites you, the shape of the answer you had to give is useful bug-report material.
{: .callout .info}

## Example profile

A fictional site — Riverside Regional Imaging — demonstrates every schema field in [`plugins/ris-triage/examples/site-profile.example.yaml`](https://github.com/b08x/ris_triage/blob/main/plugins/ris-triage/examples/site-profile.example.yaml). Every name in it is invented; see [data provenance](/docs/ris-triage/data-provenance/).
