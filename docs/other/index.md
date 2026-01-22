# Other Tools Overview

This section covers essential tools that complement DevOps, cloud, and security practices but don't fit into specific categories.

## Version Control

### Git
Distributed version control system for tracking changes in source code.

**When to Use**:
- Any software development project
- Collaboration among team members
- Code review and history tracking
- Branching for feature development

**Key Concepts**:
- **Repository**: Storage for project files and history
- **Commit**: Snapshot of changes
- **Branch**: Parallel line of development
- **Merge**: Combine changes from branches
- **Pull Request**: Request to merge changes

**Common Workflows**:
- **Git Flow**: Feature branches, develop, master, release, hotfix
- **GitHub Flow**: Feature branches directly to master
- **Trunk-Based Development**: All work on main branch with feature flags

## System Administration

### Linux Commands
Command-line tools for system administration and troubleshooting.

**When to Use**:
- Server management
- Troubleshooting and debugging
- Automation and scripting
- Container operations

**Essential Commands**:
- **File Operations**: `ls`, `cd`, `cp`, `mv`, `rm`, `find`
- **Text Processing**: `grep`, `sed`, `awk`, `cat`, `less`
- **System Monitoring**: `top`, `htop`, `ps`, `df`, `du`, `free`
- **Network**: `ping`, `curl`, `netstat`, `ss`, `dig`, `traceroute`
- **Permissions**: `chmod`, `chown`, `sudo`, `su`
- **Processes**: `ps`, `kill`, `systemctl`

**When to Use Linux vs GUI**:
- **Linux CLI**: Remote servers, automation, scripting, batch operations
- **GUI**: Local development, visual file management, initial learning

## Networking Tools

### Network Diagnostics
Tools for troubleshooting network connectivity and performance.

| Tool | Purpose | Use Case |
|------|---------|----------|
| **ping** | Test host reachability | Basic connectivity |
| **traceroute** | Trace packet path | Network path analysis |
| **nslookup/dig** | DNS resolution | DNS troubleshooting |
| **netstat/ss** | Network connections | Port and connection info |
| **curl/wget** | HTTP requests | Testing web services |
| **tcpdump** | Packet capture | Traffic analysis |
| **nc (netcat)** | Port scanning, data transfer | Network debugging |
| **nmap** | Network discovery | Port scanning, OS detection |

### When to Use Network Tools
- **ping**: Quick connectivity check
- **curl/wget**: API testing, downloading files
- **dig/nslookup**: DNS lookup troubleshooting
- **netstat/ss**: Check open ports, active connections
- **tcpdump/Wireshark**: Deep packet analysis

## HTTP & Web Tools

### HTTP Status Codes
Standard response codes for HTTP requests.

| Category | Code Range | Meaning |
|----------|------------|---------|
| **Informational** | 1xx | Request received, continuing |
| **Success** | 2xx | Request successful |
| **Redirection** | 3xx | Further action needed |
| **Client Error** | 4xx | Client error in request |
| **Server Error** | 5xx | Server failed to fulfill request |

**Common Status Codes**:
- **200 OK**: Request successful
- **201 Created**: Resource created
- **301 Moved Permanently**: URL permanently changed
- **400 Bad Request**: Invalid request
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: No permission
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server error

### Web Development Tools
- **curl**: Command-line HTTP client
- **wget**: Download files from web
- **Postman/Insomnia**: API testing GUI
- **Browser DevTools**: Web debugging

## Package Managers

### Linux Package Managers
| Manager | Distribution | Example |
|---------|-------------|---------|
| **apt** | Debian, Ubuntu | `apt install nginx` |
| **yum/dnf** | RHEL, CentOS, Fedora | `yum install nginx` |
| **zypper** | openSUSE | `zypper install nginx` |
| **pacman** | Arch Linux | `pacman -S nginx` |

### Language Package Managers
- **npm**: Node.js packages
- **pip**: Python packages
- **cargo**: Rust packages
- **go mod**: Go modules
- **gem**: Ruby packages

### When to Use Package Managers
- Installing software and dependencies
- Managing software versions
- Handling updates and dependencies
- Reproducible installations

## Text Editors

### Command-Line Editors
| Editor | Use Case | Learning Curve |
|--------|----------|----------------|
| **vim/nvim** | Remote servers, power users | Steep |
| **nano** | Quick edits, beginners | Easy |
| **emacs** | Power users, Lisp development | Steep |

### GUI Editors
- **VS Code**: Popular, extensible, modern
- **Sublime Text**: Fast, lightweight
- **JetBrains IDEs**: Language-specific (IntelliJ, PyCharm)

### When to Use Each
- **CLI Editors**: Remote servers, SSH sessions, minimal environments
- **GUI Editors**: Local development, modern features, extensions

## Terminal Multiplexers

### tmux
Terminal multiplexer for managing multiple terminal sessions.

**When to Use**:
- Running long-running processes
- Multiple terminal sessions in one window
- Remote server persistence
- Session sharing among users

**Key Benefits**:
- Detach/attach sessions
- Split panes
- Session persistence
- Remote collaboration

## SSH (Secure Shell)

### SSH Usage
Secure remote access and command execution.

**When to Use**:
- Remote server administration
- Secure file transfer (SCP, SFTP)
- Port forwarding and tunneling
- Git remote operations

**Key Concepts**:
- SSH keys (public/private)
- SSH config for easy access
- SSH agent for key management
- SSH tunnels for port forwarding

## Common Scenarios

### Scenario: Debugging Production Issue
**Tools**:
- **SSH**: Connect to server
- **top/htop**: Monitor system resources
- **journalctl**: View system logs
- **curl**: Test API endpoints
- **netstat/ss**: Check open ports

### Scenario: Deploying Application
**Tools**:
- **Git**: Clone/pull code
- **npm/pip**: Install dependencies
- **systemctl**: Restart service
- **curl**: Verify deployment

### Scenario: Network Troubleshooting
**Tools**:
- **ping**: Check connectivity
- **dig/nslookup**: Check DNS
- **curl**: Test HTTP endpoints
- **traceroute**: Trace network path
- **tcpdump**: Capture and analyze packets

### Scenario: Local Development Setup
**Tools**:
- **Git**: Clone repository
- **npm/cargo/pip**: Install dependencies
- **VS Code**: Edit code
- **tmux**: Multiple terminal sessions

## Best Practices

### Version Control
- Commit frequently with meaningful messages
- Use branches for features
- Review code before merging
- Tag releases

### System Administration
- Use sudo only when necessary
- Monitor system resources regularly
- Keep system updated
- Use configuration management (Ansible, Chef)

### Network Tools
- Use specific tools for specific tasks
- Start with simple diagnostics (ping, curl)
- Escalate to complex tools (tcpdump, Wireshark)
- Document network configurations

### SSH Security
- Use key-based authentication
- Disable password authentication
- Use SSH config for easy access
- Limit SSH access with firewalls

## Further Reading

- [Git](./git) - Git commands and workflows
- [Linux Commands](./linux) - Essential Linux administration
- [Network Tools](./network) - Network diagnostics and troubleshooting
- [HTTP Status Codes](./http-codes) - HTTP response reference
- [SSH Keys](../security/ssh) - SSH key management
