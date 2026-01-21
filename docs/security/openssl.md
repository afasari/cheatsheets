# OpenSSL

Cryptography toolkit implementing SSL and TLS protocols.

## Certificate Operations

### Generate Private Key
```bash
# Generate RSA key
openssl genrsa -out private.key 2048

# Generate with passphrase
openssl genrsa -des3 -out private.key 2048

# Generate EC key
openssl ecparam -genkey -name prime256v1 -out private.key
```

### Generate Certificate Signing Request (CSR)
```bash
# Generate CSR
openssl req -new -key private.key -out request.csr

# With configuration file
openssl req -new -key private.key -out request.csr -config openssl.cnf

# With subject info
openssl req -new -key private.key -out request.csr \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=example.com"
```

### Self-Signed Certificate
```bash
# Generate self-signed cert
openssl req -x509 -newkey rsa:2048 -keyout private.key -out certificate.crt \
  -days 365 -subj "/CN=localhost"

# With extensions
openssl req -x509 -newkey rsa:2048 -keyout private.key \
  -out certificate.crt -days 365 \
  -extensions v3_req \
  -config <(cat openssl.cnf <(printf "[v3_req]\nsubjectAltName=DNS:example.com"))
```

## Certificate Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `openssl x509 -in cert.crt -text -noout` | View certificate |
| `openssl x509 -in cert.crt -noout -subject` | View subject |
| `openssl x509 -in cert.crt -noout -issuer` | View issuer |
| `openssl x509 -in cert.crt -noout -dates` | View validity dates |
| `openssl x509 -in cert.crt -noout -fingerprint` | View fingerprint |
| `openssl verify cert.crt` | Verify certificate |
| `openssl x509 -in cert.crt -outform PEM -out cert.pem` | Convert to PEM |

## Key Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `openssl rsa -in private.key -text -noout` | View private key |
| `openssl rsa -in private.key -pubout -out public.key` | Extract public key |
| `openssl pkey -in key.pem -pubout -out pubkey.pem` | Extract public key (generic) |
| `openssl pkcs8 -topk8 -in key.pem -out key8.pem` | Convert to PKCS#8 |
| `openssl rsa -in encrypted.key -out decrypted.key` | Remove passphrase |

## Certificate Verification

### Verify Certificate Chain
```bash
# Verify against CA bundle
openssl verify -CAfile ca-bundle.crt certificate.crt

# Verify with specific depth
openssl verify -CAfile ca.crt -untrusted intermediate.crt certificate.crt

# Show verification details
openssl verify -CAfile ca.crt -verbose certificate.crt
```

### Check Certificate Expiry
```bash
# View expiration date
openssl x509 -enddate -noout -in certificate.crt

# Calculate days until expiry
echo "Days until expiry: \
  $(($(date -d "$(openssl x509 -enddate -noout -in cert.crt | cut -d= -f2)" +%s) \
  - $(date +%s)) / 86400)"
```

## File Conversions

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

### PEM to PKCS#12 (PFX)
```bash
openssl pkcs12 -export -out cert.pfx \
  -inkey private.key \
  -in certificate.crt \
  -certfile ca.crt
```

### PKCS#12 to PEM
```bash
# Extract private key
openssl pkcs12 -in cert.pfx -nocerts -out private.key -nodes

# Extract certificate
openssl pkcs12 -in cert.pfx -clcerts -nokeys -out certificate.crt
```

## Encryption & Decryption

### Encrypt File
```bash
# Encrypt with AES-256-CBC
openssl enc -aes-256-cbc -in plaintext.txt -out encrypted.enc

# With passphrase prompt
openssl enc -aes-256-cbc -in plaintext.txt -out encrypted.enc

# With salt
openssl enc -aes-256-cbc -salt -in plaintext.txt -out encrypted.enc

# With key and IV
openssl enc -aes-256-cbc -K key -IV iv -in plaintext.txt -out encrypted.enc
```

### Decrypt File
```bash
openssl enc -aes-256-cbc -d -in encrypted.enc -out plaintext.txt
```

## Hashing

| COMMAND | DESCRIPTION |
| --- | --- |
| `openssl md5 file.txt` | MD5 hash |
| `openssl sha1 file.txt` | SHA1 hash |
| `openssl sha256 file.txt` | SHA256 hash |
| `openssl sha512 file.txt` | SHA512 hash |
| `openssl dgst -sha256 file.txt` | Alternative hash command |

## Base64 Encoding/Decoding

```bash
# Encode
openssl base64 -in input.txt -out output.b64

# Decode
openssl base64 -d -in input.b64 -out output.txt

# Encode string
echo -n "hello" | openssl base64

# Decode string
echo "aGVsbG8=" | openssl base64 -d
```

## Testing SSL/TLS

### Test HTTPS Connection
```bash
# Show certificate
openssl s_client -showcerts -connect example.com:443

# Starttls for SMTP
openssl s_client -showcerts -connect smtp.gmail.com:587 -starttls smtp

# Starttls for FTP
openssl s_client -showcerts -connect ftp.example.com:21 -starttls ftp
```

### Check Certificate Details
```bash
# View certificate
openssl s_client -showcerts -connect example.com:443 | openssl x509 -text

# View expiration
openssl s_client -connect example.com:443 2>/dev/null | \
  openssl x509 -noout -dates

# Check subject
openssl s_client -connect example.com:443 2>/dev/null | \
  openssl x509 -noout -subject
```

## CSR Information

### View CSR
```bash
openssl req -in request.csr -text -noout
```

### Verify CSR
```bash
openssl req -in request.csr -verify -noout
```

## Configuration Files

### Example openssl.cnf
```ini
[req]
default_bits = 2048
default_keyfile = private.key
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = State
L = City
O = Organization
OU = Unit
CN = example.com

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = example.com
DNS.2 = www.example.com
DNS.3 = *.example.com
```

## Diffie-Hellman Parameters

```bash
# Generate DH parameters
openssl dhparam -out dhparam.pem 2048

# Generate stronger parameters (slower)
openssl dhparam -out dhparam.pem 4096
```

## Random Data

```bash
# Generate random bytes
openssl rand -hex 16

# Generate random base64
openssl rand -base64 16

# Write to file
openssl rand -hex 32 > random.txt
```

## Useful Commands

### Generate password
```bash
openssl rand -base64 12
```

### Check certificate against private key
```bash
# Compare modulus
openssl x509 -noout -modulus -in certificate.crt | openssl md5
openssl rsa -noout -modulus -in private.key | openssl md5

# Should output same MD5 hash
```

### Extract certificate from chain
```bash
# View each certificate in chain
openssl s_client -showcerts -connect example.com:443 </dev/null 2>/dev/null | \
  awk '/BEGIN CERTIFICATE/,/END CERTIFICATE/' > chain.pem

# Split certificates
csplit -z -f cert- chain.pem '/END CERTIFICATE/' '{*}'
```

### Check SSL version
```bash
# Check SSLv2 support
openssl s_client -ssl2 -connect example.com:443

# Check SSLv3 support
openssl s_client -ssl3 -connect example.com:443

# Check TLSv1.2 support
openssl s_client -tls1_2 -connect example.com:443
```

## Best Practices

- Use at least 2048-bit RSA keys (prefer 4096)
- Use SHA-256 or higher for signatures
- Never share private keys
- Use strong ciphers (AES-256)
- Regularly rotate certificates
- Use passphrase protection for private keys
- Use proper certificate chains
- Implement proper certificate validation
- Use secure key storage (HSM, KMS)
- Regularly update OpenSSL
- Test certificate deployment
- Use proper SAN (Subject Alternative Names)

::: tip
Use `openssl version -a` to check OpenSSL version and built-in options.
:::
