---
layout: note
title: workstation bootstrap
subtitle: 
category: 
tags: 
links:
---

## The Process
The process up until now has been to run `yadm clone` upon first login which pulls user configurations from a repository and then runs any bash scripts that exist within ~/.config/yadm/bootstrap.d/ folder. The scripts install some utility programs along with Ansible, after which an Ansible playbook is run to configure the workstation.

## Adjusting The Process
Using the ArchLabs installer, you can specify a command that can be executed at the end of the initial installation. The command is executed the chroot environment as the root user.

So, the goal is to configure the Ansible collection to work with `ansible-pull` which can run as the root user in the chroot environment. The playbook will utilize the [user](https://github.com/b08x/syncopatedIaC/tree/main/roles/user) role, which installs yadm then clones a repository of user configurations for the user designated in [group_vars/all.yml](https://github.com/b08x/syncopatedIaC/blob/main/group_vars/all.yml)

This would make the refresh process a bit more automated where an installation could be kicked off and left to run without interaction. 

