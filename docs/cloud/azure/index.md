# Azure Overview

Microsoft Azure is a cloud computing platform providing a wide range of cloud services including computing, analytics, storage, and networking. This overview helps you understand when to use Azure and how it compares to other cloud providers.

## When to Choose Azure

### Ideal Scenarios for Azure

| Scenario | Why Azure | Key Services |
|----------|-----------|--------------|
| **Microsoft Stack** | Seamless integration with Windows, Active Directory, Office 365 | Azure AD, Azure DevOps, Power BI |
| **Enterprise** | Enterprise-grade security, compliance, support | Azure Sentinel, Azure Policy, Azure Security Center |
| **Hybrid Cloud** | Strong hybrid capabilities, Azure Stack | Azure Arc, Azure Stack Hub |
| **Windows Workloads** | Best support for Windows applications | Azure VMs, Azure App Service |
| **Big Data & Analytics** | Integrated analytics services | Azure Synapse, Power BI, Azure Data Lake |

### Azure vs AWS vs GCP

| Feature | Azure | AWS | GCP |
|---------|-------|-----|-----|
| **Market Share** | 23% | 32% | 10% |
| **Strengths** | Microsoft integration, hybrid | Service breadth, maturity | Data/ML focus |
| **Windows Support** | Excellent | Good | Limited |
| **Hybrid Cloud** | Best | Good | Basic |
| **Pricing** | Competitive | Competitive | Competitive |
| **Learning Curve** | Steeper for non-MS users | Steep | Moderate |

## Azure Core Services

### Compute Services

| Service | Description | When to Use |
|---------|-------------|-------------|
| **Azure Virtual Machines** | IaaS virtual machines | Legacy apps, full OS control |
| **Azure App Service** | Managed web applications | Web apps, APIs, mobile backends |
| **Azure Functions** | Serverless compute | Event-driven, sporadic workloads |
| **Azure Container Instances** | Containerized applications | Short-lived containers |
| **Azure Kubernetes Service (AKS)** | Managed Kubernetes | Container orchestration, microservices |
| **Azure Batch** | Large-scale parallel jobs | HPC, batch processing |

### Storage Services

| Service | Description | Use Case |
|---------|-------------|----------|
| **Azure Blob Storage** | Object storage for unstructured data | Images, videos, backups, logs |
| **Azure Files** | Managed file shares | SMB file shares, lift-and-shift |
| **Azure Disk Storage** | Block storage for VMs | Database storage, OS disks |
| **Azure Queue Storage** | Message queuing | Decoupling components |
| **Azure Table Storage** | NoSQL key-value store | Simple NoSQL requirements |

### Database Services

| Service | Type | When to Use |
|---------|------|-------------|
| **Azure SQL Database** | Managed SQL Server | SQL applications, familiar SQL Server |
| **Azure Cosmos DB** | Multi-model NoSQL | Global, low-latency apps |
| **Azure Database for PostgreSQL** | Managed PostgreSQL | Open-source SQL, PostgreSQL apps |
| **Azure Database for MySQL** | Managed MySQL | Open-source SQL, MySQL apps |
| **Azure Cache for Redis** | Managed Redis | Caching, session storage |
| **Azure Synapse Analytics** | Data warehouse | Analytics, data warehousing |

### Networking Services

| Service | Description | Use Case |
|---------|-------------|----------|
| **Azure Virtual Network (VNet)** | Isolated network environment | Network segmentation, security |
| **Azure Load Balancer** | Layer 4 load balancing | TCP/UDP traffic distribution |
| **Application Gateway** | Layer 7 load balancing | HTTP/HTTPS routing, SSL termination |
| **Azure Front Door** | Global CDN and load balancer | Global traffic distribution |
| **Azure DNS** | DNS hosting | Domain name resolution |
| **Azure VPN Gateway** | Site-to-site and point-to-site VPN | Hybrid connectivity |

### Security & Identity

| Service | Description | Use Case |
|---------|-------------|----------|
| **Azure Active Directory (Entra ID)** | Identity and access management | User authentication, SSO |
| **Azure Key Vault** | Secrets and key management | Certificate, key, secret storage |
| **Azure Defender** | Cloud security posture management | Threat detection, security monitoring |
| **Azure Sentinel** | SIEM/SOAR | Security monitoring, incident response |
| **Azure Policy** | Policy enforcement | Compliance, resource governance |

## Azure Management Tools

### Azure Portal
Web-based management interface.

**When to Use**:
- Quick tasks and visual management
- Resource creation and configuration
- Monitoring and dashboards

### Azure CLI
Command-line interface for Azure.

**When to Use**:
- Automation and scripting
- DevOps pipelines
- Managing multiple subscriptions

### Azure PowerShell
PowerShell cmdlets for Azure management.

**When to Use**:
- Windows environments
- Existing PowerShell scripts
- Complex Azure management

### Azure SDKs
Language-specific SDKs for Azure services.

**Languages**:
- Python, JavaScript/TypeScript
- Java, Go, C#, Ruby

**When to Use**:
- Building applications that use Azure
- Custom automation tools
- Programmatic access to Azure

## Azure Architecture Patterns

### Web Application Pattern
Frontend + backend + database on Azure.

**Components**:
- Azure App Service (frontend)
- Azure App Service or Azure Functions (backend)
- Azure SQL Database or Cosmos DB (database)
- Application Gateway (load balancing)

### Microservices Pattern
Multiple independent services.

**Components**:
- Azure Kubernetes Service (AKS)
- Azure Container Registry (container images)
- Azure API Management (API gateway)
- Azure Service Bus (messaging)

### Event-Driven Pattern
Trigger-based processing.

**Components**:
- Azure Event Grid (event routing)
- Azure Functions (event handlers)
- Azure Storage (event data)
- Azure Service Bus (message queuing)

### Hybrid Cloud Pattern
Connect on-premise to Azure.

**Components**:
- Azure ExpressRoute (dedicated connection)
- Azure Arc (manage on-premise resources)
- Azure VPN Gateway (VPN connection)
- Azure Stack Hub (on-premise Azure)

## Azure Pricing Models

### Pricing Tiers

| Tier | Description | Best For |
|------|-------------|----------|
| **Free Tier** | Limited free services | Learning, testing, small projects |
| **Pay-As-You-Go** | Pay for what you use | Variable workloads, flexibility |
| **Reserved Instances** | 1-3 year commitment | Predictable workloads (savings up to 72%) |
| **Spot Instances** | Unused capacity at discount | Batch jobs, fault-tolerant workloads |

### Cost Management
- **Azure Cost Management**: Monitor and optimize costs
- **Budgets and Alerts**: Set spending limits
- **Azure Advisor**: Cost optimization recommendations
- **Azure Pricing Calculator**: Estimate costs before deployment

## Azure Security Best Practices

### Identity and Access
- Use Azure AD for authentication
- Implement multi-factor authentication (MFA)
- Use role-based access control (RBAC)
- Regularly review access permissions

### Network Security
- Use Azure Network Security Groups (NSGs)
- Implement Azure Firewall
- Use Application Gateway WAF
- Enable DDoS Protection Standard

### Data Security
- Encrypt data at rest and in transit
- Use Azure Key Vault for secrets
- Enable Azure Defender for databases
- Implement data classification and labeling

### Compliance
- Azure Policy for governance
- Azure Blueprints for repeatable deployments
- Monitor compliance with Azure Security Center
- Regular security audits

## Common Scenarios

### Scenario: Migrating Windows Application to Azure
**Approach**: Lift-and-shift using Azure VMs
**Services**: Azure VMs, Azure SQL Database, Azure Backup
**Benefits**: Reduce maintenance, improve availability, scale on demand

### Scenario: Building Modern Web Application
**Approach**: Serverless and PaaS services
**Services**: Azure App Service, Azure Functions, Cosmos DB, Application Gateway
**Benefits**: No infrastructure management, auto-scaling, pay-per-use

### Scenario: Big Data Analytics Platform
**Approach**: Data lake and analytics services
**Services**: Azure Data Lake Storage, Azure Synapse Analytics, Power BI, Azure Databricks
**Benefits**: Scalable data processing, advanced analytics, rich visualization

### Scenario: Hybrid Cloud Environment
**Approach**: Connect on-premise to Azure
**Services**: Azure ExpressRoute, Azure Arc, Azure VPN Gateway, Azure Active Directory
**Benefits**: Extend on-premise to cloud, consistent management, hybrid workloads

## Getting Started with Azure

### Learning Path
1. **Azure Fundamentals**: Learn core services and concepts
2. **Azure CLI**: Master command-line management
3. **Azure Architecture**: Understand design patterns and best practices
4. **Security & Compliance**: Implement security controls
5. **Advanced Topics**: AI/ML, IoT, blockchain

### First Steps
1. Create Azure account (free tier available)
2. Create first resource group
3. Deploy simple web app
4. Explore Azure Portal and CLI
5. Learn Azure pricing and cost management

### Azure CLI Quick Start
```bash
# Login
az login

# Create resource group
az group create --name myResourceGroup --location eastus

# Create virtual machine
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image Ubuntu2204 \
  --admin-username azureuser \
  --generate-ssh-keys
```

## Further Reading

- [Azure CLI](./azure.md) - Azure CLI commands and usage
- [Azure Bicep](./bicep.md) - Azure Infrastructure as Code (IaC)
- [Azure Services](https://azure.microsoft.com/services/) - Full Azure service catalog
- [Azure Documentation](https://docs.microsoft.com/azure/) - Official Azure documentation
- [Azure Architecture Center](https://docs.microsoft.com/azure/architecture/) - Architecture patterns and best practices
