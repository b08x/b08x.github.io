---
layout: post
permalink: /notes/virt-p2v/
title: "From Metal to Guest: Moving a Fedora 43 Workstation to AlmaLinux KVM with virt-p2v"
description: "A field guide for one workstation's journey from bare metal to KVM guest: build the virt-p2v boot medium, prepare the Alma host as the conversion server, copy the whole machine over SSH, and clean up afterward — with a troubleshooting list for everything that usually breaks on the way."
tags: [kb, fedora, almalinux]
author: Bort
model: mistral-vibe-latest
---

## The Short Version

Your Fedora 43 workstation becomes an AlmaLinux KVM guest through one boot, one SSH connection, and two cooperating programs: virt-p2v on the workstation and virt-v2v on the Alma host, both from libguestfs, both free. Build the boot image in advance, boot the workstation from it, point the GUI at the Alma host, and press one button; when the log stops scrolling, a libvirt guest sits ready for `virsh start`. The physical disk is only ever read, so it survives as your undo button.

## Why the Boot Medium Exists

Converting a running machine risks copying files mid-write, so virt-p2v insists the workstation reboot from its own boot medium, leaving the disks perfectly still while they are read. The boot image is a minimal appliance whose only job is running virt-p2v; its base operating system is independent of the Fedora 43 system being converted, in the way a moving van's engine is independent of your furniture.

## How the Two Machines Divide the Labor

virt-p2v does the talking; virt-v2v does the thinking. Every byte travels over SSH, initiated from the workstation to the Alma host on TCP port 22, so the firewall checklist is one line long. The Alma host must allow SSH reverse port forwarding and scp, because the disk data rides `ssh -R` tunnels. The network sets the speed limit: at gigabit speed (about 110 MB/s), a full 512 GB drive takes seventy-nine minutes; on 10 GbE, eight.

## Preparing the Alma Host

Prepare the Alma host first, in this order:

- Install the conversion stack from AppStream and start the daemon:
  ```
  sudo dnf install virt-v2v
  sudo systemctl enable --now libvirtd
  ```
- Create no disk in advance — virt-v2v creates the guest's disk itself; your whole job is free space:
  ```
  df -h /var/tmp
  virsh pool-list --all
  ```
- With the default `-o local` output, the image lands in `/var/tmp` and needs only filesystem space; with `-o libvirt`, point **Output storage** at a pool — the `default` pool (`/var/lib/libvirt/images`) exists on most libvirt installs, or make a dedicated directory-backed one:
  ```
  sudo virsh pool-define-as p2v dir --target /var/lib/libvirt/images/p2v
  sudo virsh pool-build p2v
  sudo virsh pool-start p2v
  ```
- With sparse allocation the image grows only as data arrives, so the space you need matches your used data.
- Confirm SSH is reachable from the workstation; skip the add-and-reload pair if the listing already shows it:
  ```
  firewall-cmd --list-services
  sudo firewall-cmd --permanent --add-service=ssh
  sudo firewall-cmd --reload
  ```
- Permit the login virt-p2v will use: root (`PermitRootLogin yes`), or a passwordless-sudo user with the first dialog's sudo box — and in both cases keep `AllowTcpForwarding yes` in `/etc/ssh/sshd_config`:
  ```
  sudo systemctl reload sshd
  ```
- Run the boredom test from the workstation: leave an SSH session open for one hour, and if it drops on its own, check `TMOUT` and `TIMEOUT` in root's shell, the `ClientAlive*` settings in sshd\_config, and any firewall in between, before a real conversion depends on it:
  ```
  ssh root@alma-host
  ```

## Cleaning the Workstation Before the Move

The copy is block-level, so it bills by the pound: a machine converted at 86% full arrives at 86% full. A long-lived workstation is a dorm room — the decor is fine, the accumulation under the bed is not — and Btrfs adds a twist: deleted files stay allocated at the device level until a discard runs, so cleaning without trimming merely relocates the clutter to where the block layer can still see it. Work the list, trim last:

- Clear the package cache and cut the journal down:
  ```
  sudo dnf clean all
  sudo journalctl --vacuum-time=7d
  ```
- Prune the container hoard, usually the single largest resident; on the Btrfs storage driver this also removes the container-layer subvolumes that can confuse inspection during conversion:
  ```
  sudo podman system prune -a
  docker system prune -a
  ```
- Remove unused flatpaks and old kernels kept past the install limit:
  ```
  flatpak uninstall --unused
  sudo dnf remove --oldinstallonly
  ```
- Delete the snapshots you can part with, because Btrfs copy-on-write means a snapshot keeps deleted files allocated — the box you never opened stays packed as long as a photograph of it exists; then walk the rooms with `ncdu` and empty the trash.
- Trim last, so the freed blocks are actually returned to the device and the copy stays small:
  ```
  sudo fstrim -av
  ```
- Check the result, remembering the guest inherits the physical disk's size — used data shrinks, nominal size does not:
  ```
  df -h /
  ```

## Building the Bootable Medium

Build the medium on the Fedora 43 workstation while it still lives happily on metal; the same maker tools sit in AlmaLinux AppStream (virt-p2v 1.42.4 for el9 and el10), so the Alma host can build it if the workstation dies first.

- Install the builder; Fedora 43 ships the binary and maker tools in one package (`virt-p2v-maker` in older releases):
  ```
  sudo dnf install virt-p2v
  ```
- Build the image — the script pulls a base OS through virt-builder; `virt-builder -l` lists the candidates:
  ```
  virt-p2v-make-disk -o /var/tmp/p2v.img
  virt-builder -l
  ```
- Copy it to a USB stick; this erases the stick completely, and dd obeys you perfectly, so read the device name twice:
  ```
  sudo dd if=/var/tmp/p2v.img of=/dev/sdX bs=8M oflag=direct conv=fsync status=progress
  ```
- Add debugging tools or bake in an SSH key if you like, appending `id_rsa.pub` to `/root/.ssh/authorized_keys` on the Alma host between the key step and the inject:
  ```
  virt-p2v-make-disk -o /var/tmp/p2v.img --install tcpdump,traceroute
  ssh-keygen -t rsa -N '' -f id_rsa
  virt-p2v-make-disk -o /var/tmp/p2v.img --inject-ssh-identity id_rsa
  ```
- A dry run is possible: boot the image in qemu with a scratch disk attached and convert that, per the test recipe in the official documentation.
- If you want a literal ISO, `virt-p2v-make-kickstart` generates a kickstart (p2v.ks) that livecd-creator builds into a live-CD ISO; expect it about five gigabytes lighter than the raw image on a Fedora 43 build, because the raw p2v.img is a full uncompressed disk while the live ISO carries a compressed minimal root filesystem — both boot the identical virt-p2v GUI. Raw image on a USB stick, ISO in a (possibly virtual) CD-ROM drive; the conversion runs the same either way.

## Running the Conversion

- Reboot the workstation from the USB stick (or the live-CD ISO); virt-p2v starts on its own and shows the connection dialog.
- In the first dialog, enter the Alma host's name, port 22, the username (root by default), and the password or SSH identity URL; press **Test connection** first, because it verifies both credentials and the remote virt-v2v version. **Configure network** handles static IPs and wifi; **XTerm** opens a shell for diagnostics.
- In the second dialog, set the guest name, vCPUs, and RAM — defaults come from the physical machine and usually stay.
- Choose the output mode: the default `-o local` with `/var/tmp` lands a disk image plus a libvirt XML file on the Alma host for manual review, or `-o libvirt` with a storage pool defines the guest directly in the host's libvirt.
- Select every disk of an LVM volume group or RAID array, or none — a half-copied volume group is a sad volume group — and keep the OS disk checked.
- Map the network interfaces to target bridges, then press **Start conversion**.
- The full logs live in `/tmp/virt-p2v-YYYYMMDD-XXXXXXXX` on the Alma host; `virt-v2v-conversion-log.txt` inside is the file to read end to end when something fails.

## Under the Hood: NBD over Reverse SSH

One SSH control connection carries commands, and one additional connection per physical disk carries data: the Alma side reads the workstation's disks through NBD tunneled back over the reverse forward — the reading runs one direction, the tunnel the other. Two protections keep the source safe: qemu-nbd exposes the physical disk read-only, and libguestfs writes to a temporary overlay on the Alma host. The whole configuration also accepts kernel command-line parameters (`p2v.server=alma-host` and friends) for fully unattended runs and PXE boots, which is how whole fleets convert themselves without anyone touching a GUI.

## The Btrfs Question

The guest does not care where the host stands on Btrfs: it runs Fedora's own kernel, which speaks Btrfs natively, while the Alma kernel never parses the guest's disk — QEMU moves blocks, and blocks carry no filesystem opinions. But AlmaLinux ships without the btrfs kernel module (RHEL-family policy), and that matters in exactly one place: the libguestfs appliance, the small inspection VM virt-v2v boots on the conversion server to mount the guest's filesystems, rewrite fstab, and rebuild the initramfs. If that appliance boots the Alma kernel, mounting the Btrfs pool can fail at inspection, killing the conversion before the first byte moves. A five-minute smoke test on the Alma host settles it before migration night:

```
sudo dnf install guestfs-tools
guestfish -N fs:mkfs:btrfs <<'EOF'
run
mount /dev/sda1 /
ll /
EOF
```

If guestfish mounts the test filesystem, the route is clear; if not, pick one of three escapes. First, run the conversion server as a Fedora VM on the Alma host — the virt-p2v documentation explicitly permits a virtual conversion server, a Fedora appliance speaks Btrfs out of the box, and the converted disk and XML land wherever you point them. Second, point the Alma appliance at a Btrfs-capable kernel (a Fedora kernel or ELRepo's kernel-ml) via the `SUPERMIN_KERNEL`, `SUPERMIN_KERNEL_VERSION`, and `SUPERMIN_MODULES` environment variables documented in the libguestfs FAQ. Third, skip inspection entirely: dd the disk across, define the guest by hand, and boot it with a universal initramfs.

That last option needs the initramfs built in advance, because Fedora builds hostonly initramfs images by default, and a hostonly initramfs built on metal has never heard of virtio\_blk, virtio\_pci, or virtio\_scsi — the guest then drops to an emergency shell hunting for a root disk that is sitting right there. Build the universal version before the workstation's last shutdown:

```
sudo dracut --force --no-hostonly
```

On the virt-p2v route, virt-v2v handles this itself: the conversion backs up the old initramfs and regenerates it with virtio\_blk, virtio\_scsi, virtio\_net, and virtio\_pci added, using the guest's own dracut inside the guest, so the Fedora modules — Btrfs included — are what get baked in. The universal image is redundant on that path and essential on the manual one.

Two final Btrfs notes. The copy is block-level, so subvolumes, snapshots, and zstd compression ride along exactly as they are — Btrfs has been Fedora's default layout since Fedora 33, one ext4 /boot, one EFI partition, one Btrfs pool with root and home subvolumes. And Docker or Podman with the Btrfs storage driver stores container image layers as subvolumes, which inspection can mistake for the OS root; recent virt-v2v releases prefer the real root, so keep the Alma host's virt-v2v current and confirm in the log which root it chose. If the pool sits inside LUKS encryption, flag it before booting the ISO: the conversion needs a passphrase keyslot and a key handed to virt-v2v, and a TPM-sealed key alone will refuse to open on the new machine — the TPM working exactly as designed.

## After the Conversion

- Inspect, start, and watch the boot:
  ```
  virsh list --all
  virsh start <name>
  virsh console <name>
  ```
- Fedora 43 ships virtio drivers in its kernel, so virtio disks and NICs need zero extra work.
- NetworkManager will meet a new NIC with a new MAC address; confirm the connection profile once.
- If the workstation carried a proprietary GPU driver (NVIDIA's, say), remove it inside the guest; the virtual GPU runs on the in-kernel driver.
- Leave the physical machine untouched for a day as the rollback plan — the cheapest backup policy you will ever adopt — and keep it powered off specifically: the guest inherits the workstation's hostname, IP configuration, and machine identity, and two machines claiming the same name on one network is the collision Red Hat's own procedure warns about.

## Troubleshooting

- The conversion drops mid-copy: repeat the one-hour idle SSH test, unset `TMOUT` and `TIMEOUT`, relax the `ClientAlive*` settings on the Alma host, and check any intermediate firewall; virt-p2v 1.36 and newer sends keepalives every five minutes.
- Login is refused: fix `PermitRootLogin`, or check the **Use sudo when running virt-v2v** box in the first dialog and grant passwordless sudo.
- The transfer stalls at the start: `AllowTcpForwarding` must be `yes` on the Alma host — a disabled reverse forward breaks the data channel quietly.
- The conversion fails: read the complete, unedited `/tmp/virt-p2v-*/virt-v2v-conversion-log.txt` from the top; support requests ask for that exact file, whole.

## Addendum: The Developer Caches

Language tooling hoards with an enthusiasm the operating system never authorized: uv, npm, Bun, pip, cargo, and Go each keep a private warehouse of downloaded packages. Clearing them costs one re-download at next build, and nothing else:

- uv (Python):
  ```
  uv cache clean
  ```
- npm (Node.js), with `--force` because npm prints a protest without it:
  ```
  npm cache clean --force
  ```
- Bun:
  ```
  bun pm cache rm
  ```
- pip and Go, if those live here; Go's module cache is read-only by design, hence the dedicated flag:
  ```
  pip cache purge
  go clean -modcache
  ```
- cargo, whose registry is the deepest single hoard in most home directories:
  ```
  rm -rf ~/.cargo/registry
  ```
- yarn and pnpm, for the other corners of the JavaScript ecosystem:
  ```
  yarn cache clean
  pnpm store prune
  ```
- Survey the rest with `ncdu ~`, and treat `~/.cache` with respect — some apps keep working state there, so delete by subdirectory after seeing the sizes ranked:
  ```
  du -sh ~/.cache/* | sort -h
  ```
- Time the purge for the final pre-migration pass, because these caches regrow with use — a purge months early is therapy, a purge the day before conversion is strategy; after the last purge, run `sudo fstrim -av` once more so the block layer agrees with the closet.

## References

The authoritative references live at libguestfs: [virt-p2v(1)](https://libguestfs.org/virt-p2v.1.html), [virt-p2v-make-disk(1)](https://libguestfs.org/virt-p2v-make-disk.1.html), and [virt-p2v-make-kickstart(1)](https://libguestfs.org/virt-p2v-make-kickstart.1.html), plus the virt-v2v manual on the same site for the full catalog of output modes.
