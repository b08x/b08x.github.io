---
layout: note
title: workstation bootstrap
subtitle: an exercise in adaptable refactoring
category: 
tags:
  - ansible
  - yadm
  - linux
  - arch
links:
---

<div><div id="elevenlabs-audionative-widget" data-height="90" data-width="100%" data-frameborder="no" data-scrolling="no" data-publicuserid="92d135b76a931d6c34c5346b967eba55b32811b1f0d1b81d613d61bc1ca54732" data-playerurl="https://elevenlabs.io/player/index.html" data-small="True" data-textcolor="rgba(0, 0, 0, 1.0)" data-backgroundcolor="rgba(255, 255, 255, 1.0)" >Loading the <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">Elevenlabs Text to Speech</a> AudioNative Player...</div><script src="https://elevenlabs.io/player/audioNativeHelper.js" type="text/javascript"></script></div>

## The Process
The process up until now has been to run `yadm clone` on first login after an initial playbook run, which pulls user configurations from a repository and then runs any executable scripts that exist within the bootstrap.d directory, which is by default located in `~/.config/yadm/bootstrap.d` 

A current, the scripts install some utility programs along with Ansible, after which an Ansible playbook is run from a remote workstation to complete the process.

## Adjusting The Process
Using the ArchLabs installer, you can specify a command that will be executed at the end of the initial installation. The command is executed within the chroot environment as the root user.

So, the goal is to configure a particular Ansible collection to work with `ansible-pull` running as root within chroot environment. Currently this collection is configured to run as the user, using `sudo` for privileged escalation. In this case of using the collection with an installer like this, it makes sense to run the playbook as root, using `su` to execute tasks as the user when necessary.



