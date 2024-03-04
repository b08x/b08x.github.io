---
layout: note
title: Package Handling
category:
  - Configuration Management
tags:
  - ansible
  - linux
---

# Wednesday 23 Nov 2022
@pulse

[description](https://askubuntu.com/questions/511250/volume-mutes-when-set-below-20-14-04)

`sudo tee /etc/modprobe.d/snd-hda-intel.conf [description]([description](<'options snd-hda-intel power_save=0'`

<https://kokkinizita.linuxaudio.org/linuxaudio/zita-dpl1-doc/quickguide.html)

## ansible method of packaging handling
#ansible 
[description](https://stackoverflow.com/a/44721036)
```yaml
#includeFile.yml :

- block
    - name: Finding the package.
      shell: rpm -qa | grep "{{pkgName}}"
      register: package

    - name: Uninstalling the package.
      shell: rpm -e "{{package}}"
  always:
    - debug: msg="this always executes"

#main.yml:

---
- hosts: all
  vars: 
    - packageList : ["pkg1","pkg2","pkg3","pkg4"]

  tasks:
    - include: includeFile.yml pkgName="{{item}}"
      with_items: packageList
   
   4.times do
   end
   
```


```yaml
#Use include with with_first_found:

- include: "{{ include_path }}"
  with_first_found:
   - "{{ ansible_distribution }}.yml"
   - "{{ ansible_os_family }}.yml"
   - "default.yml"
  loop_control:
    loop_var: include_path


#Update: added loop_var to prevent possible item variable collision.
```


@bash
error handling

```sh
 
# check if a directory exists, test will return true if it does
# see bash test and comparison functions for more
test -d "$directory" || continue

# if the command fails, then do not exit but continue forth
[description](some command) || continue

```


```sh
#

jack_lsp | while read a; do jack_lsp | while read b; do echo "$a" "$b"; done; done ) /dev/null 2>&1

  
jack_lsp | while read a; do jack_lsp | while read b; do jack_disconnect "$a" "$b"; done; done > /dev/null 2>&1
```


