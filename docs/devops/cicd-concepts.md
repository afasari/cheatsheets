# Cloud Networking Fundamentals

## Networking Fundamentals

### IP Addresses and Subnets

### IPv4 Address Structure
```
192.168.1.10/24

192.168.0 - Network ID (private)
1         - Host ID
10        - Host number
24       - Host part (0-255)
```

### Subnet Masks
```
255.255.255.0/24         - /24 (256 hosts)
255.255.255.0.0           - /16 (65536 hosts)
192.168.0.0.0            - /16 (65536 hosts)
172.16.0.0.0.12          - /16,777,216 hosts
10.0.0.0/8               - /16,777,216 hosts
```

### CIDR Notation
```
/24                     - 256 hosts
192.168.0.0/16          - 65536 hosts
172.16.0.0.12          - /16 (65536 hosts
10.0.0.8               - /16,777,216 hosts
```

### Private IP Ranges
```
10.0.0.0/8    - Class A
172.16.0.0.0/12   - Class B
192.168.0.0.16   - 192.168.255.255.255 (Class C)

# Local ranges
192.168.0.0.31   - Private
172.16.0.0.0/12   - Private
172.16.0.0.0.31   - Private
192.168.0.0.0.12   - (Class A)
```

## Routing

### Static Routing
```yaml
# Route table entry
destination: 192.168.1.1
gateway:           192.168.1.1
genmask:           255.255.255.255.0.0
metric:            0
interface:          eth0
```

### Dynamic Routing

```bash
# OSPF protocol
# Routers exchange route information
# Distance-based
# Shortest path preferred
# Equal cost can load balance
```

### Load Balancing Algorithms

### Round Robin
```bash
# Equal distribution
# Simple to implement
# Works well for identical servers
# No state required

### Least Connections
```bash
# New connections to least loaded server
# Fast response times
# No complex config needed
```

### IP Hashing

```bash
# Consistent server selection
# Client IP -> server mapping
# Better user experience
# Session persistence
```

## Firewalls and Security Groups

### Security Groups (AWS)
```yaml
# Allow specific traffic
resource "aws_security_group" "web_sg" {
  description = "Allow web traffic"
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0", "10.0.0.0/0"]
}

# Network ACLs (AWS)
resource "aws_network_acl" "web_acl" {
  vpc_id     = aws_vpc.main.id

  ingress {
    rule_no    = 100
    rule_action = "allow"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_block = "0.0.0.0/0"
  }
}
```

### Stateful Firewalls
```bash
# Track connections
# Monitor traffic patterns
# Detect anomalies
# Block suspicious IPs
# Rules
```

### Network Security Best Practices

### 1. Defense in Depth
```yaml
# Multiple layers
# - Network ACLs
# - Security groups
# - Host-based firewalls
# - Web Application Firewall (WAF)

# Principle
# Block everything, allow what's needed
# Layer 7 - Application firewall
```

### 2. Network Segmentation
```yaml
# Separate networks by tier
# - Public network (DMZ)
# - Application network (app)
# - Database network (db)
# - Management network (mgmt)

# Security differences
# - Web network: Allow HTTP/HTTPS only
# - DB network: Allow only from app tier
```

### 3. Private Subnets
```yaml
# Isolate resources
# Database in private subnet
# No internet gateway
```

### 4. Cloud Networking
```yaml
# Separate environments
# Dev state
# - backend "s3"
# - Staging "s3"
# - Production "prod"
```

## VPC Design

### VPC Architecture
```yaml
# Multi-tier VPC
resource "aws_vpc" "main" {
  cidr_block = ["10.0.0.0/0"]

  tags = { Tier = "public" }
}
```

### Public Subnet
```yaml
resource "aws_subnet" "public_subnet" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.0.0"

  availability_zone = "us-east-1a"

  tags = {
    Tier = "public"
  }
}
```

### Private Subnet
```yaml
resource "aws_subnet" "private_subnet" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.0.0/24"
  map_public_ip_on_launch = false

  tags = {
    Environment = "production"
    Tier = "private"
  }
}
```

## Peering

### VPC Peering
```bash
# Connect VPCs
resource "aws_vpc_peering_connection" "main" {
  vpc_id      = aws_vpc.main.id
  peer_vpc_id = aws_vpc.peer.id
  peer_region = "us-east-1"

  auto_accept = true
}
```

## Network Configuration

### NAT Gateway
```yaml
# Internet access for private subnets
resource "aws_nat_gateway" "nat_gw" {
  subnet_id = aws_subnet.private_subnet.id
  allocation = "elastic"

  tags = { Name = "NAT Gateway" }
}
```

## DNS Configuration

### DNS Records
```
# A Record
myapp.com.       IN    A    192.168.1.1

# CNAME Record
myapp.com.      IN    CNAME myapp.com
```

### DNS Resolution
```bash
# DNS query sequence
# Check cache
# Query authoritative servers
# Return IP address
# Client connects to IP
```

### DNS Load Balancing

```yaml
# Multiple A records
myapp.com.  IN  A    192.168.1.1
myapp.com.      IN MX 10 mail.myapp.com

# TXT Record
myapp.com.      IN    TXT  "v=spf1.include:_spf1.example.com"
```

### DNS Resolution Process

```bash
# DNS query sequence
# Check cache
# Query authoritative servers
# Return IP address
# Client connects to IP
```

## Network Troubleshooting

### Connectivity Tests
```bash
# Test connectivity
ping 192.168.1.1

# DNS resolution
nslookup myapp.com

# Trace route
traceroute myapp.com

# Test ports
nc -zv 192.168.1.1:80

# Network performance
iperf -c 10 -i eth0 -u 10M

# Packet capture
tcpdump -i eth0 -w capture.pcap
```

## Network Performance

### Monitoring
```yaml
# Monitor network metrics
metrics:
  - network_incoming_bytes
  - network_outgoing_bytes
  - network_errors_total

# Alerting
alerts:
  name: network_saturation
    expr: rate(network_errors[5m]) > 100
```

## Best Practices

### 1. Use CIDR Blocks
```yaml
# Good: Smaller allocations
# Efficient routing tables
# Easier subnet management
# Individual IPs
# Hard to manage
```

### 2. Plan for Growth
```yaml
# Reserve address space
# Use RFC1918 address space
# Consider future needs
# Document allocations
# Multiple VPCs
```

### 3. Secure by Default
```yaml
# Default deny all
# Explicitly allow what's needed
# Regularly review rules
# Remove unused rules
```

### 4. Monitor Everything
```yaml
# Network metrics
# Security events
# Connection logs
# Performance data
# Set up alerts
# Quick response to issues
```
