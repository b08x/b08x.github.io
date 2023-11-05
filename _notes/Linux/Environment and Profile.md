---
title: setting environment variables
tags:
  - linux
  - shell
  - systemd
excerpt: today was a day like any other...
---


## environment and profile config load order

```bash
# login via ssh
/etc/environment -> ~/.zshenv -> /etc/profile -> /etc/profile.d/ruby.sh -> ~/.profile -> ~/.zprofile -> ~/.zshrc
```

```bash
# autologin to i3 via xinitrc
/etc/environment -> ~/.zshenv -> /etc/profile -> /etc/profile.d/ruby.sh -> ~/.profile -> ~/.zprofile
-> startx
~/.xinitrc -> ~/.xprofile 
-> exec i3
~/.zshenv -> /etc/profile -> /etc/profile.d/ruby.sh -> ~/.profile -> ~/.zprofile -> ~/.zshrc
```

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

