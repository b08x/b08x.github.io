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
draft: true
---

## The Process
The process up until now has been to run `yadm clone` on first login after an initial playbook run, which pulls user configurations from a repository and then runs any executable scripts that exist within the bootstrap.d directory, which is by default located in `~/.config/yadm/bootstrap.d` 

A current, the scripts install some utility programs along with Ansible, after which an Ansible playbook is run from a remote workstation to complete the process.


## Adjusting The Process
Using the ArchLabs installer, you can specify a command that will be executed at the end of the initial installation. The command is executed within the chroot environment as the root user.

So, the goal is to configure a particular Ansible collection to work with `ansible-pull` running as root within chroot environment. Currently this collection is configured to run as the user, using `sudo` for privileged escalation. In this case of using the collection with an installer like this, it makes sense to run the playbook as root, using `su` to execute tasks as the user 


## Why This Is a Great Idea

- Enhanced Automation: Yadm excels at version control for individual dotfiles, while Ansible shines at orchestrating system-level configuration changes. Combining them lets you automate more of your setup, minimizing manual work.
    
- Reproducibility: With both your dotfiles and system settings under version control, replicating your ideal environment on different machines becomes a breeze. This is invaluable for development/production parity or handling reinstalls.
    
- Consistency and Collaboration: Ansible + yadm establishes a well-defined workflow that facilitates collaboration. Others can easily understand how you manage your system configuration, making it easier to onboard new users or work on shared projects.

    

### Integration Strategies

1. Yadm for Core Dotfiles: Keep your .bashrc, .vimrc, .config/i3/config etc., under yadm. This ensures you always have your personal editor, shell, and essential tool configurations at hand.
    
2. Ansible for System-Wide Settings: Utilize Ansible playbooks for tasks like:
  - Package installation and updates
  - Systemd service configuration
  - Network setup (firewall, hostname, etc.)
  - User management
  - Audio optimization (Jack, Pulseaudio, etc.)

3. Clear Separation: Maintain a logical boundary between what yadm tracks and what Ansible manages. This keeps your tools focused and simplifies reasoning about changes.
    
4. Leverage Ansible Roles: Structure your collection using Ansible roles (e.g., audio, desktop, development) to modularize tasks and improve reusability.
    
5. Integration Points: Consider these ways to link your yadm and Ansible workflows:
    - Ansible Pre-task: Have an Ansible playbook pull your yadm repo as a first step, deploying your dotfiles.    
    - Yadm Post-task: Add a yadm task at the end of your setup process to commit and push any changes to dotfiles if needed.
