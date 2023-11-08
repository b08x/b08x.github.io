---
title: troubles with libvirt IO
date: 2023-11-05T02:16:00
tags:
  - issues
  - linux
  - libvirt
status: ongoing
layout: note
category: Linux
---


### 2023-11-05
Creating a new virtual machine with virt-manager, when creating or selecting the disk image, virt-manager crashes:

```bash
#> tinybot

Nov 04 17:27:24.209082 tinybot libvirtd[1455]: End of file while reading data: Input/output error
Nov 04 17:27:24.209077 tinybot libvirtd[1455]: hostname: tinybot
Nov 04 17:27:24.209069 tinybot libvirtd[1455]: libvirt version: 9.9.0
```

```bash
#> tinybot
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

Drives:
  Local Storage: total: 931.51 GiB used: 21.08 GiB (2.3%)
  ID-1: /dev/nvme0n1 maj-min: 259:0 vendor: KIOXIA model: EXCERIA SSD
    size: 931.51 GiB block-size: physical: 512 B logical: 512 B speed: 31.6 Gb/s
    lanes: 4 tech: SSD serial: <filter> fw-rev: ECFA12.9 temp: 42.9 C
    scheme: GPT
  SMART: yes health: PASSED on: 98d 23h cycles: 90
    read-units: 3,782,448 [1.93 TB] written-units: 10,215,325 [5.23 TB]
Partition:
  ID-1: / raw-size: 931.22 GiB size: 931.22 GiB (100.00%)
    used: 21.07 GiB (2.3%) fs: btrfs block-size: 4096 B dev: /dev/nvme0n1p2
    maj-min: 259:2
  ID-2: /boot/efi raw-size: 300 MiB size: 299.4 MiB (99.80%)
    used: 576 KiB (0.2%) fs: vfat block-size: 512 B dev: /dev/nvme0n1p1
    maj-min: 259:1
  ID-3: /home raw-size: 931.22 GiB size: 931.22 GiB (100.00%)
    used: 21.07 GiB (2.3%) fs: btrfs block-size: 4096 B dev: /dev/nvme0n1p2
    maj-min: 259:2
  ID-4: /var/log raw-size: 931.22 GiB size: 931.22 GiB (100.00%)
    used: 21.07 GiB (2.3%) fs: btrfs block-size: 4096 B dev: /dev/nvme0n1p2
    maj-min: 259:2
  ID-5: /var/tmp raw-size: 931.22 GiB size: 931.22 GiB (100.00%)
    used: 21.07 GiB (2.3%) fs: btrfs block-size: 4096 B dev: /dev/nvme0n1p2
    maj-min: 259:2
```

However on another host, things are working as expected:

```bash
#> ninjabot
#> sudo inxi -FzjJxyar
System:
  Kernel: 6.6.0-2-cachyos arch: x86_64 bits: 64 compiler: gcc v: 13.2.1
    clocksource: tsc available: hpet,acpi_pm
    parameters: BOOT_IMAGE=/@/boot/vmlinuz-linux-cachyos
    root=UUID=3d8ef1d5-6156-40ef-8571-3c6ff1cee042 rw rootflags=subvol=@
    efi=runtime threadirqs crashkernel=384M-:128M quiet nowatchdog
    zswap.enabled=0 loglevel=3
  Desktop: i3 v: 4.23 info: i3bar dm: startx Distro: CachyOS base: Arch Linux

Drives:
  Local Storage: total: 238.47 GiB used: 122.58 GiB (51.4%)
  ID-1: /dev/sda maj-min: 8:0 model: SATA SSD family: Driven OEM SSDs
    size: 238.47 GiB block-size: physical: 512 B logical: 512 B sata: 3.2
    speed: 6.0 Gb/s tech: SSD serial: <filter> fw-rev: 61.3 temp: 33 C
    scheme: GPT
  SMART: yes state: enabled health: PASSED on: 1y 224d 7h cycles: 361
    written: 14375 GiB
Partition:
  ID-1: / raw-size: 237.47 GiB size: 237.47 GiB (100.00%)
    used: 122.58 GiB (51.6%) fs: btrfs block-size: 4096 B dev: /dev/sda2
    maj-min: 8:2
  ID-2: /boot/efi raw-size: 1024 MiB size: 1022 MiB (99.80%)
    used: 576 KiB (0.1%) fs: vfat block-size: 512 B dev: /dev/sda1 maj-min: 8:1
  ID-3: /home raw-size: 237.47 GiB size: 237.47 GiB (100.00%)
    used: 122.58 GiB (51.6%) fs: btrfs block-size: 4096 B dev: /dev/sda2
    maj-min: 8:2
  ID-4: /var/log raw-size: 237.47 GiB size: 237.47 GiB (100.00%)
    used: 122.58 GiB (51.6%) fs: btrfs block-size: 4096 B dev: /dev/sda2
    maj-min: 8:2
  ID-5: /var/tmp raw-size: 237.47 GiB size: 237.47 GiB (100.00%)
    used: 122.58 GiB (51.6%) fs: btrfs block-size: 4096 B dev: /dev/sda2
    maj-min: 8:2

```
