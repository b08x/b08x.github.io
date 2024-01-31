---
layout: note
title: Notepad
permalink: /devops/ansible/notepad
---

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