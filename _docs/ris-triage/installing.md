---
title: Installing
description: "Add the marketplace, install the plugin, run the cold-start interview."
permalink: /docs/ris-triage/installing/
doc_set: ris-triage
source_path: README.md
nav_order: 2
toc: true
prev:
  title: What is RIS Triage
  url: /docs/ris-triage/
next:
  title: Site profile setup
  url: /docs/ris-triage/site-profile/
---

> The Claude plugin surface is evolving quickly. Verify these commands against the current [Claude plugin documentation](https://code.claude.com/docs) before filing a bug.
{: .callout .warning}

## Add the marketplace and install

```
/plugin marketplace add b08x/ris_triage
/plugin install ris-triage@ris-triage
```

The repository is its own marketplace — `.claude-plugin/marketplace.json` at the root declares a single plugin sourced from `plugins/ris-triage`. There is nothing to build and no runtime dependency to install; the plugin is markdown and YAML.

## What you get

Six slash commands, backed by four skills over a shared analyst persona:

| Command | Skill |
|---|---|
| `/triage` | Ticket clarification and routing |
| `/kb-draft` | Knowledge capture |
| `/downtime` | Incident communications |
| `/explain` | Domain explainers and onboarding |
| `/setup` | Site profile interview |
| `/comms-tune` | Notification template shaping |

## First run

Run `/setup` before anything else. Every other skill reads the site profile it produces, and without one they fall back to generic templates labelled *not yet tuned to this site*.

The interview asks about your systems, named interfaces, escalation matrix, SLA tiers, identifier formats, and downtime procedures. It writes the result to a local path **outside the plugin directory**, so it survives plugin updates and never enters the repository.

> Keep the site profile wherever your local secrets live. It contains real interface names, escalation contacts, and distribution lists — it is yours, not the plugin's.
{: .callout .info}

See [Site profile setup](/docs/ris-triage/site-profile/) for what the interview covers and how to edit a profile afterwards.

## Verifying the install

Ask for something the plugin should decline:

```
/explain what is our escalation path
```

With no profile written, the expected response names the gap rather than inventing a plausible chain. If you get a confident answer describing an escalation path you never configured, something is wrong — that behaviour is the thing the [guardrails](/docs/ris-triage/guardrails/) exist to prevent.

## Upgrading

Re-running `/plugin install` replaces the plugin directory. Your site profile is untouched because it lives outside it. If a schema field is added in a later version, `/setup` in edit mode fills the gap without re-running the whole interview.
