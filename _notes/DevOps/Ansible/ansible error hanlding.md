---
layout: note
title: ansible subtasks
---

#ansible 

~~~yaml

# error handling whilst installing a large number of packages
source: https://stackoverflow.com/a/49758224/10073106

First setup a sub-tasks.yml to contain your install tasks:

```yaml
Sub-Tasks.yml

  - name: Install package and handle errors
    block:
      - name Install package
        yum: state=latest name="{{ package_name }}"
    rescue:
      - debug:
          msg: "I caught an error with {{ package_name }}"

# Then your playbook will setup a loop of these tasks:

  - name: Install all packages ignoring errors
    include_tasks: Sub-Tasks.yml
    vars:
      package_name: "{{ item }}"
    with_items:
      - "{{ pkgs }}"
```


~~~

