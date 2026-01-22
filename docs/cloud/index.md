# Cloud Platform Overview

Cloud platforms provide on-demand computing resources over the internet with pay-as-you-go pricing models. This section covers major cloud providers and when to choose each one.

## Major Cloud Providers

| Provider | Market Share | Strengths | Best For |
|----------|--------------|------------|----------|
| **AWS** | 32% | Largest service portfolio, mature ecosystem | Enterprise, startups, innovation-first |
| **Azure** | 23% | Microsoft integration, hybrid cloud | Enterprise, Microsoft shops, hybrid |
| **GCP** | 10% | Data/AI focus, Kubernetes expertise | Data-intensive, ML workloads |

## When to Use Which Platform

### Choose AWS When
- You need the most mature and comprehensive service catalog
- Your team has AWS expertise
- You want access to cutting-edge features (first to market)
- You need extensive third-party integrations

### Choose Azure When
- You're already using Microsoft technologies (Active Directory, Office 365)
- You need strong hybrid cloud capabilities
- Your organization has Enterprise Agreements with Microsoft
- You need Windows-based workloads

### Choose GCP When
- Your workload is data-intensive or ML-focused
- You're building Kubernetes-first applications
- You need BigQuery for analytics
- Your team prefers open-source tools

## Cloud Services Overview

### Compute Services
| Service Type | AWS | Azure | GCP | Use Case |
|--------------|-----|-------|-----|----------|
| **VMs** | EC2 | Virtual Machines | Compute Engine | Traditional workloads |
| **Serverless** | Lambda | Functions | Cloud Functions | Event-driven apps |
| **Containers** | EKS/ECS | AKS | GKE | Container orchestration |

### Storage Services
| Service Type | AWS | Azure | GCP | Use Case |
|--------------|-----|-------|-----|----------|
| **Object Storage** | S3 | Blob Storage | Cloud Storage | Files, backups |
| **Block Storage** | EBS | Disk | Persistent Disk | Database storage |
| **File Storage** | EFS | Files | Filestore | Shared file systems |

### Database Services
| Service Type | AWS | Azure | GCP | Use Case |
|--------------|-----|-------|-----|----------|
| **Managed SQL** | RDS | SQL Database | Cloud SQL | Relational databases |
| **NoSQL** | DynamoDB | Cosmos DB | Firestore | Key-value/document |
| **Caching** | ElastiCache | Cache for Redis | Memorystore | Session storage |

### Networking Services
| Service Type | AWS | Azure | GCP | Use Case |
|--------------|-----|-------|-----|----------|
| **VPC** | VPC | VNet | VPC | Network isolation |
| **Load Balancer** | ELB | Load Balancer | Cloud Load Balancing | Traffic distribution |
| **CDN** | CloudFront | CDN | Cloud CDN | Content delivery |

## Cloud Networking Fundamentals

### Virtual Private Cloud (VPC)
Isolated network environment in the cloud where you can deploy resources.

**Key Components**:
- **Subnets**: IP address ranges within VPC
- **Route Tables**: Define network traffic routing
- **Security Groups**: Firewall rules for instances
- **NAT Gateways**: Enable private instances to access internet

### Cloud Deployment Models

| Model | Description | Example |
|-------|-------------|---------|
| **Public Cloud** | Resources owned by cloud provider, shared infrastructure | AWS, Azure, GCP |
| **Private Cloud** | Dedicated resources, single organization | On-premise data center |
| **Hybrid Cloud** | Combination of public and private cloud | Azure Stack, AWS Outposts |

## Cost Management

### Pricing Models
- **On-Demand**: Pay as you go (highest cost, most flexibility)
- **Reserved**: Commit to 1-3 years (50-75% discount)
- **Spot**: Unused capacity (up to 90% discount, can be interrupted)

### Cost Optimization Tips
1. Use reserved instances for steady workloads
2. Auto-scale resources based on demand
3. Clean up unused resources
4. Choose the right storage class for data lifecycle
5. Monitor costs with cloud-native tools

## Multi-Cloud Strategies

### When to Use Multi-Cloud
- Avoid vendor lock-in
- Meet regional compliance requirements
- Leverage best services from each provider
- Disaster recovery across providers

### Challenges
- Complexity increases significantly
- Requires skills in multiple platforms
- Data transfer costs between clouds
- Different APIs and tooling

### Multi-Cloud Tools
- **Terraform**: IaC across multiple providers
- **Kubernetes**: Consistent runtime across clouds
- **Consul**: Service discovery across environments

## Getting Started Guides

- [Cloud Networking](./cloud-networking) - Network design and implementation
- [Cost Management](./cost-management) - Cloud cost optimization and monitoring
- [AWS](./aws/) - AWS services and CLI
- [Azure](./azure/) - Azure services and CLI
- [Google Cloud](./gcp) - GCP services and CLI
- [Terraform Cloud](./terraform-cloud) - Terraform-managed infrastructure
