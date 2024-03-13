---
layout: page
title: Workstation Bootstrap
subtitle: an exercise in adaptable refactoring
category:
  - OS
  - Configuration Management
tags:
  - ansible
  - yadm
  - linux
  - archlinux
links: 
permalink: /os/cfgmgmt/workstation-bootstrap
---

## The Process
The process up until now has been to run `yadm clone` on first login after an initial playbook run, which pulls user configurations from a repository and then runs any executable scripts that exist within the bootstrap.d directory, which is by default located in `~/.config/yadm/bootstrap.d` 

A current, the scripts install some utility programs along with Ansible, after which an Ansible playbook is run from a remote workstation to complete the process.


## Adjusting The Process
Using the ArchLabs installer, you can specify a command that will be executed at the end of the initial installation. The command is executed within the chroot environment as the root user.

So, the goal is to configure a particular Ansible collection to work with `ansible-pull` running as root within chroot environment. Currently this collection is configured to run as the user, using `sudo` for privileged escalation. In this case of using the collection with an installer like this, it makes sense to run the playbook as root, using `su` to execute tasks as the user 
