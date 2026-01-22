# Cloud Cost Management

Tools and strategies for monitoring, optimizing, and controlling cloud costs across AWS, Azure, and GCP.

## AWS Cost Management

### AWS Cost Explorer

| COMMAND | DESCRIPTION |
| --- | --- |
| Open Cost Explorer Console | Navigate to **Billing & Cost Management > Cost Explorer** |
| `aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-01-31` | Get cost and usage data |
| `aws ce get-cost-and-usage --granularity MONTHLY --metrics BlendedCost` | Get monthly cost |
| `aws ce get-dimension-values --dimension SERVICE --time-period Start=2024-01-01,End=2024-01-31` | List services with costs |

### AWS Billing Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws ce get-cost-and-usage --filter '{\"Dimensions\":{\"Key\":\"SERVICE\",\"Values\":[\"Amazon EC2\"]}}'` | Filter by service |
| `aws ce get-cost-and-usage --group-by Type,DIMENSION --key SERVICE` | Group by service |
| `aws ce get-cost-and-usage --metrics "UnblendedCost,UsageQuantity"` | Get multiple metrics |

### AWS Budgets

| COMMAND | DESCRIPTION |
| --- | --- |
| Navigate to **Billing & Cost Management > Budgets** | Create and manage budgets |
| `aws budgets create-budget --account-id <account-id> --budget file://budget.json` | Create budget via CLI |
| `aws budgets describe-budgets --account-id <account-id>` | List all budgets |
| `aws budgets describe-budget --account-id <account-id> --budget-name MyBudget` | Describe specific budget |
| `aws budgets delete-budget --account-id <account-id> --budget-name MyBudget` | Delete budget |

### AWS Budget JSON Example

```json
{
  "BudgetName": "MonthlyCostBudget",
  "BudgetLimit": {
    "Amount": "100",
    "Unit": "USD"
  },
  "TimeUnit": "MONTHLY",
  "TimePeriod": {
    "Start": "2024-01-01T00:00:00Z",
    "End": "2024-12-31T23:59:59Z"
  },
  "CostFilters": {},
  "CostTypes": {
    "IncludeTax": false,
    "IncludeSubscription": false,
    "UseBlended": false
  },
  "NotificationWithSubscribers": [
    {
      "Notification": {
        "NotificationType": "ACTUAL",
        "ComparisonOperator": "GREATER_THAN",
        "Threshold": 80,
        "ThresholdType": "PERCENTAGE_OF_BUDGET"
      },
      "Subscribers": [
        {
          "SubscriptionType": "EMAIL",
          "Address": "alerts@example.com"
        }
      ]
    }
  ]
}
```

### AWS Cost Optimization Tools

| Tool | Description |
|------|-------------|
| **AWS Cost Explorer** | Analyze costs and usage trends |
| **AWS Budgets** | Set cost thresholds and alerts |
| **AWS Trusted Advisor** | Cost optimization recommendations |
| **AWS Compute Optimizer** | Optimize EC2 instances |
| **AWS Savings Plans** | Commit to 1-3 years for discounts |
| **Reserved Instances** | Reserve capacity for discounts |
| **Spot Instances** | Up to 90% off EC2 prices |

### AWS Trusted Advisor Cost Checks

| Check | Description |
|-------|-------------|
| **Low Utilization Amazon EC2 Instances** | Identify underutilized EC2 instances |
| **Amazon EBS Provisioned IOPS (SSD) Volumes** | Identify underutilized EBS volumes |
| **Idle Load Balancers** | Identify unused load balancers |
| **Unassociated Elastic IP Addresses** | Identify unused Elastic IPs |
| **Underutilized Amazon RDS Instances** | Identify underutilized RDS instances |

## Azure Cost Management

### Azure Cost Management Portal

| Action | Location |
|---------|----------|
| View costs | **Cost Management + Billing > Cost Management** |
| Set budgets | **Cost Management + Billing > Cost Management > Budgets** |
| View recommendations | **Cost Management + Billing > Cost Management > Recommendations** |
| Export costs | **Cost Management + Billing > Cost Management > Exports** |

### Azure Cost Management Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `az consumption usage list --start-date 2024-01-01 --end-date 2024-01-31` | List usage details |
| `az consumption prices list --meter-id <meter-id>` | Get pricing info |
| `az billing account list` | List billing accounts |
| `az billing subscription list` | List subscriptions |
| `az costmanagement budget create --name MyBudget --amount 100 --category cost` | Create budget |
| `az costmanagement budget list` | List budgets |
| `az costmanagement budget show --name MyBudget` | Show budget details |

### Azure Budget Creation

```bash
az costmanagement budget create \
  --name MonthlyCostBudget \
  --scope /subscriptions/{subscription-id} \
  --amount 100 \
  --currency USD \
  --time-grain Monthly \
  --notification-email alerts@example.com \
  --notification-threshold 80
```

### Azure Cost Analysis

| Metric | Description |
|---------|-------------|
| **Actual Cost** | Total cost incurred |
| **Amortized Cost** | Total cost including amortized upfront fees |
| **Forecasted Cost** | Predicted future costs |
| **Cost Trend** | Cost changes over time |

### Azure Cost Optimization Tools

| Tool | Description |
|------|-------------|
| **Azure Cost Management** | Analyze and manage costs |
| **Azure Budgets** | Set spending limits and alerts |
| **Azure Advisor** | Cost optimization recommendations |
| **Azure Reserved Instances** | Reserve VM instances for discounts |
| **Azure Savings Plans** | Commit to compute usage for discounts |
| **Azure Spot Instances** | Up to 90% off VM prices |

## Google Cloud Cost Management

### GCP Billing Console

| Action | Location |
|---------|----------|
| View costs | **Billing > Reports** |
| Set budgets | **Billing > Budgets & alerts** |
| Export costs | **Billing > Export billing data** |
| Payment setup | **Billing > Payment methods** |

### GCP Billing Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud billing accounts list` | List billing accounts |
| `gcloud billing projects link <project-id> --billing-account <account-id>` | Link project to billing account |
| `gcloud billing budgets create --billing-account <account-id> --display-name "MyBudget" --amount-usd 100` | Create budget |
| `gcloud billing budgets list --billing-account <account-id>` | List budgets |
| `gcloud billing budgets describe <budget-id> --billing-account <account-id>` | Describe budget |

### GCP Cost Analysis

| Metric | Description |
|---------|-------------|
| **Cost** | Actual costs incurred |
| **Credit** | Applied credits and promotions |
| **Forecast** | Predicted future costs |
| **Committed use discounts** | Savings from commitments |

### GCP Cost Optimization Tools

| Tool | Description |
|------|-------------|
| **GCP Billing Reports** | Detailed cost analysis |
| **GCP Budgets** | Set cost alerts and thresholds |
| **GCP Recommendations** | Cost optimization suggestions |
| **Committed Use Discounts** | Commit to 1-3 years for discounts |
| **Sustained Use Discounts** | Automatic discounts for sustained usage |
| **Preemptible Instances** | Up to 80% off compute prices |

## Cost Optimization Strategies

### 1. Right-Size Resources

| Strategy | Description | Savings |
|----------|-------------|---------|
| **Instance Rightsizing** | Use appropriately sized instances | 20-40% |
| **Storage Tiers** | Use appropriate storage class | 30-50% |
| **Remove Idle Resources** | Delete unused resources | 100% |

### 2. Use Savings Plans and Reserved Instances

| Type | Commitment | Discount | Best For |
|------|------------|----------|----------|
| **Compute Savings Plans** | 1-3 years | Up to 72% | Steady EC2/ECS/Lambda usage |
| **Reserved Instances** | 1-3 years | Up to 75% | Long-running EC2 instances |
| **Committed Use Discounts** | 1-3 years | Up to 70% | Steady GCP compute usage |

### 3. Use Spot/Preemptible Instances

| Provider | Product | Discount | Best For |
|----------|---------|----------|----------|
| **AWS** | Spot Instances | Up to 90% | Fault-tolerant workloads |
| **Azure** | Spot VMs | Up to 90% | Batch processing, testing |
| **GCP** | Preemptible Instances | Up to 80% | Batch processing, testing |

**Use Cases**:
- Batch processing jobs
- CI/CD workloads
- Big data processing
- Distributed computing
- Development/testing

### 4. Optimize Storage

| Strategy | Description | Savings |
|----------|-------------|---------|
| **Lifecycle Policies** | Move old data to cheaper storage | 40-60% |
| **Delete Unused Data** | Remove old snapshots, logs | 100% |
| **Use Appropriate Tiers** | Hot, Cool, Archive storage | 20-50% |

**Storage Tiers (AWS)**:
- **Standard**: Frequently accessed
- **Intelligent-Tiering**: Automatic tiering
- **Standard-IA**: Infrequently accessed
- **Glacier**: Long-term archival

### 5. Auto-Scaling

| Strategy | Description |
|----------|-------------|
| **Auto Scaling Groups** | Scale instances based on demand |
| **Kubernetes HPA** | Horizontal pod autoscaling |
| **Serverless Functions** | Pay per execution |
| **Scheduled Scaling** | Scale during business hours |

## Monitoring and Alerting

### Cost Monitoring Dashboards

| Provider | Tool |
|----------|------|
| **AWS** | Cost Explorer, CloudWatch |
| **Azure** | Cost Management, Azure Monitor |
| **GCP** | Billing Reports, Cloud Monitoring |

### Cost Alerts

| Provider | Alert Type | Recommended Threshold |
|----------|------------|----------------------|
| **AWS** | Budget alert | 80% of budget |
| **Azure** | Budget alert | 80% of budget |
| **GCP** | Budget alert | 80% of budget |
| **AWS** | Anomaly detection | >50% increase from baseline |
| **Azure** | Anomaly detection | >50% increase from baseline |

### Cost Anomaly Detection

| Provider | Tool |
|----------|------|
| **AWS** | AWS Cost Anomaly Detection |
| **Azure** | Azure Cost Management Anomaly Detection |
| **GCP** | GCP Budget anomaly alerts |

## Tagging Strategy

### Tagging Best Practices

| Best Practice | Description |
|---------------|-------------|
| **Tag all resources** | Enable cost allocation |
| **Use consistent naming** | Standardize tag keys |
| **Business tags** | Cost center, project, owner |
| **Technical tags** | Environment, application, tier |
| **Mandatory tags** | Enforce via policies |
| **Automated tagging** | Tag on resource creation |

### Common Tags

| Tag | Example | Purpose |
|-----|---------|---------|
| `Environment` | `dev`, `staging`, `prod` | Separate environment costs |
| `Project` | `website`, `api`, `backend` | Project-level cost allocation |
| `CostCenter` | `IT001`, `SALES002` | Business unit cost tracking |
| `Owner` | `devops-team`, `team-a` | Responsibility assignment |
| `Application` | `app-service`, `database` | Application-level tracking |
| `Tier` | `frontend`, `backend`, `data` | Multi-tier cost analysis |

### Tagging Enforcement

| Provider | Tool |
|----------|------|
| **AWS** | AWS Config rules, SCPs |
| **Azure** | Azure Policy |
| **GCP** | Organization policies |

## Cost Analysis Queries

### AWS Cost and Usage Queries

```bash
# Get daily costs by service
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity DAILY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE

# Get costs by tag
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --filter '{\"Tags\":{\"Key\":\"Environment\",\"Values\":[\"prod\"]}}'

# Get forecasted costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-12-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --prediction
```

### Azure Cost Queries

```bash
# Get subscription costs
az consumption usage list \
  --start-date 2024-01-01 \
  --end-date 2024-01-31

# Get cost by resource group
az consumption usage list \
  --start-date 2024-01-01 \
  --end-date 2024-01-31 | jq 'group_by(.properties.resourceGroup)'

# Get budget status
az costmanagement budget list --scope "/subscriptions/{subscription-id}"
```

### GCP Cost Queries

```bash
# Get project costs
bq query \
  --project_id=<billing-project-id> \
  "SELECT
     project.id as project_id,
     invoice.month as month,
     SUM(cost) as total_cost
   FROM `<billing-export-dataset>`
   WHERE invoice.month = '202401'
   GROUP BY project_id, month"

# Get costs by label
bq query \
  --project_id=<billing-project-id> \
  "SELECT
     labels.value as environment,
     SUM(cost) as total_cost
   FROM `<billing-export-dataset>`
   WHERE labels.key = 'environment'
   GROUP BY labels.value"
```

## Common Cost Issues and Solutions

| Issue | Root Cause | Solution |
|-------|------------|----------|
| **Unexpected high costs** | Unoptimized instances | Right-size, use Savings Plans |
| **Data transfer costs** | Cross-region transfers | Use regional resources, CDN |
| **Storage costs growing** | Old data retention | Lifecycle policies, deletion |
| **Idle resources** | Forgotten resources | Automate cleanup, monitoring |
| **Development costs high** | Production configs in dev | Separate environments, tags |

## Cost Management Best Practices

1. **Monitor regularly** - Review costs weekly or monthly
2. **Set budgets** - Create budgets for all projects
3. **Use alerts** - Notify team of cost anomalies
4. **Tag everything** - Enable cost allocation
5. **Review recommendations** - Act on provider suggestions
6. **Use savings plans** - Commit to predictable workloads
7. **Right-size resources** - Match resources to needs
8. **Clean up unused** - Remove idle resources regularly
9. **Automate cost optimization** - Use scripts and tools
10. **Educate team** - Train on cost awareness

## Additional Resources

| Provider | Documentation |
|----------|---------------|
| **AWS Cost Management** | https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ |
| **Azure Cost Management** | https://docs.microsoft.com/azure/cost-management-billing/ |
| **GCP Billing** | https://cloud.google.com/billing/docs |
| **AWS Pricing Calculator** | https://calculator.aws/ |
| **Azure Pricing Calculator** | https://azure.microsoft.com/pricing/calculator/ |
| **GCP Pricing Calculator** | https://cloud.google.com/products/calculator/ |
