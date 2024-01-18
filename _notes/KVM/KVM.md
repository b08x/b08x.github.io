---
layout: index
title: KVM
subtitle: 
excerpt: 
category: 
tags:
  - kvm
  - libvirt
image:
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

