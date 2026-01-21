# Terraform Cloud

Infrastructure as Code platform for collaborative infrastructure management.

## Authentication

| COMMAND | DESCRIPTION |
| --- | --- |
| `terraform login` | Login to Terraform Cloud |
| `export TF_API_TOKEN=xxx` | Set API token |
| `terraform logout` | Logout from Terraform Cloud |

## Workspaces

| COMMAND | DESCRIPTION |
| --- | --- |
| `tfe workspaces list` | List all workspaces |
| `tfe workspaces show <workspace-id>` | Show workspace details |
| `tfe workspaces create --name myworkspace --organization myorg` | Create workspace |
| `tfe workspaces delete <workspace-id>` | Delete workspace |
| `tfe workspaces lock <workspace-id>` | Lock workspace |
| `tfe workspaces unlock <workspace-id>` | Unlock workspace |

## Organization

| COMMAND | DESCRIPTION |
| --- | --- |
| `tfe organizations list` | List organizations |
| `tfe organizations show <organization-name>` | Show organization details |
| `tfe organizations create-membership --email user@example.com --organization myorg` | Add member |

## Variables

| COMMAND | DESCRIPTION |
| --- | --- |
| `tfe variables list --workspace <workspace-id>` | List variables |
| `tfe variables create --workspace <workspace-id> --key AWS_ACCESS_KEY_ID --value xxx --sensitive` | Create variable |
| `tfe variables update <variable-id> --value newvalue` | Update variable |
| `tfe variables delete <variable-id>` | Delete variable |

### Environment Variables
| COMMAND | DESCRIPTION |
| --- | --- |
| `tfe workspace-variables set-sensitive <workspace-id> TF_VAR_db_password securepassword` | Set sensitive variable |
| `tfe workspace-variables set-terraform <workspace-id> TF_VERSION 1.5.0` | Set Terraform version |

## Runs

| COMMAND | DESCRIPTION |
| --- | --- |
| `tfe runs list --workspace <workspace-id>` | List runs |
| `tfe runs show <run-id>` | Show run details |
| `tfe runs apply <run-id>` | Apply run |
| `tfe runs discard <run-id>` | Discard run |
| `tfe runs cancel <run-id>` | Cancel run |
| `tfe runs watch <run-id>` | Watch run progress |

## State

| COMMAND | DESCRIPTION |
| --- | --- |
| `tfe state-versions list --workspace <workspace-id>` | List state versions |
| `tfe state-versions show <state-version-id>` | Show state version |
| `tfe state-versions download <workspace-id> --output state.json` | Download state |
| `tfe state-versions rollback <workspace-id> --state-version <version-id>` | Rollback state |

## Configuration

### Remote Backend
```hcl
terraform {
  cloud {
    organization = "my-org"
    workspaces {
      name = "my-workspace"
    }
  }
}
```

### Multiple Workspaces
```hcl
terraform {
  cloud {
    organization = "my-org"
    workspaces {
      tags = ["production", "app"]
    }
  }
}
```

## Terraform Cloud Agents

| COMMAND | DESCRIPTION |
| --- | --- |
| `tfe agents list --pool <pool-id>` | List agents |
| `tfe agents show <agent-id>` | Show agent details |

## Sentinel Policies

| COMMAND | DESCRIPTION |
| --- | --- |
| `tfe policy-sets list --organization myorg` | List policy sets |
| `tfe policies list --policy-set <policy-set-id>` | List policies |
| `tfe policy-checks list --run <run-id>` | List policy checks |

## Cost Estimation

| COMMAND | DESCRIPTION |
| --- | --- |
| `tfe cost-estimation show --run <run-id>` | Show cost estimation |

## VCS Integration

| COMMAND | DESCRIPTION |
| --- | --- |
| `tfe oauth-tokens list` | List OAuth tokens |
| `tfe oauth-clients list` | List OAuth clients |

## Teams & Access

| COMMAND | DESCRIPTION |
| --- | --- |
| `tfe teams list --organization myorg` | List teams |
| `tfe team-access list --workspace <workspace-id>` | List team access |
| `tfe team-access add --workspace <workspace-id> --team <team-id> --role admin` | Add team access |

## CLI Configuration

```bash
# Configure Terraform Cloud
cat > ~/.terraformrc <<EOF
credentials "app.terraform.io" {
  token = "your-api-token"
}
EOF
```

## Terraform Cloud API

### Get Workspace Variables
```bash
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  https://app.terraform.io/api/v2/workspaces/$WORKSPACE_ID/vars
```

### Trigger Run via API
```bash
curl \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data '{"data":{"type":"runs","attributes":{"message":"API triggered run"}}}' \
  https://app.terraform.io/api/v2/workspaces/$WORKSPACE_ID/runs
```

## Terraform Cloud Features

### Run Tasks
```hcl
terraform {
  cloud {
    organization = "my-org"
    workspaces {
      name = "my-workspace"
    }
  }
}

resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  # Run tasks can validate resources before apply
}
```

### Policy Checks
```hcl
# Sentinel policy example
import "tfplan/v2" as tfplan
import "tfconfig/v2" as tfconfig

# Enforce tagging
all_resources = tfplan.resource_changes

main = rule {
  length(all_resources) > 0
  all(all_resources as _, r {
    r.change.after.tags is not null
  })
}
```

## Best Practices

- Use separate workspaces for different environments (dev, staging, prod)
- Tag resources for organization and cost tracking
- Use sensitive variables for secrets
- Implement workspace locking to prevent concurrent runs
- Use Sentinel policies for governance
- Enable cost estimation for runs
- Use VCS integration for automatic triggers
- Review and approve changes via pull requests
- Use workspace-level variables for environment-specific values
- Monitor runs and notifications
- Implement proper IAM roles for teams
- Use agent pools for private network resources

## Troubleshooting

### Check Workspace Status
```bash
terraform workspace show
```

### Refresh State
```bash
terraform refresh
```

### Import Existing Resources
```bash
terraform import aws_instance.example i-0123456789abcdef0
```

### Force Unlock Workspace
```bash
tfe workspaces unlock <workspace-id> --force
```

### Debug Mode
```bash
TF_LOG=DEBUG terraform apply
```

::: tip
Use Terraform Cloud's VCS integration to automatically trigger runs on git commits for a smooth CI/CD workflow.
:::
