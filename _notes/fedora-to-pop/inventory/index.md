---
layout: post
permalink: /notes/fedora-to-pop/inventory/
title: "Inventory — what is actually installed"
description: "Topic map for what the old machine held: userspace toolchains across three package managers, and ~30 GB of agent tooling."
summary: "Topic map for what the old machine held: userspace toolchains across three package managers, and ~30 GB of agent tooling."
id: 20260810-inventory-topic
tags: [inventory, migration]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-fedora-to-pop-index]
---

Captured from `gir` while it was still Fedora 43. These lists stop being
obtainable after the wipe, which is the whole reason they exist. Raw snapshots
live in `WorkspaceV3/Syncopated/workstation-forensics/manifests/`.

Triage against the snapshot, not against memory.

- [Userspace toolchains](userspace-toolchains.md) — 53 CLI tools across cargo, uv and npm, plus the asdf/Ruby divergence.
- [Agent tooling footprint](agent-tooling-footprint.md) — nine directories, ~30 GB, ~405,000 files.

## Related

- [KB index](../) — parent: full registry.
- [The three-layer split](../decisions/three-layer-split.md) — prerequisite: which layer each of these belongs to.
- [Backup posture](../migration/backup-posture.md) — see-also: what of this is actually in restic.
