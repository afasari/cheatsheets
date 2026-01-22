# AWS IAM Cheatsheet

## Essential Commands

```bash
# List users
aws iam list-users

# Get user details
aws iam get-user --user-name myuser

# Create user
aws iam create-user --user-name myuser

# Delete user
aws iam delete-user --user-name myuser

# List access keys
aws iam list-access-keys --user-name myuser

# Create access key
aws iam create-access-key --user-name myuser

# Delete access key
aws iam delete-access-key \
  --user-name myuser \
  --access-key-id AKIAIOSFODNN7EXAMPLE
```

## User Management

```bash
# Create user with console access
aws iam create-user --user-name myuser
aws iam create-login-profile \
  --user-name myuser \
  --password MyTempPassword123! \
  --password-reset-required

# Create user with programmatic access
aws iam create-user --user-name myuser
aws iam create-access-key --user-name myuser

# Add user to group
aws iam add-user-to-group \
  --group-name Developers \
  --user-name myuser

# Remove user from group
aws iam remove-user-from-group \
  --group-name Developers \
  --user-name myuser

# List groups for user
aws iam list-groups-for-user --user-name myuser
```

## Group Management

```bash
# Create group
aws iam create-group --group-name Developers

# List groups
aws iam list-groups

# Attach policy to group
aws iam attach-group-policy \
  --group-name Developers \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# Detach policy from group
aws iam detach-group-policy \
  --group-name Developers \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# List attached policies
aws iam list-attached-group-policies --group-name Developers

# Delete group
aws iam delete-group --group-name Developers
```

## Roles

```bash
# Create role
aws iam create-role \
  --role-name my-role \
  --assume-role-policy-document file://trust-policy.json

# Attach policy to role
aws iam attach-role-policy \
  --role-name my-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# Create instance profile
aws iam create-instance-profile --instance-profile-name my-instance-profile

# Add role to instance profile
aws iam add-role-to-instance-profile \
  --instance-profile-name my-instance-profile \
  --role-name my-role

# Assume role
aws sts assume-role \
  --role-arn arn:aws:iam::123456789012:role/my-role \
  --role-session-name my-session
```

## Trust Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

```bash
# Update trust policy
aws iam update-assume-role-policy \
  --role-name my-role \
  --policy-document file://trust-policy.json

# Get trust policy
aws iam get-role --role-name my-role --query 'Role.AssumeRolePolicyDocument'
```

## Inline Policies

```bash
# Create inline policy for user
aws iam put-user-policy \
  --user-name myuser \
  --policy-name MyInlinePolicy \
  --policy-document file://policy.json

# Get inline policy
aws iam get-user-policy \
  --user-name myuser \
  --policy-name MyInlinePolicy

# Delete inline policy
aws iam delete-user-policy \
  --user-name myuser \
  --policy-name MyInlinePolicy

# List inline policies
aws iam list-user-policies --user-name myuser
```

## Managed Policies

```bash
# Create managed policy
aws iam create-policy \
  --policy-name MyManagedPolicy \
  --policy-document file://policy.json

# Get policy
aws iam get-policy \
  --policy-arn arn:aws:iam::123456789012:policy/MyManagedPolicy

# Get policy version
aws iam get-policy-version \
  --policy-arn arn:aws:iam::123456789012:policy/MyManagedPolicy \
  --version-id v1

# List policies
aws iam list-policies --scope Local

# Delete policy
aws iam delete-policy \
  --policy-arn arn:aws:iam::123456789012:policy/MyManagedPolicy
```

## Policy Language

### Basic Policy Structure

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3Read",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::mybucket/*",
        "arn:aws:s3:::mybucket"
      ]
    }
  ]
}
```

### Policy Actions

```bash
# Specific action
"Action": "s3:GetObject"

# Multiple actions
"Action": ["s3:GetObject", "s3:PutObject"]

# Wildcard actions (not recommended)
"Action": "s3:*"

# Service prefix wildcard
"Action": ["s3:*", "ec2:*"]
```

### Policy Resources

```bash
# Specific resource
"Resource": "arn:aws:s3:::mybucket/file.txt"

# Bucket wildcard
"Resource": "arn:aws:s3:::mybucket/*"

# All resources
"Resource": "*"

# Multiple resources
"Resource": [
  "arn:aws:s3:::bucket1/*",
  "arn:aws:s3:::bucket2/*"
]
```

### Policy Conditions

```json
{
  "Effect": "Allow",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::mybucket/*",
  "Condition": {
    "IpAddress": {
      "aws:SourceIp": ["203.0.113.0/24"]
    },
    "DateGreaterThan": {
      "aws:CurrentTime": "2024-01-01T00:00:00Z"
    },
    "StringEquals": {
      "aws:userid": "AIDACKCEVSQ6C2EXAMPLE:session-name"
    }
  }
}
```

## Common Policy Examples

### S3 Read-Only Access

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:Get*",
        "s3:List*"
      ],
      "Resource": "*"
    }
  ]
}
```

### EC2 Full Access (Specific Region)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:*",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "ec2:Region": "us-east-1"
        }
      }
    }
  ]
}
```

### Lambda Invoke Permission

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "arn:aws:lambda:*:*:function:my-function"
    }
  ]
}
```

### Multi-Factor Authentication Required

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowConsoleAccess",
      "Effect": "Allow",
      "Action": [
        "s3:*",
        "ec2:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "PreventWithoutMFA",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}
```

### Time-Based Access

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "DateGreaterThan": {
          "aws:CurrentTime": "2024-01-01T00:00:00Z"
        },
        "DateLessThan": {
          "aws:CurrentTime": "2024-12-31T23:59:59Z"
        }
      }
    }
  ]
}
```

## AWS Managed Policies

```bash
# AdministratorAccess
aws iam attach-role-policy \
  --role-name my-role \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# PowerUserAccess
aws iam attach-role-policy \
  --role-name my-role \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# ReadOnlyAccess
aws iam attach-role-policy \
  --role-name my-role \
  --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess

# AmazonS3FullAccess
aws iam attach-role-policy \
  --role-name my-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

# AmazonEC2FullAccess
aws iam attach-role-policy \
  --role-name my-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess
```

## Cross-Account Access

```bash
# Trust policy for cross-account role
aws iam create-role \
  --role-name CrossAccountRole \
  --assume-role-policy-document \
  '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "AWS": "arn:aws:iam::ACCOUNT-ID:root"
        },
        "Action": "sts:AssumeRole",
        "Condition": {
          "StringEquals": {
            "sts:ExternalId": "unique-external-id"
          }
        }
      }
    ]
  }'

# Assume cross-account role
aws sts assume-role \
  --role-arn arn:aws:iam::ACCOUNT-ID:role/CrossAccountRole \
  --role-session-name MySession \
  --external-id unique-external-id
```

## IAM Best Practices

### Least Privilege

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::my-bucket/public/*"
      ]
    }
  ]
}
```

### Use Managed Policies

```bash
# Attach managed policy instead of inline
aws iam attach-user-policy \
  --user-name myuser \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
```

### Require MFA for Sensitive Operations

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyWithoutMFA",
      "Effect": "Deny",
      "NotAction": [
        "iam:CreateVirtualMFADevice",
        "iam:EnableMFADevice",
        "iam:GetUser",
        "iam:ListMFADevices",
        "iam:ListVirtualMFADevices",
        "iam:ResyncMFADevice",
        "iam:ChangePassword",
        "iam:GetAccountPasswordPolicy"
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}
```

## MFA Configuration

```bash
# Create virtual MFA device
aws iam create-virtual-mfa-device \
  --virtual-mfa-device-name myuser-mfa \
  --bootstrap-method QRCodePNG \
  --outfile qr-code.png

# Enable MFA for user
aws iam enable-mfa-device \
  --user-name myuser \
  --serial-number arn:aws:iam::123456789012:mfa/myuser-mfa \
  --authentication-code1 123456 \
  --authentication-code2 789012

# List MFA devices
aws iam list-mfa-devices --user-name myuser

# Deactivate MFA
aws iam deactivate-mfa-device \
  --user-name myuser \
  --serial-number arn:aws:iam::123456789012:mfa/myuser-mfa
```

## Password Policy

```bash
# Set account password policy
aws iam update-account-password-policy \
  --minimum-password-length 12 \
  --require-symbols \
  --require-numbers \
  --require-uppercase-characters \
  --require-lowercase-characters \
  --allow-users-to-change-password \
  --max-password-age 90 \
  --password-reuse-prevention 5

# Get password policy
aws iam get-account-password-policy

# Delete password policy
aws iam delete-account-password-policy
```

## Audit and Compliance

```bash
# Get last used info
aws iam get-access-key-last-used \
  --access-key-id AKIAIOSFODNN7EXAMPLE

# List access keys last used
aws iam list-access-keys-last-used

# Generate credential report
aws iam generate-credential-report

# Get credential report
aws iam get-credential-report

# Get user last used
aws iam get-user-last-used-information \
  --user-name myuser
```

## Common Use Cases

### Service Role for Lambda

```bash
# Create role
aws iam create-role \
  --role-name lambda-role \
  --assume-role-policy-document \
  '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'

# Attach policies
aws iam attach-role-policy \
  --role-name lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
  --role-name lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
```

### Role for EC2 Instance

```bash
# Create role
aws iam create-role \
  --role-name ec2-role \
  --assume-role-policy-document \
  '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "ec2.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'

# Create instance profile
aws iam create-instance-profile \
  --instance-profile-name ec2-instance-profile

aws iam add-role-to-instance-profile \
  --instance-profile-name ec2-instance-profile \
  --role-name ec2-role

# Attach policies
aws iam attach-role-policy \
  --role-name ec2-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
```

### Assume Role with CLI

```bash
# Assume role
aws sts assume-role \
  --role-arn arn:aws:iam::123456789012:role/MyRole \
  --role-session-name my-session > role-creds.json

# Export credentials
export AWS_ACCESS_KEY_ID=$(jq -r '.Credentials.AccessKeyId' role-creds.json)
export AWS_SECRET_ACCESS_KEY=$(jq -r '.Credentials.SecretAccessKey' role-creds.json)
export AWS_SESSION_TOKEN=$(jq -r '.Credentials.SessionToken' role-creds.json)
```
