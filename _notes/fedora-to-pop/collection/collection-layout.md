---
layout: post
permalink: /notes/fedora-to-pop/collection/collection-layout/
title: "b08x.workstation layout"
description: "Repository shape of the Ansible collection, why every role is self-contained, and the one coupling the restructure was forced to fix."
summary: "Repository shape of the Ansible collection, why every role is self-contained, and the one coupling the restructure was forced to fix."
id: 20260810-collection-layout
tags: [ansible, migration]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-three-layer-split, 20260810-verification-approach, 20260810-single-nvidia-source]
---

> Summary: five roles, each carrying its own defaults, meta, argument specs and
> handlers. No role reads a variable file outside its own directory.

## Details

### Shape

```
pop_os-workstation-builder/       # collection root: b08x.workstation
├── galaxy.yml
├── meta/runtime.yml
├── changelogs/changelog.yaml
├── docs/BACKLOG.md
├── inventory/
│   ├── hosts.ini
│   ├── group_vars/workstations.yml
│   └── host_vars/popvm.yml
├── playbooks/
│   ├── bootstrap.yml
│   └── workstation.yml
└── roles/
    ├── base/          timezone, APT tuning, core dumps, CLI toolchain
    ├── hardware/      System76 daemons, NVIDIA, graphics mode, kernelstub
    ├── desktop/       fonts, PipeWire, real-time audio limits
    ├── containers/    Podman by default, Docker opt-in
    └── dotfiles/      yadm install, Layer 2 handoff
```

Role names dropped their `pop_` prefix because the collection namespace already
carries the scope: `b08x.workstation.hardware` reads better than
`b08x.workstation.pop_hardware`.

### The coupling that had to die

A dependency analysis of the Fedora repo found exactly **one** cross-cutting
coupling in the whole thing:

```yaml
# roles/osbuild/tasks/main.yml:53
ansible.builtin.include_vars:
  file: "{{ playbook_dir }}/../../vars/packages/{{ ansible_distribution }}.yml"
```

A role reaching two levels out of itself via `playbook_dir`. It breaks the moment
a playbook runs from a different depth. The Pop prototype had inherited the same
shape as `vars_files: ../vars/pop_os_packages.yml`.

The fix was to dissolve the shared taxonomy into each role's
`defaults/main.yml`. This costs a little duplication — `curl` appears in more
than one list — and buys the property that any single role can be lifted out and
used alone. Given that 20 of the old repo's 21 roles already referenced no shared
vars, the shared file was carrying almost nothing anyway.

### Argument specs earn their keep

Every role has `meta/argument_specs.yml`, 43 documented variables across the
five. That gives two things worth the typing: `ansible-doc -t role
b08x.workstation.hardware` renders real documentation, and a typo'd variable
name fails at the start of the role rather than producing a silently skipped
task twenty minutes in.

### A pattern worth reusing

`roles/hardware/tasks/apt_optional.yml` installs only packages APT can actually
resolve, by querying `apt-cache policy` first and filtering:

{% raw %}
```yaml
{{ hardware_apt_policy.results
   | selectattr('stdout', 'search', 'Candidate:')
   | rejectattr('stdout', 'search', 'Candidate: \(none\)')
   | map(attribute='item') | list }}
```
{% endraw %}

This replaced a `failed_when` that tested `result.rc` on `ansible.builtin.apt` —
a module that does not return `rc`. That guard had never worked, and its fallback
of matching stderr text would have swallowed genuine failures like a held package
or a dpkg lock. Checking availability up front keeps real errors fatal while
letting hardware-specific packages be absent quietly.

## Related

- [The three-layer split](../decisions/three-layer-split.md) — prerequisite: the ownership model this implements.
- [How the collection gets verified](verification-approach.md) — see-also: what proves the above actually works.
- [One NVIDIA driver source](../decisions/single-nvidia-source.md) — supports: enforced in `hardware/defaults/main.yml`.
