# TLS Certificates

Transport Layer Security certificates for secure communications.

## Certificate Types

| TYPE | DESCRIPTION |
| --- | --- |
| **Self-Signed** | Self-signed for development/testing |
| **Domain Validated (DV)** | Validates domain ownership |
| **Organization Validated (OV)** | Validates organization |
| **Extended Validation (EV)** | Highest level of validation |
| **Wildcard** | Covers subdomains (*.example.com) |
| **Multi-Domain (SAN)** | Covers multiple domains |

## Certificate Authority (CA)

### Create Root CA
```bash
# Generate private key
openssl genrsa -out ca.key 4096

# Create root certificate
openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 \
  -out ca.crt -subj "/CN=My Root CA"

# Verify root CA
openssl x509 -in ca.crt -text -noout
```

### Create Intermediate CA
```bash
# Generate key
openssl genrsa -out intermediate.key 4096

# Create CSR
openssl req -new -key intermediate.key -out intermediate.csr \
  -subj "/CN=My Intermediate CA"

# Sign with root CA
openssl x509 -req -in intermediate.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -out intermediate.crt -days 1825 -sha256
```

## CSR (Certificate Signing Request)

### Generate CSR
```bash
# Generate key and CSR
openssl req -new -newkey rsa:2048 -nodes \
  -keyout server.key -out server.csr \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=example.com"

# With subject alternative names
openssl req -new -newkey rsa:2048 -nodes \
  -keyout server.key -out server.csr \
  -subj "/CN=example.com" \
  -addext "subjectAltName=DNS:example.com,DNS:www.example.com,DNS:*.example.com"
```

### Verify CSR
```bash
openssl req -in server.csr -text -noout
```

### Sign CSR with CA
```bash
# Sign CSR
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -out server.crt -days 365 -sha256
```

## Self-Signed Certificates

### Generate Self-Signed Cert
```bash
# Basic
openssl req -x509 -newkey rsa:2048 -nodes -keyout server.key \
  -out server.crt -days 365 -subj "/CN=localhost"

# With SAN
openssl req -x509 -newkey rsa:2048 -nodes -keyout server.key \
  -out server.crt -days 365 \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:127.0.0.1"

# From CSR
openssl req -x509 -in server.csr -nodes -keyout server.key \
  -out server.crt -days 365
```

## Certificate Formats

### PEM to DER
```bash
# Certificate
openssl x509 -in cert.pem -outform DER -out cert.der

# Key
openssl rsa -in key.pem -outform DER -out key.der
```

### DER to PEM
```bash
openssl x509 -in cert.der -inform DER -outform PEM -out cert.pem
```

### PKCS#12 (PFX) to PEM
```bash
# Extract certificate
openssl pkcs12 -in cert.pfx -clcerts -nokeys -out cert.pem

# Extract private key
openssl pkcs12 -in cert.pfx -nocerts -nodes -out key.pem

# Extract both
openssl pkcs12 -in cert.pfx -nodes -out all.pem
```

### PEM to PKCS#12
```bash
openssl pkcs12 -export -out cert.pfx \
  -inkey server.key \
  -in server.crt \
  -certfile ca.crt \
  -name "My Certificate"
```

## Certificate Chains

### Create Chain File
```bash
# Combine certificates (server, intermediate, root)
cat server.crt intermediate.crt > fullchain.crt

# Order matters: server -> intermediate -> root
```

### Verify Chain
```bash
# Verify against root CA
openssl verify -CAfile ca.crt intermediate.crt
openssl verify -CAfile ca.crt server.crt

# Verify with intermediate
openssl verify -CAfile ca.crt -untrusted intermediate.crt server.crt
```

## Certificate Information

### View Certificate
```bash
# View certificate details
openssl x509 -in cert.pem -text -noout

# View subject
openssl x509 -in cert.pem -noout -subject

# View issuer
openssl x509 -in cert.pem -noout -issuer

# View validity dates
openssl x509 -in cert.pem -noout -dates

# View serial number
openssl x509 -in cert.pem -noout -serial

# View fingerprint
openssl x509 -in cert.pem -noout -fingerprint
```

### Check Expiry
```bash
# Check expiration
openssl x509 -in cert.pem -noout -checkend 0

# Check if expired within 30 days
openssl x509 -in cert.pem -noout -checkend 2592000

# Get expiration date
openssl x509 -in cert.pem -noout -enddate
```

## SSL/TLS Testing

### Test HTTPS Connection
```bash
# Show certificate
openssl s_client -showcerts -connect example.com:443

# Get certificate
openssl s_client -showcerts -connect example.com:443 </dev/null 2>/dev/null | \
  openssl x509 -outform PEM

# Check expiration
openssl s_client -connect example.com:443 2>/dev/null | \
  openssl x509 -noout -dates

# Check subject
openssl s_client -connect example.com:443 2>/dev/null | \
  openssl x509 -noout -subject
```

### Test SSL Version
```bash
# Test TLS 1.2
openssl s_client -tls1_2 -connect example.com:443

# Test TLS 1.3
openssl s_client -tls1_3 -connect example.com:443
```

## Certificate Revocation

### Check CRL (Certificate Revocation List)
```bash
# Download CRL
wget http://example.com/crl.pem

# Check CRL
openssl crl -in crl.pem -text -noout
```

### OCSP (Online Certificate Status Protocol)
```bash
# Check OCSP
openssl ocsp -issuer ca.crt -cert server.crt \
  -url http://ocsp.example.com
```

## Certificate Conversion

### Convert formats
```bash
# PEM to PKCS#12
openssl pkcs12 -export -out cert.p12 -inkey key.pem -in cert.pem

# PKCS#12 to PEM
openssl pkcs12 -in cert.p12 -out cert.pem -nodes

# DER to PEM
openssl x509 -in cert.der -inform DER -out cert.pem -outform PEM

# PEM to DER
openssl x509 -in cert.pem -outform DER -out cert.der
```

## Useful Commands

### Extract public key
```bash
# From certificate
openssl x509 -pubkey -noout -in cert.pem > pubkey.pem

# From private key
openssl rsa -in key.pem -pubout -out pubkey.pem
```

### Match key and certificate
```bash
# Compare modulus
openssl x509 -noout -modulus -in cert.pem | openssl md5
openssl rsa -noout -modulus -in key.pem | openssl md5

# Should match
```

### Generate Diffie-Hellman parameters
```bash
openssl dhparam -out dhparam.pem 2048
```

### Check certificate against CA bundle
```bash
openssl verify -CAfile /etc/ssl/certs/ca-bundle.crt cert.pem
```

## Renewal

### Renew Self-Signed Cert
```bash
# New expiration date
openssl req -x509 -new -key server.key -sha256 \
  -days 365 -out server.crt -subj "/CN=localhost"
```

### Renew from CA
```bash
# Generate new CSR
openssl req -new -key server.key -out newcsr.csr \
  -subj "/CN=example.com"

# Sign with CA
openssl x509 -req -in newcsr.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -out newcert.crt -days 365 -sha256
```

## Troubleshooting

### Common Issues
```bash
# Certificate expired
openssl x509 -in cert.pem -noout -checkend 0

# Common name mismatch
openssl x509 -in cert.pem -noout -subject

# Certificate chain incomplete
openssl s_client -showcerts -connect example.com:443

# Private key doesn't match
openssl x509 -noout -modulus -in cert.pem
openssl rsa -noout -modulus -in key.pem
```

### Check Certificate Chain
```bash
# Verify chain
openssl verify -CAfile ca.crt -untrusted intermediate.crt server.crt
```

## Best Practices

- Use certificates from trusted CAs for production
- Use at least 2048-bit RSA keys (prefer 4096)
- Include subject alternative names (SAN)
- Use certificate chains properly
- Regularly monitor certificate expiry
- Set up automatic renewal
- Use proper key management (HSM, KMS)
- Never share private keys
- Use strong ciphers (AES-256)
- Implement proper certificate validation
- Use TLS 1.2 or higher
- Disable SSLv2, SSLv3, TLS 1.0, 1.1

::: tip
Use Let's Encrypt (certbot) for free, trusted SSL certificates: `certbot certonly --standalone -d example.com`
:::
