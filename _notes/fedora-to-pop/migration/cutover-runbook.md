---
layout: post
permalink: /notes/fedora-to-pop/migration/cutover-runbook/
title: "Cutover runbook"
description: "Ordered sequence from pre-wipe capture to first provisioned boot, with the decision gate that has to be answered before booting the installer."
summary: "Ordered sequence from pre-wipe capture to first provisioned boot, with the decision gate that has to be answered before booting the installer."
id: 20260810-cutover-runbook
tags: [migration, backup]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-backup-posture, 20260810-verification-approach, 20260810-agent-tooling-footprint]
---

> Summary: the ordering matters more than any individual step. Anything not
> captured before the installer repartitions `nvme0n1` is gone.

## Decision gate — answer before booting

| Question | Working default |
|---|---|
| Wipe, or preserve `/home` on a new filesystem? | **wipe** — keeping `/home` carries the drift forward, which defeats the exercise |
| LUKS? | **no** — single-user laptop, backup is off-host. If yes, the passphrase must be written somewhere that is not this laptop |
| Filesystem: ZFS, ext4, or btrfs? | **ext4** — ZFS on Pop works but adds knobs |
| Preserve uid 1000? | **yes** — avoids chowning ~200 GB on day one |

Changing any of these changes the restore steps.

## Pre-wipe capture

Ordered by consequence. Nothing here survives the installer.

1. **Push every repo that has unpushed work.** An earlier audit found 44 repos
   with no remote *and* uncommitted changes, of which about 10 were real
   projects. The rest were agent scratch. Triage against the snapshot, not
   memory.
2. **Export stashes.** 55 stashes across 28 repos. They do not survive a wipe and
   are invisible to `git status`. `git stash show -p` into patch files.
3. **Two repos have no commits at all** — pure working trees. `git init` and
   commit, or tar them.
4. **Copy the things that cannot be reinstalled:** `~/.ssh`, `~/.gnupg`,
   `~/.claude.json` (322 KB of MCP config *and tokens*), `~/.codex/auth.json`,
   `~/.hermes/profiles/`. To encrypted storage, and verify you can read them
   back.
5. **NetworkManager profiles** — `/etc/NetworkManager/system-connections/*.nmconnection`.
   Cheap to copy, annoying to rebuild.
6. **`chmod 600` the 33 world-readable `.env` files** before they get backed up
   with their permissions intact.
7. **Final backup run**, with the exclusions corrected — see
   [backup posture](backup-posture.md).

## Install

Pop!_OS 24.04 amd64 **NVIDIA** ISO. The NVIDIA build ships the proprietary
driver signed for Secure Boot, which is why this path skips the akmods and MOK
enrollment dance the Fedora side needed.

Clean install, entire disk, ext4, encryption off, same username. Verify `id -u`
returns 1000 on first login — **before** any rsync restore. If the installer
assigned 1001, fixing it after restoring 200 GB means chowning all of it.

## Post-install

```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y openssh-server        # needed before Ansible can reach it
nvidia-smi                                # must not say "has failed"
glxinfo | grep "OpenGL renderer"          # must not say llvmpipe
```

Then restore `~/.ssh` and `~/.gnupg` (mode 700 on the dirs, 600 on the keys), and
only then clone the collection.

## Provision

```bash
ansible-playbook -i inventory/hosts.ini playbooks/bootstrap.yml -K
ansible-playbook -i inventory/hosts.ini playbooks/workstation.yml -K --check --diff
ansible-playbook -i inventory/hosts.ini playbooks/workstation.yml -K
ansible-playbook -i inventory/hosts.ini playbooks/workstation.yml -K   # expect changed=0
```

Uncomment `gir` in `inventory/hosts.ini` first — it is commented out precisely
because running it against Fedora would trip the distribution assert.

**This is where the untested half of `roles/hardware` runs for the first time.**
Expect to fix things: System76 vendor package names, whether
`power-profiles-daemon` masking behaves as documented, whether the graphics-mode
read returns what the parser expects. Budget for it rather than treating a
failure here as a surprise.

Do **not** carry the `NOPASSWD` sudoers drop-in from the test VM onto this
machine.

## Restore

Largest and most irreplaceable first: `WorkspaceV3`, `StudioV2`, `Workspace`,
`Videos`. Then dotdirs yadm does not own, using `--ignore-existing` so an old
config cannot overwrite a newer one, then `yadm restore` on top.

Do not restore `~/.local/lib/python3.14`. That 11 GB is the problem, not the
asset.

## Related

- [Backup posture](backup-posture.md) — prerequisite: the backup this depends on.
- [How the collection gets verified](../collection/verification-approach.md) — context: what has and has not been proven before this point.
- [Agent tooling footprint](../inventory/agent-tooling-footprint.md) — prerequisite: config-versus-state must be settled before step 7.
