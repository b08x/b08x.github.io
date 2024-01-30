---
layout: note
title: installing packages Ansible
---

#ansible 

```yaml
- name: Install packages for audio
  package:
    use: aur
    name: "{{ packages.audio }}"
    state: present
  become: True
  tags: ['testtest']

```


#### use copy module to create files with content
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

