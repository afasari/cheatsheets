# Cloud Networking Fundamentals

## Networking Fundamentals

### IP Addresses and Subnets

### IPv4 Address Structure
```
192.168.1.10/24

192.168   - Network ID (private)
1         - Host ID
10        - Host number
.24       - Host part (0-255)
```

### Subnet Masks
```
255.255.255.0 0/24         - /24 (256 hosts)
255.255.255.0 0        - /16 (65536 hosts)
192.168.0.0/0            - /16 (65536 hosts)
172.16.0.0/0            - /16 (65536 hosts)
10.0.0.0/24              - /24 (256 hosts)
```

### CIDR Notation
```
/24                     - 256 hosts
192.168.0.0/16          - 65536 hosts
172.16.0.0/12          - 1,048,576 hosts
10.0.0.0/8               - 16,777,216 hosts
```

### Private IP Ranges
```
10.0.0.0/8    - 10.0.0.0/15    (Class A)
172.16.0.0/12   - 172.31.255.255   (Class B)
192.168.0.0/16   - 192.168.255.255  (Class C)
172.16.0.0/16   - 172.16.255.255 (Class D)

# Local ranges
192.168.0.0/16   - 192.168.0.0.31   (Private)
172.16.0.0/12   - 172.16.0.0.31   (Private)
```

## Routing

### Static Routing

```yaml
# Route table entry
destination: 192.168.1.0
gateway:           192.168.1.1
genmask:           255.255.255.255.0
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

# Policy-based
# Different routes for different services
```

### Load Balancing Algorithms

### Round Robin
```bash
# Equal distribution
# Simple to implement
# Works well for identical servers
# No state required
```

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

### DNS

### DNS Records
```
# A Record
myapp.com.       IN    A    192.168.1.1

# CNAME Record
api.myapp.com.  IN    CNAME myapp.com

# MX Record
myapp.com.      IN    MX    10 mail.myapp.com

# TXT Record
myapp.com.      IN    TXT    "v=spf1 include:_spf1.example.com"
```

### DNS Resolution Process
```bash
# DNS query sequence
1. Check cache
2. Query authoritative servers
3. Return IP address
4. Client connects to IP
```

### DNS Load Balancing
```
# Multiple A records
myapp.com.  IN  A  192.168.1.1
myapp.com.  IN  A 192.168.1.2
myapp.com.  IN  A 192.168.1.3

# Round Robin
# DNS rotates through IPs
# Simple client-side load balancing
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

  egress {
    from_port   = 80
    protocol    = "tcp"
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0", "10.0.0.0/0"]
  }
}
```

### Network ACLs (AWS)
```yaml
# Fine-grained control
resource "aws_network_acl" "web_acl" {
  vpc_id     = aws_vpc.main.id

  ingress {
    rule_no    = 100
    protocol   = "-1"
    rule_action = "allow"
    from_port   = 80
    to_port     = 80
    cidr_block = "0.0.0.0/0/0"
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
# Allow only necessary ports
# Default deny all
```

### Network Security Best Practices

### 1. Defense in Depth
```yaml
# Multiple layers
# - Network ACL
# - Security groups
# - Host-based firewalls
# - Web Application Firewall

# Principle
# Block everything, allow only what's needed
# Least privilege
```

### 2. Network Segmentation
```yaml
# Separate networks by tier
# Public network (DMZ)
# Private network (app tier)
# Database network
# Management network
```

### 3. Private Subnets
```yaml
# Isolate resources
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

## VPC Design

### VPC Architecture
```yaml
# Multi-tier VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0.0/16"

  tags = {
    Name = "Main VPC"
    Environment = "production"
  }
}

# Public subnet
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  availability_zone = "us-east-1a"

  tags = { Tier = "public" }
}

# Private subnet
resource "aws_subnet" "private_subnet" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = false

  availability_zone = "us-east-1a"

  tags = { Tier = "private" }
}
```

### VPC Peering
```yaml
# Connect VPCs
resource "aws_vpc_peering_connection" "peer_connection" {
  vpc_id      = aws_vpc.main.id
  peer_vpc_id  = aws_vpc.peer.id
  peer_region = "us-east-1"

  auto_accept = true

  tags = { Name = "Main-to-Peer Peering" }
}
```

### NAT Gateway
```yaml
# Internet access for private subnets
resource "aws_nat_gateway" "nat_gw" {
  subnet_id     = aws_subnet.private_subnet.id

  allocation = "elastic"

  tags = { Name = "NAT Gateway" }
}

# Route table
resource "aws_route_table" "nat_routes" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id   = aws_nat_gateway.nat_gw.id
  }
}
```

## Network Configuration

### Static IP Assignment

```bash
# Assign public IP
aws ec2 allocate-address --domain myapp.com

# Associate with instance
aws ec2 associate-address --instance-id i-1234567890 \
  --allocation-id eipalloc-12345678

# Release when done
aws ec2 release-address --allocation-id eipalloc-123456
```

### Elastic IP

```yaml
# Dynamic IP pool
# Auto-assign on instance start
# Release when instance terminates
# Pool management

resource "aws_eip" "web_eip" {
  domain   = "myapp.example.com"
  vpc      = aws_vpc.main.id

  tags = { Name = "Web EIP" }
}

# Association
resource "aws_eip_association" "web_eip_assoc" {
  instance_id = aws_instance.web.id
  allocation_id = aws_eip.web_eip.id
}
```

### DNS Configuration

```yaml
# Update DNS record
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.id
  name     = "www"
  type     = "A"
  ttl      = 300
  records  = ["192.168.1.1"]
}

# Configure with EIP
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.id
  name     = "www"
  type     = "A"
  ttl      = 300
  records  ["192.168.1.1"]

  # Wait for association
  depends_on = [aws_eip_association.web_eip_assoc]
}
```

## Cloud Networking Services

### AWS Networking
```yaml
# VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/0/16"
}

# Subnet
resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
}

# Security Group
resource "aws_security_group" "web_sg" {
  description = "Web security group"
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### Azure Networking
```yaml
# Virtual Network
resource "azurerm_virtual_network" "main" {
  address_space       = "10.0.0.0/16"
  location          = "eastus"
  resource_group_name = "my-rg"
}

# Subnet
resource "azurerm_subnet" "public" {
  name                 = "public-subnet"
  virtual_network_name  = "azurerm_virtual_network.main.name"
  address_prefixes    = ["10.0.1."]

# Network Security Group
resource "azurerm_network_security_group" "web_sg" {
  name                = "web-ns-g"
  location            = "eastus"
  resource_group_name  = "my-rg"
}
```

### GCP Networking
```yaml
# VPC Network
resource "google_compute_network" "main" {
  name                    = "main-network"
  auto_create_subnetworks = false
  routing_mode          = "REGIONAL"

  ip_cidr_range = "10.0.0.0/16"
}

# Firewall Rules
resource "google_compute_firewall" "web_firewall" {
  name        = "web-firewall"
  network     = google_compute_network.main.name
  allow {
    protocol    = "tcp"
    ports       = ["80", "443"]
    source_ranges = ["0.0.0.0/0"]
  }
}
```

## Network Troubleshooting

### Connectivity Tests

```bash
# Test connectivity
ping 192.168.1.1
telnet 192.168.1.1 80
nc -zv 192.168.1.1 80

# DNS resolution
nslookup myapp.com
dig myapp.com
dig myapp.com +short

# Trace route
traceroute myapp.com
mtr myapp.com -n 10
```

### Network Performance

```bash
# Bandwidth test
iperf -c 10 -i eth0 -u 10M

# Latency test
ping -c 10 myapp.com

# Packet capture
tcpdump -i eth0 -w capture.pcap
```

### Network Monitoring

```yaml
# Monitor network metrics
metrics:
  - network_incoming_bytes
  - network_outgoing_bytes
  - network_errors
  - network_conntrack_count

# Alert on anomalies
alerts:
  - name: network_saturation
    expr: rate(network_errors[5m]) > 100
```

## Best Practices

### 1. Use CIDR Blocks
```yaml
# Good: Smaller allocations
# Efficient routing tables
# Easier subnet management

# Bad: Individual IPs
# Wastes address space
# Hard to manage
```

### 2. Plan for Growth
```yaml
# Reserve address space
# Use RFC 1918 address space
# Consider future needs
# Document allocations

# Multiple VPCs
# Separate environments
# Use VPC peering carefully
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
