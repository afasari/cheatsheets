# Ansible

Open-source automation tool for configuration management, application deployment, and task automation.

## Basic Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `ansible all -m ping` | Ping all hosts |
| `ansible all -m setup` | Gather facts about hosts |
| `ansible-playbook playbook.yml` | Run a playbook |
| `ansible-vault create file.yml` | Create encrypted file |
| `ansible-vault edit file.yml` | Edit encrypted file |
| `ansible-vault decrypt file.yml` | Decrypt file |
| `ansible-galaxy install collection` | Install collection |
| `ansible-galaxy init role` | Initialize role |

## Ad-hoc Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `ansible all -a "ls -la"` | Run command on all hosts |
| `ansible webservers -m apt -a "name=nginx state=present"` | Install package |
| `ansible all -m service -a "name=nginx state=started"` | Start service |
| `ansible all -m copy -a "src=file dest=/path"` | Copy file |
| `ansible all -m shell -a "echo hello"` | Run shell command |
| `ansible all -m yum -a "name=httpd state=latest"` | Update package |

## Modules

### Package Management
```bash
# APT (Debian/Ubuntu)
ansible all -m apt -a "name=nginx state=present"

# YUM (RHEL/CentOS)
ansible all -m yum -a "name=httpd state=present"

# DNF (Fedora)
ansible all -m dnf -a "name=nginx state=present"

# PIP (Python)
ansible all -m pip -a "name=django state=present"
```

### Service Management
```bash
# Start service
ansible all -m service -a "name=nginx state=started enabled=yes"

# Stop service
ansible all -m service -a "name=nginx state=stopped"

# Restart service
ansible all -m service -a "name=nginx state=restarted"
```

### File Operations
```bash
# Copy file
ansible all -m copy -a "src=index.html dest=/var/www/html/"

# Create directory
ansible all -m file -a "path=/var/log/app state=directory mode=0755"

# Create file
ansible all -m file -a "path=/tmp/app.log state=touch"

# Remove file/directory
ansible all -m file -a "path=/tmp/app state=absent"

# Set permissions
ansible all -m file -a "path=/var/www/html mode=0755 owner=www-data"
```

### User Management
```bash
# Create user
ansible all -m user -a "name=john home=/home/john shell=/bin/bash"

# Delete user
ansible all -m user -a "name=john state=absent"

# Add user to group
ansible all -m user -a "name=john groups=wheel append=yes"
```

## Inventory Files

### Simple Inventory
```ini
[webservers]
web1.example.com
web2.example.com

[databases]
db1.example.com

[all:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/id_rsa
```

### YAML Inventory
```yaml
all:
  children:
    webservers:
      hosts:
        web1.example.com:
          http_port: 80
        web2.example.com:
          http_port: 8080
    databases:
      hosts:
        db1.example.com:
          db_port: 5432
  vars:
    ansible_user: ubuntu
```

## Playbook Structure

```yaml
---
- name: Playbook description
  hosts: webservers
  become: yes
  vars:
    package_name: nginx
  tasks:
    - name: Install package
      apt:
        name: "{{ package_name }}"
        state: present

    - name: Start service
      service:
        name: "{{ package_name }}"
        state: started
        enabled: yes
```

## Common Playbook Examples

### Install and Configure Web Server
```yaml
---
- name: Configure web servers
  hosts: webservers
  become: yes

  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes
        cache_valid_time: 3600

    - name: Install nginx
      apt:
        name: nginx
        state: present

    - name: Start nginx
      service:
        name: nginx
        state: started
        enabled: yes

    - name: Copy website
      copy:
        src: index.html
        dest: /var/www/html/index.html

    - name: Restart nginx
      service:
        name: nginx
        state: restarted
```

### Deploy Application
```yaml
---
- name: Deploy application
  hosts: webservers
  become: yes
  vars:
    app_name: myapp
    app_version: "1.0.0"

  tasks:
    - name: Create app directory
      file:
        path: "/opt/{{ app_name }}"
        state: directory

    - name: Copy application files
      copy:
        src: ./app/
        dest: "/opt/{{ app_name }}/"

    - name: Install Python dependencies
      pip:
        requirements: "/opt/{{ app_name }}/requirements.txt"

    - name: Create systemd service
      template:
        src: app.service.j2
        dest: "/etc/systemd/system/{{ app_name }}.service"

    - name: Start application
      systemd:
        name: "{{ app_name }}"
        state: started
        enabled: yes
        daemon_reload: yes
```

### Database Setup
```yaml
---
- name: Configure database
  hosts: databases
  become: yes

  tasks:
    - name: Install PostgreSQL
      apt:
        name:
          - postgresql
          - postgresql-contrib
        state: present

    - name: Start PostgreSQL
      service:
        name: postgresql
        state: started
        enabled: yes

    - name: Create database
      become_user: postgres
      postgresql_db:
        name: myapp
        state: present

    - name: Create user
      become_user: postgres
      postgresql_user:
        db: myapp
        name: myapp_user
        password: secure_password
        priv: "ALL"
```

## Variables

### Defining Variables
```yaml
vars:
  package_name: nginx
  service_port: 80
  enabled_features:
    - ssl
    - gzip
  config:
    worker_processes: 4
    keepalive_timeout: 65
```

### Using Variables
```yaml
- name: Install {{ package_name }}
  apt:
    name: "{{ package_name }}"
```

### External Variables Files
```bash
# Load variables from file
ansible-playbook playbook.yml -e "@variables.yml"

# Set variable from command line
ansible-playbook playbook.yml -e "package_name=apache2"
```

## Conditionals

### When Clause
```yaml
- name: Install Apache
  apt:
    name: apache2
  when: ansible_os_family == "Debian"

- name: Install Nginx
  apt:
    name: nginx
  when: package_name is defined
```

### Conditional Blocks
```yaml
- name: Update packages
  block:
    - name: Update apt cache
      apt:
        update_cache: yes
    - name: Upgrade packages
      apt:
        upgrade: dist
  when: update_packages | bool
```

## Loops

### Simple Loop
```yaml
- name: Create multiple users
  user:
    name: "{{ item }}"
    state: present
  loop:
    - john
    - jane
    - bob
```

### Loop with Dictionary
```yaml
- name: Create multiple directories
  file:
    path: "{{ item.path }}"
    mode: "{{ item.mode }}"
    state: directory
  loop:
    - { path: /var/www, mode: '0755' }
    - { path: /var/log, mode: '0750' }
```

### Register and Loop
```yaml
- name: Get running processes
  shell: ps aux
  register: processes

- name: Show processes
  debug:
    msg: "{{ item }}"
  loop: "{{ processes.stdout_lines }}"
```

## Handlers

```yaml
---
- name: Configure service
  hosts: webservers
  become: yes

  handlers:
    - name: Restart nginx
      service:
        name: nginx
        state: restarted

    - name: Reload nginx
      service:
        name: nginx
        state: reloaded

  tasks:
    - name: Update nginx config
      copy:
        src: nginx.conf
        dest: /etc/nginx/nginx.conf
      notify: Restart nginx
```

## Templates

### Using Jinja2 Templates
```yaml
- name: Configure app
  template:
    src: config.j2
    dest: /etc/app/config.conf
```

### Template Example
```jinja
# config.j2
[general]
port = {{ app_port }}
host = {{ app_host }}
debug = {{ debug | lower }}

{% for server in servers %}
[server_{{ loop.index }}]
address = {{ server.address }}
port = {{ server.port }}
{% endfor %}
```

## Ansible Vault

### Encrypting Files
```bash
# Create encrypted file
ansible-vault create secrets.yml

# Encrypt existing file
ansible-vault encrypt secrets.yml

# View encrypted file
ansible-vault view secrets.yml

# Edit encrypted file
ansible-vault edit secrets.yml
```

### Using Encrypted Files
```bash
# Provide vault password
ansible-playbook playbook.yml --ask-vault-pass

# Use vault password file
ansible-playbook playbook.yml --vault-password-file vault-pass
```

## Roles

### Role Structure
```
myrole/
├── defaults/
│   └── main.yml      # Default variables
├── files/            # Static files
├── handlers/         # Handlers
│   └── main.yml
├── meta/            # Role metadata
│   └── main.yml
├── tasks/           # Tasks
│   └── main.yml
├── templates/       # Jinja2 templates
├── tests/           # Test playbooks
│   ├── inventory
│   └── test.yml
└── vars/            # Variables
    └── main.yml
```

### Using Roles
```yaml
---
- name: Use roles
  hosts: webservers
  become: yes

  roles:
    - common
    - nginx
    - { role: app, vars: { app_port: 8080 } }
```

## Best Practices

- Use descriptive names for tasks and plays
- Group hosts logically in inventory
- Use variables for configuration values
- Implement idempotent tasks
- Use handlers for service restarts
- Keep playbooks simple and focused
- Use roles for reusability
- Document your playbooks
- Use version control
- Test playbooks in staging first
- Use check mode for dry-runs
- Implement proper error handling

::: tip
Use `ansible-playbook playbook.yml --check` for dry-run mode to preview changes without making them.
:::
