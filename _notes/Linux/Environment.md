---
title: setting environment variables
tags:
  - linux
  - shell
  - systemd
---



### pam_env

* `/etc/environment` is used by the [pam_env module](https://wiki.archlinux.org/title/environment_variables#Using_pam_env) and is shell agnostic so scripting or glob expansion cannot be used.

* The [PAM](https://wiki.archlinux.org/title/PAM "PAM") module [pam_env(8)](https://man.archlinux.org/man/pam_env.8) loads the variables to be set in the environment from the following files in order: `/etc/security/pam_env.conf` and `/etc/environment`.

* - These files are read before other files...in particular before `~/.profile`, `~/.bash_profile` and `~/.zshenv`.


```bash
/etc/environment -> /etc/profile -> ~/.profile
```



/etc/profile initializes variables for login shells only

### shell

* zsh will read commands from the following files in the following order: 
	* /etc/zsh/zshenv
	* $ZDOTDIR/.zshenv
	* /etc/zsh/zprofile
		* please note that on Arch Linux, by default it contains [one line](https://gitlab.archlinux.org/archlinux/packaging/packages/zsh/-/blob/main/zprofile) which sources `/etc/profile`. See warning below before wanting to remove that!
	* $ZDOTDIR/.zprofile
	* /etc/zsh/zshrc
	* $ZDOTDIR/.zshrc
	* /etc/zsh/zlogin
	* $ZDOTDIR/.zlogin
	* $ZDOTDIR/.zlogout
	* /etc/zsh/zlogout
	* 

- `/etc/profile` This file should be sourced by all POSIX sh-compatible shells upon login: it sets up `$PATH` and other environment variables and application-specific (`/etc/profile.d/*.sh`) settings upon login.

### graphical session (xorg)

* If an environment variable only affects graphical applications, you may want to restrict the scope of it by only setting it within the graphical session. In order of decreasing scope:

	 * per xorg session
		* .xprofile
		* .xinitrc
		* .xsession
		* 

	* per desktop environment session
	* per application*

#### systemd

* The user instance of systemd does not inherit any of the [environment variables](https://wiki.archlinux.org/title/Environment_variables "Environment variables") set in places like `.bashrc` etc. There are several ways to set environment variables for the systemd user instance:
	* `~/.config/environment.d/` directory with lines of the form `NAME=VAL`. Affects only that user's user unit.

	* At any time, use `systemctl --user set-environment` or `systemctl --user import-environment`. Affects all user units started after setting the environment variables, but not the units that were already running.

	* Using the `dbus-update-activation-environment --systemd --all` command provided by [dbus](https://wiki.archlinux.org/title/Dbus "Dbus"). Has the same effect as `systemctl --user import-environment`, but also affects the D-Bus session. ==You can add this to the end of your shell initialization file.== 
	* 
	* 
	* 

[source](https://wiki.archlinux.org/title/Systemd/User#Environment_variables)
[source](https://www.alibabacloud.com/blog/a-guide-on-environment-variable-configuration-in-linux_598423)
