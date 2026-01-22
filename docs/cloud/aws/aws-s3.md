# AWS S3 Cheatsheet

## Essential Commands

```bash
# List buckets
aws s3 ls

# Create bucket
aws s3 mb s3://mybucket
aws s3 mb s3://mybucket --region us-east-1

# Delete bucket (must be empty)
aws s3 rb s3://mybucket
aws s3 rb s3://mybucket --force

# Sync directory
aws s3 sync ./local-dir s3://mybucket/remote-dir

# Copy file
aws s3 cp file.txt s3://mybucket/
aws s3 cp s3://mybucket/file.txt ./local-file.txt

# List objects
aws s3 ls s3://mybucket/
aws s3 ls s3://mybucket/path/

# Delete objects
aws s3 rm s3://mybucket/file.txt
aws s3 rm s3://mybucket/ --recursive
```

## Bucket Configuration

```bash
# Enable versioning
aws s3api put-bucket-versioning \
  --bucket mybucket \
  --versioning-configuration Status=Enabled

# Enable server-side encryption
aws s3api put-bucket-encryption \
  --bucket mybucket \
  --server-side-encryption-configuration \
  '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        }
      }
    ]
  }'

# Set bucket policy
aws s3api put-bucket-policy \
  --bucket mybucket \
  --policy file://policy.json

# Get bucket policy
aws s3api get-bucket-policy --bucket mybucket

# Set lifecycle policy
aws s3api put-bucket-lifecycle-configuration \
  --bucket mybucket \
  --lifecycle-configuration file://lifecycle.json

# Get lifecycle policy
aws s3api get-bucket-lifecycle-configuration \
  --bucket mybucket
```

## Public/Private Buckets

```json
// Public read bucket policy
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mybucket/*"
    }
  ]
}
```

```bash
# Block public access
aws s3api put-public-access-block \
  --bucket mybucket \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

## CORS Configuration

```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["https://example.com"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

```bash
# Set CORS
aws s3api put-bucket-cors \
  --bucket mybucket \
  --cors-configuration file://cors.json

# Get CORS
aws s3api get-bucket-cors --bucket mybucket

# Delete CORS
aws s3api delete-bucket-cors --bucket mybucket
```

## Presigned URLs

```bash
# Generate presigned URL (valid for 1 hour)
aws s3 presign s3://mybucket/file.txt --expires-in 3600

# Generate presigned URL for upload
aws s3 presign s3://mybucket/file.txt --expires-in 3600 --method put

# Generate using AWS CLI v2 with credentials
aws s3 presign s3://mybucket/file.txt \
  --profile myprofile \
  --expires-in 300
```

## Sync and Transfer

```bash
# Sync with delete (remove files not in source)
aws s3 sync ./local s3://mybucket --delete

# Sync with exclude pattern
aws s3 sync ./local s3://mybucket --exclude "*.tmp"

# Sync with include pattern
aws s3 sync ./local s3://mybucket --include "*.jpg" --include "*.png"

# Sync with size filter
aws s3 sync ./local s3://mybucket --size-greater-than 1M

# Sync with dry-run
aws s3 sync ./local s3://mybucket --dry-run

# Parallel multipart upload
aws s3 cp largefile s3://mybucket/ --concurrent 8
```

## Versioning

```bash
# List object versions
aws s3api list-object-versions --bucket mybucket

# Get specific version
aws s3api get-object \
  --bucket mybucket \
  --key file.txt \
  --version-id 123456789abcdef \
  ./file.txt

# Delete specific version
aws s3api delete-object \
  --bucket mybucket \
  --key file.txt \
  --version-id 123456789abcdef
```

## Lifecycle Management

```json
{
  "Rules": [
    {
      "ID": "Archive to Glacier",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "logs/"
      },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        },
        {
          "Days": 365,
          "StorageClass": "DEEP_ARCHIVE"
        }
      ],
      "Expiration": {
        "Days": 730
      }
    }
  ]
}
```

## Access Control

```bash
# Get bucket ACL
aws s3api get-bucket-acl --bucket mybucket

# Get object ACL
aws s3api get-object-acl --bucket mybucket --key file.txt

# Set object ACL
aws s3api put-object-acl \
  --bucket mybucket \
  --key file.txt \
  --acl public-read

# Share with specific account
aws s3api put-object-acl \
  --bucket mybucket \
  --key file.txt \
  --grant-read id=ACCOUNTID
```

## Storage Classes

```bash
# Copy to different storage class
aws s3 cp s3://mybucket/file.txt s3://mybucket/file.txt \
  --storage-class STANDARD_IA

# Available storage classes:
# STANDARD - Default
# STANDARD_IA - Infrequent access
# ONEZONE_IA - Single AZ, infrequent access
# GLACIER - Long-term archive
# DEEP_ARCHIVE - Long-term, lowest cost
# INTELLIGENT_TIERING - Auto-tiering

# Restore from Glacier
aws s3api restore-object \
  --bucket mybucket \
  --key file.txt \
  --restore-request '{"Days": 5}'
```

## Encryption

```bash
# Upload with SSE-S3
aws s3 cp file.txt s3://mybucket/ \
  --server-side-encryption AES256

# Upload with SSE-KMS
aws s3 cp file.txt s3://mybucket/ \
  --server-side-encryption aws:kms \
  --ssekms-key-id alias/my-key

# Upload with SSE-C (customer-provided)
aws s3 cp file.txt s3://mybucket/ \
  --sse-c AES256 \
  --sse-c-key-file key.bin

# Use default encryption
aws s3api put-bucket-encryption \
  --bucket mybucket \
  --server-side-encryption-configuration \
  '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

## Event Notifications

```bash
# Enable notifications to SQS
aws s3api put-bucket-notification-configuration \
  --bucket mybucket \
  --notification-configuration \
  '{
    "QueueConfigurations": [{
      "Id": "QueueConfig",
      "QueueArn": "arn:aws:sqs:us-east-1:123456789012:myqueue",
      "Events": ["s3:ObjectCreated:*"]
    }]
  }'

# Enable notifications to Lambda
aws s3api put-bucket-notification-configuration \
  --bucket mybucket \
  --notification-configuration \
  '{
    "LambdaFunctionConfigurations": [{
      "Id": "LambdaConfig",
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:myfunction",
      "Events": ["s3:ObjectRemoved:*"]
    }]
  }'
```

## Multipart Upload

```bash
# List multipart uploads
aws s3api list-multipart-uploads --bucket mybucket

# Abort multipart upload
aws s3api abort-multipart-upload \
  --bucket mybucket \
  --key largefile \
  --upload-id upload-id

# List parts
aws s3api list-parts \
  --bucket mybucket \
  --key largefile \
  --upload-id upload-id
```

## Transfer Acceleration

```bash
# Enable transfer acceleration
aws s3api put-bucket-accelerate-configuration \
  --bucket mybucket \
  --accelerate-configuration Status=Enabled

# Use accelerated endpoint
aws s3 cp file.txt s3://mybucket/ \
  --endpoint-url https://mybucket.s3-accelerate.amazonaws.com
```

## Requester Pays

```bash
# Enable requester pays
aws s3api put-bucket-request-payment \
  --bucket mybucket \
  --request-payment-configuration Payer=Requester

# Access requester pays bucket
aws s3 cp s3://mybucket/file.txt ./file.txt --request-payer requester
```

## Website Hosting

```bash
# Enable website hosting
aws s3api put-bucket-website \
  --bucket mybucket \
  --website-configuration \
  '{
    "IndexDocument": {
      "Suffix": "index.html"
    },
    "ErrorDocument": {
      "Key": "error.html"
    }
  }'

# Get website configuration
aws s3api get-bucket-website --bucket mybucket

# Delete website configuration
aws s3api delete-bucket-website --bucket mybucket
```

## Logging

```bash
# Enable server access logging
aws s3api put-bucket-logging \
  --bucket mybucket \
  --bucket-logging-status \
  '{
    "LoggingEnabled": {
      "TargetBucket": "my-logs-bucket",
      "TargetPrefix": "mybucket/"
    }
  }'
```

## Common Use Cases

### Static Website Hosting
```bash
# Enable static website
aws s3api put-bucket-website \
  --bucket mybucket \
  --website-configuration \
  '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "error.html"}
  }'

# Set bucket policy for public read
aws s3api put-bucket-policy \
  --bucket mybucket \
  --policy file://website-policy.json

# Upload files
aws s3 sync ./website s3://mybucket --delete
```

### Backup to S3
```bash
# Create backup bucket with versioning
aws s3 mb s3://my-backup-bucket
aws s3api put-bucket-versioning \
  --bucket my-backup-bucket \
  --versioning-configuration Status=Enabled

# Sync backup
aws s3 sync /path/to/backup s3://my-backup-bucket/$(date +%Y%m%d)

# Set lifecycle policy
aws s3api put-bucket-lifecycle-configuration \
  --bucket my-backup-bucket \
  --lifecycle-configuration file://backup-lifecycle.json
```

### Data Lake Setup
```bash
# Create data lake bucket
aws s3 mb s3://my-datalake

# Enable encryption and versioning
aws s3api put-bucket-encryption \
  --bucket my-datalake \
  --server-side-encryption-configuration \
  '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "aws:kms"
      }
    }]
  }'

aws s3api put-bucket-versioning \
  --bucket my-datalake \
  --versioning-configuration Status=Enabled

# Partition data
aws s3 s3 cp data.json s3://my-datalake/year=2024/month=01/data.json
```
