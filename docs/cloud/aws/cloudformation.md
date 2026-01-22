# AWS CloudFormation

Infrastructure as Code (IaC) service for AWS that allows you to define and provision AWS resources using templates.

## CloudFormation Template Basics

### Template Formats
CloudFormation supports two template formats:
- **YAML**: More readable, supports comments
- **JSON**: Validated by schema, less readable

### Basic Template Structure (YAML)

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Sample CloudFormation template

Parameters:
  # Input parameters for your template

Resources:
  # AWS resources to create

Outputs:
  # Values to return after stack creation
```

## Stack Management Commands

### Create Stack

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws cloudformation create-stack --stack-name my-stack --template-body file://template.yaml` | Create stack from template file |
| `aws cloudformation create-stack --stack-name my-stack --template-url https://s3.amazonaws.com/...` | Create stack from S3 URL |
| `aws cloudformation create-stack --stack-name my-stack --parameters ParameterKey=Param1,ParameterValue=Value1` | Create with parameters |
| `aws cloudformation create-stack --stack-name my-stack --capabilities CAPABILITY_IAM` | Create with IAM capabilities |
| `aws cloudformation create-stack --stack-name my-stack --on-failure ROLLBACK` | Set failure behavior (ROLLBACK/DELETE/DO_NOTHING) |

### Update Stack

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws cloudformation update-stack --stack-name my-stack --template-body file://template.yaml` | Update stack with new template |
| `aws cloudformation update-stack --stack-name my-stack --parameters ParameterKey=Param1,ParameterValue=NewValue` | Update stack parameters |
| `aws cloudformation update-stack --stack-name my-stack --use-previous-template` | Re-use existing template |
| `aws cloudformation update-stack --stack-name my-stack --capabilities CAPABILITY_IAM` | Update with IAM capabilities |

### Delete Stack

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws cloudformation delete-stack --stack-name my-stack` | Delete stack |
| `aws cloudformation delete-stack --stack-name my-stack --retain-resources Resource1,Resource2` | Delete but retain specific resources |

### Stack Monitoring

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws cloudformation describe-stacks --stack-name my-stack` | Describe stack details |
| `aws cloudformation list-stacks` | List all stacks |
| `aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE` | Filter by status |
| `aws cloudformation get-template --stack-name my-stack` | Get stack template |
| `aws cloudformation describe-stack-events --stack-name my-stack` | View stack events |
| `aws cloudformation describe-stack-resources --stack-name my-stack` | List stack resources |
| `aws cloudformation describe-stack-resource --stack-name my-stack --logical-resource-id MyResource` | Get specific resource details |
| `aws cloudformation list-stack-resources --stack-name my-stack` | List all resources in stack |

### Change Sets

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws cloudformation create-change-set --stack-name my-stack --change-set-name my-changes --template-body file://template.yaml` | Create change set |
| `aws cloudformation describe-change-set --change-set-name my-changes --stack-name my-stack` | Describe change set |
| `aws cloudformation list-change-sets --stack-name my-stack` | List all change sets |
| `aws cloudformation execute-change-set --change-set-name my-changes --stack-name my-stack` | Execute change set |
| `aws cloudformation delete-change-set --change-set-name my-changes --stack-name my-stack` | Delete change set |

### Stack Drift Detection

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws cloudformation detect-stack-drift --stack-name my-stack` | Detect stack drift |
| `aws cloudformation describe-stack-drift-detection-status --stack-drift-detection-id <id>` | Check drift detection status |
| `aws cloudformation describe-stack-resource-drifts --stack-name my-stack` | List drifted resources |
| `aws cloudformation detect-stack-resource-drift --stack-name my-stack --logical-resource-id MyResource` | Detect drift for single resource |

## Common Resource Examples

### S3 Bucket

```yaml
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-unique-bucket-name
      VersioningConfiguration:
        Status: Enabled
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
```

### EC2 Instance

```yaml
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: t2.micro
      KeyName: my-key-pair
      SecurityGroupIds:
        - sg-12345678
      UserData: !Base64 |
        #!/bin/bash
        echo "Hello World" > /tmp/hello.txt
```

### VPC

```yaml
Resources:
  MyVPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: MyVPC

  PublicSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref MyVPC
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: us-east-1a
      MapPublicIpOnLaunch: true

  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: MyIGW

  VPCGatewayAttachment:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref MyVPC
      InternetGatewayId: !Ref InternetGateway
```

### Lambda Function

```yaml
Resources:
  MyLambdaFunction:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: MyLambda
      Runtime: python3.9
      Handler: index.handler
      Code:
        ZipFile: |
          def handler(event, context):
              return {'statusCode': 200, 'body': 'Hello World'}
      Role: !GetAtt LambdaRole.Arn

  LambdaRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

### Security Group

```yaml
Resources:
  MySecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow HTTP/SSH
      GroupName: MySecurityGroup
      VpcId: !Ref MyVPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 10.0.0.0/16
```

## Parameters

### Parameter Types

| Type | Description | Example |
|------|-------------|---------|
| `String` | Alphanumeric string | `!Sub ${AWS::StackName}` |
| `Number` | Integer or float | `1`, `2.5` |
| `List<Number>` | Array of numbers | `[1, 2, 3]` |
| `CommaDelimitedList` | Comma-separated values | `"a,b,c"` |
| `AWS::EC2::KeyPair::KeyName` | EC2 key pair name | `my-key-pair` |
| `AWS::EC2::SecurityGroup::GroupName` | Security group name | `my-sg` |
| `AWS::EC2::Subnet::Id` | Subnet ID | `subnet-12345` |
| `AWS::EC2::VPC::Id` | VPC ID | `vpc-12345` |
| `AWS::SSM::Parameter::Name` | SSM parameter name | `/my/parameter` |

### Parameter Example

```yaml
Parameters:
  Environment:
    Type: String
    Default: dev
    AllowedValues:
      - dev
      - staging
      - prod
    Description: Deployment environment

  InstanceType:
    Type: String
    Default: t2.micro
    AllowedValues:
      - t2.micro
      - t2.small
      - t2.medium
    Description: EC2 instance type

  KeyName:
    Type: AWS::EC2::KeyPair::KeyName
    Description: EC2 key pair name
```

## Pseudo Parameters

| Parameter | Description | Example Value |
|-----------|-------------|---------------|
| `AWS::AccountId` | Account ID | `123456789012` |
| `AWS::NotificationARNs` | Notification ARNs | `[]` |
| `AWS::NoValue` | Removes property | Used with conditional |
| `AWS::Partition` | Partition name | `aws` |
| `AWS::Region` | Region name | `us-east-1` |
| `AWS::StackId` | Stack ID | `arn:aws:cloudformation:...` |
| `AWS::StackName` | Stack name | `my-stack` |
| `AWS::URLSuffix` | URL suffix | `amazonaws.com` |

## Intrinsic Functions

| Function | Description | Example |
|----------|-------------|---------|
| `!Ref` | Return value of parameter or resource | `!Ref InstanceType` |
| `!GetAtt` | Get attribute from resource | `!GetAtt MyInstance.PublicIp` |
| `!Sub` | Substitute variables in string | `!Sub ${AWS::StackName}-bucket` |
| `!Join` | Join values with delimiter | `!Join ['-', [a, b, c]]` |
| `!Select` | Select from list | `!Select [0, !Ref MyList]` |
| `!GetAZs` | Get availability zones | `!GetAZs ''` |
| `!ImportValue` | Import export from another stack | `!ImportValue VPC-ID` |
| `!If` | Conditional logic | `!If [Condition, TrueValue, FalseValue]` |
| `!And` | Logical AND | `!And [!Equals [a, b], !Equals [c, d]]` |
| `!Or` | Logical OR | `!Or [!Equals [a, b], !Equals [c, d]]` |
| `!Not` | Logical NOT | `!Not [!Equals [a, b]]` |
| `!Equals` | String equality | `!Equals [!Ref Env, 'prod']` |

### Condition Example

```yaml
Parameters:
  Environment:
    Type: String
    Default: dev
    AllowedValues:
      - dev
      - prod

Conditions:
  IsProd: !Equals [!Ref Environment, prod]

Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      VersioningConfiguration:
        Status: !If [IsProd, Enabled, Suspended]
```

## Outputs

### Output Example

```yaml
Outputs:
  VPCId:
    Description: VPC ID
    Value: !Ref MyVPC
    Export:
      Name: !Sub ${AWS::StackName}-VPC-ID

  InstancePublicIP:
    Description: EC2 instance public IP
    Value: !GetAtt MyInstance.PublicIp

  BucketARN:
    Description: S3 bucket ARN
    Value: !GetAtt MyBucket.Arn
```

## Useful Tips

### Validation

| COMMAND | DESCRIPTION |
| --- | --- |
| `aws cloudformation validate-template --template-body file://template.yaml` | Validate template syntax |
| `aws cloudformation validate-template --template-url https://s3.amazonaws.com/...` | Validate remote template |

### Stack Policies

```yaml
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "Update:Modify",
      "Principal": "*",
      "Resource": "*"
    },
    {
      "Effect": "Deny",
      "Action": "Update:Replace",
      "Principal": "*",
      "Resource": "LogicalResourceId/MyDatabase"
    }
  ]
}
```

### Common Stack Errors

| Error | Solution |
|-------|----------|
| `CAPABILITY_IAM` required | Add `--capabilities CAPABILITY_IAM` to command |
| `CAPABILITY_NAMED_IAM` required | Add `--capabilities CAPABILITY_NAMED_IAM` to command |
| Parameter validation failed | Check parameter values match allowed values |
| Resource creation failed | Check CloudFormation logs for specific error |
| Stack already exists | Use `update-stack` instead of `create-stack` |

### Best Practices

1. **Use Parameters** for values that change between environments
2. **Use Mappings** for region-specific values
3. **Use Conditions** for environment-specific resources
4. **Use Outputs** to share values between stacks
5. **Use Stack Policies** to protect critical resources
6. **Use Change Sets** for production updates
7. **Enable Termination Protection** for production stacks
8. **Use IAM least privilege** for CloudFormation roles
9. **Test templates in dev environment first**
10. **Version control your templates**
