---
tags: obsidian-auto-glossary
---
## Index
- [[ansible error handling]]
- [[ansible tasks dotfiles]]
- [[Ansible Variable Precedence]]
- [[Package Handling]]
- [[Playbook Optimization]]




[ansible-pull example](https://gitlab.liu.se/ansible/pull-deploy)

#### An example of setting a variable of args to a command:

```sh
packages__reflector_args: >-
  --latest 200
  --sort rate
  --protocol http --protocol https
  --threads {{ ansible_facts.processor_vcpus }}
  --save /etc/pacman.d/mirrorlist
```

#### use copy module to create files with content
{% raw %}
```yaml
- name: Create test file
  copy:
    content: |
      This is a line
      Leave a newline at the end
    dest: '{{ lookup("env", "HOME") }}/test.txt'
    owner: "{{ user.name }}"
    group: "{{ user.group }}"
  tags: ['test']
```
{% endraw %}


#### vars_prompt

```yaml
 vars_prompt: 
  - name: username
    prompt: What is your username?
    private: no

  
  pre_tasks:
    - name: print hostname
      debug: msg="{{ ansible_architecture }}"
      tags: ['test']
  
    - name: print os_family
      debug: msg="{{ ansible_facts }}"
      tags: ['test']
  
    - name: print os_family
      debug: msg="{{ username }}"
      tags: ['test']
  
    - name: set user name variable
      set_fact:
        user:
          name: "{{ username }}"
  
    - name: print username
      debug: msg="{{ user.name }}"
      tags: ['test']
```


```yaml
  tasks:
      - name: print os_family
        debug: msg="{{ ansible_facts }}"
        tags: ['test']
```

