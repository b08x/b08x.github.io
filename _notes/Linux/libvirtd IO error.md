---
title: troubles with libvirt IO
date: 2023-11-05T02:16:00
tags:
  - linux
  - kvm
  - libvirt
categories: notes
image: /assets/image.jpg
---
When creating a new virtual machine with virt-manager, when creating or selecting the disk image, virt-manager crashes:

---


```bash
#> tinybot

│Nov 04 17:27:24.209082 tinybot libvirtd[1455]: End of file while reading data: Input/output error                                      
│Nov 04 17:27:24.209077 tinybot libvirtd[1455]: hostname: tinybot                                                                       
│Nov 04 17:27:24.209069 tinybot libvirtd[1455]: libvirt version: 9.9.0

```

```bash
#> sudo inxi -FzjJxyar

System:
  Kernel: 6.6.0-2-cachyos arch: x86_64 bits: 64 compiler: gcc v: 13.2.1
    clocksource: tsc available: acpi_pm
    parameters: BOOT_IMAGE=/@/boot/vmlinuz-linux-cachyos
    root=UUID=fededb4c-d1e2-4820-ae23-70ec793ad627 rw rootflags=subvol=@
    efi=runtime threadirqs crashkernel=384M-:128M quiet nowatchdog
    zswap.enabled=0 loglevel=3
  Desktop: i3 v: 4.23-1+ info: i3bar dm: startx Distro: CachyOS
    base: Arch Linux
```




