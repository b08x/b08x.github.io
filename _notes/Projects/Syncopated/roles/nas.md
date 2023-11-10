---
layout: note
description: a role for managing networked file servers
tags:
  - ansible
  - role
  - nas
  - nfs
  - samba
  - rsync
category: Role
---

Add the parent folder and the exports to the host_vars

```yaml
---
#> host_vars/tinybot.yml

nfs:
  parent: "{{ user.home }}"
  exports:
    - Archive
    - Workspace

```

Run the playbook
```bash
aplaybook -C -i inventory.ini playbooks/nas.yml --limit tinybot
```

