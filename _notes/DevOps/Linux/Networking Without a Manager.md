---
layout: note
title: Networking Without a Manager
subtitle: Well, it's just called something different, which is still better
category: 
tags: 
links:
---


# general grievances and exceptions

interface name changes happen at random!

#### so...


As usual, [Arch wiki](https://wiki.archlinux.org/index.php/Systemd-networkd) covers it

enable systemd-networkd.service

create /etc/systemd/network/20-wired.service


```sh
[Match]
Name=eth0

[Network]
Address=10.1.10.9/24
Gateway=10.1.10.1
DNS=10.1.10.1
#DNS=8.8.8.8
```


This is of course assuming if.netnames & biosdevame are both set to =0 in grub.


### samba config

[description](https://wiki.archlinux.org/index.php/samba)

```sh
/etc/samba/smb.conf

[global]
  ;inherit owner = unix only ; Inherit ownership of the parent directory for new files and directories
  ;inherit permissions = yes ; Inherit permissions of the parent directory for new files and directories
  create mask = 0664
  directory mask = 2755
  force create mode = 0644
  force directory mode = 2755
  disable netbios = yes
  dns proxy = no
  ...

[media]
  comment = Media share accessible by greg and pcusers
  path = /srv/share
  valid users = b08x asherry @home
  force group = +home
  public = no
  writable = yes
  create mask = 0664
  directory mask = 2775
  force create mode = 0664
  force directory mode = 2775

[archive]
  comment = Public share where archie has write access
  path = /srv/archive
  public = yes
  read only = yes
  write list = b08x
  printable = no

#[guests]
#  comment = Allow all users to read/write
#  path = /tmp
#  public = yes
#  only guest = yes
#  writable = yes
#  printable = no
```



