# Secrets Management

Tools and services for securely storing, accessing, and rotating secrets, API keys, certificates, and sensitive configuration data.

## Secrets Management Best Practices

| Practice | Description |
|----------|-------------|
| **Never commit secrets** | Never store secrets in version control |
| **Use least privilege** | Grant minimum necessary access |
| **Rotate secrets regularly** | Automatic rotation for critical secrets |
| **Encrypt at rest** | Secrets encrypted in storage |
| **Encrypt in transit** | Use TLS for all communications |
| **Use environment variables** | Inject secrets at runtime |
| **Audit access** | Track who accesses secrets |
| **Use secret scanning** | Detect secrets in code |
| **Separate environments** | Different secrets for dev/staging/prod |

## AWS Secrets Manager

### AWS CLI Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws secretsmanager create-secret --name my-secret --secret-string "my-password"` | Create secret |
| `aws secretsmanager get-secret-value --secret-id my-secret` | Get secret value |
| `aws secretsmanager describe-secret --secret-id my-secret` | Describe secret metadata |
| `aws secretsmanager list-secrets` | List all secrets |
| `aws secretsmanager delete-secret --secret-id my-secret` | Delete secret |
| `aws secretsmanager update-secret --secret-id my-secret --secret-string "new-password"` | Update secret |
| `aws secretsmanager rotate-secret --secret-id my-secret` | Rotate secret |

### Create Secret

```bash
# Create simple secret
aws secretsmanager create-secret \
  --name myapp/database-password \
  --description "Database password for myapp" \
  --secret-string "mySecurePassword123"

# Create secret with tags
aws secretsmanager create-secret \
  --name myapp/api-key \
  --description "API key for external service" \
  --secret-string '{"username":"user","password":"pass"}' \
  --tags Key=Environment,Value=production

# Create secret from file
aws secretsmanager create-secret \
  --name myapp/config \
  --description "Application configuration" \
  --secret-binary fileb://config.json
```

### Retrieve Secret

```bash
# Get secret value
aws secretsmanager get-secret-value \
  --secret-id myapp/database-password \
  --query SecretString \
  --output text

# Get secret and save to file
aws secretsmanager get-secret-value \
  --secret-id myapp/config \
  --query SecretBinary \
  --output text > config.json

# Get secret in shell script
export DB_PASSWORD=$(aws secretsmanager get-secret-value \
  --secret-id myapp/database-password \
  --query SecretString \
  --output text)
```

### Update Secret

```bash
# Update secret
aws secretsmanager update-secret \
  --secret-id myapp/database-password \
  --secret-string "newSecurePassword456"

# Update secret with new version
aws secretsmanager put-secret-value \
  --secret-id myapp/database-password \
  --secret-string "newSecurePassword789"
```

### Rotate Secret

```bash
# Trigger immediate rotation
aws secretsmanager rotate-secret \
  --secret-id myapp/database-password

# Cancel rotation
aws secretsmanager cancel-rotation-secret \
  --secret-id myapp/database-password
```

### Delete Secret

```bash
# Delete secret (no recovery window)
aws secretsmanager delete-secret \
  --secret-id myapp/database-password \
  --force-delete-without-recovery

# Delete secret with recovery window
aws secretsmanager delete-secret \
  --secret-id myapp/database-password \
  --recovery-window-in-days 7
```

### Secret Rotation

```json
{
  "VersionId": "EXAMPLE1-90ab-cdef-fedcba9876543210987654321",
  "SecretVersion": "AWSCURRENT",
  "VersionStages": ["AWSCURRENT", "AWSPENDING"]
}
```

## Azure Key Vault

### Azure CLI Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `az keyvault create --name my-vault --resource-group MyRG` | Create Key Vault |
| `az keyvault secret set --vault-name my-vault --name my-secret --value my-password` | Set secret |
| `az keyvault secret show --vault-name my-vault --name my-secret` | Get secret |
| `az keyvault secret list --vault-name my-vault` | List all secrets |
| `az keyvault secret delete --vault-name my-vault --name my-secret` | Delete secret |
| `az keyvault key create --vault-name my-vault --name my-key` | Create key |
| `az keyvault certificate import --vault-name my-vault --file cert.pfx` | Import certificate |

### Create Key Vault

```bash
# Create Key Vault
az keyvault create \
  --name my-key-vault \
  --resource-group myResourceGroup \
  --location eastus \
  --enable-soft-delete true \
  --enable-purge-protection true

# Add access policy
az keyvault set-policy \
  --name my-key-vault \
  --object-id <object-id> \
  --secret-permissions get list set delete \
  --key-permissions get list create delete
```

### Manage Secrets

```bash
# Set secret
az keyvault secret set \
  --vault-name my-key-vault \
  --name database-password \
  --value "mySecurePassword123" \
  --description "Database password for myapp"

# Set secret with expiration
az keyvault secret set \
  --vault-name my-key-vault \
  --name api-key \
  --value "myApiKey" \
  --expires "2024-12-31T23:59:59Z"

# Get secret
az keyvault secret show \
  --vault-name my-key-vault \
  --name database-password \
  --query value -o tsv

# List secrets
az keyvault secret list \
  --vault-name my-key-vault

# Update secret
az keyvault secret set \
  --vault-name my-key-vault \
  --name database-password \
  --value "newSecurePassword456"

# Delete secret
az keyvault secret delete \
  --vault-name my-key-vault \
  --name database-password
```

### Manage Keys

```bash
# Create key
az keyvault key create \
  --vault-name my-key-vault \
  --name my-encryption-key \
  --kty RSA \
  --size 2048

# Get key
az keyvault key show \
  --vault-name my-key-vault \
  --name my-encryption-key

# List keys
az keyvault key list \
  --vault-name my-key-vault

# Delete key
az keyvault key delete \
  --vault-name my-key-vault \
  --name my-encryption-key
```

### Manage Certificates

```bash
# Import certificate
az keyvault certificate import \
  --vault-name my-key-vault \
  --name my-cert \
  --file my-cert.pfx \
  --password cert-password

# Get certificate
az keyvault certificate show \
  --vault-name my-key-vault \
  --name my-cert

# List certificates
az keyvault certificate list \
  --vault-name my-key-vault
```

## HashiCorp Vault

### Vault Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `vault login` | Authenticate to Vault |
| `vault secrets enable -path=kv kv` | Enable KV secrets engine |
| `vault kv put kv/my-secret value=my-password` | Create secret |
| `vault kv get kv/my-secret` | Get secret |
| `vault kv list kv/` | List secrets |
| `vault kv delete kv/my-secret` | Delete secret |
| `vault status` | Check Vault status |
| `vault operator init` | Initialize Vault |
| `vault operator unseal` | Unseal Vault |

### Vault Configuration

```hcl
# config.hcl
listener "tcp" {
  address = "0.0.0.0:8200"
  cluster_address = "0.0.0.0:8201"
  tls_disable = 1
}

storage "consul" {
  address = "127.0.0.1:8500"
  path = "vault"
}

ui = true
```

### Manage Secrets

```bash
# Write secret
vault kv put kv/myapp/database \
  username="admin" \
  password="mySecurePassword123"

# Read secret
vault kv get kv/myapp/database

# List secrets
vault kv list kv/myapp/

# Delete secret
vault kv delete kv/myapp/database

# Update secret
vault kv put kv/myapp/database \
  username="admin" \
  password="newSecurePassword456"
```

### Secret Versions

```bash
# List versions
vault kv list -versions kv/myapp/database

# Get specific version
vault kv get -version=2 kv/myapp/database

# Delete specific version
vault kv delete -versions=2 kv/myapp/database
```

### Vault Policies

```hcl
# policy.hcl
path "secret/myapp/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

path "secret/data/myapp/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
```

```bash
# Write policy
vault policy write myapp-policy policy.hcl

# List policies
vault policy list

# Read policy
vault policy read myapp-policy

# Delete policy
vault policy delete myapp-policy
```

### Vault Auth Methods

| Method | Description |
|--------|-------------|
| **Token** | Default authentication |
| **GitHub** | Authenticate with GitHub token |
| **LDAP** | Authenticate with LDAP |
| **AppRole** | Machine authentication |
| **Kubernetes** | Authenticate with Kubernetes service account |
| **AWS** | Authenticate with AWS IAM |

### Enable Auth Method

```bash
# Enable GitHub auth
vault auth enable github

# Configure GitHub auth
vault write auth/github/config organization=my-org

# Create role
vault write auth/github/roles/my-role \
  policies="myapp-policy" \
  ttl="1h" \
  max_ttl="24h"

# Login with GitHub
vault login -method=github github-token
```

## Secrets in CI/CD

### GitHub Actions

```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      
      - name: Retrieve secret from AWS Secrets Manager
        run: |
          DB_PASSWORD=$(aws secretsmanager get-secret-value \
            --secret-id myapp/database-password \
            --query SecretString \
            --output text)
          echo "DB_PASSWORD=$DB_PASSWORD" >> $GITHUB_ENV
      
      - name: Deploy
        run: ./deploy.sh
        env:
          DB_PASSWORD: ${{ env.DB_PASSWORD }}
```

### Kubernetes Secrets

```bash
# Create secret from literal
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=my-password

# Create secret from file
kubectl create secret generic db-config \
  --from-file=config.json

# Create secret from env file
kubectl create secret generic env-secret \
  --from-env-file=.env

# Use secret in pod
kubectl run myapp --image=nginx \
  --env=DB_PASSWORD=$(kubectl get secret db-secret -o jsonpath='{.data.password}' | base64 -d)
```

```yaml
# kubernetes-secret.yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
  - name: myapp
    image: nginx
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password
```

### Docker Secrets

```bash
# Create secret
echo "mySecurePassword123" | docker secret create db-password -

# Use secret in service
docker service create \
  --name myapp \
  --secret db-password \
  nginx

# Access secret in container
cat /run/secrets/db-password
```

## Secrets Scanning

### Trivy

```bash
# Scan Git repository for secrets
trivy repo https://github.com/myorg/myrepo

# Scan local directory
trivy fs /path/to/code

# Scan Docker image
trivy image myapp:latest
```

### GitGuardian

```bash
# Scan repository
gitguardian scan /path/to/repo

# Scan file
gitguardian scan file.txt

# Scan commit
gitguardian scan commit HEAD
```

### Git-secrets

```bash
# Install git-secrets
brew install git-secrets

# Configure patterns
git secrets --register-aws
git secrets --add 'password\s*=\s*[A-Za-z0-9_@]+'

# Scan repository
git secrets --scan-history
git secrets --scan
```

## Secrets Rotation

### AWS Secrets Manager Rotation

```bash
# Enable automatic rotation
aws secretsmanager rotate-secret \
  --secret-id myapp/database-password \
  --rotation-lambda-arn arn:aws:lambda:us-east-1:123456789012:function:MyRotationFunction

# Manual rotation
aws secretsmanager rotate-secret \
  --secret-id myapp/database-password
```

### Azure Key Vault Rotation

```bash
# Set rotation policy
az keyvault certificate set-attributes \
  --vault-name my-key-vault \
  --name my-cert \
  --policy auto_rotation_enabled=true
```

### HashiCorp Vault Rotation

```bash
# Rotate database credentials
vault write database/rotate/myapp/database

# Rotate lease
vault lease renew -increment=1h database/creds/myapp/database
```

## Secrets Management Comparison

| Feature | AWS Secrets Manager | Azure Key Vault | HashiCorp Vault |
|---------|---------------------|------------------|------------------|
| **Cloud Native** | Yes | Yes | Yes (optional) |
| **Secret Types** | String, Binary | Secret, Key, Certificate | Dynamic, Static |
| **Automatic Rotation** | Yes | Yes | With plugins |
| **Pricing** | Per secret/month | Per operation | Free (self-hosted) |
| **Access Control** | IAM | RBAC | Policies |
| **Audit Logging** | CloudTrail | Azure Monitor | Built-in |
| **Integration** | AWS Services | Azure Services | Multiple providers |

## Secrets Security Best Practices

1. **Use Secret Managers** - Don't hardcode secrets
2. **Never Commit Secrets** - Use secret scanning
3. **Rotate Regularly** - Automate secret rotation
4. **Use Least Privilege** - Grant minimal access
5. **Encrypt Secrets** - At rest and in transit
6. **Monitor Access** - Audit secret access logs
7. **Use Environment Variables** - Inject at runtime
8. **Separate Environments** - Different secrets per environment
9. **Revoke Compromised Secrets** - Rotate immediately
10. **Document Secret Usage** - Track where secrets are used

## Common Scenarios

### Scenario: Database Credentials

**Approach**: Store in secret manager, inject at runtime

```bash
# AWS Secrets Manager
aws secretsmanager create-secret \
  --name myapp/database \
  --secret-string '{"username":"admin","password":"pass"}'

# Retrieve in application
export DB_CREDS=$(aws secretsmanager get-secret-value \
  --secret-id myapp/database \
  --query SecretString)
```

### Scenario: API Keys

**Approach**: Store in secret manager with rotation

```bash
# Azure Key Vault
az keyvault secret set \
  --vault-name my-key-vault \
  --name api-key \
  --value "myApiKey" \
  --expires "2024-12-31"

# Retrieve in application
API_KEY=$(az keyvault secret show \
  --vault-name my-key-vault \
  --name api-key \
  --query value -o tsv)
```

### Scenario: TLS Certificates

**Approach**: Store in secret manager, auto-renew

```bash
# HashiCorp Vault
vault write pki/issue/example-dot-com \
  common_name="example.com" \
  ttl="24h"

# Retrieve certificate
vault read pki/cert/example-dot-com
```

## Useful Tips

### Debugging Secrets

```bash
# AWS: Check secret rotation status
aws secretsmanager describe-secret --secret-id my-secret

# Azure: Check secret properties
az keyvault secret show --vault-name my-vault --name my-secret --query attributes

# Vault: Check secret metadata
vault kv metadata get kv/my-secret
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Secret not found | Check secret ID/name, permissions |
| Access denied | Verify IAM/RBAC permissions |
| Rotation failed | Check rotation function logs |
| Secret not in environment | Check secret injection, configuration |

### Pricing Considerations

| Service | Free Tier | Paid Pricing |
|----------|-----------|--------------|
| **AWS Secrets Manager** | 10,000 requests/month | $0.40 per 10,000 requests |
| **Azure Key Vault** | 10,000 operations/month | $0.03 per 10,000 operations |
| **HashiCorp Vault** | Free (self-hosted) | Free, Enterprise for features |
