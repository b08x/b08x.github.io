---
layout: note
title: libvirt
subtitle: 
category:
  - OS
  - Linux
tags:
  - libvirt
  - linux
links:
---


```bash
#!/usr/bin/env bash

virt-clone --connect=qemu:///system \
--original <source-vm-name> \
--name <dest-vm-name-clone> \
--auto-clone
```

