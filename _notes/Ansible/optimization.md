---
---


#ansible 


* When a playbook executes, ***each play*** runs a hidden task, called gathering facts, using the setup module


instead, gather facts only when needed...

{% raw %}
```yaml
---
- name: Restricted fact gathering example
  hosts: localhost
  connection: local
  become: true
  gather_facts: false
  vars_prompt:
    - name: device
      prompt: "Enter name of the USB device"
      private: false
      default: "sda"
  vars:
    target_device: "/dev/{{ device }}"
  tasks:
    - name: Get only 'devices, mount' facts
      ansible.builtin.setup:
        gather_subset:
          - '!all'
          - '!min'
          - devices
          - mounts
    
    - name: Basic setup and verification for target system
      block:
        - name: Facts for {{ target_device }}
          community.general.parted:
            device: "{{ target_device }}"
            state: "info"
            unit: "GB"
          register: target_parted_data
        - name: Calculate disk size
          debug:
            msg: "{{ ansible_devices[device] }}"
        - name: Calculate available space on USB device and save it as a fact
          ansible.builtin.set_fact:
            total_usb_disk_space: "{{ (ansible_devices[device]['sectorsize']| int) * (ansible_devices[device]['sectors']|int) }}"
            cacheable: yes
          when: target_parted_data is defined
        - name: Print facts for {{ target_device }}
          ansible.builtin.debug:
            msg: "{{ ansible_devices[device].size }}, {{ total_usb_disk_space }} bytes"
          when: target_parted_data is defined
```
{% endraw %}

* [mitogen](https://mitogen.networkgenomics.com/ansible_detailed.html#noteworthy-differences)




