# AWS CLI

Command line interface for Amazon Web Services.

## Configuration

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws configure` | Interactive configuration |
| `aws configure --profile profilename` | Configure named profile |
| `aws configure list` | List current configuration |
| `aws configure set region us-east-1` | Set default region |

## EC2 (Elastic Compute Cloud)

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws ec2 describe-instances` | List all EC2 instances |
| `aws ec2 run-instances --image-id ami-xxx --count 1` | Launch EC2 instance |
| `aws ec2 start-instances --instance-ids i-xxx` | Start instance |
| `aws ec2 stop-instances --instance-ids i-xxx` | Stop instance |
| `aws ec2 terminate-instances --instance-ids i-xxx` | Terminate instance |
| `aws ec2 describe-instances --instance-id i-xxx` | Get instance details |
| `aws ec2 create-key-pair --key-name mykey` | Create SSH key pair |
| `aws ec2 create-security-group --name mysg` | Create security group |

## S3 (Simple Storage Service)

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws s3 ls` | List all buckets |
| `aws s3 ls s3://bucketname` | List objects in bucket |
| `aws s3 mb s3://bucketname` | Create bucket |
| `aws s3 rb s3://bucketname` | Delete bucket |
| `aws s3 cp file.txt s3://bucketname/` | Upload file |
| `aws s3 cp s3://bucketname/file.txt .` | Download file |
| `aws s3 sync ./dir s3://bucketname/dir` | Sync directory |
| `aws s3 rm s3://bucketname/file.txt` | Delete object |
| `aws s3api put-bucket-versioning --bucket name --versioning-configuration Status=Enabled` | Enable versioning |

## IAM (Identity and Access Management)

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws iam list-users` | List IAM users |
| `aws iam create-user --user-name username` | Create user |
| `aws iam delete-user --user-name username` | Delete user |
| `aws iam list-roles` | List IAM roles |
| `aws iam get-role --role-name rolename` | Get role details |
| `aws iam create-access-key --user-name username` | Create access key |
| `aws iam list-access-keys --user-name username` | List access keys |
| `aws iam attach-user-policy --user-name user --policy-arn arn` | Attach policy to user |

## Lambda

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws lambda list-functions` | List Lambda functions |
| `aws lambda invoke response.json --function-name myfunc` | Invoke function |
| `aws lambda get-function --function-name myfunc` | Get function details |
| `aws lambda update-function-code --function-name myfunc --zip-file fileb://deployment.zip` | Update function code |
| `aws logs tail /aws/lambda/myfunc --follow` | Tail Lambda logs |

## RDS (Relational Database Service)

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws rds describe-db-instances` | List DB instances |
| `aws rds create-db-instance --db-instance-identifier mydb --db-instance-class db.t3.micro` | Create DB instance |
| `aws rds start-db-instance --db-instance-identifier mydb` | Start DB instance |
| `aws rds stop-db-instance --db-instance-identifier mydb` | Stop DB instance |
| `aws rds delete-db-instance --db-instance-identifier mydb --skip-final-snapshot` | Delete DB instance |

## CloudWatch

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws cloudwatch list-metrics` | List all metrics |
| `aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization` | Get metric statistics |
| `aws logs describe-log-groups` | List log groups |
| `aws logs tail /aws/lambda/myfunc --follow` | Tail log group |
| `aws logs filter-log-events --log-group-name /aws/lambda/myfunc` | Get log events |

## CloudFormation

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws cloudformation list-stacks` | List all stacks |
| `aws cloudformation create-stack --stack-name mystack --template-body file://template.yaml` | Create stack |
| `aws cloudformation update-stack --stack-name mystack --template-body file://template.yaml` | Update stack |
| `aws cloudformation delete-stack --stack-name mystack` | Delete stack |
| `aws cloudformation describe-stack-events --stack-name mystack` | Get stack events |
| `aws cloudformation describe-stack-resources --stack-name mystack` | List stack resources |

## VPC (Virtual Private Cloud)

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws ec2 describe-vpcs` | List VPCs |
| `aws ec2 create-vpc --cidr-block 10.0.0.0/16` | Create VPC |
| `aws ec2 describe-subnets` | List subnets |
| `aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24` | Create subnet |
| `aws ec2 describe-route-tables` | List route tables |
| `aws ec2 create-internet-gateway` | Create internet gateway |

## ECR (Elastic Container Registry)

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws ecr describe-repositories` | List ECR repositories |
| `aws ecr create-repository --repository-name myrepo` | Create repository |
| `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin acct-id.dkr.ecr.us-east-1.amazonaws.com` | Login to ECR |
| `docker push acct-id.dkr.ecr.us-east-1.amazonaws.com/myrepo:tag` | Push image |

## ECS (Elastic Container Service)

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws ecs list-clusters` | List ECS clusters |
| `aws ecs create-cluster --cluster-name mycluster` | Create cluster |
| `aws ecs list-tasks --cluster mycluster` | List tasks in cluster |
| `aws ecs list-services --cluster mycluster` | List services |
| `aws ecs update-service --cluster mycluster --service myservice --desired-count 3` | Scale service |

## Common Queries

### Filter EC2 instances by tag
```bash
aws ec2 describe-instances \
  --filters "Name=tag:Environment,Values=Production"
```

### Get public IP of instance
```bash
aws ec2 describe-instances \
  --instance-ids i-xxx \
  --query "Reservations[0].Instances[0].PublicIpAddress" \
  --output text
```

### List S3 objects with size
```bash
aws s3api list-objects-v2 \
  --bucket mybucket \
  --query 'Contents[].{Key:Key,Size:Size}'
```

### Get Lambda function size
```bash
aws lambda get-function \
  --function-name myfunc \
  --query 'Code.Location'
```

### List IAM policies attached to user
```bash
aws iam list-attached-user-policies \
  --user-name username
```

## Best Practices

- Use IAM roles instead of access keys when possible
- Enable MFA for root account and IAM users
- Use AWS CLI profiles for multiple accounts
- Set default region to avoid specifying it in every command
- Use `--query` to filter output and get specific data
- Enable versioning on important S3 buckets
- Use S3 lifecycle policies to manage object retention
- Tag resources for cost allocation and organization
- Use AWS CloudTrail to audit API calls
- Enable encryption for sensitive data

::: tip
Use the `--dry-run` flag to test commands without making actual changes.
:::
