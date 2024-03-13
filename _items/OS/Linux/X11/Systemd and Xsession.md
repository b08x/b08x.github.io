---
layout: page
title: Systemd & Xsession
subtitle: 
category:
  - Operations
  - OS
  - Linux
tags: 
links:
---

```sh
#systemd approach
#First of all, I don’t want to reconfigure my whole system and right now Xsession script is rather tightly coupled with the rest of Debian. If I ever have to configure X session on a new computer, I want to simply symlink some files with GNU Stow (you can read about how I approach my configuration in dotfiles series). Besides, I’d be rewriting big parts of Xsession anyway, because it out-of-the-box contains some very handy bits (like injecting environment to systemd via DBus, which usually is a separate topic and in Debian we have it for free).

Long story short: I modified ~/.xsession to contain exactly 2 lines:

#!/bin/sh
systemctl --user start --wait xsession.target

#Above invocation of systemctl can be of course placed in a *.desktop file. Just keep in mind that it’s important to use --wait flag, which disallows immediate exit, which in turn would stop X session right after it.

xsession.target looks like this:

[Unit]
Description=X session managed by systemd
BindsTo=graphical-session.target
xsession.target is a synchronization point. User units (started with systemctl --user) cannot wait for targets from system-wide systemctl calls, like graphical.target, sound.target etc. That’s because user units are spawned in a separate daemon, spawned for each user, which has no knowledge of other systemd instances. By hooking into built-in Xsession mechanism we ensured that when xsession.target becomes active, all resources needed by graphical programs ($DISPLAY and $XAUTHORITY) are available.

xsession.target binds to a special target: graphical-session.target, which is active as long as any other active unit requires it. It also acts as an alias for any graphical session (such as GNOME, KDE, i3, awesome, …): other units, which are part of X session should contain PartOf=graphical-session.target. This way they’ll be stopped when graphical-session.target stops. They also don’t need to be changed if i3wm were to be replaced with e.g. some other window manager.

Example unit started in session looks like this:

[Unit]
Description=Compton compositor for X11
PartOf=graphical-session.target

[Service]
ExecStart=/usr/bin/compton --config "%h/.config/compton/compton.conf"

[Install]
WantedBy=graphical-session.target
xsession.target is explicitly required by only one other unit: i3wm.service, which handles starting and stopping window manager:

[Unit]
Description=i3 Window Manager
PartOf=graphical-session.target

[Service]
ExecStart=/usr/local/bin/i3
ExecStopPost=/bin/systemctl --user stop graphical-session.target
Restart=on-failure

[Install]
RequiredBy=xsession.target
Note that xsession.target itself doesn’t require anything by itself (via Requires=). That’s because I prefer to add and remove programs to autostart via systemctl enable and systemctl disable instead of editing systemd unit files.

Another interesting part is ExecStopPost=, which stops graphical-session (and all of its parts) whenever i3 quits. To quit a session, graphical-session.target must be stopped one way or another and I decided to keep a behaviour that I’m familiar with: window manager acts as a session’s master and whenever it quits, the whole session is killed as well - it didn’t always work for me before, but it’s one of the features of systemd.
```

