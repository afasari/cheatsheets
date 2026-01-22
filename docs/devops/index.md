# DevOps Overview

DevOps combines development (Dev) and operations (Ops) to shorten the development lifecycle and provide continuous delivery with high software quality.

## Core DevOps Practices

### Infrastructure as Code (IaC)
Managing and provisioning infrastructure through machine-readable definition files rather than physical hardware configuration or interactive configuration tools.

**Key Tools**: Terraform, Ansible, CloudFormation, Pulumi

### Containerization
Packaging applications with all their dependencies into standardized units called containers.

**Key Tools**: Docker, Podman, BuildKit

### Container Orchestration
Managing containerized workloads and services, including deployment, scaling, and networking.

**Key Tools**: Kubernetes, Docker Swarm, Nomad

### Continuous Integration/Continuous Deployment (CI/CD)
Automatically building, testing, and deploying code changes to production.

**Key Tools**: GitHub Actions, GitLab CI, Jenkins, ArgoCD

### Monitoring & Observability
Collecting metrics, logs, and traces to understand system behavior and performance.

**Key Tools**: Prometheus, Grafana, ELK Stack, Loki

## Tool Selection Guide

| Category | Tool | When to Use | Best For |
|---------|------|-------------|----------|
| **Container Runtime** | Docker | Standard container platform | Development, small deployments |
| | Podman | Rootless containers needed | Security-focused environments |
| **Orchestration** | Kubernetes | Complex microservices | Large-scale deployments |
| | Docker Compose | Multi-container apps | Development, simple deployments |
| **IaC** | Terraform | Multi-cloud infrastructure | Managing cloud resources |
| | Ansible | Configuration management | Server provisioning |
| | Chef | Configuration management | Infrastructure automation |
| | Puppet | Configuration management | Infrastructure automation |
| **CI/CD** | GitHub Actions | GitHub-based projects | Open source, GitHub workflows |
| | Jenkins | Self-hosted CI/CD | On-premise, custom pipelines |
| | ArgoCD | GitOps workflows | Kubernetes deployments |

## Learning Path

1. **Foundations**
   - Linux command line basics
   - Networking fundamentals
   - Version control with Git

2. **Containerization**
   - Start with Docker for container basics
   - Learn Docker Compose for multi-container apps
   - Understand container networking and volumes

3. **Orchestration**
   - Learn Kubernetes basics (pods, deployments, services)
   - Practice with Helm for package management
   - Understand Kubernetes networking and storage

4. **Infrastructure as Code**
   - Start with Terraform for cloud resources
   - Learn Ansible for server configuration
   - Practice GitOps workflows with ArgoCD

5. **CI/CD**
   - Build simple pipelines with GitHub Actions
   - Learn Jenkins for enterprise workflows
   - Implement GitOps with ArgoCD

6. **Monitoring**
   - Set up Prometheus for metrics collection
   - Create dashboards in Grafana
   - Implement logging with ELK or Loki

## Common Scenarios

### Scenario: Local Development
**Tools**: Docker, Docker Compose
**Use Case**: Running application stack locally with database and caching

### Scenario: Small Team Deployment
**Tools**: Docker, Docker Compose, GitHub Actions
**Use Case**: Deploying to single server or small cloud instance

### Scenario: Large Microservices Architecture
**Tools**: Kubernetes, Helm, ArgoCD, Prometheus, Grafana
**Use Case**: Managing dozens of services across multiple environments

### Scenario: Multi-Cloud Infrastructure
**Tools**: Terraform, Ansible, Jenkins
**Use Case**: Managing resources across AWS, Azure, and GCP

## Key Concepts

### Immutable Infrastructure
Servers are never modified after deployment. New versions are built and deployed, replacing old servers.

### Declarative vs Imperative
- **Declarative**: Define desired state (Terraform, Kubernetes)
- **Imperative**: Define steps to achieve state (Ansible playbooks)

### Blue-Green Deployment
Two identical production environments. Traffic switches between them during deployment.

### Canary Deployment
Gradually roll out new version to small subset of users before full deployment.

### Infrastructure as Code Principles
- Idempotency: Running same code multiple times produces same result
- Reproducibility: Infrastructure can be recreated identically
- Version Control: All infrastructure changes tracked in Git

## Further Reading

- [IaC Concepts](./iac-concepts) - Infrastructure as Code patterns and best practices
- [Containerization Concepts](./containerization-concepts) - Container fundamentals
- [CI/CD Concepts](./cicd-concepts) - Pipeline patterns and workflows
- [Monitoring Concepts](./monitoring-concepts) - Observability and alerting strategies
