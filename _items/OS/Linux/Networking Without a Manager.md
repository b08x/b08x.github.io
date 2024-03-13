---
layout: page
title: Networking Without a Manager
subtitle: 
category:
  - OS
  - Linux
tags:
  - linux
  - networking
links: 
status: draft
---

## general grievances and exceptions

interface name changes happen at random!

As usual, [Arch wiki](https://wiki.archlinux.org/index.php/Systemd-networkd) covers it

#TODO: replace network-manager with systemd-network

```sh
[Match]
Name=eth0

[Network]
Address=10.1.10.9/24
Gateway=10.1.10.1
DNS=10.1.10.1
#DNS=8.8.8.8
```

