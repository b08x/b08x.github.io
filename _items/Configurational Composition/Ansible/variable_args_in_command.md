---
layout: note
title: Variable Args in Command
subtitle: 
category: Ansible
tags: 
links:
---

An example of setting a variable of args to a command:

```sh
packages__reflector_args: >-
  --latest 200
  --sort rate
  --protocol http --protocol https
  --threads {{ ansible_facts.processor_vcpus }}
  --save /etc/pacman.d/mirrorlist
```

