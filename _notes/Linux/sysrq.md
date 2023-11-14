---
layout: note
title: sysrq
subtitle: 
category: 
tags: 
links:
---

`Alt + PrintScreen + $command`


https://docs.kernel.org/admin-guide/sysrq.html

[Okay, so what can I use them for?](https://docs.kernel.org/admin-guide/sysrq.html#okay-so-what-can-i-use-them-for "Permalink to this heading")

Well, unraw(r) is very handy when your X server or a svgalib program crashes.

The loglevels `0`-`9` are useful when your console is being flooded with kernel messages you do not want to see. Selecting `0` will prevent all but the most urgent kernel messages from reaching your console. (They will still be logged if syslogd/klogd are alive, though.)

`term(e)` and `kill(i)` are useful if you have some sort of runaway process you are unable to kill any other way, especially if it's spawning other processes.

"just thaw `it(j)`" is useful if your system becomes unresponsive due to a frozen (probably root) filesystem via the FIFREEZE ioctl.