---
layout: post
permalink: /notes/fedora-to-pop/inventory/userspace-toolchains/
title: "Userspace toolchains"
description: "53 CLI tools spread across cargo, uv and npm with nothing declaring them — plus an asdf install that declares Ruby 4.0.1 and provides nothing."
summary: "53 CLI tools spread across cargo, uv and npm with nothing declaring them — plus an asdf install that declares Ruby 4.0.1 and provides nothing."
id: 20260810-userspace-toolchains
tags: [inventory, migration]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-three-layer-split, 20260810-agent-tooling-footprint]
---

> Summary: three package managers hold 53 CLI tools, none of them declared
> anywhere. Snapshot: `workstation-forensics/manifests/toolchain-userspace.txt`.

## Details

### The three piles

| Source | Count |
|---|---:|
| `cargo install` | 16 |
| `uv tool` | 11 |
| `npm -g` | 26 |

None of these has a manifest. Reproducing the machine means remembering what was
installed, which is precisely the failure mode this rebuild exists to end.

### Entries that will not simply reinstall

Worth flagging before the wipe, because a manifest listing them would be a lie:

- **`zeroclaw`** — cargo-installed from `/tmp/zeroclaw-bootstrap-xzFcSu`. That
  path is gone. The binary exists; its source does not.
- **`whis-cli`** — cargo-installed from a local path,
  `~/Workspace/source/whis/crates/whis-cli`. Reinstall depends on that repo
  surviving the migration.
- **Four npm entries with empty versions** — `@open-gitagent/gapman`,
  `codeburn`, `hermes-paperclip-adapter`, `code-insights-workspace`. Local
  installs that will not resolve from a registry.
- **Two npm symlinks** into `~/WorkspaceV3/code-insights`. They point at a
  working tree, not a published package.
- **Several `uv tool` entries are personal projects** — `docs2db`, `graphifyy`,
  `linux-mcp-server`, `notebooklm-py`, `omega13`, `rubygemdb`, `seishun`. Their
  repos need to be reachable before reinstall works, which loops back to whether
  those repos have remotes.

### The asdf divergence

This one is a genuine finding, not just an inventory line.

`~/.tool-versions` declares `ruby 4.0.1`. asdf 0.19.0 — the Go rewrite — is
installed at `/usr/bin/asdf`, with shims at `/opt/asdf/shims`. But:

```
asdf plugin list   →  No plugins installed
~/.asdf/installs/ruby  →  does not exist
ruby -v            →  ruby 3.4.10 (system, /usr/bin/ruby)
```

**Zero plugins, zero rubies.** So every `ruby` invocation silently resolves to
distro Ruby 3.4.10 while the declaration says 4.0.1. That divergence has been
quiet for a while and would carry straight into the new machine.

Open question rather than a decision: is 4.0.1 the real target, or a stale line?
Ruby 4.0 is recent enough that gem compatibility needs checking against the
projects that matter — `sfl-engine`, `ruby-dev-plugin`, `rubygemdb`,
`RubyLLM-SFL-RAG`. And it is worth asking whether asdf earns its place at all
when `uv` already owns Python and 16 cargo binaries sit outside it. A version
manager for exactly one language is a reasonable outcome, but it should be a
choice.

### Where these land

Per the three-layer split: the tools themselves are Layer 2, declared in
manifests under `~/.config/tooling/` and tracked in yadm. Anything available as a
current apt package on noble — `bottom`, `eza`, `just`, `sd`, `ripgrep` all are —
should move to Layer 1 `base_packages` instead, where it costs nothing to
maintain.

asdf splits across layers: the binary and `/opt/asdf` are Layer 1; plugins,
installed versions and `.tool-versions` are Layer 2; gems are Layer 3.

## Related

- [The three-layer split](../decisions/three-layer-split.md) — prerequisite: which layer each pile belongs to.
- [Agent tooling footprint](agent-tooling-footprint.md) — see-also: the other undeclared surface.
