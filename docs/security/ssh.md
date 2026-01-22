# SSH Keys

Secure Shell for secure network operations.

## Key Generation

### Generate SSH Key
```bash
# Generate RSA key (default 2048 bits)
ssh-keygen -t rsa

# Generate with 4096 bits
ssh-keygen -t rsa -b 4096

# Generate ECDSA key
ssh-keygen -t ecdsa -b 521

# Generate Ed25519 key (recommended)
ssh-keygen -t ed25519

# Generate with custom filename
ssh-keygen -t ed25519 -f ~/.ssh/mykey

# Generate with comment
ssh-keygen -t ed25519 -C "user@example.com"
```

## Key Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `ls ~/.ssh/` | List SSH keys |
| `cat ~/.ssh/id_rsa.pub` | View public key |
| `ssh-keygen -l -f key` | View key fingerprint |
| `ssh-keygen -p -f ~/.ssh/id_rsa` | Change passphrase |
| `ssh-keygen -f ~/.ssh/id_rsa -p` | Change key passphrase |
| `ssh-copy-id user@host` | Copy key to remote host |
| `ssh-copy-id -i ~/.ssh/key.pub user@host` | Copy specific key |

## SSH Connection

| COMMAND | DESCRIPTION |
| --- | --- |
| `ssh user@host` | Connect to host |
| `ssh user@host -p port` | Connect on specific port |
| `ssh -i ~/.ssh/key user@host` | Use specific key |
| `ssh -L 8080:localhost:80 user@host` | Local port forwarding |
| `ssh -R 8080:localhost:80 user@host` | Remote port forwarding |
| `ssh -D 1080 user@host` | Dynamic port forwarding (SOCKS) |
| `ssh -N user@host` | Don't execute remote command |
| `ssh -f user@host` | Background SSH |
| `ssh -v user@host` | Verbose mode |

## SSH Config

### Configuration File (~/.ssh/config)
```ini
Host example
  HostName example.com
  User username
  Port 22
  IdentityFile ~/.ssh/id_ed25519
  ForwardX11 no

Host production
  HostName prod.example.com
  User ubuntu
  IdentityFile ~/.ssh/prod_key

Host github
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_key
```

### Config Options
| OPTION | DESCRIPTION |
| --- | --- |
| `HostName` | Remote host address |
| `User` | Remote username |
| `Port` | SSH port |
| `IdentityFile` | Path to private key |
| `ForwardX11` | X11 forwarding |
| `Compression` | Enable compression |
| `ServerAliveInterval` | Keep-alive interval |
| `ServerAliveCountMax` | Keep-alive count |

## Copying Files

### SCP (Secure Copy)
```bash
# Copy file to remote
scp local.txt user@host:/remote/path/

# Copy directory
scp -r localdir/ user@host:/remote/path/

# Copy from remote
scp user@host:/remote/file.txt local.txt

# Copy between remote hosts
scp user1@host1:/file.txt user2@host2:/remote/
```

### SFTP (Secure FTP)
```bash
# Connect to SFTP
sftp user@host

# SFTP commands
put localfile.txt
get remotefile.txt
ls
cd /remote/path
```

### Rsync over SSH
```bash
# Sync files
rsync -avz localdir/ user@host:remotedir/

# Delete files that don't exist locally
rsync -avz --delete localdir/ user@host:remotedir/

# Use specific SSH key
rsync -avz -e "ssh -i ~/.ssh/key" localdir/ user@host:remotedir/

# Show progress
rsync -avz --progress localdir/ user@host:remotedir/
```

## SSH Tunneling

### Local Port Forwarding
```bash
# Forward local port to remote
ssh -L 8080:localhost:80 user@host

# Access localhost:8080 to connect to remote's localhost:80
```

### Remote Port Forwarding
```bash
# Forward remote port to local
ssh -R 8080:localhost:80 user@host

# Access host's localhost:8080 to connect to local's localhost:80
```

### Dynamic Port Forwarding (SOCKS Proxy)
```bash
# Create SOCKS proxy
ssh -D 1080 user@host

# Use with curl
curl --socks5 127.0.0.1:1080 http://example.com
```

## SSH Keys Management

### Multiple Keys
```bash
# Add key to agent
ssh-add ~/.ssh/id_rsa

# Add all keys
ssh-add

# List keys in agent
ssh-add -l

# Remove key from agent
ssh-add -d ~/.ssh/id_rsa

# Remove all keys
ssh-add -D
```

### Authorized Keys (~/.ssh/authorized_keys)
```ini
# Add public key
echo "ssh-rsa AAAAB3... user@example.com" >> ~/.ssh/authorized_keys

# Set permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

## SSH Agent

### Start Agent
```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Start with specific key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

## Useful Commands

### Check if key matches public key
```bash
ssh-keygen -l -f ~/.ssh/id_rsa.pub
ssh-keygen -l -f ~/.ssh/id_rsa
```

### Generate MD5 fingerprint
```bash
ssh-keygen -l -E md5 -f ~/.ssh/id_rsa.pub
```

### Check SSH connection
```bash
# Check if port is open
nc -zv host 22

# Check SSH version
ssh -v user@host 2>&1 | grep "Remote protocol version"
```

### Copy multiple keys to remote
```bash
# Add all keys
ssh-copy-id -i ~/.ssh/*.pub user@host
```

### Remove known host key
```bash
# Remove from known_hosts
ssh-keygen -R host

# Remove from known_hosts file
sed -i '/host/d' ~/.ssh/known_hosts
```

## Security

### Disable Password Authentication
```bash
# On remote server
sudo nano /etc/ssh/sshd_config

# Set
PasswordAuthentication no
ChallengeResponseAuthentication no

# Restart SSH
sudo systemctl restart sshd
```

### Change Default Port
```bash
# Edit config
sudo nano /etc/ssh/sshd_config

# Change port
Port 2222

# Restart SSH
sudo systemctl restart sshd
```

### Limit Users
```bash
# Only allow specific users
AllowUsers user1 user2

# Deny specific users
DenyUsers root admin
```

### Key-Based Authentication Only
```bash
# Edit config
sudo nano /etc/ssh/sshd_config

# Set
PubkeyAuthentication yes
PasswordAuthentication no
```

## Troubleshooting

### Verbose Mode
```bash
ssh -vvv user@host
```

### Check Permissions
```bash
# Private key should be 600
chmod 600 ~/.ssh/id_rsa

# Public key should be 644
chmod 644 ~/.ssh/id_rsa.pub

# Directory should be 700
chmod 700 ~/.ssh
```

### Test Connection
```bash
# Test SSH connection without login
ssh -o BatchMode=yes -o ConnectTimeout=5 user@host echo ok
```

## Best Practices

- Use Ed25519 or ECDSA keys over RSA
- Use strong passphrases for private keys
- Never share private keys
- Use SSH config for convenience
- Disable password authentication
- Change default SSH port
- Use fail2ban for security
- Regularly rotate SSH keys
- Monitor SSH access logs
- Use key-based authentication only
- Implement proper firewall rules
- Use SSH keys without passphrase for automation

::: tip
Use `ssh-keygen -t ed25519 -C "your_email@example.com"` to generate secure SSH keys for GitHub/GitLab.
:::
