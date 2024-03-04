---
layout: note
title: xauth
subtitle: 
category:
  - Operations
  - OS
  - Linux
tags: []
links:
---

#linux #xorg 

```bash
touch ~/.Xauthority
xauth generate :0 . trusted
xauth add ${HOST}:0 . $(xxd -l 16 -p /dev/urandom)
xauth list
```

