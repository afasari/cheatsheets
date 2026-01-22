# Network Tools

Essential networking utilities for troubleshooting and diagnostics.

## Ping

| COMMAND | DESCRIPTION |
| --- | --- |
| `ping host` | Ping host |
| `ping -c 4 host` | Ping 4 times |
| `ping -i 0.2 host` | Ping every 0.2 seconds |
| `ping -s 1500 host` | Set packet size to 1500 bytes |
| `ping -f host` | Flood ping (root only) |

## Traceroute

| COMMAND | DESCRIPTION |
| --- | --- |
| `traceroute host` | Trace route to host |
| `traceroute -n host` | No DNS lookup |
| `traceroute -p 80 host` | Use specific port |
| `traceroute -w 1 host` | Wait 1 second for response |

## DNS Tools

### nslookup
| COMMAND | DESCRIPTION |
| --- | --- |
| `nslookup host` | DNS lookup |
| `nslookup -type=A host` | A record lookup |
| `nslookup -type=MX host` | MX record lookup |
| `nslookup -type=NS host` | NS record lookup |
| `nslookup host 8.8.8.8` | Use specific DNS server |

### dig
| COMMAND | DESCRIPTION |
| --- | --- |
| `dig host` | DNS lookup (detailed) |
| `dig +short host` | Short output |
| `dig @8.8.8.8 host` | Use specific DNS server |
| `dig MX host` | MX record lookup |
| `dig NS host` | NS record lookup |
| `dig TXT host` | TXT record lookup |
| `dig +trace host` | Trace DNS lookup |

### host
| COMMAND | DESCRIPTION |
| --- | --- |
| `host host` | DNS lookup |
| `host -t A host` | A record lookup |
| `host -t MX host` | MX record lookup |
| `host -t NS host` | NS record lookup |

## Curl

### Basic Usage
| COMMAND | DESCRIPTION |
| --- | --- |
| `curl URL` | GET request |
| `curl -I URL` | HEAD request (headers only) |
| `curl -X POST URL` | POST request |
| `curl -d "data" URL` | POST data |
| `curl -o file URL` | Save to file |
| `curl -O URL` | Save with remote filename |
| `curl -u user:pass URL` | Basic authentication |
| `curl -H "Header: Value" URL` | Add header |
| `curl -v URL` | Verbose output |
| `curl -L URL` | Follow redirects |
| `curl -k URL` | Skip SSL verification |

### Common Examples
```bash
# POST JSON data
curl -X POST -H "Content-Type: application/json" \
  -d '{"key":"value"}' URL

# Upload file
curl -F "file=@localfile.txt" URL

# Download with resume
curl -C - -O URL

# Use proxy
curl -x http://proxy:port URL

# Follow redirects
curl -L -O http://example.com/file

# Check HTTP status code
curl -o /dev/null -s -w "%{http_code}" URL
```

## Wget

| COMMAND | DESCRIPTION |
| --- | --- |
| `wget URL` | Download file |
| `wget -c URL` | Continue interrupted download |
| `wget -O filename URL` | Save to specific filename |
| `wget -r URL` | Recursive download |
| `wget -b URL` | Background download |
| `wget -c -r URL` | Recursive with resume |

## Netcat

| COMMAND | DESCRIPTION |
| --- | --- |
| `nc -l 8080` | Listen on port 8080 |
| `nc -l -p 8080` | Listen on port 8080 |
| `nc -zv host 80` | Check if port is open |
| `nc -zv host 1-100` | Scan ports 1-100 |
| `nc host port` | Connect to host:port |
| `echo "message" | nc host port` | Send message |
| `nc -l -p 8080 < file` | Send file |

## Netstat

| COMMAND | DESCRIPTION |
| --- | --- |
| `netstat -tuln` | List listening TCP/UDP ports |
| `netstat -tulpn` | List listening ports with process |
| `netstat -an` | List all connections |
| `netstat -r` | Show routing table |
| `netstat -i` | Show network interfaces |

## ss (Socket Statistics)

| COMMAND | DESCRIPTION |
| --- | --- |
| `ss -tuln` | List listening TCP/UDP ports |
| `ss -tulpn` | List listening with process |
| `ss -s` | Show statistics |
| `ss -4` | IPv4 sockets |
| `ss -6` | IPv6 sockets |

## ip

| COMMAND | DESCRIPTION |
| --- | --- |
| `ip addr` | Show IP addresses |
| `ip link` | Show network interfaces |
| `ip route` | Show routing table |
| `ip link set dev eth0 up` | Bring interface up |
| `ip link set dev eth0 down` | Bring interface down |
| `ip addr add 192.168.1.2/24 dev eth0` | Add IP address |
| `ip addr del 192.168.1.2/24 dev eth0` | Remove IP address |
| `ip route add default via 192.168.1.1` | Add default route |

## Tcpdump

| COMMAND | DESCRIPTION |
| --- | --- |
| `tcpdump -i eth0` | Capture on interface |
| `tcpdump -i eth0 -n` | No DNS resolution |
| `tcpdump -i eth0 port 80` | Capture HTTP traffic |
| `tcpdump -i eth0 host 192.168.1.1` | Capture from specific host |
| `tcpdump -i eth0 -w capture.pcap` | Write to file |
| `tcpdump -r capture.pcap` | Read from file |
| `tcpdump -i eth0 -v` | Verbose output |
| `tcpdump -i eth0 -c 100` | Capture 100 packets |

### Filters
```bash
# Capture HTTP
tcpdump -i eth0 port 80

# Capture HTTPS
tcpdump -i eth0 port 443

# Capture from IP
tcpdump -i eth0 src 192.168.1.1

# Capture to IP
tcpdump -i eth0 dst 192.168.1.2

# Capture TCP
tcpdump -i eth0 tcp

# Capture UDP
tcpdump -i eth0 udp

# Capture ICMP
tcpdump -i eth0 icmp

# Capture with host and port
tcpdump -i eth0 host 192.168.1.1 and port 80

# Capture with OR
tcpdump -i eth0 "port 80 or port 443"

# Capture with NOT
tcpdump -i eth0 not port 22
```

## Wireshark

### Useful Display Filters
```text
# HTTP
http

# HTTPS
tls

# TCP
tcp

# UDP
udp

# Filter by IP
ip.addr == 192.168.1.1

# Filter by port
tcp.port == 80

# Filter by host and port
ip.addr == 192.168.1.1 and tcp.port == 80

# Filter by protocol
tcp or udp

# Filter by network
ip.src == 192.168.1.0/24
```

## Nmap

| COMMAND | DESCRIPTION |
| --- | --- |
| `nmap host` | Scan host |
| `nmap -p 80,443 host` | Scan specific ports |
| `nmap -p 1-1000 host` | Scan port range |
| `nmap -A host` | Aggressive scan |
| `nmap -sV host` | Service version detection |
| `nmap -O host` | OS detection |
| `nmap -T4 host` | Faster scan |
| `nmap -sS host` | SYN scan (default) |
| `nmap -sU host` | UDP scan |

### Examples
```bash
# Quick scan (common ports)
nmap -F host

# Comprehensive scan
nmap -A -T4 host

# Scan network
nmap 192.168.1.0/24

# Scan with specific ports
nmap -p 22,80,443,3306 host

# Scan multiple hosts
nmap host1 host2 host3
```

## Telnet

| COMMAND | DESCRIPTION |
| --- | --- |
| `telnet host port` | Connect to port |
| `telnet host 25` | Connect to SMTP |
| `telnet host 80` | Connect to HTTP |

## SSH

| COMMAND | DESCRIPTION |
| --- | --- |
| `ssh user@host` | Connect to host |
| `ssh -p port user@host` | Connect on specific port |
| `ssh -i key user@host` | Use specific key |
| `ssh -L 8080:localhost:80 user@host` | Local port forwarding |
| `ssh -R 8080:localhost:80 user@host` | Remote port forwarding |
| `ssh-keygen -t ed25519` | Generate SSH key |
| `ssh-copy-id user@host` | Copy key to host |

## ARP

| COMMAND | DESCRIPTION |
| --- | --- |
| `arp -a` | Show ARP table |
| `arp -n` | Show without DNS resolution |
| `arp -d host` | Delete ARP entry |
| `arp -s host MAC` | Add ARP entry |

## Route

| COMMAND | DESCRIPTION |
| --- | --- |
| `route -n` | Show routing table |
| `route add default gw 192.168.1.1` | Add default route |
| `route del default` | Delete default route |
| `route add -host 192.168.1.2 gw 192.168.1.1` | Add host route |

## Useful Commands

### Check if port is open
```bash
nc -zv host port
```

### Find process using port
```bash
lsof -i :port
```

### Get public IP
```bash
curl ifconfig.me
curl ipinfo.io/ip
```

### Check internet connectivity
```bash
ping -c 4 8.8.8.8
```

### Check DNS resolution
```bash
nslookup host
dig +short host
```

### Speed test
```bash
curl -o /dev/null http://speedtest.tele2.net/100mb.img
```

### Download and test speed
```bash
curl -o /dev/null -w "Speed: %{speed_download} bytes/sec" URL
```

## Best Practices

- Use `curl` for HTTP operations
- Use `dig` for detailed DNS queries
- Use `nc` for port checking
- Use `tcpdump` for packet capture
- Use `nmap` for port scanning
- Use `ssh-keygen` for SSH keys
- Use `ip` instead of `ifconfig` (modern)
- Use `ss` instead of `netstat` (modern)
- Use `tcpdump` for troubleshooting
- Monitor network traffic
- Use proper firewalls

::: tip
Use `mtr` (My Traceroute) for real-time network monitoring: `mtr host`.
:::
