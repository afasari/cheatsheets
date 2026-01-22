# Security Overview

Security in DevOps and cloud environments requires a layered approach across infrastructure, applications, and data. This section covers essential security concepts, tools, and practices for protecting your systems.

## CIA Triad

The three core principles of information security:

| Principle | Description | Example |
|-----------|-------------|---------|
| **Confidentiality** | Preventing unauthorized access | Encryption, access controls |
| **Integrity** | Preventing unauthorized modification | Hashes, digital signatures |
| **Availability** | Ensuring authorized access | Redundancy, load balancing |

## Authentication & Authorization

### Authentication (AuthN)
Verifying identity of users or systems.

**Authentication Methods**:
- **Password-based**: Something you know
- **Multi-factor (MFA)**: Something you have + know
- **Certificate-based**: Something you are (certificate)
- **Token-based**: JWT, OAuth tokens
- **Biometric**: Fingerprint, face recognition

**Best Practices**:
- Enforce strong password policies
- Require MFA for privileged access
- Rotate credentials regularly
- Use single sign-on (SSO) where possible
- Implement account lockout policies

### Authorization (AuthZ)
Determining what authenticated entities can do.

**Authorization Models**:
- **RBAC (Role-Based Access Control)**: Permissions based on roles
- **ABAC (Attribute-Based Access Control)**: Permissions based on attributes
- **PBAC (Policy-Based Access Control)**: Permissions based on policies

**Principle of Least Privilege**: Grant minimum necessary permissions

## Encryption

### Encryption Types

| Type | Description | Use Case | Tools |
|------|-------------|----------|-------|
| **Symmetric** | Same key for encryption/decryption | Data at rest, fast | AES, ChaCha20 |
| **Asymmetric** | Public/private key pair | Key exchange, signatures | RSA, ECDSA |
| **Hashing** | One-way transformation | Password storage, integrity | SHA-256, bcrypt |

### Encryption Scenarios

**Data at Rest**:
- Database encryption (TDE)
- Disk encryption (LUKS, BitLocker)
- Object storage encryption (S3 SSE, Azure encryption)

**Data in Transit**:
- TLS/SSL for network communication
- HTTPS for web applications
- SSH for remote access
- VPN for site-to-site connections

**Best Practices**:
- Use TLS 1.3 or later
- Use strong cipher suites
- Rotate encryption keys
- Use Hardware Security Modules (HSMs) for key management

## Network Security

### Firewall Rules
Control network traffic ingress and egress.

**Default Deny**: Block all traffic, allow only what's needed

**Rule Example**:
```yaml
# Allow HTTP from specific subnet
rules:
  - source: 10.0.0.0/8
    destination: 80
    protocol: tcp
    action: allow
```

### Network Segmentation
Divide network into smaller, isolated segments.

**Benefits**:
- Limits blast radius of breaches
- Enforces least privilege
- Improves compliance

**Implementation**:
- VPCs and subnets
- Security groups / NACLs
- Zero Trust networks

### DDoS Protection
Distributed Denial of Service attack mitigation.

**Protection Layers**:
- **Network**: Block at edge (Cloudflare, AWS Shield)
- **Application**: WAF rules (ModSecurity, AWS WAF)
- **Rate Limiting**: Throttle requests per IP

## Application Security

### OWASP Top 10
Critical web application security risks:

| Risk | Description | Mitigation |
|------|-------------|------------|
| **Injection** | SQL injection, command injection | Prepared statements, input validation |
| **Broken Auth** | Session fixation, weak passwords | MFA, secure session management |
| **XSS** | Cross-site scripting | Output encoding, CSP headers |
| **Insecure Deserialization** | Object injection | Avoid deserialization, validate input |
| **Security Misconfig** | Default credentials, open ports | Security hardening, audits |

### Secure Coding Practices
- Input validation and sanitization
- Output encoding (prevent XSS)
- Parameterized queries (prevent SQL injection)
- Secure session management
- Security headers (CSP, HSTS, X-Frame-Options)
- Dependency management (update vulnerable packages)

## Secrets Management

### Secret Types
- API keys and tokens
- Database credentials
- SSH private keys
- TLS certificates
- Configuration with sensitive data

### Secrets Storage

| Method | Description | Use Case |
|--------|-------------|----------|
| **Environment Variables** | Runtime environment | Containerized apps |
| **Secrets Managers** | Encrypted storage service | Production systems |
| **Vaults** | Secure secret storage | Enterprise, compliance |
| **Kubernetes Secrets** | Etcd-backed encryption | K8s workloads |

**Best Practices**:
- Never commit secrets to version control
- Rotate secrets regularly
- Use different secrets for different environments
- Encrypt secrets at rest and in transit
- Implement secret access logging

### Tools
- **AWS Secrets Manager**: AWS-specific secrets
- **Azure Key Vault**: Azure-specific secrets
- **HashiCorp Vault**: Multi-platform, advanced features
- **Kubernetes Secrets**: K8s-native, etcd encryption

## DevSecOps

### Shifting Security Left
Integrate security early in development lifecycle.

**Security in CI/CD Pipeline**:
1. **Code Scan**: Static analysis (SonarQube, ESLint)
2. **Dependency Scan**: Vulnerability scanning (Snyk, Dependabot)
3. **Container Scan**: Image vulnerability scanning (Trivy, Clair)
4. **IaC Scan**: Infrastructure security checks (tfsec, Checkov)
5. **Pre-deploy Tests**: Security tests before deployment
6. **Runtime Monitoring**: Real-time security monitoring

### Security Automation
- Automated security scanning in CI/CD
- Automated compliance checks
- Automated patching and updates
- Automated incident response

## Compliance & Auditing

### Common Compliance Frameworks
- **SOC 2**: Service Organization Control Type 2
- **PCI DSS**: Payment Card Industry Data Security Standard
- **HIPAA**: Health Insurance Portability and Accountability Act
- **GDPR**: General Data Protection Regulation
- **ISO 27001**: Information Security Management

### Audit Logging
Record security-relevant events for compliance and investigation.

**Events to Log**:
- Login/logout events
- Privilege escalation
- Configuration changes
- Access to sensitive data
- Failed authentication attempts

**Log Requirements**:
- Tamper-evident storage
- Immutable logs
- Regular review
- Retention policies

## Common Scenarios

### Scenario: Securing Web Application
**Measures**:
- HTTPS with TLS 1.3
- Input validation and output encoding
- WAF for attack detection
- Rate limiting and DDoS protection
- Security headers (CSP, HSTS)
- Dependency scanning in CI/CD

### Scenario: Securing Cloud Infrastructure
**Measures**:
- Network segmentation (VPC, subnets)
- Security groups with least privilege
- IAM roles and policies
- Instance profiling and monitoring
- Secret rotation
- Regular security audits

### Scenario: Securing CI/CD Pipeline
**Measures**:
- Branch protection rules
- Required code reviews
- Automated security scanning
- Separate production and non-production environments
- Access controls for pipeline
- Audit logging of pipeline runs

## Security Best Practices

1. **Defense in Depth**: Multiple security layers
2. **Principle of Least Privilege**: Minimum necessary access
3. **Fail Securely**: Default to secure configuration
4. **Regular Updates**: Patch vulnerabilities promptly
5. **Security Reviews**: Regular code and architecture reviews
6. **Incident Response**: Have a plan for security incidents
7. **Training**: Educate team on security best practices

## Further Reading

- [OpenSSL](./openssl) - SSL/TLS certificates and cryptographic operations
- [SSH Keys](./ssh) - SSH key management and configuration
- [TLS Certificates](./tls) - Certificate management and troubleshooting
- [OAuth 2.0](./oauth) - Authorization framework
