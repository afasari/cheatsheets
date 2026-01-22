# Azure DevOps

## Overview

Azure DevOps is Microsoft's cloud-native DevOps platform that provides integrated services for building, deploying, and managing applications across Azure.

## Key Services

### Azure Pipelines
```yaml
# Azure DevOps (classic)
trigger:
- master
steps:
- script: |
    azure pipelines build --name $(Build) --definition build.yml
    azure pipelines run --name 'Deploy to Prod' --trigger manual --definition deploy.yml
```

```yaml
# GitHub Actions with Azure
name: Deploy to Azure
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - uses: azure/webapps-deploy@v4
        with:
          app-name: myapp
          publish-profile: my-ProductionProfile
          images: 'myapp:*'
          package: ./package.zip
```

```yaml
# Azure DevOps
trigger:
  branches: [main]
stages:
  - stage: Build
    jobs: build
      steps:
      - script: dotnet build -c Release
  - stage: Deploy
    jobs: deploy_prod:
      runs-on: [ 'windows-latest' ]
      steps:
      - task: AzureWebApp@1
        inputs:
          app: myapp
          environment: Production
        displayName: Deploy to Azure Web App
      - task: AzureSqlDatabase@1
        inputs:
          environment: Production
        displayName: Deploy SQL Database
```

## Container Services

### Azure Container Instances
```bash
# Create container instance
az container create \
  --resource-group my-rg \
  --name mycontainer \
  --image nginx:alpine \
  --cpu 1 \
  --memory 512 \
  --ports 80

# List containers
az container list \
  --resource-group my-rg

# Show container logs
az container logs \
  --resource-group myrg \
  --name mycontainer \
  --follow true
```

### Azure Container Registry (ACR)

```bash
# Login to registry
az acr login \
  --name myregistry.azurecr.io

# List repositories
az acr repository list \
  --name myregistry.azurecr.io

# Tag and push image
docker tag myapp:latest myregistry.azurecr.io/myapp
docker push myregistry.azurecr.io/myapp
```

### Kubernetes (AKS)

```bash
# Get AKS credentials
az aks get-credentials \
  --resource-group my-rg \
  --file aks-credentials.json

# Create AKS cluster
az aks create \
  --resource-group my-rg \
  --name myaks \
  --node-count 3 \
  --node-vm-size Standard_D2s_v2 \
  --enable-cluster-autoscaler

# Get cluster credentials
az aks get-credentials \
  --resource-group my-rg \
  --file aks-credentials.json

# Scale cluster
az aks scale \
  --resource-group myrg \
  --name myaks \
  --node-count 5
  --node-count 5
```

## Infrastructure as Code

### Bicep

```bash
# Install Bicep
az bicep install

# Validate Bicep template
az bicep build \
  --file main.bicep \
  --outdir ./compiled

# Deploy infrastructure
az deployment group create \
  --template-file main.bicep \
  --resource-group my-rg

# Clean up
az deployment group delete \
  --name my-deployment \
  --resource-group myrg
```

### Terraform on Azure

```bash
# Configure Azure provider
terraform init

# Initialize backend
terraform init \
  -backend-config backend.tf \
  -backend-config azurerm \
    storage_account_name mystorageaccount

# Deploy
terraform apply -auto-approve

# Destroy
terraform destroy
```

## Application Services

### Azure Web Apps

```bash
# Create web app
az webapp up \
  --name mywebapp \
  --resource-group myrg \
  --plan my-webapp.plan

# Deploy to slot
az webapp up \
  --name mywebapp \
  --slot staging \
  --resource-group my-rg

# Swap slots
az webapp up \
  --name mywebapp \
  --swap \
  --resource-group myrg \
  --slot production production \
  --slot-name production \
  --target-slot staging

# Scale instances
az webapp up \
  --name mywebapp \
  --instance-count 5 \
  --resource-group myrg
```

### Azure Functions

```bash
# Create function
az function create \
  --name myfunction \
  --resource-group myrg \
  --functions-python \
  --functions-path ./functions

# Deploy function
az functionapp publish \
  --name myfunction \
  --resource-group myrg \
  --source myfunction.zip

# List functions
az functionapp list \
  --resource-group myrg

# Invoke function
az functionapp invoke \
  --name myfunction \
  --resource-group myrg
  --functions-path ./functions \
  --function-name myfunction
  --data '{"name":"Test"}'

# Scale function
az functionapp scale \
  --name myfunction \
  --resource-group myrg \
  --functions-path ./functions \
  --max-instances 10
```

### Azure Logic Apps

```bash
# Create logic app
az logicapp create \
  --name mylogicapp \
  --resource-group myrg \
  --functions-path ./functions

# Deploy workflow
az logicapp workflow create \
  --name myworkflow \
  --resource-group myrg \
  --workflow-file workflow.json
```

## Monitoring & Observability

### Azure Monitor
```bash
# Enable metrics collection
az monitor metrics enable \
  --resource-group my-rg \
  --output-path azure-metrics.json

# List available metrics
az monitor metrics list \
  --resource-group myrg

# Query metrics
az monitor metrics show \
  --resource-group myrg \
  --metrics container-app myapp
```

### Application Insights
```bash
# Enable app insights
az monitor app-insights enable \
  --resource-group myrg

# View metrics
az monitor app-insights show \
  --resource-group myrg \
  --app myapp \
  --interval PT1M

# Custom metrics
az monitor metrics show \
  --resource-group myrg \
  --metrics container-app myapp \
  --interval PT1M \
  --aggregation-type ""

# View diagnostics
az monitor app-insights show \
  --resource-group myrg \
  --app myapp
  --diagnostics \
  --events true
```

### Log Analytics

```bash
# Create Log Analytics workspace
az monitor log-analytics create \
  --resource-group my-logs \
  --workspace-name my-logs \
  --location eastus

# Query logs
az monitor log-analytics query \
  --resource-group my-logs \
  --workspace-name my-logs \
  --query "* where TimeGeneratedTime >= ago(1h)"

# Export logs
az monitor log-analytics export \
  --resource-group my-logs \
  --workspace-name my-logs \
  --output-path logs.csv
```

## Storage

### Azure Blob Storage

```bash
# Create container
az storage container create \
  --name mystorage \
  --resource-group myrg \
  --public-access false

# Upload file
az storage blob upload \
  --container-name mystorage \
  --name myfile.txt \
  --source ./myfile.txt \
  --auth-mode login

# Download file
az storage blob download \
  --container-name mystorage \
  --name myfile.txt \
  --destination ./myfile.txt

# List containers
az storage container list \
  --resource-group myrg
```

### Azure Files Shares

```bash
# Create share
az share create \
  --name myshare \
  --resource-group myrg \
  --path /myshare \
  --quota 5

# Grant access
az share access grant --share-name myshare \
  --permission Read

# Set quota
az share update \
  --share-name myshare \
  --quota 10G
```

### Azure SQL Database

```bash
# Create SQL database
az sql up \
  --server-name mysqlserver \
  --resource-group my-rg \
  --location eastus2 \
  -admin-user adminuser \
  --database-name mydb \
  --sku-name GP_Gen5_2

# List databases
az sql server list \
  --resource-group my-rg

# Execute query
az sql execute \
  --server-name mysqlserver \
  --resource-group my-rg \
  --database-name mydb \
  --query 'SELECT * FROM users'

# Show database details
az sql db show \
  --server-name mysqlserver \
  --resource-group myrg \
  --database-name mydb
```

## Virtual Machines

### Azure VMs

```bash
# Create VM
az vm create \
  --resource-group myrg \
  --name myvm \
  --size Standard_B2s_v2 \
  --admin-username azureuser \
  --authentication-type password

# List VMs
az vm list \
  --resource-group myrg

# Start VM
az vm start \
  --resource-group myrg \
  --name myvm

# Stop VM
az vm stop \
  --resource-group myrg \
  --name myvm

# Resize VM
az vm resize \
  --resource-group myrg \
  --name myvm \
  --size Standard_B2s_v4

# Delete VM
az vm delete \
  --resource-group myrg \
  --name myvm
```

### Scale Sets

```bash
# Create scale set
az vmss create \
  --resource-group myrg \
  --name myscaleset \
  --location eastus2 \
  --size 2

# Scale VM in scale set
az vmss resize \
  --resource-group myrg \
  --name myscaleset \
  --new-capacity 4

# Delete scale set
az vmss delete \
  --resource-group myrg \
  --name myscaleset
```

## Security & Identity

### Azure Active Directory

```bash
# Create user
az ad user create \
  --display-name "My User" \
  --user-name user001 \
  --password Pass@ord123
  --force-change-password

# Create group
az ad group create \
  --display-name "My Group" \
  --group-name MyGroup

# Add user to group
az ad group member add \
  --group-name MyGroup \
  --member-name user001

# List users in group
az ad group member list \
  --group-name MyGroup

# Enable MFA
az ad user update \
  --id user001 \
  --enable-mfa true

# Assign role
az role assignment create \
  --role MyRole \
  --scope /subscriptions/{sub-id}/resourceGroups/MyGroup \
  --assignee user001

# List role assignments
az role assignment list \
  --scope /subscriptions/{sub-id}/resourceGroups/MyGroup
```

### RBAC

```bash
# Create role definition
az role definition create \
  --name MyReadOnlyRole \
  --permissions '["Microsoft.Storage/storage/accounts/readwrite"]'
  --assignable yes

# Assign role to user
az role assignment create \
  --scope /subscriptions/{sub-id}/resourceGroups/MyGroup \
  --role MyReadOnlyRole \
  --assignee user001

# List role assignments
az role assignment list \
  --scope /subscriptions/{sub-id}/resourceGroups/MyGroup \
  --role MyReadOnlyRole \
  --assignee user001
```

## Azure CLI Reference

### Core Commands
```bash
# Login
az login

# Account management
az account show
az account list

# Resource groups
az group list
az group create

# Set subscription
az account set \
  --subscription my-subscription-id

# Location management
az account show-locations

# VM management
az vm list
az vm create
az vm start
az vm stop

# Container management
az container create
az container start
az aks create
```

### Best Practices

1. Use resource groups for organizing
2. Tag all resources
3. Use Azure Policy for governance
4. Enable diagnostic settings
5. Monitor costs regularly
6. Use Azure CLI scripts for automation
