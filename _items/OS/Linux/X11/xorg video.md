---
layout: note
title: xorg video
subtitle: 
category:
  - Operations
  - OS
  - Linux
tags:
  - linux
links:
---



```bash
│Oct 10 17:01:56.162978 tinybot qpdfview.desktop[72746]: libGL error: glx: failed to create dri3 screen                                                                                                            │
│Oct 10 17:01:56.162978 tinybot qpdfview.desktop[72746]: libGL error: failed to load driver: i915                                                                                                                  │
│Oct 10 17:01:56.167109 tinybot qpdfview.desktop[72746]: libGL error: glx: failed to create dri2 screen                                                                                                            │
│Oct 10 17:01:56.167109 tinybot qpdfview.desktop[72746]: libGL error: failed to load driver: i915  
```


[fix for: intel(0): Failed to submit rendering commands (Invalid argument), disabling acceleration.](https://forums.gentoo.org/viewtopic-t-1145306-start-0.html)


xorg.conf four displays
-----------------------

libGL error: MESA-LOADER: failed to open i965: /usr/lib/dri/i965_dri.so: cannot open shared object file: No such file or directory (search paths /usr/lib/dri, suffix _dri)

sudo pacman -F /usr/lib/dri/i965_dri.so                                                                   
usr/lib/dri/i965_dri.so is owned by extra/mesa-amber 21.3.9-1

[description](https://access.redhat.com/discussions/1144733)
[description](https://wiki.archlinux.org/title/multihead)

---

[description](https://unix.stackexchange.com/a/569807/483352)

```sh
Section "Device"
    Identifier "intel0"
    Driver "intel"
    Option "ZaphodHeads" "VGA1,HDMI1,DP1"
    Screen 0
EndSection

Section "Device"
    Identifier "intel1"
    Driver "intel"
    Option "ZaphodHeads" "HDMI3"
    Screen 1
EndSection
```


