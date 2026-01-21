# Terraform

Infrastructure as Code (IaC) tool for building, changing, and versioning infrastructure.

## Basic Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `terraform init` | Initialize working directory |
| `terraform plan` | Show execution plan |
| `terraform apply` | Apply the configuration |
| `terraform destroy` | Destroy infrastructure |
| `terraform fmt` | Format configuration files |
| `terraform validate` | Validate configuration files |
| `terraform show` | Show state or plan |
| `terraform output` | Show output values |

## State Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `terraform state list` | List resources in state |
| `terraform state show <resource>` | Show resource details |
| `terraform state mv <old> <new>` | Move resource in state |
| `terraform state rm <resource>` | Remove from state |
| `terraform refresh` | Refresh state with real resources |
| `terraform import <resource> <id>` | Import existing resource |

## Workspace Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `terraform workspace list` | List workspaces |
| `terraform workspace new <name>` | Create workspace |
| `terraform workspace show` | Show current workspace |
| `terraform workspace select <name>` | Select workspace |

## Useful Flags

| FLAG | DESCRIPTION |
| --- | --- |
| `-out=plan.tfplan` | Save plan to file |
| `-destroy` | Plan for destroy |
| `-refresh=false` | Skip refresh |
| `-target=resource` | Target specific resource |
| `-auto-approve` | Auto-approve apply |
| `-var="key=value"` | Set variable |
| `-var-file=file.tfvars` | Load variables from file |

## HCL Syntax

### Variable Definition
```hcl
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "enable_monitoring" {
  description = "Enable monitoring"
  type        = bool
  default     = true
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}
```

### Resource Definition
```hcl
resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = var.instance_type

  tags = {
    Name        = "Example Instance"
    Environment = var.environment
  }
}
```

### Output Definition
```hcl
output "instance_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.example.public_ip
}

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.example.id
}
```

### Data Sources
```hcl
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  owners = ["099720109477"]
}

data "aws_vpc" "default" {
  default = true
}
```

### Provider Configuration
```hcl
provider "aws" {
  region = "us-east-1"
}

provider "azurerm" {
  features {}
}

provider "google" {
  project = "my-project-id"
  region  = "us-central1"
}
```

## Modules

### Using a Module
```hcl
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = false

  tags = {
    Terraform   = "true"
    Environment = "dev"
  }
}
```

### Creating a Module
```
modules/
└── ec2-instance/
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    └── README.md
```

## Backend Configuration

### S3 Backend
```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

### Remote Backend
```hcl
terraform {
  backend "remote" {
    organization = "my-org"

    workspaces {
      name = "prod-app"
    }
  }
}
```

## Terraform Cloud/Enterprise

| COMMAND | DESCRIPTION |
| --- | --- |
| `terraform login` | Authenticate with Terraform Cloud |
| `terraform cloud workspace list` | List cloud workspaces |
| `terraform cloud workspace show` | Show workspace details |

## Common Patterns

### Conditional Resource
```hcl
resource "aws_instance" "example" {
  count = var.create_instance ? 1 : 0

  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
}
```

### For Loop
```hcl
resource "aws_instance" "example" {
  count = 3

  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  tags = {
    Name = "Instance-${count.index + 1}"
  }
}
```

### For Each
```hcl
resource "aws_instance" "example" {
  for_each = {
    web  = "t3.micro"
    db   = "t3.small"
    cache = "t3.medium"
  }

  ami           = data.aws_ami.ubuntu.id
  instance_type = each.value

  tags = {
    Name = each.key
  }
}
```

### Dynamic Block
```hcl
resource "aws_security_group" "example" {
  name = "example-sg"

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.from_port
      to_port     = ingress.value.to_port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }
}
```

## State Commands

```bash
# Show state in JSON format
terraform show -json > state.json

# Compare state to real infrastructure
terraform plan -refresh-only

# Remove resources from state without destroying
terraform state rm aws_instance.example

# Import existing infrastructure
terraform import aws_instance.example i-0123456789abcdef0
```

## Environment Variables

```bash
# Set AWS credentials
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-1"

# Terraform-specific
export TF_LOG=DEBUG
export TF_LOG_PATH=terraform.log
export TF_VAR_environment=prod
```

## Best Practices

- Use version control for all Terraform code
- Separate environments with workspaces or directories
- Use remote backend with state locking
- Never manually modify infrastructure managed by Terraform
- Use variables for configuration values
- Use outputs to expose important values
- Document your modules with README files
- Use semantic versioning for modules
- Implement proper tagging strategy
- Use `.tfvars` files for environment-specific variables
- Run `terraform plan` before applying
- Review changes carefully

::: tip
Use `terraform fmt -recursive` to format all HCL files in a directory tree.
:::
