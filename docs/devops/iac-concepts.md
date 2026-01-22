# IaC Concepts & Patterns

## What is IaC?

Infrastructure as Code (IaC) is the practice of managing and provisioning infrastructure through code instead of manual processes. It treats infrastructure as software code, enabling version control, reproducibility, and consistency.

## Core Principles

### Declarative vs Imperative
```yaml
# Declarative (IaC) - What, not how
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  tags = {
    Name = "WebServer"
  Environment = "Production"
  }
}

# Imperative (Manual) - How
# 1. Open AWS Console
# 2. Navigate to EC2
# 3. Click "Launch Instance"
# 4. Select AMI, instance type, tags
# 5. Configure security groups
# 6. Configure key pairs
# 7. Launch
```

### Idempotency
```yaml
# Idempotent - Safe to run multiple times
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
}

# Run multiple times - creates only once
terraform apply  # Creates instance
terraform apply  # Checks, instance already exists, no-op
```

### Desired State Configuration
```yaml
# Define desired state, not steps to get there
resource "aws_lb_target_group" "web" {
  port     = 80
  protocol = "HTTP"

  target_group {
    arn = aws_lb_target_group.web.id
  }
}
# IaC ensures load balancer exists with this configuration
```

## Common Patterns

### Multi-Environment Configuration
```yaml
# dev.tf
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

resource "aws_instance" "web" {
  instance_type = var.environment == "prod" ? "t3.micro" : "t3.nano"
}
```

```bash
# Apply with different environments
terraform apply -var="environment=dev"
terraform apply -var="environment=prod"
```

### Module Reuse
```yaml
# modules/web-server/main.tf
variable "instance_type" {
  type = string
}

resource "aws_instance" "web" {
  instance_type = var.instance_type
}

# dev/main.tf - Reuse module
module "web" {
  source = "../modules/web-server"
  instance_type = "t3.nano"
}

# prod/main.tf - Reuse module
module "web" {
  source = "../modules/web-server"
  instance_type = "t3.micro"
}
```

### State Isolation
```bash
# Separate state files per environment
terraform init -state=tfstate-dev -backend-config=backend-dev
terraform apply -state=tfstate-dev

terraform init -state=tfstate-prod -backend-config=backend-prod
terraform apply -state=tfstate-prod
```

## Best Practices

### 1. Version Control
```bash
# All infrastructure in git
git init
git add .
git commit -m "Initial IaC configuration"
git push origin main
```

### 2. Modularize
```yaml
# Organize by function
# main.tf
module "networking" { source = "./modules/networking" }
module "database" { source = "./modules/database" }
module "application" { source = "./modules/application" }
```

### 3. Use Variables
```yaml
# variables.tf
variable "region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region"
}

variable "instance_type" {
  type        = string
  default     = "t3.micro"
}

# Use in main.tf
provider "aws" {
  region = var.region
}
```

### 4. Document Changes
```yaml
# Add description to resources
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  tags = {
    Name        = "WebServer"
    Environment  = var.environment
    ManagedBy    = "Terraform"
  }
}
```

### 5. Test Locally
```bash
# Test before applying to prod
terraform plan
terraform validate
terraform fmt

# Use test environments
terraform apply -auto-approve -var="environment=test"
```

## IaC Tools Comparison

| Tool | Language | Clouds | Use Case |
|-------|----------|---------|
| Terraform | HCL | All | Most popular, best documentation |
| CloudFormation | JSON/YAML | AWS | AWS-native, limited to AWS |
| Bicep | Bicep | Azure | Azure modern, better than JSON |
| Pulumi | Python/Go/TS | All | Good for developers, stateful |
| AWS CDK | TypeScript | AWS | AWS CDK, native TypeScript |
| Troposphere | HCL | AWS | Higher-level abstraction |
| CDK for Terraform | TypeScript | HashiCorp | IaC as software patterns |

## Common IaC Commands

```bash
# Terraform
terraform init                    # Initialize working directory
terraform plan                     # Show execution plan
terraform apply                     # Apply changes
terraform destroy                   # Destroy resources
terraform output                     # Show outputs
terraform import                    # Import existing resources

# AWS CDK
cdk synth                       # Synthesize CloudFormation
cdk deploy                       # Deploy stack
cdk destroy                     # Destroy stack

# Pulumi
pulumi up                         # Deploy changes
pulumi destroy                    # Destroy resources
pulumi stack                     # List stacks
```

## Resource Lifecycle

### Create
```bash
# Only create if not exists
terraform apply
# Terraform checks state and creates resource
```

### Update
```bash
# Modify definition and apply
terraform apply
# Updates existing resources to new configuration
```

### Delete
```bash
# Remove from configuration
terraform destroy
# Removes all resources in state
```

## State Management

### State File
```bash
# View state
terraform show

# Refresh state (update from actual)
terraform refresh

# Move resource in state
terraform state mv aws_instance.web_old aws_instance.web

# Remove resource from state
terraform state rm aws_instance.web
```

### State Backends
```yaml
# Remote state (S3)
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

# Local state (default)
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}
```

## Security Best Practices

### 1. No Secrets in Code
```yaml
# BAD - Don't do this
resource "aws_instance" "web" {
  password = "MyS3cr3tP@ssw0rd!"  # ❌ Never commit secrets
}

# GOOD - Use variables
variable "db_password" {
  type      = string
  sensitive = true
}

resource "aws_db_instance" "db" {
  password = var.db_password
}
```

### 2. Least Privilege
```yaml
# Use specific IAM roles
resource "aws_iam_role" "terraform_role" {
  name = "terraform-ec2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ec2:DescribeInstances"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}
```

### 3. Network Isolation
```yaml
# Separate environments
# dev state
terraform {
  backend "s3" {
    bucket = "terraform-state-dev"
    key    = "dev/terraform.tfstate"
  }
}

# prod state
terraform {
  backend "s3" {
    bucket = "terraform-state-prod"
    key    = "prod/terraform.tfstate"
  }
}
```

## IaC Anti-Patterns

### 1. Hardcoded Values
```yaml
# BAD - Hardcoded
resource "aws_instance" "web" {
  instance_type = "t3.micro"  # ❌ Can't change per environment
}

# GOOD - Variable
variable "instance_type" {
  type        = string
  default     = "t3.micro"
}

resource "aws_instance" "web" {
  instance_type = var.instance_type  # ✅ Flexible
}
```

### 2. Monolithic State
```yaml
# BAD - Everything in one state
terraform {
  backend "s3" {
    key = "everything.tfstate"  # ❌ Too big, slow
  }
}

# GOOD - Separate modules
terraform {
  backend "s3" {
    key = "networking.tfstate"    # ✅ Small, fast
  }
}
```

### 3. No Documentation
```yaml
# Resource without description
resource "aws_instance" "web" {
  ami = "ami-0c55b159cbfafe1f0"  # ❌ Unclear purpose
}

# With documentation
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  tags = {
    Name        = "Web Server"
    Environment = "Production"  # ✅ Documented
  }
}
```

## GitOps with IaC

### Workflow
```yaml
# 1. Open PR for changes
# 2. Automated plan check (terraform plan)
# 3. Automated apply on merge
# 4. State validation (terraform validate)
# 5. Automated destruction if needed (terraform destroy)
```

### Pull Request Template
```markdown
## Proposed Changes
- Add new database instance
- Update instance type to t3.micro

## Plan Output
```bash
$ terraform plan

Terraform will perform the following actions:

+ aws_instance.web
    ami:           "ami-0c55b159cbfafe1f0"
    instance_type:  "t3.nano"
    instance_type: "t3.micro"

Plan: 1 to add, 0 to change, 1 to destroy.
```

## Validation
```bash
# Validate syntax
terraform fmt -check
terraform validate

# Check state consistency
terraform show

# List resources in state
terraform state list
```

## IaC vs Manual Comparison

| Aspect | IaC | Manual |
|---------|------|--------|
| Speed | Minutes | Hours |
| Consistency | 100% | Variable |
| Reproducibility | Yes | No |
| Version Control | Yes | No |
| Error Prone | Low | High |
| Documentation | Code | Tribal knowledge |
| Cost | Predictable | Unpredictable |
