---
layout: page
title: btrfs
subtitle: 
category:
  - OS
  - Linux
tags: 
links: 
permalink:
---


```sh
# /dev/sdb all of a sudden, just fails....
# either in maintaience mode or boot from rescue

# /dev/sda /dev/sdb are configured as raid1 mounted by uuid to /backup

mount /dev/sda /backup -o degraded

btrfs replace start -r 2 /dev/sdb backup # takes a few hours

btrfs balance start -musage=50 -dusage=50 /backup/ # about 10 minutes

btrfs scrub start / # 2-3 hours

btrfs filesystem defragment -r -v -czstd /backup/


```

[a source](https://wiki.tnonline.net/w/Btrfs/Replacing_a_disk)