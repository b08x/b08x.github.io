---
layout: note
title: ansible subtasks
sources: https://stackoverflow.com/a/49758224/10073106
category:
  - OS
  - Configuration Management
  - Ansible
tags:
  - ansible
---


> [!ai]+ AI
>
> The content explains how to handle errors while installing multiple packages using Ansible. It involves creating a tasks file with a block that includes the package installation task and a rescue block to handle errors. The playbook then loops through the packages, including the tasks file for each package and using rescue to recover from any errors encountered during installation.

## => Error handling whilst installing a large number of packages

First create a tasks file that will handle installing packages. Put the task within a block and use rescue to recover from errors (e.g. mirror timeout, dependency issue, etc)

{% raw %}
```yaml
# install-package.yml
- name: Install package and handle errors
  block:
    - name: Install package
      yum:
        state: latest
        name: "{{ package_name }}"
  rescue:
    - debug:
        msg: "I caught an error with {{ package_name }}"
```

```yaml
# Then your playbook will setup a loop of these tasks,
# using `rescue` to recover from errors
- name: Install packages
  include_tasks: install-package.yml
  vars:
    package_name: "{{ item }}"
  with_items:
    - "{{ pkgs }}"
```
{% endraw %}


