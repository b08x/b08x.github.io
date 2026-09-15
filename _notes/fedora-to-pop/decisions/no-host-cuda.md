---
layout: post
permalink: /notes/fedora-to-pop/decisions/no-host-cuda/
title: "No host CUDA toolkit"
description: "Why CUDA belongs in a container, and the ~21 GB of overlapping GPU runtime on the old machine that made the case."
summary: "Why CUDA belongs in a container, and the ~21 GB of overlapping GPU runtime on the old machine that made the case."
id: 20260810-no-host-cuda
tags: [decision, nvidia, containers]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-single-nvidia-source, 20260810-podman-over-docker, 20260810-three-layer-split]
---

> Summary: `hardware_install_host_cuda` defaults to `false`. GPU work happens in
> containers via `nvidia-container-toolkit`, or in a project venv.

## Details

### The measurement

On Fedora, the machine carried two full GPU compute stacks:

| Layer | Size |
|---|---:|
| `/usr/local/cuda-13.1` (orphaned, from a stale F42 repo) | 4.8 G |
| `/usr/local/cuda-13.2` (current) | 4.8 G |
| `~/.local/lib/python3.14/site-packages/nvidia/` | 4.3 G |
| `torch/` | 1.8 G |
| `triton/` | 641 M |

Roughly **21 GB of overlapping CUDA and torch runtime**, plus 4.8 GB of a CUDA
version nothing referenced. Parallel-installable CUDA versions never
auto-clean, so the orphan would have sat there indefinitely.

### The vendor's own position

System76 documents that this is mostly unnecessary anyway:

> Basic CUDA runtime functionality is installed automatically with the NVIDIA
> driver (in the `libnvidia-compute-*` and `nvidia-compute-utils-*` packages).

`nvidia-smi` reports the maximum CUDA version those libraries support. They also
warn that `nvidia-cuda-toolkit` is Ubuntu-maintained and often lags what the
driver actually supports — so installing it can give you an *older* CUDA than
you already had.

### What replaces it

`nvidia-container-toolkit` and `libnvidia-container-tools` are installed. A
project needing CUDA 12.4 runs an `nvidia/cuda:12.4` image; a project needing
13.x runs that instead. Versions coexist without touching the host, which is
the thing the old machine could not do.

The corresponding guardrail on the Python side — the one that made the
`pip --user` pile possible — is `~/.config/pip/pip.conf`:

```ini
[global]
require-virtualenv = true
```

That turns a bare `pip install` into a loud failure rather than another silent
gigabyte.

### One caveat carried forward

System76's CUDA article adds `systemd.unified_cgroup_hierarchy=0` as a kernel
argument for the Docker plus container-toolkit path. That forces the system back
to cgroups v1, which breaks rootless Podman resource limits on noble. It is
deliberately **not** in `hardware_kernel_params`. If Docker ever becomes the GPU
runtime, that argument comes back into scope and needs testing.

## Related

- [One NVIDIA driver source](single-nvidia-source.md) — see-also: the other half of the GPU cleanup.
- [Podman over Docker](podman-over-docker.md) — prerequisite: containers are where CUDA now lives.
- [Userspace toolchains](../inventory/userspace-toolchains.md) — see-also: the `pip --user` habit this replaces.
