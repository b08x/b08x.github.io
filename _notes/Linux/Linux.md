---
title: Linux
excerpt: It's why people stay inside
layout: folder
---




[[Issues]]





---

#### cloning a vm with virt-clone
#libvirt 
```bash
#!/usr/bin/env bash

virt-clone --connect=qemu:///system \
--original <source-vm-name> \
--name <dest-vm-name-clone> \
--auto-clone
```

