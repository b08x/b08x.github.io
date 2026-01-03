---
last updated: "Friday, October 3rd 2025, 4:45:49 am"
tags:
- linux
- troubleshooting
- system-configuration
- grub
- rocky-linux-9
title: Rocky Linux 9 Corrupted EFI Boot Troubleshooting
permalink: /notes/linux/rocky-linux-9-corrupted-efi-boot-troubleshooting
---

So the problem occurs is after a power outage on a host with a weak or low CMOS battery, A sudden loss of power, combined with a failing battery, will cause the NVRAM to lose its stored settings including the EFI Boot entries required for system boot.

In this case, Rocky 9 is the host OS. First, boot into a Rocky 9-Workstation UEFI Live ISO. Then, mount your EFI and other relevant system partitions (boot, root, etc.).

> \[!info\]  
> In this specific context; the efi, boot and root partitions were assigned to /dev/sdb

**Mounting Partitions & Chroot**

```bash
[root@localhost-live ~] mkdir -pv /mnt/boot/efi

[root@localhost-live ~] mount /dev/sdb3 /mnt
[root@localhost-live ~] mount /dev/sdb2 /mnt/boot
[root@localhost-live ~] mount /dev/sdb1 /mnt/boot/efi

[root@localhost-live ~] mount -o bind /dev /mnt/dev
[root@localhost-live ~] mount -o bind /proc /mnt/proc
[root@localhost-live ~] mount -o bind /sys /mnt/sys

[root@localhost-live ~] chroot /mnt
```

**Reinstalling Grub Packages and Mounting efivarfs:**

After chrooting, reinstall relevant grub/efi related packages; Mount efivarfs. This is a common requirement inside a `chroot` to communicate with the UEFI firmware.

```bash
[root@localhost-live /] dnf reinstall grub2-common grub2-efi-* shim*

[root@localhost-live /] mount -t efivarfs efivarfs /sys/firmware/efi/efivars
```

Use `grub2-install` to place the GRUB bootloader files on your EFI partition and create a new EFI boot entry. The `--bootloader-id` option assigns a name to the boot entry, such as `rocky`.

> \[!caution\]  
> These notes assume that UEFI Secure Boot is *disabled* -- seek additional information if the host requires Secure Boot


**Installing Grub:**

```shell
[root@localhost-live /] grub2-install --target=x86_64-efi \
--efi-directory=/boot/efi --bootloader-id=rocky --recheck

Installing for x86_64-efi platform.

grub2-install: error: This utility should not be used for EFI platforms because it does not support UEFI Secure Boot. If you really wish to proceed, invoke the --force option.

Make sure Secure Boot is disabled before proceeding.
```

> \[!attention\]  
> The `--force` option is used because Secure Boot is assumed to be disabled. If Secure Boot is enabled, stop here and investigate the correct procedure.\*\*

```bash
[root@localhost-live /] grub2-install --target=x86_64-efi \
--efi-directory=/boot/efi --bootloader-id=rocky --recheck --force

Installing for x86_64-efi platform.

Installation finished. No error reported.
```

**Generating the GRUB Configuration:**

Finally, generate a new GRUB configuration file, exit the `chroot` environment, and reboot:

```bash
[root@localhost-live /] grub2-mkconfig -o /boot/grub2/grub.cfg
Generating grub configuration file ...
grub2-probe: error: cannot find a GRUB drive for /dev/sdd1.  Check your device.map.
Adding boot menu entry for UEFI Firmware Settings ...
done

[root@localhost-live /] exit

[root@localhost-live ~] reboot
```

After the reboot, your system should now boot correctly.
