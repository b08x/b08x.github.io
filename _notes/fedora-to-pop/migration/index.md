---
layout: post
permalink: /notes/fedora-to-pop/migration/
title: "Migration — sequencing and cutover"
description: "Topic map for the mechanics of the move: what gets captured before the wipe, in what order, and what the backup actually holds."
summary: "Topic map for the mechanics of the move: what gets captured before the wipe, in what order, and what the backup actually holds."
id: 20260810-migration-topic
tags: [migration, backup]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-fedora-to-pop-index]
---

The irreversible part. Everything else in this KB can be revised later; the wipe
cannot.

- [Cutover runbook](cutover-runbook.md) — ordered sequence, pre-wipe through first provisioned boot.
- [Backup posture](backup-posture.md) — what restic holds, and two exclusions that are currently wrong.

## Related

- [KB index](../) — parent: full registry.
- [How the collection gets verified](../collection/verification-approach.md) — prerequisite: the untested path runs here for the first time.
