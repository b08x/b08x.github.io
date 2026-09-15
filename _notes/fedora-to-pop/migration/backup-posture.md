---
layout: post
permalink: /notes/fedora-to-pop/migration/backup-posture/
title: "Backup posture"
description: "restic holds 218 snapshots of ~157 GiB, but two exclusions mean some things worth keeping are not in it."
summary: "restic holds 218 snapshots of ~157 GiB, but two exclusions mean some things worth keeping are not in it."
id: 20260810-backup-posture
tags: [backup, migration]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-cutover-runbook, 20260810-agent-tooling-footprint]
---

> Summary: restic to a NAS repo, 218 snapshots, latest ~157 GiB, running roughly
> daily. Two exclusions need revisiting before the wipe.

## Details

### Current state

```bash
restic snapshots --insecure-no-password -r /mnt/ninjabot/backup00/b08x/
```

218 snapshots of `/home/b08x`, most recent 2026-08-10, sizes drifting between
157 and 195 GiB as caches grow and get pruned. Off-host, which is the property
that matters — an earlier plan had the backup target on `/dev/sda1`, the same
device as the install USB, which would have destroyed the backup at the moment of
maximum need.

Home is ~362 G of which roughly a third is regenerable, so ~157 GiB is a
plausible number rather than a suspiciously small one.

### The reasoning behind the exclusions

Caches, `node_modules`, `.venv`, `__pycache__`, language-manager stores
(`~/.npm`, `~/.bun`, `~/.gem`, `~/.cargo/registry`), `~/Downloads`, and agent
state snapshots. All genuinely re-derivable. Excluding them trims about 110 GB
and makes restores fast enough to actually do.

### Two that are currently wrong

**`~/.var` is excluded wholesale.** That is where Flatpak keeps per-app state. So
**no Flatpak application config is in restic** — 46 apps' worth. Most of that is
disposable, but not all of it, and the exclusion was made for size rather than
after looking. Needs a pass before the final run: identify which of the 46 apps
hold state worth keeping and either narrow the exclusion or export those
directories by hand.

**Agent config and state are not separated.** `~/.hermes` is 17 GB and
`~/.gemini` is 8.6 GB, and the parts that matter — `profiles/` with their `.env`
and `auth.json` files, authored skills — are a rounding error inside them. Right
now it is all-or-nothing per directory. See
[agent tooling footprint](../inventory/agent-tooling-footprint.md).

### The thing to verify, not assume

A backup you have never restored from is a hypothesis. Before the wipe, restore a
handful of files from a recent snapshot into a scratch directory and diff them
against the originals. Specifically test one of the encrypted or
credential-bearing paths, because those are the ones where a permissions or
encryption surprise is unrecoverable and also the ones nobody thinks to test.

The repo currently uses `--insecure-no-password`. That is a deliberate tradeoff
worth naming: it removes the "backup I cannot decrypt" failure mode entirely, at
the cost of the NAS being the only access control. Fine if the NAS is trusted;
worth a second thought if it is ever exposed.

## Related

- [Cutover runbook](cutover-runbook.md) — see-also: where this backup gets relied on.
- [Agent tooling footprint](../inventory/agent-tooling-footprint.md) — prerequisite: the separation that fixes the second exclusion.
