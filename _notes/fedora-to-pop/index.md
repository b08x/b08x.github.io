---
layout: post
permalink: /notes/fedora-to-pop/
title: "Fedora to Pop!_OS — migration knowledge base"
description: "Index for the gir workstation migration: decisions, the Ansible collection, inventories, and the cutover runbook."
summary: "Index for the gir workstation migration: decisions, the Ansible collection, inventories, and the cutover runbook."
id: 20260810-fedora-to-pop-index
tags: [migration]
created: 2026-08-10
updated: 2026-08-10
related: []
---

Rebuilding `gir` — an i7-11800H / NVIDIA T1200 laptop — from Fedora 43 onto
Pop!_OS 24.04, with the configuration captured as an Ansible collection rather
than as accumulated manual drift. This is the working knowledge base for that
project.

The short version of why: after roughly a year, the machine reached 84 % of a
475 G disk with two CUDA toolkits installed, 11 GB of `pip --user` packages
duplicating the RPM GPU stack, 17 empty dotdirs from a single evaluation
session, and a playbook that could not build because it declared two mutually
exclusive desktop components. None of that was a disaster on its own. Together
they meant nobody could say what the machine *was*.

## How to use this KB

1. Read this index first. Pick notes by their descriptions and open only those.
2. Prefer opening one to three specific notes over reading everything.
3. Cite the note `id` when you use something from it.

## How to update this KB

- New idea → new atomic note. Same idea, changed → edit in place and bump `updated`.
- Any create, rename or delete must update this registry **and** the topic index
  in the same change.
- Use only the tags below. Add a tag here before using it anywhere.
- Jekyll publishes this collection, so every note needs `layout`, `permalink`,
  `title` and `description` alongside the KB fields. Files beginning with `_`
  are skipped by Jekyll's entry filter — hence `index.md` for topic maps, not
  `_topic.md`.

## Controlled tags

`migration`, `decision`, `ansible`, `containers`, `nvidia`, `system76`,
`inventory`, `backup`

## Registry

### decisions

- `20260810-podman-over-docker` — **Podman over Docker** — `decisions/podman-over-docker.md` — Why the container role installs Podman by default and leaves Docker opt-in.
- `20260810-no-host-cuda` — **No host CUDA toolkit** — `decisions/no-host-cuda.md` — Why CUDA lives in containers, and the 21 GB of duplication that argued for it.
- `20260810-single-nvidia-source` — **One NVIDIA driver source** — `decisions/single-nvidia-source.md` — Two repos shipping the same driver is resolution-order luck, not configuration.
- `20260810-three-layer-split` — **The three-layer split** — `decisions/three-layer-split.md` — What Ansible owns, what yadm owns, and the project layer that was missing.

### collection

- `20260810-collection-layout` — **b08x.workstation layout** — `collection/collection-layout.md` — Repository shape, why roles are self-contained, and what the split forced.
- `20260810-verification-approach` — **How the collection gets verified** — `collection/verification-approach.md` — VM rehearsal, lint profile, idempotency proof, and what none of it covers.

### inventory

- `20260810-userspace-toolchains` — **Userspace toolchains** — `inventory/userspace-toolchains.md` — Three package managers holding 53 undeclared CLI tools, plus the asdf/Ruby divergence.
- `20260810-agent-tooling-footprint` — **Agent tooling footprint** — `inventory/agent-tooling-footprint.md` — ~30 GB across nine agent directories, and the config-versus-state problem.

### migration

- `20260810-cutover-runbook` — **Cutover runbook** — `migration/cutover-runbook.md` — Ordered sequence from pre-wipe capture through first provisioned boot.
- `20260810-backup-posture` — **Backup posture** — `migration/backup-posture.md` — What restic holds, and the two exclusions that are currently wrong.

## Related

- [Decisions](decisions/) — the choices this rebuild encodes and why.
- [Collection](collection/) — the Ansible collection that does the work.
- [Inventory](inventory/) — what is actually installed, captured before the wipe.
- [Migration](migration/) — sequencing, backups, cutover.
