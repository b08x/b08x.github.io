---
title: environment and profile config load order
date: 2023-11-06T01:04:00
tags:
  - linux
  - issues
  - profile
status: ongoing
layout: note
category: Linux
---
## environment and profile config load order

* browser needs to be set as when it is exported, it interferes with xdg

### setting vs exporting

**Setting a variable**

When you set a variable, you are creating a local variable that is only accessible within the current shell session. This means that the variable will not be available to any child processes that are spawned from the current shell

**Exporting a variable**

When you export a variable, you are making it available to child processes that are spawned from the current shell. This means that the variable will be available to any command that you execute from the current shell, as well as to any scripts that you run.

|Action|Description|Scope|
|---|---|---|
|Set|Creates a local variable that is only accessible within the current shell session.|Local|
|Export|Makes a variable available to child processes.|Global|




`2023-11-07 16:45`

```bash
# via ssh
b08x@archlabs ~ % echo $UU_ORDER
/etc/environment:/etc/zsh/profile:/etc/profile:/etc/profile.d/ruby.sh:~/.zprofile:~/.zshrc

# via i3
b08x@archlabs ~ % echo $UU_ORDER
/etc/environment
~/.zshenv
/etc/profile
~/.zprofile:
~/.xinitrc
~/.xprofile
~/.zshrc
```

---

`2023-11-07 00:44`

A fresh install of Archlabs using i3 and autologin via getty console:

```bash
$UU_ORDER:
/etc/environment:
/etc/zsh/profile:
/etc/profile:
~/.zprofile:
~/.xinitrc:
~/.xprofile:
~/.zshrc`
```

---
`2023-11-06`

After latest revision of Ansible playbook and tasks, this is the load order of environment and profile configs:

* using CachyOS

```bash
# login via ssh
/etc/environment
~/.zshenv
/etc/profile
/etc/profile.d/ruby.sh
~/.profile
~/.zprofile
~/.zshrc
```

```bash
# autologin to i3 via xinitrc
/etc/environment
~/.zshenv
/etc/profile
/etc/profile.d/ruby.sh
~/.profile
~/.zprofile
--> startx
~/.xinitrc
~/.xprofile 
--> exec i3
~/.zshenv
/etc/profile
/etc/profile.d/ruby.sh
~/.profile
~/.zprofile
~/.zshrc
```

For some reason, logging into i3 via agetty service (which uses xinitrc) loads the profile configurations twice


---

# notes
## /etc/environment & /etc/profile
* `/etc/environment` is shell agnostic so scripting or glob expansion cannot be used.

* The PAM module loads the variables to be set in the environment from the following files in order: `/etc/security/pam_env.conf` and `/etc/environment`.

* - These files are read before other files...in particular before `~/.profile`, `~/.bash_profile` and `~/.zshenv`.
 
* /etc/profile initializes variables for login shells only
 
* `/etc/profile` This file should be sourced by all POSIX sh-compatible shells upon login: it sets up `$PATH` and other environment variables and application-specific (`/etc/profile.d/*.sh`) settings upon login.

## zsh
* zsh will read commands from the following files in the following order: 

```bash
* /etc/zsh/zshenv
* $ZDOTDIR/.zshenv
* /etc/zsh/zprofile # please note that on Arch Linux, by default sources `/etc/profile`
* $ZDOTDIR/.zprofile
* /etc/zsh/zshrc
* $ZDOTDIR/.zshrc
* /etc/zsh/zlogin
* $ZDOTDIR/.zlogin
* $ZDOTDIR/.zlogout
* /etc/zsh/zlogout
```

## graphical session (xorg)

* .xprofile
* .xinitrc

## systemd

* The user instance of systemd does not inherit any of the environment variables set in places like `.bashrc` etc. 
* There are several ways to set environment variables for the systemd user instance:

	* `~/.config/environment.d/` directory with lines of the form `NAME=VAL`. Affects only that user's user unit.

	* At any time, use `systemctl --user set-environment` or `systemctl --user import-environment`. Affects all user units started after setting the environment variables, but not the units that were already running.

	* Using the `dbus-update-activation-environment --systemd --all` command provided by [dbus](https://wiki.archlinux.org/title/Dbus "Dbus"). Has the same effect as `systemctl --user import-environment`, but also affects the D-Bus session. <font color="#ffff00">You can add this to the end of your shell initialization file.</font>

---

[arch wiki: environment variables](https://wiki.archlinux.org/title/Systemd/User#Environment_variables)

[helpful method on how to determine file load order](https://www.alibabacloud.com/blog/a-guide-on-environment-variable-configuration-in-linux_598423)

