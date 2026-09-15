---
layout: post
permalink: /notes/fedora-to-pop/collection/
title: "Collection — b08x.workstation"
description: "Topic map for the Ansible collection that provisions the machine: repository layout, roles, and how it gets verified."
summary: "Topic map for the Ansible collection that provisions the machine: repository layout, roles, and how it gets verified."
id: 20260810-collection-topic
tags: [ansible, migration]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-fedora-to-pop-index]
---

`b08x.workstation` is the Layer 1 provisioner: five roles, two playbooks, no
user-scope tooling. It replaces a Fedora osbuild collection that is being
archived.

- [b08x.workstation layout](collection-layout.md) — repository shape and why roles are self-contained.
- [How the collection gets verified](verification-approach.md) — VM rehearsal, lint, idempotency, and the gap that remains.

## Related

- [KB index](../) — parent: full registry.
- [The three-layer split](../decisions/three-layer-split.md) — prerequisite: the ownership model the layout implements.
