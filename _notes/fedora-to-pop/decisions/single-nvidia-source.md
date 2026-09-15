---
layout: post
permalink: /notes/fedora-to-pop/decisions/single-nvidia-source/
title: "One NVIDIA driver source"
description: "Two repositories shipping the same driver means the winner is resolution order, not intent. On Pop that means system76-driver-nvidia alone."
summary: "Two repositories shipping the same driver means the winner is resolution order, not intent. On Pop that means system76-driver-nvidia alone."
id: 20260810-single-nvidia-source
tags: [decision, nvidia, system76]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-no-host-cuda, 20260810-collection-layout]
---

> Summary: exactly one package provides the NVIDIA driver. On Pop!_OS that is
> `system76-driver-nvidia`, and nothing else may be added beside it.

## Context

The Fedora playbook declared two sources for the same component:

{% raw %}
```yaml
sources:
  - rpmfusion-nonfree-nvidia-driver     # 0 packages actually installed
  - cuda-fedora{{ ... }}-{{ arch }}     # 25 packages installed -- this one won
```
{% endraw %}

Both ship `nvidia-driver`. CUDA's repo won on that machine. Nothing chose that;
dependency resolution order did. A rebuild on a different day, or with repo
priorities nudged, could resolve the other way and produce a machine that is
"the same configuration" but a different driver.

## Details

### Why it matters more than it looks

A driver that comes from an unexpected source still works, right up until the
kernel updates and only one of the two sources has a matching build. Then you
get a black screen and a bisect through two repos you did not know were
competing.

### What the Pop version does

```yaml
hardware_nvidia_packages:
  - system76-driver-nvidia
```

One entry, with a comment in `defaults/main.yml` saying explicitly not to add
`nvidia-driver-<NNN>` beside it. The prototype had done exactly that — it listed
`system76-driver-nvidia` *and* `nvidia-driver-550`, reproducing the Fedora
mistake on a new distro before the new distro was even installed.

`system76-driver-nvidia` is the right single source here because System76 builds
and validates it against their own kernel, and signs it for Secure Boot. That
last part is not a small convenience: the Fedora side needed an akmods dance and
a MOK enrollment that the vendor path skips entirely.

### The check that catches regressions

```bash
apt list --installed 2>/dev/null | grep -c '^nvidia-driver-'
```

Should be `0`. Anything else means a second source got in.

## Related

- [No host CUDA toolkit](no-host-cuda.md) — see-also: same cleanup, the compute half rather than the driver half.
- [b08x.workstation layout](../collection/collection-layout.md) — supports: how single-source is enforced in the role.
