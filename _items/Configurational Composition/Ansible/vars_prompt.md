---
layout: note
title: Vars Prompt
subtitle: 
category: Configuration
tags:
  - ansible
links:
---



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

