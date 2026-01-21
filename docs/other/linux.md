# Linux Commands

Essential Linux command line operations.

## File Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `ls` | List directory contents |
| `ls -la` | List all files with details |
| `ls -lh` | List with human-readable sizes |
| `cd /path` | Change directory |
| `pwd` | Print working directory |
| `mkdir dir` | Create directory |
| `mkdir -p path/to/dir` | Create nested directories |
| `rmdir dir` | Remove empty directory |
| `rm file` | Remove file |
| `rm -r dir` | Remove directory and contents |
| `rm -rf dir` | Force remove directory |
| `cp file1 file2` | Copy file |
| `cp -r dir1 dir2` | Copy directory |
| `mv file1 file2` | Move/rename file |
| `touch file` | Create empty file |

## File Content

| COMMAND | DESCRIPTION |
| --- | --- |
| `cat file` | Display file content |
| `less file` | View file with paging |
| `head -n 10 file` | View first 10 lines |
| `tail -n 10 file` | View last 10 lines |
| `tail -f file` | Follow file (log watching) |
| `grep pattern file` | Search in file |
| `grep -r pattern dir` | Search recursively |
| `grep -i pattern file` | Case-insensitive search |
| `grep -v pattern file` | Invert match |
| `grep -n pattern file` | Show line numbers |
| `wc -l file` | Count lines |
| `wc -w file` | Count words |
| `wc -c file` | Count characters |
| `sort file` | Sort lines |
| `sort -r file` | Reverse sort |
| `sort -n file` | Numeric sort |
| `uniq file` | Remove duplicate lines |

## File Permissions

| COMMAND | DESCRIPTION |
| --- | --- |
| `chmod 755 file` | Set permissions (rwxr-xr-x) |
| `chmod +x script.sh` | Make script executable |
| `chmod -R 755 dir` | Recursive permission change |
| `chown user:group file` | Change owner |
| `chown -R user:group dir` | Recursive owner change |
| `chgrp group file` | Change group |

### Permission Codes
| CODE | PERMISSION |
| --- | --- |
| `7` | rwx (read, write, execute) |
| `6` | rw- (read, write) |
| `5` | r-x (read, execute) |
| `4` | r-- (read only) |
| `0` | --- (no permission) |

## Process Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `ps aux` | List all processes |
| `ps -ef` | List processes in full format |
| `top` | Display system processes |
| `htop` | Interactive process viewer |
| `kill PID` | Terminate process |
| `kill -9 PID` | Force kill process |
| `killall name` | Kill all processes by name |
| `pkill pattern` | Kill processes matching pattern |
| `pgrep pattern` | Find process IDs |
| `nohup command &` | Run command in background |
| `jobs` | List background jobs |
| `bg %1` | Background job |
| `fg %1` | Foreground job |

## System Information

| COMMAND | DESCRIPTION |
| --- | --- |
| `uname -a` | System information |
| `uname -r` | Kernel version |
| `hostname` | Hostname |
| `df -h` | Disk space usage |
| `du -sh dir` | Directory size |
| `free -h` | Memory usage |
| `uptime` | System uptime |
| `who` | Who is logged in |
| `w` | Who is logged in and what they're doing |
| `date` | Current date/time |
| `cal` | Calendar |
| `dmesg` | Kernel ring buffer messages |

## Network

| COMMAND | DESCRIPTION |
| --- | --- |
| `ip addr` | Show IP addresses |
| `ip link` | Show network interfaces |
| `ifconfig` | Show network config (deprecated) |
| `ping host` | Ping host |
| `traceroute host` | Trace route to host |
| `nslookup host` | DNS lookup |
| `dig host` | DNS lookup (more detailed) |
| `netstat -tuln` | List listening ports |
| `ss -tuln` | List listening sockets |
| `lsof -i :port` | List processes using port |
| `curl URL` | Transfer data from URL |
| `wget URL` | Download file from URL |
| `hostname -I` | Show IP address |

## Disk & Filesystem

| COMMAND | DESCRIPTION |
| --- | --- |
| `df -h` | Disk space (human-readable) |
| `df -i` | Disk inode usage |
| `du -sh *` | Size of all files/directories |
| `du -h --max-depth=1` | Size of top-level directories |
| `mount` | Show mounted filesystems |
| `mount /dev/sdb1 /mnt` | Mount filesystem |
| `umount /mnt` | Unmount filesystem |
| `fdisk -l` | List disk partitions |
| `lsblk` | List block devices |
| `mkfs.ext4 /dev/sdb1` | Format partition |

## Archive & Compress

| COMMAND | DESCRIPTION |
| --- | --- |
| `tar -cvf archive.tar files` | Create tar archive |
| `tar -xvf archive.tar` | Extract tar archive |
| `tar -czvf archive.tar.gz files` | Create tar.gz |
| `tar -xzvf archive.tar.gz` | Extract tar.gz |
| `zip -r archive.zip files` | Create zip archive |
| `unzip archive.zip` | Extract zip archive |
| `gzip file` | Compress with gzip |
| `gunzip file.gz` | Decompress gzip |

## Find

| COMMAND | DESCRIPTION |
| --- | --- |
| `find . -name "pattern"` | Find by name |
| `find . -type f` | Find files only |
| `find . -type d` | Find directories only |
| `find . -size +100M` | Find files > 100MB |
| `find . -mtime -7` | Find modified in last 7 days |
| `find . -perm 755` | Find with specific permissions |
| `find . -exec command {} \;` | Execute command on results |

## User Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `whoami` | Current user |
| `id` | User and group IDs |
| `who` | Logged in users |
| `useradd username` | Create user |
| `userdel username` | Delete user |
| `usermod -aG group user` | Add user to group |
| `passwd username` | Change password |
| `groups` | Show user groups |
| `sudo -i` | Switch to root |

## Environment Variables

| COMMAND | DESCRIPTION |
| --- | --- |
| `env` | Display environment variables |
| `export VAR=value` | Set environment variable |
| `echo $VAR` | Display variable value |
| `unset VAR` | Unset variable |
| `source ~/.bashrc` | Reload bash configuration |

## Package Management

### Debian/Ubuntu
| COMMAND | DESCRIPTION |
| --- | --- |
| `apt update` | Update package list |
| `apt upgrade` | Upgrade packages |
| `apt install package` | Install package |
| `apt remove package` | Remove package |
| `apt search package` | Search for package |
| `apt show package` | Show package info |

### RHEL/CentOS
| COMMAND | DESCRIPTION |
| --- | --- |
| `yum update` | Update packages |
| `yum install package` | Install package |
| `yum remove package` | Remove package |
| `yum search package` | Search for package |

## Systemd Services

| COMMAND | DESCRIPTION |
| --- | --- |
| `systemctl start service` | Start service |
| `systemctl stop service` | Stop service |
| `systemctl restart service` | Restart service |
| `systemctl status service` | Show service status |
| `systemctl enable service` | Enable at boot |
| `systemctl disable service` | Disable at boot |
| `systemctl list-units` | List all units |
| `journalctl -u service` | View service logs |

## SSH

| COMMAND | DESCRIPTION |
| --- | --- |
| `ssh user@host` | Connect to remote host |
| `ssh -p port user@host` | Connect on specific port |
| `ssh-keygen -t ed25519` | Generate SSH key |
| `ssh-copy-id user@host` | Copy SSH key to host |
| `scp file user@host:/path` | Copy file to remote |

## Useful Commands

### Find large files
```bash
find . -type f -size +100M -exec ls -lh {} \;
```

### Find old files
```bash
find . -type f -mtime +30
```

### Count files in directory
```bash
find . -type f | wc -l
```

### Monitor file changes
```bash
watch -n 1 ls -lh
```

### Process using most CPU
```bash
ps aux --sort=-%cpu | head -n 10
```

### Process using most memory
```bash
ps aux --sort=-%mem | head -n 10
```

### Listen on port
```bash
nc -l 8080
```

### Download with progress
```bash
wget --progress=bar:force URL
```

### Parallelize downloads
```bash
aria2c -x 16 -s 16 URL
```

## Best Practices

- Use tab completion
- Use `man` for command documentation
- Use aliases for frequently used commands
- Use `sudo` carefully
- Regularly update packages
- Monitor disk space
- Use log files for troubleshooting
- Keep backups of important files
- Use screen or tmux for long-running sessions
- Use version control for configuration files

::: tip
Use `history | grep "command"` to find previously used commands.
:::
