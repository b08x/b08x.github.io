---
---


# Variables defined within a role take precedence over host variables that share the same variable name.


The variable precedence in Ansible is influenced by the scope and context in which the variables are defined. When a variable is defined at multiple levels, Ansible uses a merging strategy based on the variable's scope. In the case of role and host variables:

1. **Role Variables:** Variables defined within a role have a specific scope limited to that role.
    
2. **Host Variables:** Variables defined for a specific host have <font color="#953734">a broader scope</font> <font color="#5f497a">limited to</font> that particular host.
    

If a variable is defined both in a role and for a specific host, the role variable indeed takes precedence over the host variable. 

<span style="background:rgba(163, 67, 31, 0.2)">This is because the role variable is more specific to the role in context.</span>





```bash
DEFAULT_PRIVATE_ROLE_VARS:
  default: false
  description:
  - Makes role variables inaccessible from other roles.
  - This was introduced as a way to reset role variables to default values if a role
    is used more than once in a playbook.
  env:
  - name: ANSIBLE_PRIVATE_ROLE_VARS
  ini:
  - key: private_role_vars
    section: defaults
  name: Private role variables
  type: boolean
  yaml:
    key: defaults.private_role_vars

```

**Playbook Context:**

- Understanding the variable precedence often requires considering the context of the playbook and the specific tasks being executed.

- Different tasks in a playbook might have different sources of variable values, leading to varying precedence.
