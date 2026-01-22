# AWS Lambda Cheatsheet

## Essential Commands

```bash
# List functions
aws lambda list-functions

# Get function details
aws lambda get-function --function-name my-function

# Invoke function
aws lambda invoke \
  --function-name my-function \
  --payload '{"key": "value"}' \
  response.json

# Invoke asynchronously
aws lambda invoke \
  --function-name my-function \
  --invocation-type Event \
  response.json

# Tail logs
aws logs tail /aws/lambda/my-function --follow
```

## Function Management

```bash
# Create function (Python)
aws lambda create-function \
  --function-name my-function \
  --runtime python3.9 \
  --role arn:aws:iam::123456789012:role/lambda-role \
  --handler app.lambda_handler \
  --zip-file fileb://function.zip

# Create function (Node.js)
aws lambda create-function \
  --function-name my-function \
  --runtime nodejs18.x \
  --role arn:aws:iam::123456789012:role/lambda-role \
  --handler index.handler \
  --zip-file fileb://function.zip

# Update function code
aws lambda update-function-code \
  --function-name my-function \
  --zip-file fileb://function.zip

# Update function configuration
aws lambda update-function-configuration \
  --function-name my-function \
  --timeout 30 \
  --memory-size 256 \
  --environment Variables={ENV=production}

# Delete function
aws lambda delete-function --function-name my-function
```

## Function Code (Python)

```python
# Basic handler
import json

def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

# With path parameters
def lambda_handler(event, context):
    name = event.get('pathParameters', {}).get('name', 'World')
    return {
        'statusCode': 200,
        'body': json.dumps(f'Hello {name}!')
    }

# With environment variables
import os

def lambda_handler(event, context):
    api_key = os.environ.get('API_KEY')
    return {
        'statusCode': 200,
        'body': json.dumps({'key': api_key})
    }

# Async operation
import asyncio

def lambda_handler(event, context):
    async def process():
        await asyncio.sleep(1)
        return "Done"
    result = asyncio.run(process())
    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
```

## Function Code (Node.js)

```javascript
// Basic handler
exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!')
    };
};

// With path parameters
exports.handler = async (event) => {
    const name = event.pathParameters?.name || 'World';
    return {
        statusCode: 200,
        body: JSON.stringify(`Hello ${name}!`)
    };
};

// With environment variables
exports.handler = async (event) => {
    const apiKey = process.env.API_KEY;
    return {
        statusCode: 200,
        body: JSON.stringify({ key: apiKey })
    };
};

// Async operation
exports.handler = async (event) => {
    const data = await fetchData();
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};

async function fetchData() {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ message: 'Done' }), 1000);
    });
}
```

## Triggers and Integrations

```bash
# Add API Gateway trigger
aws lambda add-permission \
  --function-name my-function \
  --statement-id apigateway-get \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn arn:aws:execute-api:us-east-1:123456789012:api-id/*/GET/path

# Add S3 trigger
aws lambda add-permission \
  --function-name my-function \
  --statement-id s3-trigger \
  --action lambda:InvokeFunction \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::mybucket

# Configure S3 notification
aws s3api put-bucket-notification-configuration \
  --bucket mybucket \
  --notification-configuration \
  '{
    "LambdaFunctionConfigurations": [{
      "Id": "LambdaConfig",
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:my-function",
      "Events": ["s3:ObjectCreated:*"]
    }]
  }'

# Add DynamoDB stream
aws lambda create-event-source-mapping \
  --function-name my-function \
  --batch-size 100 \
  --starting-position LATEST \
  --event-source-arn arn:aws:dynamodb:us-east-1:123456789012:table/MyTable/stream/2024-01-01

# Add SQS trigger
aws lambda create-event-source-mapping \
  --function-name my-function \
  --batch-size 10 \
  --event-source-arn arn:aws:sqs:us-east-1:123456789012:myqueue
```

## Environment Variables

```bash
# Update environment variables
aws lambda update-function-configuration \
  --function-name my-function \
  --environment Variables={DB_HOST=localhost,DB_PORT=5432}

# Add to existing variables
ENV=$(aws lambda get-function-configuration \
  --function-name my-function \
  --query 'Environment.Variables' \
  --output json)

NEW_ENV=$(echo $ENV | jq '. + {"NEW_VAR": "value"}')

aws lambda update-function-configuration \
  --function-name my-function \
  --environment "$NEW_ENV"

# Get environment variables
aws lambda get-function-configuration \
  --function-name my-function \
  --query 'Environment.Variables'
```

## Layers

```bash
# Create layer
aws lambda publish-layer-version \
  --layer-name my-layer \
  --description "My dependencies" \
  --zip-file fileb://layer.zip \
  --compatible-runtimes python3.9 python3.10

# List layers
aws lambda list-layers

# Add layer to function
aws lambda update-function-configuration \
  --function-name my-function \
  --layers arn:aws:lambda:us-east-1:123456789012:layer:my-layer:1

# Remove layer
aws lambda update-function-configuration \
  --function-name my-function \
  --layers []
```

## Aliases and Versions

```bash
# Publish version
aws lambda publish-version --function-name my-function

# Create alias
aws lambda create-alias \
  --function-name my-function \
  --name production \
  --function-version 2

# Update alias
aws lambda update-alias \
  --function-name my-function \
  --name production \
  --function-version 3

# List aliases
aws lambda list-aliases --function-name my-function

# Delete alias
aws lambda delete-alias \
  --function-name my-function \
  --name production
```

## Concurrency

```bash
# Set reserved concurrency
aws lambda put-function-concurrency \
  --function-name my-function \
  --reserved-concurrent-executions 10

# Set provisioned concurrency
aws lambda put-provisioned-concurrency-config \
  --function-name my-function:production \
  --provisioned-concurrent-executions 5

# Get concurrency config
aws lambda get-function-concurrency \
  --function-name my-function

# Delete concurrency limit
aws lambda delete-function-concurrency \
  --function-name my-function
```

## Monitoring and Logs

```bash
# Get metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=my-function \
  --start-time 2024-01-01T00:00:00 \
  --end-time 2024-01-02T00:00:00 \
  --period 86400 \
  --statistics Sum

# Tail logs
aws logs tail /aws/lambda/my-function --follow

# Get recent logs
aws logs tail /aws/lambda/my-function \
  --since 1h \
  --format short

# Filter logs
aws logs filter-log-events \
  --log-group-name /aws/lambda/my-function \
  --filter-pattern "ERROR"
```

## API Gateway Integration

```bash
# Create REST API
aws apigateway create-rest-api --name my-api

# Create resource
aws apigateway create-resource \
  --rest-api-id abc123 \
  --parent-id / \
  --path-part hello

# Create method
aws apigateway put-method \
  --rest-api-id abc123 \
  --resource-id xyz789 \
  --http-method GET \
  --authorization-type NONE

# Integrate with Lambda
aws apigateway put-integration \
  --rest-api-id abc123 \
  --resource-id xyz789 \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:123456789012:function:my-function/invocations

# Deploy API
aws apigateway create-deployment \
  --rest-api-id abc123 \
  --stage-name prod
```

## EventBridge (CloudWatch Events)

```bash
# Create rule
aws events put-rule \
  --name my-rule \
  --schedule-expression "rate(5 minutes)"

# Add Lambda target
aws events put-targets \
  --rule my-rule \
  --targets \
    Id=1,Arn=arn:aws:lambda:us-east-1:123456789012:function:my-function

# Cron schedule
aws events put-rule \
  --name my-cron-rule \
  --schedule-expression "cron(0 9 * * ? *)"

# Event pattern
aws events put-rule \
  --name my-event-rule \
  --event-pattern \
  '{
    "source": ["aws.ec2"],
    "detail-type": ["EC2 Instance State-change Notification"]
  }'
```

## Deployment Packages

```bash
# Create Python deployment package
zip -r function.zip app.py

# Create Node.js deployment package
zip -r function.zip index.js package.json node_modules/

# Create with dependencies
pip install -r requirements.txt -t package/
cd package
zip -r ../function.zip *
cd ..
zip -g function.zip app.py

# SAM build
sam build
sam deploy

# Serverless framework
serverless deploy
```

## Best Practices

```python
# Connection reuse
import psycopg2

# Global connection pool
conn = None

def get_connection():
    global conn
    if conn is None:
        conn = psycopg2.connect(
            host=os.environ['DB_HOST'],
            database=os.environ['DB_NAME'],
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASSWORD']
        )
    return conn

def lambda_handler(event, context):
    conn = get_connection()
    # Use connection
    return {'statusCode': 200}
```

```python
# Handle cold starts
import time
import boto3

s3 = boto3.client('s3')

def lambda_handler(event, context):
    start_time = time.time()
    # Your logic here
    duration = time.time() - start_time
    print(f"Execution time: {duration:.2f}s")
    return {'statusCode': 200}
```

```python
# Error handling
def lambda_handler(event, context):
    try:
        # Your logic
        return {'statusCode': 200}
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

## Common Use Cases

### S3 Event Processing
```python
import boto3

s3 = boto3.client('s3')

def lambda_handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        
        response = s3.get_object(Bucket=bucket, Key=key)
        content = response['Body'].read().decode('utf-8')
        
        # Process content
        print(f"Processed {key} from {bucket}")
    
    return {'statusCode': 200}
```

### API Response
```python
import json

def lambda_handler(event, context):
    response = {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'message': 'Hello World',
            'data': event
        })
    }
    return response
```

### Scheduled Task
```python
import boto3

def lambda_handler(event, context):
    # Send email notification
    ses = boto3.client('ses')
    ses.send_email(
        Source='sender@example.com',
        Destination={'ToAddresses': ['recipient@example.com']},
        Message={
            'Subject': {'Data': 'Scheduled Report'},
            'Body': {'Text': {'Data': 'Report content'}}
        }
    )
    return {'statusCode': 200}
```
