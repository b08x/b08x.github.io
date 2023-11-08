---
layout: project
title: Syncopated
subtitle: Ansible Collection For Audio Production on Linux
status: ongoing
permalink: /syncopated
tags:
  - audio
  - linux
  - ansible
  - linux-audio
image: /assets/headers/mpv-shot0001.jpg
---
The "Syncopated" Ansible collection is a framework that contains roles, playbooks, and modules to help configure and manage Linux hosts that are part of an audio production workflow. This includes digital signal processing (DSP) servers as well as digital audio workstation (DAW) client machines.

---

```shell

┌────────────────────────────────┐                      ┌──────────────────────────────────────────┐
│                                │                      │                                          │
│  tinybot                       │                      │        soundbot                          │
│                                │                      │                                          │
│                                │                      │                                          │
│  ray_daemon -p 7777            │                      │   ray-session                            │
│                                │◄─────────────────────┤     * starts jacktrip serer              │
│  ray-session                   │                      │     * starts NetworkSession with tinybot │
│    * starts jacktrip client    │                      │     * launches clients                   │
│    * launches clients          │                      │                                          │
│                                │                      │                                          │
└────────────────────────────────┘                      └──────────────────────────────────────────┘
 
```
 

---


```json

"example/group_vars/all.yml"
{"user"=>{"name"=>"b08x", "realname"=>"Robert Pannick", "group"=>"b08x", "uid"=>1000, "gid"=>1000, "secondary_groups"=>"input,video,audio", "sudoers"=>true, "home"=>"/home/b08x", "workspace"=>"/home/b08x/Workspace", "shell"=>"/usr/bin/zsh", "email"=>"rwpannick@gmail.com", "gpg"=>"36A6ECD355DB42B296C0CEE2157CA2FC56ECC96A", "dots"=>"git@github.com:b08x/dots.git"}, "users"=>[{"name"=>"root", "group"=>"root", "uid"=>0, "gid"=>0, "home"=>"/root", "shell"=>"/usr/bin/zsh"}, {"name"=>"b08x", "realname"=>"Robert Pannick", "group"=>"b08x", "uid"=>1000, "gid"=>1000, "secondary_groups"=>"input,video,audio", "sudoers"=>true, "home"=>"/home/b08x", "workspace"=>"/home/b08x/Workspace", "shell"=>"/usr/bin/zsh", "email"=>"rwpannick@gmail.com", "gpg"=>"36A6ECD355DB42B296C0CEE2157CA2FC56ECC96A", "dots"=>"git@github.com:b08x/dots.git"}], "autofs_client"=>{"host"=>"bender", "shares"=>["backup", "storage"]}, "docker"=>{"storage"=>"/var/lib/docker", "service"=>{"enabled"=>true}, "nvidia"=>false, "users"=>["b08x"]}, "libvirt"=>{"service"=>{"enabled"=>false}, "users"=>["b08x"]}}
"example/group_vars/server.yml"
nil
No Variables in example/group_vars/server.yml
"example/group_vars/workstation.yml"
nil
No Variables in example/group_vars/workstation.yml
+---------------------------------------------------------------------------------------------------------------------------->>
|            File            |      Key      |                                                                               >>
+---------------------------------------------------------------------------------------------------------------------------->>
| example/group_vars/all.yml | user          | {"name"=>"b08x", "realname"=>"Robert Pannick", "group"=>"b08x", "uid"=>1000, ">>
| example/group_vars/all.yml | users         | [{"name"=>"root", "group"=>"root", "uid"=>0, "gid"=>0, "home"=>"/root", "shell>>
| example/group_vars/all.yml | autofs_client | {"host"=>"bender", "shares"=>["backup", "storage"]}                           >>
| example/group_vars/all.yml | docker        | {"storage"=>"/var/lib/docker", "service"=>{"enabled"=>true}, "nvidia"=>false, >>
| example/group_vars/all.yml | libvirt       | {"service"=>{"enabled"=>false}, "users"=>["b08x"]}                            >>
+---------------------------------------------------------------------------------------------------------------------------->>

```

