---
id: SyncopatedIaC
aliases: 
tags:
  - linux
  - audio
  - ansible
gh-project: https://github.com/users/b08x/projects/9
image: /assets/img/headers/mpv-shot0001.jpg
layout: project
permalink: /iac
status: forever ongoing
subtitle: Ansible Collection For Audio Production on Linux
title: SyncopatedIaC
---

[[Ansible]]

[[Open Source Audio]]



### Developing In or On

```bash
# clone the syncopated repository
git clone https://github.com/b08x/syncopated.git /opt/syncopated

# navigate to the repostiory folder
cd /opt/syncopated

# download the iso image
wget http://syncopated.hopto.org/repo/archlinux/iso/syncopated-2023.11.08-x86_64.iso

# run bootstrap script to install required packages
./bin/bootstrap.sh

# run testvm.rb script to create a KVM virtual machine to test with or on
./bin/testvm.rb
```

---
