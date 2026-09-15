---
layout: post
permalink: /notes/fedora-to-pop/decisions/
title: "Decisions — Fedora to Pop!_OS"
description: "Topic map for the choices the rebuild encodes: container runtime, GPU stack, and where configuration ownership sits."
summary: "Topic map for the choices the rebuild encodes: container runtime, GPU stack, and where configuration ownership sits."
id: 20260810-decisions-topic
tags: [decision, migration]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-fedora-to-pop-index]
---

Choices worth recording because the reasoning is not recoverable from the code
alone. A `false` default with no note beside it looks like an oversight six
months later.

Each of these came out of measuring the old machine rather than from preference.

- [Podman over Docker](podman-over-docker.md) — default runtime, and why Docker is opt-in.
- [No host CUDA toolkit](no-host-cuda.md) — the 21 GB that argued for containers.
- [One NVIDIA driver source](single-nvidia-source.md) — two repos, one driver, undefined winner.
- [The three-layer split](three-layer-split.md) — root, `$HOME`, and project scope.

## Related

- [KB index](../) — parent: full registry.
- [b08x.workstation layout](../collection/collection-layout.md) — supports: where these decisions land in code.
