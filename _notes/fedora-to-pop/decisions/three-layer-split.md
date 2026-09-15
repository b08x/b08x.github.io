---
layout: post
permalink: /notes/fedora-to-pop/decisions/three-layer-split/
title: "The three-layer split"
description: "Ansible owns root, yadm owns $HOME, and projects own their runtimes. The old machine had no third layer, which is where the mess accumulated."
summary: "Ansible owns root, yadm owns $HOME, and projects own their runtimes. The old machine had no third layer, which is where the mess accumulated."
id: 20260810-three-layer-split
tags: [decision, ansible, migration]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-collection-layout, 20260810-no-host-cuda, 20260810-userspace-toolchains]
---

> Summary: three ownership layers, not two. The third is where every
> accumulated problem on the old machine actually lived.

## Details

### The layers

| Layer | Owner | Scope |
|---|---|---|
| 1 | Ansible / `b08x.workstation` | Anything needing root and identical for every user: APT packages, System76 daemons, kernel arguments, container runtimes, PAM limits |
| 2 | yadm | Anything under `$HOME` encoding personal preference: shell, editor, agent configs, SSH and GPG (encrypted), and **manifests declaring layer-3 tools** |
| 3 | the project | Language runtimes and dependencies: `.venv`, `node_modules`, `Gemfile.lock`, project `.env` |

### Why the third layer is the point

The old machine had layers 1 and 2 working reasonably — yadm tracked 513 files
with a clean remote. What it did not have was any notion that PyTorch belongs to
a project rather than to a user or to a machine.

The result was 11 GB in `~/.local/lib/python3.14/site-packages` across 456
distributions, plus a stale `python3.12` tree still sitting there after 3.12 was
removed. Not because anyone decided to install a global GPU stack — because
`pip install` without a venv puts things there by default, and nothing said no.

### The rule that follows

> Nothing goes into `~/.local/lib/python3.x/site-packages`. Ever.

With the mechanisms that make it true rather than aspirational:

| Need | Mechanism |
|---|---|
| GPU / ML work | container image with `nvidia-container-toolkit` |
| Python CLI tools | `uv tool install` — isolated venvs, never touches site-packages |
| Ad-hoc scripting | `python3 -m venv` per project |

And the guardrail, `~/.config/pip/pip.conf` with `require-virtualenv = true`, so
the wrong thing fails loudly.

### Where the boundary shows up in the collection

The `dotfiles` role is deliberately the last thing that runs and deliberately
does very little: install yadm, clone the repo, print a message explaining that
Layer 1 stops here. It does not install a single user-scope tool. That is not
laziness — it is the boundary being visible in the code, so the next person to
add "just one global npm package" to an Ansible role has to argue with a comment
first.

## Related

- [b08x.workstation layout](../collection/collection-layout.md) — supports: how layer 1 is structured.
- [Userspace toolchains](../inventory/userspace-toolchains.md) — prerequisite: the layer-2 manifests that do not exist yet.
- [No host CUDA toolkit](no-host-cuda.md) — supports: the clearest single application of this split.
