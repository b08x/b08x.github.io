---
layout: note
title: "Ansible Tasks: Dotfiles"
subtitle: 
category:
  - OS
  - Configuration Management
  - Ansible
tags: 
links:
---

#ansible #yadm


{% raw %}
```markdown

- name: install git-lfs
	dnf:
		name: git-lfs
		state: present
	become: True
	tags: ['packages']

# yadm and ansible: together
# ansible may overwrite dot files managed with yadm
# when this happens:
# check `yadm status`, if these changes are desirable then commit & push
# if dot file managed with yadm is edited and not pushed,
# ansible will overwrite
- name: populate gitattributes
	copy:
		content: |
			*.png filter=lfs diff=lfs merge=lfs -text
			*.wav filter=lfs diff=lfs merge=lfs -text
			*.jpg filter=lfs diff=lfs merge=lfs -text
		dest: "{{ user.home }}/.gitattributes"

#TODO: fix: Host key verification failed.
# happens when cloning from git for the first time
- block:
		- name: clone dot files
			shell: |
				{{ yadm }} clone git@github.com:b08x/dots.git
			args:
				chdir: "{{ user.home }}"
			register: yadm_clone
			failed_when:
				- yadm_clone.rc != 0
				- '"Git repo already exists" not in yadm_clone.stderr'
			changed_when: '"Please review and resolve" in yadm_clone.stdout'
			ignore_errors: "{{ ansible_check_mode }}"

		- name: checkout dot files
			shell: |
				{{ yadm }} checkout {{ user.home }}
			args:
				chdir: "{{ user.home }}"
			when:
				- yadm_clone.rc == 0
				- '"Please review and resolve" in yadm_clone.stdout'

	when: use_yadm is defined
	environment:
		PATH: "{{ ansible_env.PATH }}:{{ '{{ user.home }}.local/bin'|join(':') }}"
	vars:
		yadm: "{{ user.home }}/.local/bin/yadm"

tags: ['dots']

- block:
- name: update dots
	shell: "{{ yadm }} fetch && {{ yadm }} pull"
	args:
		chdir: "{{ user.home }}"
	when: update_dots is defined
	tags: ['yadmfetch']

environment:
PATH: "{{ ansible_env.PATH }}:{{ '{{ user.home }}.local/bin'|join(':') }}"
vars:
yadm: "{{ user.home }}/.local/bin/yadm"

```
{% endraw %}