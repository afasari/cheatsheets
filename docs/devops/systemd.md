# Systemd Cheatsheet

## Basic Commands

```bash
# Service management
systemctl start service
systemctl stop service
systemctl restart service
systemctl status service
systemctl reload service

# Enable/disable at boot
systemctl enable service
systemctl disable service
systemctl is-enabled service

# Check failed units
systemctl --failed
systemctl --state=failed

# List units
systemctl list-units
systemctl list-units --type=service
systemctl list-units --all
systemctl list-units --state=running
```

## Unit Files

```bash
# List unit files
systemctl list-unit-files
systemctl list-unit-files --type=service

# Show unit file
systemctl cat service
systemctl show service

# Edit unit file (use override)
systemctl edit service
systemctl edit --full service

# Reload changes
systemctl daemon-reload
```

## Service Unit File Template

```ini
[Unit]
Description=My Application Service
Documentation=https://example.com/docs
After=network.target network-online.target
Wants=network-online.target
Requires=network.target

[Service]
Type=exec
User=myuser
Group=myuser
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/myapp --config /etc/myapp/config.yml
ExecReload=/bin/kill -HUP $MAINPID
ExecStop=/bin/kill -TERM $MAINPID

Restart=on-failure
RestartSec=5s
TimeoutStartSec=30
TimeoutStopSec=30

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/myapp /var/log/myapp

# Resource limits
LimitNOFILE=65536
MemoryLimit=512M
CPUQuota=100%

[Install]
WantedBy=multi-user.target
```

## Service Types

```ini
# Type=simple (default)
[Service]
Type=simple
ExecStart=/usr/bin/myapp
# Service considered started immediately

# Type=forking
[Service]
Type=forking
ExecStart=/usr/bin/myapp --daemon
PIDFile=/run/myapp.pid
# Expected to fork and create PID file

# Type=oneshot
[Service]
Type=oneshot
ExecStart=/usr/bin/myscript
# Runs once, considered active when command exits

# Type=dbus
[Service]
Type=dbus
BusName=org.example.MyService
# Wait for DBus name to be acquired

# Type=notify
[Service]
Type=notify
ExecStart=/usr/bin/myapp
NotifyAccess=all
# Service sends ready notification via sd_notify
```

## Environment Variables

```ini
[Service]
Environment="ENV_VAR1=value"
Environment="ENV_VAR2=value2"
EnvironmentFile=/etc/myapp/env
EnvironmentFile=-/etc/myapp/env.local

PassEnvironment=PATH HOME
```

```bash
# /etc/myapp/env
DATABASE_URL=postgresql://localhost/mydb
API_KEY=secret123
LOG_LEVEL=info
```

## Security Hardening

```ini
[Service]
# Basic
NoNewPrivileges=true
PrivateTmp=true

# Filesystem
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/myapp /var/log/myapp
ReadWritePaths=/run/myapp

# Network
PrivateNetwork=true  # Disable network access
RestrictAddressFamilies=AF_UNIX AF_INET  # Allow only specific families

# Capabilities
CapabilityBoundingSet=CAP_NET_BIND_SERVICE CAP_SETUID CAP_SETGID
AmbientCapabilities=CAP_NET_BIND_SERVICE

# System calls
SystemCallFilter=@system-service
SystemCallErrorNumber=EPERM

# Device access
DeviceAllow=/dev/null rw
DevicePolicy=closed

# User namespace
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
```

## Resource Limits

```ini
[Service]
# Memory
MemoryLimit=512M
MemoryMax=1G

# CPU
CPUQuota=100%  # 100% of 1 CPU
CPUQuota=200%  # 200% of 1 CPU (2 cores)
CPUWeight=100  # 1-10000, default 100

# File descriptors
LimitNOFILE=65536
LimitNPROC=4096

# Threads
TasksMax=512

# Block I/O
IOReadBandwidthMax=/dev/sda 10M
IOWriteBandwidthMax=/dev/sda 10M

# Nice level
Nice=5
```

## Timers (Cron Replacement)

```ini
# /etc/systemd/system/mytask.timer
[Unit]
Description=Run mytask daily
Documentation=https://example.com/docs

[Timer]
OnCalendar=daily
Persistent=true
AccuracySec=1h
Unit=mytask.service

[Install]
WantedBy=timers.target
```

```ini
# /etc/systemd/system/mytask.service
[Unit]
Description=My Task

[Service]
Type=oneshot
ExecStart=/usr/local/bin/mytask
```

```bash
# Timer commands
systemctl start mytask.timer
systemctl enable mytask.timer
systemctl list-timers
systemctl status mytask.timer

# Calendar expressions
OnCalendar=Mon-Fri *-*-* 09:00:00  # Weekdays at 9 AM
OnCalendar=weekly
OnCalendar=monthly
OnCalendar=hourly
OnCalendar=*:0/15  # Every 15 minutes
OnCalendar=Mon *-*-* 01..04:30  # Monday 1-4:30 AM
```

## Sockets (Socket Activation)

```ini
# /etc/systemd/system/myapp.socket
[Unit]
Description=My App Socket

[Socket]
ListenStream=8080
Accept=no

[Install]
WantedBy=sockets.target
```

```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My App Service

[Service]
ExecStart=/usr/bin/myapp --socket-activation
StandardInput=socket
```

```bash
# Socket management
systemctl start myapp.socket
systemctl enable myapp.socket
systemctl status myapp.socket
```

## Paths (Directory Watching)

```ini
# /etc/systemd/system/myapp.path
[Unit]
Description=Watch for new files

[Path]
PathModified=/var/spool/myapp/incoming
DirectoryNotEmpty=/var/spool/myapp/incoming
Unit=myapp.service

[Install]
WantedBy=multi-user.target
```

## Targets (Runlevels)

```bash
# List targets
systemctl list-unit-files --type=target
systemctl get-default

# Set default target
systemctl set-default graphical.target
systemctl set-default multi-user.target

# Switch target immediately
systemctl isolate multi-user.target
systemctl isolate graphical.target
systemctl isolate rescue.target

# Target meanings
# poweroff.target -> Runlevel 0
# rescue.target   -> Runlevel 1
# multi-user.target -> Runlevel 3
# graphical.target -> Runlevel 5
# reboot.target  -> Runlevel 6
```

## Logs (journalctl)

```bash
# Basic logs
journalctl -u service
journalctl -u service -f  # Follow
journalctl -u service --since today
journalctl -u service --since "1 hour ago"

# Filter by priority
journalctl -p err
journalctl -p warning
journalctl -p 3  # 0=emerg, 1=alert, 2=crit, 3=err, 4=warning, 5=notice, 6=info, 7=debug

# Time ranges
journalctl --since "2024-01-01 00:00:00"
journalctl --since yesterday
journalctl --until "2024-01-01 23:59:59"

# Boot-specific
journalctl -b  # Current boot
journalctl -b -1  # Previous boot
journalctl --list-boots

# Disk usage
journalctl --disk-usage
journalctl --vacuum-time=7d
journalctl --vacuum-size=1G

# Output format
journalctl -u service -o json
journalctl -u service -o cat
journalctl -u service -o verbose
```

## User Services

```bash
# User unit location
~/.config/systemd/user/
~/.local/share/systemd/user/

# User commands
systemctl --user start service
systemctl --user enable service
systemctl --user status service

# Enable linger (run services when not logged in)
loginctl enable-linger username

# Check user services
systemctl --user list-units
systemctl --user list-unit-files
```

## Overriding Units

```bash
# Create override directory
mkdir -p /etc/systemd/system/nginx.service.d

# Create override file
cat > /etc/systemd/system/nginx.service.d/override.conf << EOF
[Service]
LimitNOFILE=65536
MemoryLimit=1G
EOF

# Reload and apply
systemctl daemon-reload
systemctl restart nginx

# Check what's overridden
systemd-analyze verify nginx.service
systemctl cat nginx.service
```

## Analysis and Debugging

```bash
# Analyze boot time
systemd-analyze
systemd-analyze blame
systemd-analyze critical-chain

# Analyze dependencies
systemd-analyze dot | dot -Tsvg > graph.svg
systemd-analyze dot nginx.service | dot -Tsvg > nginx-deps.svg

# Verify unit file
systemd-analyze verify /path/to/service

# Check dependencies
systemctl show nginx.service -p Requires
systemctl show nginx.service -p Wants
systemctl show nginx.service -p After
systemctl show nginx.service -p Before

# Debug service startup
systemctl set-property service CPUAccounting=yes MemoryAccounting=yes
systemd-run --scope --unit=debug.service /bin/bash
```

## Emergency and Rescue

```bash
# Boot into rescue mode
systemctl rescue

# Boot into emergency mode
systemctl emergency

# Reset failed units
systemctl reset-failed

# Check boot failures
journalctl -b -1 -p err
```

## System Maintenance

```bash
# Reload all unit files
systemctl daemon-reload

# Reset everything (dangerous)
systemctl default

# Mask service (prevent start)
systemctl mask service
systemctl unmask service

# Check service cgroup
systemctl show service -p ControlGroup
systemd-cgtop
```

## Common Service Examples

### Nginx Override
```ini
[Service]
LimitNOFILE=65536
MemoryLimit=1G
CPUQuota=200%
```

### Docker Service
```ini
[Unit]
Description=Docker Application Container Engine
After=network-online.target docker.socket firewalld.service
Wants=network-online.target
Requires=docker.socket

[Service]
Type=notify
ExecStart=/usr/bin/dockerd
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
TasksMax=infinity

[Install]
WantedBy=multi-user.target
```

### Custom Application
```ini
[Unit]
Description=My Custom App
After=network.target

[Service]
Type=simple
User=myuser
WorkingDirectory=/opt/myapp
ExecStart=/opt/myapp/bin/app
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```
