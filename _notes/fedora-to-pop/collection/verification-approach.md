---
layout: post
permalink: /notes/fedora-to-pop/collection/verification-approach/
title: "How the collection gets verified"
description: "A Pop!_OS VM as rehearsal target, ansible-lint at production profile, an idempotency second pass — and the one path none of it can reach."
summary: "A Pop!_OS VM as rehearsal target, ansible-lint at production profile, an idempotency second pass — and the one path none of it can reach."
id: 20260810-verification-approach
tags: [ansible, migration]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-collection-layout, 20260810-cutover-runbook]
---

> Summary: lint at production profile, apply against a Pop!_OS 24.04 VM, then
> re-apply and require `changed=0`. The System76 path stays unverified until it
> runs on real hardware.

## Details

### The four gates

1. **`yamllint` + `ansible-lint --offline`** at `profile: production`. Currently
   0 failures across 40 files.
2. **`--syntax-check`** on both playbooks, and `ansible-galaxy collection build`
   to confirm the collection actually packages.
3. **Apply against a VM** — `popvm`, Pop!_OS 24.04 noble, libvirt, bridged.
4. **Re-apply and require `changed=0`.** This is the gate that catches
   non-idempotent tasks, and it is the one most easily skipped.

### What `--check` revealed that a real run would not

Ansible skips `command` tasks under `--check` by default. That means every
read-only probe — `apt-cache policy`, `which kernelstub`, `kernelstub
--print-config`, `system76-power graphics` — registered nothing, and every task
branching on those facts would have failed on an undefined attribute.

Four `check_mode: false` markers fixed it. Worth noting *how* this surfaced:
running `--check --diff` before applying, on a host where those tasks were
skipped anyway. It would otherwise have appeared as a dry-run failure the first
time the collection was pointed at real System76 hardware — exactly the moment
you least want a surprise.

### What the VM run confirmed

Second pass: `ok=37 changed=0 failed=0`. State verified on the guest rather than
inferred from the recap — timezone, the coredump drop-in, PAM limits with both
groups created, group membership, lingering, `podman info` reporting
`Rootless=true`, rtkit enabled.

Two of the checks were negative assertions, which matter as much as the positive
ones: `docker absent`, `nvcc absent`. Defaults that merely *read* correctly are
not the same as defaults that hold through a real run.

### The gap, stated plainly

`popvm` is a virtio guest. Its `host_vars` set:

```yaml
hardware_install_system76: false
hardware_install_nvidia: false
```

Correct for a VM, and it means the entire System76 branch skips — vendor
packages, `power-profiles-daemon` masking, graphics mode, the firmware `adm`
group. Roughly half of `roles/hardware` has never executed.

That half cannot be tested anywhere but on `gir` itself, after Pop is installed.
No amount of VM work substitutes. The verification story is only honest if that
is said out loud rather than hidden behind a green `changed=0`.

### A local wrinkle

`ansible-lint` on the Fedora host is broken independently of this work — CLI
2.18.2 against python module 2.18.18rc1, which it reports as a broken execution
environment. Worked around with a throwaway venv under `/tmp`. That workaround
dies with `/tmp`, so it needs a real fix or a documented recipe.

## Related

- [b08x.workstation layout](collection-layout.md) — prerequisite: what is being verified.
- [Cutover runbook](../migration/cutover-runbook.md) — see-also: where the untested path finally runs.
