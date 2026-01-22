# AWS Overview

Amazon Web Services (AWS) is the world's most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally. This overview helps you understand when to use AWS and how to navigate its extensive service catalog.

## When to Choose AWS

### Ideal Scenarios for AWS

| Scenario | Why AWS | Key Services |
|----------|---------|--------------|
| **Startups** | Broadest service catalog, first-to-market innovation | Lambda, API Gateway, Cognito |
| **Enterprise** | Mature ecosystem, compliance, global presence | AWS Organizations, Config, Security Hub |
| **Machine Learning** | Comprehensive ML/AI services | SageMaker, Bedrock, Rekognition |
| **Data Analytics** | Integrated data lake and analytics services | S3, Redshift, Athena, Glue |
| **Microservices** | Container-first approach, extensive tooling | ECS, EKS, App Runner |

### AWS vs Azure vs GCP

| Feature | AWS | Azure | GCP |
|---------|-----|-------|-----|
| **Market Share** | 32% | 23% | 10% |
| **Strengths** | Service breadth, maturity, innovation | Microsoft integration, hybrid | Data/ML, K8s expertise |
| **Service Catalog** | Largest | Large | Focused |
| **Pricing** | Competitive | Competitive | Competitive |
| **Learning Curve** | Steep | Steep | Moderate |
| **Community** | Largest | Large | Growing |

## AWS Core Services

### Compute Services

| Service | Description | When to Use |
|---------|-------------|-------------|
| **Amazon EC2** | Virtual servers in the cloud | Full OS control, custom instances |
| **AWS Lambda** | Serverless compute functions | Event-driven, sporadic workloads |
| **Amazon ECS** | Container orchestration (Docker) | Containerized applications |
| **Amazon EKS** | Managed Kubernetes | Kubernetes deployments |
| **AWS Fargate** | Serverless containers | Containers without managing infrastructure |
| **AWS Batch** | Batch computing jobs | HPC, batch processing |

### Storage Services

| Service | Description | Use Case |
|---------|-------------|----------|
| **Amazon S3** | Object storage | Files, backups, static websites |
| **Amazon EBS** | Block storage for EC2 | Database storage, OS disks |
| **Amazon EFS** | Network file system | Shared file storage for Lambda/EC2 |
| **Amazon FSx for Windows** | Managed Windows file server | Windows applications |
| **Amazon Glacier** | Long-term archival storage | Compliance, infrequent access |

### Database Services

| Service | Type | When to Use |
|---------|------|-------------|
| **Amazon RDS** | Managed SQL/NoSQL databases | Standard databases (MySQL, PostgreSQL, etc.) |
| **Amazon DynamoDB** | Managed NoSQL key-value | Fast, scalable NoSQL needs |
| **Amazon Aurora** | Cloud-native relational databases | High-performance, scalable SQL |
| **Amazon ElastiCache** | Managed Redis/Memcached | Caching, session storage |
| **Amazon Neptune** | Graph database | Social networks, fraud detection |
| **Amazon Redshift** | Data warehouse | Analytics, business intelligence |
| **Amazon DocumentDB** | MongoDB-compatible | Document-based applications |
| **Amazon QLDB** | Ledger database | Financial transactions, audit trails |

### Networking Services

| Service | Description | Use Case |
|---------|-------------|----------|
| **Amazon VPC** | Isolated network environment | Network segmentation, security |
| **Elastic Load Balancing (ELB)** | Distribute incoming traffic | High availability, scaling |
| **Amazon API Gateway** | Managed API service | REST/HTTP APIs, microservices |
| **AWS CloudFront** | Content Delivery Network (CDN) | Global content delivery, caching |
| **AWS Direct Connect** | Dedicated network connection | Hybrid cloud, consistent performance |
| **AWS Global Accelerator** | Improve application performance | Global traffic routing |

### Security Services

| Service | Description | Use Case |
|---------|-------------|----------|
| **AWS IAM** | Identity and access management | User authentication, authorization |
| **AWS KMS** | Key Management Service | Encryption key management |
| **AWS Secrets Manager** | Secrets and credential management | API keys, database passwords |
| **AWS Shield** | DDoS protection | Attack mitigation |
| **Amazon GuardDuty** | Threat detection | Security monitoring |
| **AWS Config** | Configuration tracking | Compliance, change management |

### Management & Governance

| Service | Description | Use Case |
|---------|-------------|----------|
| **AWS CloudWatch** | Monitoring and observability | Metrics, logs, alerts |
| **AWS CloudTrail** | Audit logging | Compliance, security auditing |
| **AWS Organizations** | Multi-account management | Enterprise governance |
| **AWS Trusted Advisor** | Best practices recommendations | Cost optimization, security |
| **AWS Cost Explorer** | Cost analysis and reporting | Budgeting, cost management |

## AWS Pricing Models

### Instance Purchasing Options

| Option | Description | Savings | Best For |
|--------|-------------|---------|----------|
| **On-Demand** | Pay by second/usage | None | Short-term, unpredictable |
| **Reserved Instances** | 1-3 year commitment | Up to 75% | Steady, predictable workloads |
| **Savings Plans** | Compute usage commitment | Up to 72% | Flexible, consistent usage |
| **Spot Instances** | Unused capacity | Up to 90% | Fault-tolerant, flexible workloads |

### Storage Pricing Tiers (S3)
- **Standard**: Frequent access
- **Intelligent-Tiering**: Automatic cost optimization
- **Standard-IA**: Infrequent access (lower cost, retrieval fee)
- **One Zone-IA**: Single AZ, infrequent access
- **Glacier**: Long-term archival (lowest cost, retrieval time)

### Cost Management
- **AWS Budgets**: Set spending limits and alerts
- **AWS Cost Explorer**: Analyze costs and trends
- **AWS Cost Anomaly Detection**: Detect unusual spending
- **Trusted Advisor**: Optimization recommendations

## AWS Architecture Patterns

### Web Application Pattern
Frontend + backend + database on AWS.

**Components**:
- Route 53 (DNS)
- CloudFront (CDN)
- Application Load Balancer
- EC2 or ECS (application servers)
- RDS or DynamoDB (database)
- ElastiCache (caching)

### Serverless Pattern
Event-driven, fully managed architecture.

**Components**:
- API Gateway (API endpoints)
- Lambda (business logic)
- DynamoDB (database)
- S3 (storage)
- CloudWatch (monitoring)

### Microservices Pattern
Independent, containerized services.

**Components**:
- EKS or ECS (orchestration)
- ECR (container registry)
- Application Load Balancer
- Service discovery (Cloud Map)
- X-Ray (tracing)

### Event-Driven Pattern
Loosely coupled, event-based communication.

**Components**:
- SNS (pub/sub messaging)
- SQS (message queuing)
- EventBridge (event bus)
- Lambda (event handlers)

## AWS Security Best Practices

### Identity and Access Management (IAM)
- Follow least privilege principle
- Use IAM roles for applications
- Enable MFA for root account and IAM users
- Rotate access keys regularly
- Use IAM policies for fine-grained access

### Network Security
- Use VPC with private subnets
- Implement security groups and NACLs
- Use bastion hosts for SSH access
- Enable VPC flow logs
- Use AWS WAF for web application firewall

### Data Security
- Encrypt data at rest and in transit
- Use AWS KMS for key management
- Enable S3 bucket policies and ACLs
- Use AWS Shield for DDoS protection
- Enable CloudTrail for audit logging

### Compliance
- Use AWS Config for compliance monitoring
- Enable Security Hub for centralized security
- Use AWS Artifact for compliance reports
- Implement AWS Control Tower for governance

## Common Scenarios

### Scenario: Migrating On-Premise Application to AWS
**Approach**: Lift-and-shift using EC2
**Services**: EC2, RDS, EBS, AWS Backup, Direct Connect
**Benefits**: Reduce infrastructure overhead, improve availability, scale on demand

### Scenario: Building Serverless Web Application
**Approach**: Fully managed, event-driven architecture
**Services**: API Gateway, Lambda, DynamoDB, Cognito, CloudFront
**Benefits**: No server management, auto-scaling, pay-per-use

### Scenario: Big Data Analytics Platform
**Approach**: Data lake and analytics services
**Services**: S3, Glue, Athena, Redshift, QuickSight
**Benefits**: Scalable data storage, SQL analytics, business intelligence

### Scenario: Containerized Microservices
**Approach**: Kubernetes-based container orchestration
**Services**: EKS, ECR, Fargate, Application Load Balancer, X-Ray
**Benefits**: Portable applications, auto-scaling, improved deployment

## AWS Management Tools

### AWS Console
Web-based management interface.

**When to Use**:
- Quick tasks and visual management
- Resource creation and configuration
- Monitoring and dashboards

### AWS CLI
Command-line interface for AWS.

**When to Use**:
- Automation and scripting
- DevOps pipelines
- Managing multiple accounts

### AWS SDKs
Language-specific SDKs for AWS services.

**Languages**:
- Python (boto3), JavaScript/TypeScript
- Java, Go, C#, Ruby, PHP

**When to Use**:
- Building applications that use AWS
- Custom automation tools
- Programmatic access to AWS

## Getting Started with AWS

### Learning Path
1. **AWS Fundamentals**: Learn core services and concepts
2. **AWS CLI**: Master command-line management
3. **Compute and Storage**: EC2, S3, Lambda
4. **Networking and Security**: VPC, IAM, Security Groups
5. **Databases**: RDS, DynamoDB
6. **Advanced Topics**: Serverless, containers, machine learning

### First Steps
1. Create AWS account (free tier available)
2. Create IAM user with limited permissions
3. Set up AWS CLI configuration
4. Deploy first EC2 instance
5. Explore AWS Console and CLI

### AWS CLI Quick Start
```bash
# Configure AWS CLI
aws configure

# Create EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --count 1 \
  --instance-type t2.micro \
  --key-name my-key-pair \
  --security-group-ids sg-903004f8 \
  --subnet-id subnet-6e7f829e

# List S3 buckets
aws s3 ls

# Create S3 bucket
aws s3 mb s3://my-unique-bucket-name
```

## AWS Services Covered

- **[AWS CLI](./aws-cli)** - AWS CLI commands and usage
- **[Amazon S3](./aws-s3)** - Object storage
- **[Amazon EC2](./aws-ec2)** - Elastic compute
- **[AWS Lambda](./aws-lambda)** - Serverless functions
- **[AWS IAM](./aws-iam)** - Identity and access management
- **[Amazon CloudWatch](./cloudwatch-alerting)** - Monitoring and alerting
- **[AWS CloudFormation](./cloudformation)** - Infrastructure as Code (IaC)

## Further Reading

- [AWS Services](https://aws.amazon.com/products/) - Full AWS service catalog
- [AWS Documentation](https://docs.aws.amazon.com/) - Official AWS documentation
- [AWS Architecture Center](https://aws.amazon.com/architecture/) - Architecture patterns and best practices
- [AWS Training](https://aws.amazon.com/training/) - AWS certifications and training
