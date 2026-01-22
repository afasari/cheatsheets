# Network Security

Tools and practices for protecting networks, applications, and infrastructure from security threats including DDoS attacks, web vulnerabilities, and unauthorized access.

## Web Application Firewall (WAF)

### WAF Concepts

| Concept | Description |
|----------|-------------|
| **WAF** | Web Application Firewall - filters HTTP traffic |
| **SQL Injection** | Attack that executes SQL via input fields |
| **XSS** | Cross-Site Scripting - injects malicious scripts |
| **Rate Limiting** | Limits request rate per IP/user |
| **IP Blocking** | Blocks malicious IP addresses |
| **Geo-blocking** | Blocks requests from specific countries |

### AWS WAF

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws wafv2 create-ip-set --name MyIPSet` | Create IP set for blocking |
| `aws wafv2 create-web-acl --name MyWebACL` | Create Web ACL |
| `aws wafv2 create-rule-group --name MyRuleGroup` | Create rule group |
| `aws wafv2 associate-web-acl --web-acl-arn <arn> --resource-arn <arn>` | Associate Web ACL to resource |
| `aws wafv2 list-web-acls` | List Web ACLs |
| `aws wafv2 get-web-acl --name MyWebACL` | Get Web ACL details |

### AWS WAF Setup

```bash
# Create IP set for blocking
aws wafv2 create-ip-set \
  --name MyBlockedIPs \
  --scope REGIONAL \
  --ip-address-version IPV4 \
  --addresses '["192.0.2.0/24"]'

# Create Web ACL
aws wafv2 create-web-acl \
  --name MyWebACL \
  --scope REGIONAL \
  --default-action Allow

# Add rule to Web ACL
aws wafv2 update-web-acl \
  --name MyWebACL \
  --scope REGIONAL \
  --rules '[
    {
      "Name": "BlockMaliciousIPs",
      "Priority": 1,
      "Statement": {
        "IPSetReferenceStatement": {
          "ARN": "arn:aws:wafv2:region:us-east-1:123456789012:globalipset/MyBlockedIPs/..."
        },
        "IPSetForwardedIPConfig": {
          "HeaderName": "X-Forwarded-For",
          "FallbackBehavior": "MATCH",
          "Position": "FIRST"
        }
      },
      "Action": {
        "Block": {}
      }
    }
  ]'

# Associate with CloudFront distribution
aws wafv2 associate-web-acl \
  --web-acl-arn arn:aws:wafv2:region:us-east-1:123456789012:globalwebacl/MyWebACL/... \
  --resource-arn arn:aws:cloudfront::123456789012:distribution/ABC123
```

### AWS WAF Managed Rules

```bash
# Use AWS managed rule groups
aws wafv2 update-web-acl \
  --name MyWebACL \
  --scope REGIONAL \
  --default-action Allow \
  --managed-rule-group-statements '[
    {
      "VendorName": "AWS",
      "Name": "AWSManagedRulesCommonRuleSet",
      "Version": "Version_1.0_20240101",
      "RuleActionOverrides": []
    }
  ]'
```

### Azure WAF

| COMMAND | DESCRIPTION |
| --- | --- |
| `az network waf create --name MyWAF --resource-group MyRG` | Create WAF policy |
| `az network waf policy create --name MyPolicy --resource-group MyRG` | Create WAF policy |
| `az network waf policy rule create` | Create WAF rule |
| `az network waf policy rule list` | List WAF rules |
| `az network waf policy managed-rule-group list` | List managed rule groups |
| `az network waf policy custom-rule create` | Create custom rule |

### Azure WAF Setup

```bash
# Create WAF policy
az network waf policy create \
  --name MyWAFPolicy \
  --resource-group MyResourceGroup \
  --location eastus \
  --sku Standard

# Add custom rule
az network waf policy custom-rule create \
  --policy-name MyWAFPolicy \
  --name BlockMaliciousIPs \
  --priority 1 \
  --rule-type MatchRule \
  --match-conditions "MatchVariable RemoteAddr Operator IpMatch MatchValues 192.0.2.0/24" \
  --action Block

# Associate with Application Gateway
az network application-gateway waf-config update \
  --gateway-name MyGateway \
  --resource-group MyResourceGroup \
  --firewall-policy MyWAFPolicy
```

### Nginx WAF (ModSecurity)

```nginx
# nginx.conf
load_module modules/ngx_http_modsecurity_module.so;

server {
    listen 80;
    server_name example.com;
    
    # Enable ModSecurity
    ModSecurityEnabled On;
    ModSecurityConfig /etc/modsecurity/modsecurity.conf;
    
    location / {
        proxy_pass http://backend;
    }
}
```

```conf
# modsecurity.conf
SecRuleEngine On
SecRequestBodyAccess On
SecResponseBodyAccess Off

# Block SQL injection
SecRule ARGS "@rx (?i:(union select))" \
    "id:1001,phase:2,deny,status:403,msg:'SQL Injection'"

# Block XSS
SecRule ARGS "@rx (?i:(<script|javascript:))" \
    "id:1002,phase:2,deny,status:403,msg:'XSS Attack'"
```

## DDoS Protection

### DDoS Attack Types

| Type | Description | Mitigation |
|------|-------------|------------|
| **Volumetric** | High bandwidth to overwhelm network | CDN, traffic scrubbing |
| **Protocol** | Exploits network protocols | Rate limiting, protocol filtering |
| **Application Layer** | Exhausts application resources | WAF, rate limiting |

### AWS Shield

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws shield create-subscription` | Enable Shield Advanced |
| `aws shield describe-subscription` | Check Shield status |
| `aws shield list-protections` | List protected resources |
| `aws shield create-protection --resource-arn <arn>` | Enable protection |
| `aws shield delete-protection --protection-id <id>` | Remove protection |
| `aws shield describe-attack --attack-id <id>` | Get attack details |

### AWS Shield Setup

```bash
# Enable Shield Standard (automatic, free)
# No action needed - automatically enabled for CloudFront, Route 53, ELB

# Enable Shield Advanced (paid)
aws shield create-subscription

# Enable protection for CloudFront distribution
aws shield create-protection \
  --name MyCloudFrontProtection \
  --resource-arn arn:aws:cloudfront::123456789012:distribution/ABC123

# Enable protection for ALB
aws shield create-protection \
  --name MyALBProtection \
  --resource-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/MyLoadBalancer/abc123

# Get attack statistics
aws shield describe-attack --attack-id <attack-id>
```

### Azure DDoS Protection

| COMMAND | DESCRIPTION |
| --- | --- |
| `az network ddos-protection create --name MyDDoS --resource-group MyRG` | Enable DDoS protection |
| `az network ddos-protection show --name MyDDoS --resource-group MyRG` | Show protection details |
| `az network ddos-protection list` | List all protections |
| `az network ddos-protection update` | Update protection settings |
| `az monitor metrics list` | Get DDoS metrics |

### Azure DDoS Setup

```bash
# Enable DDoS Protection Standard
az network ddos-protection create \
  --name MyDDoSProtection \
  --resource-group MyResourceGroup \
  --location eastus \
  --ddos-protection-plan Standard

# Associate with public IP
az network public-ip update \
  --name MyPublicIP \
  --resource-group MyResourceGroup \
  --ddos-protection MyDDoSProtection

# Enable DDoS Protection for Application Gateway
az network application-gateway waf-config update \
  --gateway-name MyGateway \
  --resource-group MyResourceGroup \
  --firewall-policy MyWAFPolicy \
  --enable-ddos-protection true
```

### Cloudflare

| COMMAND | DESCRIPTION |
| --- | --- |
| `curl -X POST -H "X-Auth-Email: user@example.com" -H "X-Auth-Key: <api-key>" "https://api.cloudflare.com/client/v4/zones/<zone-id>/firewall/waf/packages"` | Get WAF packages |
| `curl -X POST -H "X-Auth-Email: user@example.com" -H "X-Auth-Auth-Key: <api-key>" "https://api.cloudflare.com/client/v4/zones/<zone-id>/firewall/access_rules/rules"` | Create firewall rule |
| `curl -X DELETE "https://api.cloudflare.com/client/v4/zones/<zone-id>/firewall/access_rules/rules/<rule-id>"` | Delete firewall rule |
| `curl -X POST -H "X-Auth-Email: user@example.com" -H "X-Auth-Key: <api-key>" "https://api.cloudflare.com/client/v4/zones/<zone-id}/firewall/lockdowns"` | Create lockdown rule |

### Cloudflare WAF Setup

```bash
# Enable WAF
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/<zone-id>/settings/waf" \
  -H "X-Auth-Email: user@example.com" \
  -H "X-Auth-Key: <api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "on"
  }'

# Create firewall rule
curl -X POST "https://api.cloudflare.com/client/v4/zones/<zone-id>/firewall/access_rules/rules" \
  -H "X-Auth-Email: user@example.com" \
  -H "X-Auth-Key: <api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "block",
    "configuration": {
      "target": "ip",
      "value": "192.0.2.0/24"
    },
    "notes": "Block malicious IP range"
  }'
```

## Network Security Best Practices

### Firewall Rules

| Best Practice | Description |
|--------------|-------------|
| **Default Deny** | Block all traffic by default |
| **Least Privilege** | Allow only necessary ports |
| **Ingress/Egress** | Filter both inbound and outbound |
| **Rule Ordering** | Order rules from specific to general |
| **Regular Audits** | Review and update rules regularly |

### Security Groups (AWS)

```bash
# Create security group
aws ec2 create-security-group \
  --group-name MySecurityGroup \
  --description "Allow HTTP and SSH"

# Add rules
aws ec2 authorize-security-group-ingress \
  --group-name MySecurityGroup \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name MySecurityGroup \
  --protocol tcp \
  --port 22 \
  --cidr 10.0.0.0/16

# List security groups
aws ec2 describe-security-groups --group-names MySecurityGroup

# Delete security group
aws ec2 delete-security-group --group-name MySecurityGroup
```

### Network Security Groups (Azure)

```bash
# Create network security group
az network nsg create \
  --name MyNSG \
  --resource-group MyResourceGroup \
  --location eastus

# Create security rule (allow HTTP)
az network nsg rule create \
  --nsg-name MyNSG \
  --resource-group MyResourceGroup \
  --name AllowHTTP \
  --priority 100 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --destination-port-ranges 80 \
  --source-address-prefixes '*' \
  --destination-address-prefixes '*'

# Create security rule (allow SSH)
az network nsg rule create \
  --nsg-name MyNSG \
  --resource-group MyResourceGroup \
  --name AllowSSH \
  --priority 110 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --destination-port-ranges 22 \
  --source-address-prefixes 10.0.0.0/16 \
  --destination-address-prefixes '*'

# Associate with subnet
az network vnet subnet update \
  --vnet-name MyVNet \
  --name MySubnet \
  --resource-group MyResourceGroup \
  --network-security-group MyNSG
```

### IP Whitelisting/Blacklisting

```bash
# AWS WAF IP set
aws wafv2 create-ip-set \
  --name WhitelistedIPs \
  --scope REGIONAL \
  --ip-address-version IPV4 \
  --addresses '["203.0.113.1", "198.51.100.1"]'

# Azure Network Security Group
az network nsg rule create \
  --nsg-name MyNSG \
  --resource-group MyResourceGroup \
  --name WhitelistIP \
  --priority 100 \
  --direction Inbound \
  --access Allow \
  --protocol Tcp \
  --destination-port-ranges 443 \
  --source-address-prefixes 203.0.113.1 \
  --destination-address-prefixes '*'
```

### Rate Limiting

```nginx
# Nginx rate limiting
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

server {
    limit_req zone=one burst=20 nodelay;
    
    location /api/ {
        # Limit to 10 requests per second
        limit_req zone=one burst=20 nodelay;
        
        proxy_pass http://backend;
    }
}
```

```yaml
# Kubernetes ingress with rate limiting
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/limit-rps: "10"
    nginx.ingress.kubernetes.io/limit-burst: "20"
spec:
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        backend:
          service:
            name: my-service
            port:
              number: 80
```

## Geo-blocking

### AWS WAF Geo-blocking

```bash
# Create IP set for countries
aws wafv2 create-ip-set \
  --name BlockedCountries \
  --scope REGIONAL \
  --ip-address-version IPV4

# Use geo match statement
aws wafv2 update-web-acl \
  --name MyWebACL \
  --scope REGIONAL \
  --rules '[
    {
      "Name": "BlockSpecificCountries",
      "Priority": 1,
      "Statement": {
        "GeoMatchStatement": {
          "CountryCodes": ["US", "GB", "CA"]
        }
      },
      "Action": {
        "Block": {}
      }
    }
  ]'
```

### Cloudflare Geo-blocking

```bash
# Create firewall rule for countries
curl -X POST "https://api.cloudflare.com/client/v4/zones/<zone-id>/firewall/access_rules/rules" \
  -H "X-Auth-Email: user@example.com" \
  -H "X-Auth-Key: <api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "block",
    "configuration": {
      "target": "country",
      "value": ["US", "GB", "CA"]
    },
    "notes": "Block specific countries"
  }'
```

## Security Headers

### Common Security Headers

| Header | Purpose | Example |
|--------|---------|---------|
| `X-Frame-Options` | Prevent clickjacking | `DENY`, `SAMEORIGIN` |
| `X-Content-Type-Options` | Prevent MIME sniffing | `nosniff` |
| `X-XSS-Protection` | XSS protection | `1; mode=block` |
| `Strict-Transport-Security` | Enforce HTTPS | `max-age=31536000; includeSubDomains` |
| `Content-Security-Policy` | XSS protection | `default-src 'self'` |
| `Referrer-Policy` | Control referrer info | `strict-origin-when-cross-origin` |

### Nginx Security Headers

```nginx
server {
    listen 443 ssl;
    server_name example.com;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    location / {
        proxy_pass http://backend;
    }
}
```

### Apache Security Headers

```apache
<VirtualHost *:443>
    ServerName example.com
    
    # Security headers
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Content-Security-Policy "default-src 'self'"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</VirtualHost>
```

## Network Security Tools

| Tool | Description | Use Case |
|------|-------------|----------|
| **Nmap** | Network scanning | Port scanning, vulnerability detection |
| **Wireshark** | Packet capture | Traffic analysis, troubleshooting |
| **Tcpdump** | Packet capture | Lightweight packet capture |
| **Fail2ban** | IP banning | Brute force protection |
| **Snort** | IDS/IPS | Network intrusion detection |
| **Suricata** | IDS/IPS | Network intrusion detection |

### Nmap

```bash
# Scan open ports
nmap -p- target.example.com

# Scan all ports
nmap -p- target.example.com

# OS detection
nmap -O target.example.com

# Service version detection
nmap -sV target.example.com

# UDP scan
nmap -sU target.example.com
```

### Fail2ban

```bash
# Install fail2ban
apt-get install fail2ban

# Configure jail.local
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

# Start fail2ban
systemctl start fail2ban

# Check status
fail2ban-client status sshd
```

## Network Security Best Practices

1. **Use WAF** - Protect web applications from common attacks
2. **Enable DDoS Protection** - Mitigate volumetric attacks
3. **Implement Rate Limiting** - Prevent abuse
4. **Use Security Headers** - Add security headers to responses
5. **Monitor Traffic** - Use IDS/IPS for threat detection
6. **Regular Audits** - Review firewall rules and logs
7. **Patch Systems** - Keep software up to date
8. **Use Encryption** - Encrypt network traffic with TLS
9. **Network Segmentation** - Separate public and private networks
10. **Access Controls** - Implement strong authentication

## Common Scenarios

### Scenario: Protect Web Application

**Approach**: WAF + security headers + rate limiting

1. **Enable WAF** - Use AWS WAF or Azure WAF
2. **Add Security Headers** - Configure server headers
3. **Rate Limit** - Implement rate limiting per IP
4. **Monitor Logs** - Review WAF logs for attacks
5. **Block Malicious IPs** - Use IP sets to block attackers

### Scenario: Prevent DDoS Attack

**Approach**: DDoS protection + CDN + rate limiting

1. **Enable DDoS Protection** - AWS Shield or Azure DDoS Protection
2. **Use CDN** - CloudFlare, CloudFront for traffic scrubbing
3. **Rate Limit** - Implement application-level rate limiting
4. **Scale Resources** - Auto-scale based on traffic
5. **Monitor** - Set up alerts for unusual traffic patterns

### Scenario: Secure API

**Approach**: Authentication + rate limiting + input validation

1. **API Gateway** - Use API gateway with built-in security
2. **Rate Limiting** - Limit API calls per key
3. **Input Validation** - Validate all input parameters
4. **Authentication** - Use API keys or OAuth
5. **CORS** - Configure CORS properly

## Network Security Comparison

| Feature | AWS WAF | Azure WAF | CloudFlare |
|---------|---------|-----------|-----------|
| **Managed Rules** | Yes | Yes | Yes |
| **Custom Rules** | Yes | Yes | Yes |
| **DDoS Protection** | Shield | DDoS Protection | Built-in |
| **Pricing** | Per WAF + rules | Per WAF + rules | Free + paid tiers |
| **DDoS Mitigation** | Automatic | Automatic | Automatic |
| **Learning** | Bot protection | Machine learning | Machine learning |
| **Rate Limiting** | Yes | Yes | Yes |

## Useful Tips

### Testing Security Headers

```bash
# Test security headers
curl -I https://example.com

# Online tool
# https://securityheaders.com/
```

### Monitoring DDoS Attacks

```bash
# AWS CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --metric-name DDoSAttackVolume \
  --namespace AWS/DDoSProtection \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z \
  --period 300

# Azure Monitor metrics
az monitor metrics list \
  --resource /subscriptions/<id>/resourceGroups/<rg>/providers/Microsoft.Network/ddosProtectionPlans/<plan> \
  --metric "DDoSAttackBandwidth"
```

### Common Issues

| Issue | Solution |
|-------|----------|
| False positives | Adjust WAF rules, use allow lists |
| Legitimate traffic blocked | Review logs, add IP to allow list |
| High WAF costs | Optimize rules, use CloudFlare free tier |
| DDoS protection not working | Verify resource is associated with protection |
| Security headers not appearing | Check server configuration, caching |

### DDoS Mitigation Services

| Service | Features |
|----------|---------|
| **AWS Shield** | Free standard, paid advanced |
| **Azure DDoS** | Free basic, paid standard |
| **CloudFlare** | Free plan with DDoS protection |
| **Akamai** | Enterprise DDoS protection |
| **Imperva** | Enterprise security and DDoS protection |
