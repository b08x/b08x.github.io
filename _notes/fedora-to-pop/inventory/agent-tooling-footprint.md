---
layout: post
permalink: /notes/fedora-to-pop/inventory/agent-tooling-footprint/
title: "Agent tooling footprint"
description: "Nine agent directories holding ~30 GB across ~405,000 files, almost none of it configuration — and the separation that has to happen before the wipe."
summary: "Nine agent directories holding ~30 GB across ~405,000 files, almost none of it configuration — and the separation that has to happen before the wipe."
id: 20260810-agent-tooling-footprint
tags: [inventory, migration, backup]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-userspace-toolchains, 20260810-backup-posture]
---

> Summary: ~30 GB across nine directories and ~405,000 files. The migration task
> is separating config from state, not copying any of it wholesale.

## Details

### The footprint

| Directory | Size | Files |
|---|---:|---:|
| `.hermes` | 17 G | 296,759 |
| `.gemini` | 8.6 G | 28,007 |
| `.antigravity` | 1.9 G | 16,522 |
| `.vibe` | 983 M | 19,505 |
| `.claude` | 898 M | 30,179 |
| `.codex` | 163 M | 5,861 |
| `.syncopated` | 97 M | 4,302 |
| `.config/opencode` | 73 M | 3,781 |
| `.crush` | 13 M | 228 |

`.hermes` alone is 296,759 files. Snapshot:
`workstation-forensics/manifests/agent-tooling.txt`.

### Three categories, not one

The instinct is to treat these as "my agent setup" and copy them. That would
move 30 GB of which perhaps a few megabytes matter. The useful split:

**Config — small, belongs in yadm, often needs encrypting.** `.hermes/profiles/`
holds 14 profiles each with a `.env` and an `auth.json`. Those are
irreplaceable and secret. `yadm encrypt` is the mechanism; a separate vault is
not needed.

**Skills and personal plugin work — belongs in git or yadm.** `.claude` carries
54 skills. Those represent real authoring effort.

**State, caches, session logs, cloned marketplaces — belongs nowhere.** `.claude`
also carries 8 plugin marketplaces (`claude-code-workflows`,
`claude-context-mode`, `claude-plugins-official`, `context-engineering-kit`,
`everything-claude-code`, `obsidian-skills`, `oh-my-mermaid`,
`ruby-dev-plugin`). All re-clonable. An earlier audit found these accounted for
1,945 of what appeared to be 1,996 "unpushed commits" — noise that made the real
number, 50 commits across 16 repos, nearly invisible.

### The dotdir tell

The same audit found **17 dotdirs containing zero files**, all created on the
same day: `.codeium .continue .factory .iflow .kode .mcpjam .mux .neovate
.openhands .pi .pochi .qoder .qwen .roo .snowflake .trae .trae-cn`.

That is not configuration. That is the residue of one evaluation session. None of
it carries forward, and it is a useful reminder that a lot of what looks like
setup is just sediment.

### What to do, per tool

For each agent directory, before the wipe: identify the config files, encrypt the
ones holding tokens, add them to yadm, and explicitly exclude everything else
from both yadm and the backup. The exclusion is the part that gets skipped, and
skipping it is how 30 GB ends up in a backup that then takes an hour to restore.

## Related

- [Userspace toolchains](userspace-toolchains.md) — see-also: the CLI binaries these directories belong to.
- [Backup posture](../migration/backup-posture.md) — prerequisite: what the backup currently does and does not hold.
