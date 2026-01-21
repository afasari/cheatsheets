# Azure CLI

Command line interface for Microsoft Azure.

## Authentication

| COMMAND | DESCRIPTION |
| --- | --- |
| `az login` | Login to Azure |
| `az logout` | Logout from Azure |
| `az account list` | List all accounts |
| `az account show` | Show current account |
| `az account set --subscription <id>` | Set active subscription |

## Resource Groups

| COMMAND | DESCRIPTION |
| --- | --- |
| `az group list` | List resource groups |
| `az group create --name myrg --location eastus` | Create resource group |
| `az group show --name myrg` | Show resource group details |
| `az group delete --name myrg` | Delete resource group |

## Virtual Machines (VM)

| COMMAND | DESCRIPTION |
| --- | --- |
| `az vm list` | List all VMs |
| `az vm create --resource-group myrg --name myvm --image UbuntuLTS` | Create VM |
| `az vm start --resource-group myrg --name myvm` | Start VM |
| `az vm stop --resource-group myrg --name myvm` | Stop VM |
| `az vm restart --resource-group myrg --name myvm` | Restart VM |
| `az vm delete --resource-group myrg --name myvm` | Delete VM |
| `az vm show --resource-group myrg --name myvm` | Show VM details |
| `az vm list-ip-addresses --resource-group myrg --name myvm` | List IP addresses |
| `az vm open-port --resource-group myrg --name myvm --port 80` | Open port |

## Storage Accounts

| COMMAND | DESCRIPTION |
| --- | --- |
| `az storage account list` | List storage accounts |
| `az storage account create --name mystorage --resource-group myrg` | Create storage account |
| `az storage account show-connection-string --name mystorage` | Show connection string |
| `az storage account delete --name mystorage --resource-group myrg` | Delete storage account |

### Blob Storage
| COMMAND | DESCRIPTION |
| --- | --- |
| `az storage container list --account-name mystorage` | List containers |
| `az storage container create --name mycontainer --account-name mystorage` | Create container |
| `az storage blob list --container-name mycontainer --account-name mystorage` | List blobs |
| `az storage blob upload --container-name mycontainer --name myfile --account-name mystorage` | Upload blob |
| `az storage blob download --container-name mycontainer --name myfile --file localfile` | Download blob |

## App Service (Web Apps)

| COMMAND | DESCRIPTION |
| --- | --- |
| `az webapp list` | List web apps |
| `az webapp create --resource-group myrg --name myapp --plan myplan` | Create web app |
| `az webapp up --name myapp --resource-group myrg` | Deploy to web app |
| `az webapp show --name myapp --resource-group myrg` | Show web app details |
| `az webapp log tail --name myapp --resource-group myrg` | Tail web app logs |
| `az webapp stop --name myapp --resource-group myrg` | Stop web app |

## SQL Database

| COMMAND | DESCRIPTION |
| --- | --- |
| `az sql server list` | List SQL servers |
| `az sql server create --name myserver --resource-group myrg` | Create SQL server |
| `az sql db list --server myserver --resource-group myrg` | List databases |
| `az sql db create --name mydb --server myserver --resource-group myrg` | Create database |
| `az sql db show --name mydb --server myserver --resource-group myrg` | Show database details |

## Cosmos DB

| COMMAND | DESCRIPTION |
| --- | --- |
| `az cosmosdb list` | List Cosmos DB accounts |
| `az cosmosdb create --name mycosmos --resource-group myrg` | Create Cosmos DB account |
| `az cosmosdb show --name mycosmos --resource-group myrg` | Show Cosmos DB details |

## Key Vault

| COMMAND | DESCRIPTION |
| --- | --- |
| `az keyvault list` | List key vaults |
| `az keyvault create --name myvault --resource-group myrg` | Create key vault |
| `az keyvault secret set --vault-name myvault --name mysecret --value myvalue` | Set secret |
| `az keyvault secret show --vault-name myvault --name mysecret` | Show secret |
| `az keyvault secret list --vault-name myvault` | List secrets |

## Network

| COMMAND | DESCRIPTION |
| --- | --- |
| `az network vnet list` | List virtual networks |
| `az network vnet create --name myvnet --resource-group myrg --address-prefixes 10.0.0.0/16` | Create VNet |
| `az network subnet list --vnet-name myvnet --resource-group myrg` | List subnets |
| `az network nsg list` | List network security groups |
| `az network nsg create --name mynsg --resource-group myrg` | Create NSG |
| `az network public-ip list` | List public IP addresses |
| `az network public-ip create --name myip --resource-group myrg` | Create public IP |

## AKS (Azure Kubernetes Service)

| COMMAND | DESCRIPTION |
| --- | --- |
| `az aks list` | List AKS clusters |
| `az aks create --name myaks --resource-group myrg --node-count 3` | Create AKS cluster |
| `az aks get-credentials --name myaks --resource-group myrg` | Get cluster credentials |
| `az aks scale --name myaks --resource-group myrg --node-count 5` | Scale cluster |
| `az aks browse --name myaks --resource-group myrg` | Open cluster dashboard |

## Container Registry

| COMMAND | DESCRIPTION |
| --- | --- |
| `az acr list` | List container registries |
| `az acr create --name myregistry --resource-group myrg --sku Basic` | Create registry |
| `az acr login --name myregistry` | Login to registry |
| `az acr build --registry myregistry --image myimage .` | Build and push image |

## Functions

| COMMAND | DESCRIPTION |
| --- | --- |
| `az functionapp list` | List function apps |
| `az functionapp create --name myfunc --resource-group myrg --consumption-plan-location eastus` | Create function app |
| `az functionapp show --name myfunc --resource-group myrg` | Show function app details |

## Monitoring

| COMMAND | DESCRIPTION |
| --- | --- |
| `az monitor metrics list --resource /subscriptions/.../resourceGroups/myrg/providers/Microsoft.Compute/virtualMachines/myvm` | List metrics |
| `az monitor activity-log list` | List activity logs |
| `az monitor diagnostic-settings list` | List diagnostic settings |

## Useful Queries

### Get VM public IP
```bash
az vm list-ip-addresses --resource-group myrg --name myvm \
  --query "[0].virtualMachine.network.publicIpAddresses[0].ipAddress" \
  --output tsv
```

### List all resources in resource group
```bash
az resource list --resource-group myrg
```

### Get storage account keys
```bash
az storage account keys list \
  --resource-group myrg \
  --account-name mystorage \
  --query '[0].value' \
  --output tsv
```

### List all running VMs
```bash
az vm list --query "[?powerState=='VM running']" --output table
```

### Get web app URL
```bash
az webapp show --name myapp --resource-group myrg \
  --query "defaultHostName" \
  --output tsv
```

## Best Practices

- Use resource groups to organize related resources
- Always specify resource groups for clarity
- Use output formats (json, table, tsv) for better readability
- Enable tags for cost tracking and organization
- Use Azure CLI configuration files for complex deployments
- Use `--query` to filter and format output
- Set up monitoring and alerts for critical resources
- Use managed identities for service-to-service authentication
- Regularly review and clean up unused resources
- Use Azure Policy to enforce organizational standards

::: tip
Use `--output json` and `--query` together to filter and format JSON output easily.
:::
