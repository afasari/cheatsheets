# Azure Bicep

Infrastructure as Code (IaC) language for Azure that provides a concise syntax, type safety, and support for modules.

## Bicep Basics

### Bicep vs ARM Templates
| Feature | Bicep | ARM Templates |
|---------|--------|--------------|
| Syntax | Concise, readable | Verbose, JSON |
| Modules | Native support | Nested templates |
| Type safety | Built-in | None |
| IntelliSense | Yes | Limited |
| Learning Curve | Easy | Steep |

### Basic Bicep File

```bicep
@description('Location for resources')
param location string = resourceGroup().location

@description('Name of storage account')
param storageAccountName string

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

output storageAccountName string = storageAccount.name
```

## Bicep CLI Commands

### Build Bicep to ARM

| COMMAND | DESCRIPTION |
| --- | --- |
| `bicep build main.bicep` | Compile to ARM JSON |
| `bicep build main.bicep --outfile main.json` | Compile to specific file |
| `bicep build main.bicep --stdout` | Output to stdout |

### Decompile ARM to Bicep

| COMMAND | DESCRIPTION |
| --- | --- |
| `bicep decompile main.json` | Convert ARM to Bicep |
| `bicep decompile main.json --outfile main.bicep` | Convert to specific file |

### Bicep Installation

| COMMAND | DESCRIPTION |
| --- | --- |
| `az bicep install` | Install Bicep CLI |
| `az bicep upgrade` | Upgrade to latest version |
| `az bicep version` | Check Bicep version |
| `az bicep uninstall` | Uninstall Bicep CLI |

### Bicep Linting

| COMMAND | DESCRIPTION |
| --- | --- |
| `bicep lint main.bicep` | Lint Bicep file |
| `bicep build main.bicep --diagnostics-format Sarif` | Build with Sarif output |

## Parameters

### Parameter Types

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text value | `'my-resource'` |
| `int` | Integer | `42` |
| `bool` | Boolean | `true` |
| `array` | Array of values | `['a', 'b', 'c']` |
| `object` | JSON object | `{'key': 'value'}` |
| `secureString` | Encrypted string | `@secure()` |
| `secureObject` | Encrypted object | `@secure()` |

### Parameter Examples

```bicep
@description('Storage account name')
param storageAccountName string

@description('Environment')
@allowed([
  'dev'
  'staging'
  'prod'
])
param environment string = 'dev'

@description('Enable diagnostic settings')
param enableDiagnostic bool = true

@description('Tags')
param tags object = {
  Environment: 'dev'
  Owner: 'DevOps'
}

@description('Admin password')
@secure()
param adminPassword string
```

### Decorators

| Decorator | Description | Example |
|-----------|-------------|---------|
| `@description()` | Parameter description | `@description('Resource name')` |
| `@allowed()` | Allowed values | `@allowed(['a', 'b'])` |
| `@minValue()` | Minimum value | `@minValue(0)` |
| `@maxValue()` | Maximum value | `@maxValue(100)` |
| `@minLength()` | Minimum length | `@minLength(1)` |
| `@maxLength()` | Maximum length | `@maxLength(50)` |
| `@metadata()` | Metadata | `@metadata({key: 'value'})` |
| `@secure()` | Secure value | `@secure()` |

## Variables

### Variable Examples

```bicep
@description('Resource group location')
param location string = resourceGroup().location

@description('Storage account name prefix')
param storageAccountPrefix string = 'stg'

var storageAccountName = '${storageAccountPrefix}${uniqueString(resourceGroup().id)}'

var tags = {
  Environment: 'dev'
  'Created By': 'Bicep'
}

var skuName = 'Standard_LRS'
```

## Resources

### Resource Syntax

```bicep
resource symbolicName 'resourceType@apiVersion' = {
  name: 'resourceName'
  location: resourceGroup().location
  properties: {
    // Resource properties
  }
}
```

### Resource Examples

#### Storage Account

```bicep
@description('Storage account name')
param storageAccountName string

@description('Location')
param location string = resourceGroup().location

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
    tier: 'Standard'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
  }
}
```

#### Virtual Network

```bicep
@description('VPC name')
param vnetName string = 'my-vnet'

@description('Address prefix')
param addressPrefix string = '10.0.0.0/16'

@description('Location')
param location string = resourceGroup().location

resource vnet 'Microsoft.Network/virtualNetworks@2021-03-01' = {
  name: vnetName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        addressPrefix
      ]
    }
    subnets: [
      {
        name: 'default'
        properties: {
          addressPrefix: '10.0.0.0/24'
        }
      }
    ]
  }
}
```

#### Virtual Machine

```bicep
@description('VM name')
param vmName string

@description('VM size')
param vmSize string = 'Standard_B2s'

@description('Admin username')
param adminUsername string = 'azureuser'

@secure()
@description('Admin password')
param adminPassword string

@description('Location')
param location string = resourceGroup().location

resource vm 'Microsoft.Compute/virtualMachines@2021-03-01' = {
  name: vmName
  location: location
  properties: {
    hardwareProfile: {
      vmSize: vmSize
    }
    osProfile: {
      computerName: vmName
      adminUsername: adminUsername
      adminPassword: adminPassword
    }
    storageProfile: {
      imageReference: {
        publisher: 'Canonical'
        offer: 'UbuntuServer'
        sku: '18.04-LTS'
        version: 'latest'
      }
      osDisk: {
        createOption: 'FromImage'
        caching: 'ReadWrite'
        managedDisk: {
          storageAccountType: 'Standard_LRS'
        }
      }
    }
    networkProfile: {
      networkInterfaces: [
        {
          id: nic.id
        }
      ]
    }
  }
}

resource nic 'Microsoft.Network/networkInterfaces@2021-03-01' existing = {
  name: '${vmName}-nic'
}
```

#### App Service

```bicep
@description('App service name')
param appServiceName string

@description('App service plan name')
param appServicePlanName string = 'my-asp'

@description('Location')
param location string = resourceGroup().location

resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'F1'
    tier: 'Free'
    size: 'F1'
    capacity: 1
  }
}

resource appService 'Microsoft.Web/sites@2021-02-01' = {
  name: appServiceName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      appSettings: [
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: 'Production'
        }
      ]
    }
  }
}
```

## Modules

### Module Syntax

```bicep
module moduleName 'path/to/module.bicep' = {
  name: 'deploymentName'
  params: {
    paramName: paramValue
  }
}
```

### Module Example

#### Module File (storage.bicep)

```bicep
@description('Storage account name')
param storageAccountName string

@description('Location')
param location string = resourceGroup().location

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

output storageAccountId string = storageAccount.id
```

#### Main File (main.bicep)

```bicep
@description('Storage account name')
param storageAccountName string

module storage 'modules/storage.bicep' = {
  name: 'storageDeployment'
  params: {
    storageAccountName: storageAccountName
    location: resourceGroup().location
  }
}

output storageId string = storage.outputs.storageAccountId
```

### Modules from Registry

```bicep
module storage 'br/public:avm/res/storage/storage-account:0.9.0' = {
  name: 'storageDeployment'
  params: {
    name: storageAccountName
    location: resourceGroup().location
  }
}
```

## Outputs

### Output Examples

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageAccountName
  location: resourceGroup().location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

output storageAccountId string = storageAccount.id
output storageAccountName string = storageAccount.name
output primaryEndpoint string = storageAccount.properties.primaryEndpoints.web
```

## Loops and Conditionals

### For Loop

```bicep
param location string = resourceGroup().location

param storageNames array = [
  'storage1'
  'storage2'
  'storage3'
]

resource storageAccounts 'Microsoft.Storage/storageAccounts@2021-04-01' = [for name in storageNames: {
  name: name
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}]
```

### Conditional Resources

```bicep
@description('Enable diagnostic settings')
param enableDiagnostic bool = true

resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01' = if (enableDiagnostic) {
  name: 'diagnosticSettings'
  properties: {
    logs: [
      {
        category: 'AuditEvent'
        enabled: true
      }
    ]
  }
}
```

### Conditional with String Comparison

```bicep
@description('Environment')
param environment string = 'dev'

param isProduction bool = environment == 'prod'

resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01' = if (isProduction) {
  name: 'diagnosticSettings'
  properties: {
    logs: [
      {
        category: 'AuditEvent'
        enabled: true
      }
    ]
  }
}
```

## Bicep Functions

| Function | Description | Example |
|----------|-------------|---------|
| `resourceGroup()` | Resource group object | `resourceGroup().location` |
| `subscription()` | Subscription object | `subscription().subscriptionId` |
| `tenant()` | Tenant object | `tenant().tenantId` |
| `deployment()` | Deployment object | `deployment().properties` |
| `uniqueString()` | Create unique string | `uniqueString(resourceGroup().id)` |
| `utcNow()` | Current UTC datetime | `utcNow()` |
| `newGuid()` | Generate GUID | `newGuid()` |
| `concat()` | Concatenate strings | `concat('prefix-', 'suffix')` |
| `toUpper()` | Convert to uppercase | `toUpper('hello')` |
| `toLower()` | Convert to lowercase | `toLower('HELLO')` |
| `contains()` | Check if contains | `contains('hello', 'el')` |
| `split()` | Split string | `split('a,b,c', ',')` |
| `replace()` | Replace substring | `replace('hello', 'l', 'L')` |
| `length()` | Get length | `length('hello')` |
| `take()` | Take first N items | `take([1,2,3], 2)` |
| `skip()` | Skip first N items | `skip([1,2,3], 1)` |

## Deployment Commands

### Deploy Bicep File

| COMMAND | DESCRIPTION |
| --- | --- |
| `az deployment group create --resource-group MyResourceGroup --template-file main.bicep` | Deploy to resource group |
| `az deployment group create --resource-group MyResourceGroup --template-file main.bicep --parameters storageAccountName=mystorage` | Deploy with parameters |
| `az deployment group create --resource-group MyResourceGroup --template-file main.bicep --parameters @params.json` | Deploy with parameter file |
| `az deployment sub create --template-file main.bicep --location eastus` | Deploy to subscription |
| `az deployment mg create --template-file main.bicep --management-group-id MyMG --location eastus` | Deploy to management group |
| `az deployment tenant create --template-file main.bicep --location eastus` | Deploy to tenant |

### What-if Deployment

| COMMAND | DESCRIPTION |
| --- | --- |
| `az deployment group what-if --resource-group MyResourceGroup --template-file main.bicep` | Preview changes |
| `az deployment group what-if --resource-group MyResourceGroup --template-file main.bicep --no-pretty-print` | Preview without formatting |

### Parameter Files (JSON)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "value": "mystorageaccount123"
    },
    "location": {
      "value": "eastus"
    }
  }
}
```

### Deploy with Parameter File

```bash
az deployment group create \
  --resource-group MyResourceGroup \
  --template-file main.bicep \
  --parameters @params.json
```

## Best Practices

1. **Use Parameters** for values that change between deployments
2. **Use Modules** to reuse resources and templates
3. **Use Variables** for computed values and constants
4. **Use Descriptions** to document parameters and resources
5. **Use Decorators** for validation and constraints
6. **Organize Resources** logically in the file
7. **Use Conditionals** for environment-specific resources
8. **Use Loops** to create multiple similar resources
9. **Test Locally** with `bicep build` before deploying
10. **Version Control** your Bicep files
11. **Use What-if** to preview changes before deployment
12. **Use Parameter Files** for environment-specific values

## Useful Tips

### Generate Parameter File

```bash
az deployment group create \
  --resource-group MyResourceGroup \
  --template-file main.bicep \
  --generate-parameters-parameters parameters.json
```

### Export Template from Existing Resource

```bash
az group export \
  --name MyResourceGroup \
  --resource-ids /subscriptions/{id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{name}
```

### List Available Resource Types

```bash
az provider show --namespace Microsoft.Storage --query "resourceTypes[*].resourceType"
```

### Format and Lint

```bash
bicep format main.bicep
bicep lint main.bicep
```

### Use Bicep with CI/CD

```yaml
- name: Deploy Bicep
  run: |
    az deployment group create \
      --resource-group ${{ env.RESOURCE_GROUP }} \
      --template-file infra/main.bicep \
      --parameters @infra/parameters.${{ env.ENVIRONMENT }}.json
```
