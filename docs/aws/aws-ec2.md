# AWS EC2 Cheatsheet

## Essential Commands

```bash
# List instances
aws ec2 describe-instances

# Describe specific instance
aws ec2 describe-instances --instance-ids i-1234567890abcdef0

# Start instance
aws ec2 start-instances --instance-ids i-1234567890abcdef0

# Stop instance
aws ec2 stop-instances --instance-ids i-1234567890abcdef0

# Reboot instance
aws ec2 reboot-instances --instance-ids i-1234567890abcdef0

# Terminate instance
aws ec2 terminate-instances --instance-ids i-1234567890abcdef0

# Get instance state
aws ec2 describe-instance-status --instance-ids i-1234567890abcdef0
```

## Instance Management

```bash
# Create instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --count 1 \
  --instance-type t2.micro \
  --key-name my-key-pair \
  --security-group-ids sg-903004f8 \
  --subnet-id subnet-6e7f829e

# Create with user data
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --user-data file://user-data.sh

# Create with tags
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --tag-specifications \
  'ResourceType=instance,Tags=[{Key=Name,Value=my-instance}]'
```

## Key Pairs

```bash
# Create key pair
aws ec2 create-key-pair --key-name my-key-pair --query 'KeyMaterial' --output text > my-key-pair.pem

# List key pairs
aws ec2 describe-key-pairs

# Delete key pair
aws ec2 delete-key-pair --key-name my-key-pair

# Import key pair
aws ec2 import-key-pair \
  --key-name imported-key \
  --public-key-material fileb://~/.ssh/id_rsa.pub
```

## Security Groups

```bash
# Create security group
aws ec2 create-security-group \
  --group-name my-sg \
  --description "My security group"

# Add inbound rule
aws ec2 authorize-security-group-ingress \
  --group-id sg-903004f8 \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

# Add outbound rule
aws ec2 authorize-security-group-egress \
  --group-id sg-903004f8 \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# List security groups
aws ec2 describe-security-groups

# Delete security group
aws ec2 delete-security-group --group-id sg-903004f8

# Revoke rule
aws ec2 revoke-security-group-ingress \
  --group-id sg-903004f8 \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0
```

## AMI Management

```bash
# Create AMI from instance
aws ec2 create-image \
  --instance-id i-1234567890abcdef0 \
  --name "my-ami" \
  --description "My custom AMI"

# List AMIs
aws ec2 describe-images --owners self

# Describe specific AMI
aws ec2 describe-images --image-ids ami-0c55b159cbfafe1f0

# Deregister AMI
aws ec2 deregister-image --image-id ami-0c55b159cbfafe1f0

# Copy AMI to another region
aws ec2 copy-image \
  --source-region us-east-1 \
  --source-image-id ami-0c55b159cbfafe1f0 \
  --name my-copied-ami \
  --region us-west-2
```

## Volumes and Snapshots

```bash
# Create volume
aws ec2 create-volume \
  --size 20 \
  --availability-zone us-east-1a \
  --volume-type gp3

# List volumes
aws ec2 describe-volumes

# Attach volume
aws ec2 attach-volume \
  --volume-id vol-1234567890abcdef0 \
  --instance-id i-1234567890abcdef0 \
  --device /dev/sdf

# Detach volume
aws ec2 detach-volume --volume-id vol-1234567890abcdef0

# Delete volume
aws ec2 delete-volume --volume-id vol-1234567890abcdef0

# Create snapshot
aws ec2 create-snapshot \
  --volume-id vol-1234567890abcdef0 \
  --description "My snapshot"

# List snapshots
aws ec2 describe-snapshots --owner-ids self

# Delete snapshot
aws ec2 delete-snapshot --snapshot-id snap-1234567890abcdef0
```

## Elastic IPs

```bash
# Allocate Elastic IP
aws ec2 allocate-address

# Associate with instance
aws ec2 associate-address \
  --instance-id i-1234567890abcdef0 \
  --allocation-id eipalloc-1234567890abcdef0

# Disassociate
aws ec2 disassociate-association-id \
  --association-id eipassoc-1234567890abcdef0

# Release Elastic IP
aws ec2 release-address --allocation-id eipalloc-1234567890abcdef0
```

## Instance Types

```bash
# List instance types
aws ec2 describe-instance-types

# List specific type
aws ec2 describe-instance-types \
  --instance-types t2.micro,m5.large

# List available instance types
aws ec2 describe-instance-type-offerings \
  --location-type region \
  --filters Name=location,Values=us-east-1
```

## Auto Scaling

```bash
# Create launch template
aws ec2 create-launch-template \
  --launch-template-name my-template \
  --launch-template-data file://template.json

# Create auto scaling group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name my-asg \
  --launch-template LaunchTemplateId=lt-1234567890abcdef0 \
  --min-size 1 \
  --max-size 10 \
  --desired-capacity 2 \
  --vpc-zone-identifier subnet-12345,subnet-67890

# Set scaling policy
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name my-asg \
  --policy-name scale-up \
  --scaling-adjustment 1 \
  --adjustment-type ChangeInCapacity

# List ASGs
aws autoscaling describe-auto-scaling-groups

# Update desired capacity
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name my-asg \
  --desired-capacity 5
```

## EC2 User Data Scripts

```bash
#!/bin/bash
# user-data.sh

# Update system
yum update -y

# Install software
yum install -y nginx docker

# Start services
systemctl start nginx
systemctl enable nginx

# Clone repository
git clone https://github.com/user/repo.git /var/www/app

# Run Docker
docker run -d -p 80:80 myapp

# Send signal to CloudFormation
cfn-signal -e $? \
  --stack my-stack \
  --resource WebServer \
  --region us-east-1
```

## Instance Metadata

```bash
# Get instance ID
curl http://169.254.169.254/latest/meta-data/instance-id

# Get local IP
curl http://169.254.169.254/latest/meta-data/local-ipv4

# Get public IP
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Get availability zone
curl http://169.254.169.254/latest/meta-data/placement/availability-zone

# Get instance type
curl http://169.254.169.254/latest/meta-data/instance-type

# Get IAM role credentials
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Get all metadata
curl http://169.254.169.254/latest/meta-data/
```

## Spot Instances

```bash
# Request spot instance
aws ec2 request-spot-instances \
  --spot-price 0.05 \
  --instance-count 1 \
  --launch-specification file://spot-spec.json

# List spot requests
aws ec2 describe-spot-instance-requests

# Cancel spot request
aws ec2 cancel-spot-instance-requests \
  --spot-instance-request-ids sir-1234567890abcdef0

# Get spot price history
aws ec2 describe-spot-price-history \
  --instance-types m5.large \
  --product-descriptions "Linux/UNIX" \
  --availability-zones us-east-1a
```

## Monitoring

```bash
# Enable detailed monitoring
aws ec2 monitor-instances \
  --instance-ids i-1234567890abcdef0

# Disable detailed monitoring
aws ec2 unmonitor-instances \
  --instance-ids i-1234567890abcdef0

# Get console output
aws ec2 get-console-output \
  --instance-id i-1234567890abcdef0

# Get instance status
aws ec2 describe-instance-status \
  --instance-ids i-1234567890abcdef0 \
  --include-all-instances
```

## SSH Access

```bash
# Connect using key pair
ssh -i my-key-pair.pem ec2-user@34.207.249.238

# Connect with specific user (Ubuntu)
ssh -i my-key-pair.pem ubuntu@34.207.249.238

# Connect with specific user (Amazon Linux)
ssh -i my-key-pair.pem ec2-user@34.207.249.238

# Connect through bastion
ssh -J bastion-user@bastion-ip -i my-key.pem ec2-user@private-ip

# Add to SSH config
Host my-instance
  HostName 34.207.249.238
  User ec2-user
  IdentityFile ~/.ssh/my-key.pem
```

## Common Use Cases

### Web Server Setup
```bash
# Create security group for web
aws ec2 create-security-group \
  --group-name web-sg \
  --description "Web server security group"

SG_ID=$(aws ec2 describe-security-groups \
  --group-names web-sg \
  --query 'SecurityGroups[0].GroupId' \
  --output text)

# Allow HTTP and HTTPS
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Create instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name my-key \
  --security-group-ids $SG_ID \
  --user-data file://web-server.sh
```

### Auto Scaling Web Fleet
```bash
# Create launch template
aws ec2 create-launch-template \
  --launch-template-name web-template \
  --version-description "Web server template" \
  --launch-template-data \
  '{
    "ImageId": "ami-0c55b159cbfafe1f0",
    "InstanceType": "t2.micro",
    "KeyName": "my-key",
    "SecurityGroupIds": ["sg-903004f8"],
    "UserData": "'$(base64 -w0 web-server.sh)'"
  }'

# Create target group
aws elbv2 create-target-group \
  --name web-targets \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-1234567890abcdef0

# Create ASG
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name web-asg \
  --launch-template LaunchTemplateId=lt-1234567890abcdef0 \
  --target-group-arns arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/web-targets/abc123 \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 3
```
