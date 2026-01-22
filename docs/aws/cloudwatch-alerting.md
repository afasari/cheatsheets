# AWS CloudWatch Cheatsheet

## Essential Commands

```bash
# List metrics
aws cloudwatch list-metrics --namespace AWS/Lambda

# Get metric statistics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=my-function \
  --start-time 2024-01-01T00:00:00 \
  --end-time 2024-01-02T00:00:00 \
  --period 86400 \
  --statistics Sum,Average,Maximum

# Put custom metric
aws cloudwatch put-metric-data \
  --namespace MyApp \
  --metric-name RequestCount \
  --value 100 \
  --unit Count

# Delete metric (via PutMetricData with Timestamp)
aws cloudwatch put-metric-data \
  --namespace MyApp \
  --metric-name RequestCount \
  --value 0 \
  --timestamp 2024-01-01T00:00:00
```

## Metrics

```bash
# List EC2 metrics
aws cloudwatch list-metrics \
  --namespace AWS/EC2 \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0

# List Lambda metrics
aws cloudwatch list-metrics \
  --namespace AWS/Lambda \
  --dimensions Name=FunctionName,Value=my-function

# Get specific metric statistics
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average,Maximum

# Multiple metrics
aws cloudwatch get-metric-data \
  --metric-data-queries file://queries.json \
  --start-time 2024-01-01T00:00:00 \
  --end-time 2024-01-02T00:00:00
```

## Custom Metrics

```bash
# Put single metric
aws cloudwatch put-metric-data \
  --namespace MyApp \
  --metric-name PageViews \
  --value 500 \
  --unit Count \
  --timestamp $(date -u +%Y-%m-%dT%H:%M:%S)

# Put multiple metrics
aws cloudwatch put-metric-data \
  --namespace MyApp \
  --metric-data \
    MetricName=PageViews,Value=500,Unit=Count \
    MetricName=UniqueVisitors,Value=250,Unit=Count

# Put metric with dimensions
aws cloudwatch put-metric-data \
  --namespace MyApp \
  --metric-name RequestCount \
  --dimensions Name=Region,Value=us-east-1 \
  --value 1000 \
  --unit Count

# Put metric with timestamp
aws cloudwatch put-metric-data \
  --namespace MyApp \
  --metric-name Temperature \
  --value 72.5 \
  --unit Fahrenheit \
  --timestamp 2024-01-01T12:00:00
```

## Metric Streams

```bash
# Create metric stream
aws cloudwatch create-metric-stream \
  --name my-stream \
  --firehose-arn arn:aws:firehose:us-east-1:123456789012:deliverystream/my-stream \
  --role-arn arn:aws:iam::123456789012:role/MetricStreamRole \
  --output-format json

# List metric streams
aws cloudwatch list-metric-streams

# Get metric stream
aws cloudwatch get-metric-stream --name my-stream

# Start metric stream
aws cloudwatch start-metric-streams --names my-stream

# Stop metric stream
aws cloudwatch stop-metric-streams --names my-stream

# Delete metric stream
aws cloudwatch delete-metric-stream --name my-stream
```

## Alarms

```bash
# Create alarm
aws cloudwatch put-metric-alarm \
  --alarm-name high-cpu-alarm \
  --alarm-description "CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --evaluation-periods 2

# List alarms
aws cloudwatch describe-alarms

# Get alarm history
aws cloudwatch describe-alarm-history \
  --alarm-name high-cpu-alarm

# Disable alarm
aws cloudwatch disable-alarm-actions \
  --alarm-name high-cpu-alarm

# Enable alarm
aws cloudwatch enable-alarm-actions \
  --alarm-name high-cpu-alarm

# Delete alarm
aws cloudwatch delete-alarms \
  --alarm-names high-cpu-alarm
```

## Alarm Actions

```bash
# Create alarm with SNS notification
aws cloudwatch put-metric-alarm \
  --alarm-name high-cpu-alarm \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:my-topic

# Create alarm with EC2 action (Auto Scaling)
aws cloudwatch put-metric-alarm \
  --alarm-name scale-up-alarm \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:policy-id:autoScalingGroupName/my-asg

# Create alarm with Lambda action
aws cloudwatch put-metric-alarm \
  --alarm-name lambda-alarm \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:lambda:us-east-1:123456789012:function:my-function
```

## Log Groups and Streams

```bash
# Create log group
aws logs create-log-group --log-group-name /aws/lambda/my-function

# List log groups
aws logs describe-log-groups

# Describe log group
aws logs describe-log-groups \
  --log-group-name-prefix /aws/lambda

# Delete log group
aws logs delete-log-group \
  --log-group-name /aws/lambda/my-function

# Create log stream
aws logs create-log-stream \
  --log-group-name /aws/lambda/my-function \
  --log-stream-name 2024/01/01/[$LATEST]abcdef123456

# List log streams
aws logs describe-log-streams \
  --log-group-name /aws/lambda/my-function

# Get log events
aws logs get-log-events \
  --log-group-name /aws/lambda/my-function \
  --log-stream-name 2024/01/01/[$LATEST]abcdef123456
```

## Log Filtering

```bash
# Filter logs with pattern
aws logs filter-log-events \
  --log-group-name /aws/lambda/my-function \
  --filter-pattern "ERROR"

# Filter with time range
aws logs filter-log-events \
  --log-group-name /aws/lambda/my-function \
  --start-time $(date -u -d '1 hour ago' +%s)000 \
  --end-time $(date -u +%s)000

# Filter with pattern and time
aws logs filter-log-events \
  --log-group-name /aws/lambda/my-function \
  --filter-pattern "[timestamp, request_id, level=*ERROR*, message]"

# Tail logs
aws logs tail /aws/lambda/my-function --follow

# Tail with filter
aws logs tail /aws/lambda/my-function \
  --follow \
  --filter-pattern "ERROR"
```

## Log Insights

```bash
# Start query
aws logs start-query \
  --log-group-name /aws/lambda/my-function \
  --start-time $(date -u -d '1 hour ago' +%s) \
  --end-time $(date -u +%s) \
  --query-string 'fields @timestamp, @message | filter @message like /ERROR/ | limit 20'

# Get query results
aws logs get-query-results --query-id <query-id>

# Stop query
aws logs stop-query --query-id <query-id>

# Sample queries
# Count errors by type
fields @timestamp, errorType
| filter level = "ERROR"
| stats count() by errorType

# Top slow requests
fields @timestamp, duration
| sort duration desc
| limit 10

# Request latency
fields @timestamp, @message
| parse @message "duration=*ms" as duration
| stats avg(duration) by bin(5m)
```

## Metric Filters

```bash
# Create metric filter
aws logs put-metric-filter \
  --log-group-name /aws/lambda/my-function \
  --filter-name error-count \
  --filter-pattern "[timestamp, request_id, level=*ERROR*, message]" \
  --metric-transformations \
    metricName=ErrorCount,metricNamespace=MyApp,metricValue=1

# List metric filters
aws logs describe-metric-filters \
  --log-group-name /aws/lambda/my-function

# Delete metric filter
aws logs delete-metric-filter \
  --log-group-name /aws/lambda/my-function \
  --filter-name error-count
```

## Subscription Filters

```bash
# Create subscription filter to Lambda
aws logs put-subscription-filter \
  --log-group-name /aws/lambda/my-function \
  --filter-name lambda-subscription \
  --filter-pattern "" \
  --destination-arn arn:aws:lambda:us-east-1:123456789012:function:log-processor

# Create subscription filter to Kinesis
aws logs put-subscription-filter \
  --log-group-name /aws/lambda/my-function \
  --filter-name kinesis-subscription \
  --filter-pattern "[timestamp, request_id, level=*ERROR*]" \
  --destination-arn arn:aws:kinesis:us-east-1:123456789012:stream/log-stream

# List subscription filters
aws logs describe-subscription-filters \
  --log-group-name /aws/lambda/my-function

# Delete subscription filter
aws logs delete-subscription-filter \
  --log-group-name /aws/lambda/my-function \
  --filter-name lambda-subscription
```

## Dashboards

```bash
# Create dashboard
aws cloudwatch put-dashboard \
  --dashboard-name my-dashboard \
  --dashboard-body file://dashboard.json

# List dashboards
aws cloudwatch list-dashboards

# Get dashboard
aws cloudwatch get-dashboard --dashboard-name my-dashboard

# Delete dashboard
aws cloudwatch delete-dashboards --dashboard-names my-dashboard

# Dashboard body example
{
  "widgets": [
    {
      "type": "metric",
      "x": 0,
      "y": 0,
      "width": 6,
      "height": 6,
      "properties": {
        "metrics": [
          ["AWS/EC2", "CPUUtilization", "InstanceId", "i-1234567890abcdef0"]
        ],
        "period": 300,
        "stat": "Average",
        "region": "us-east-1"
      }
    }
  ]
}
```

## Composite Alarms

```bash
# Create composite alarm
aws cloudwatch put-composite-alarm \
  --alarm-name composite-alarm \
  --alarm-description "Multiple conditions" \
  --alarm-rule 'ALARM("alarm1") OR ALARM("alarm2")'

# List composite alarms
aws cloudwatch describe-alarms \
  --alarm-types COMPOSITE_ALARM

# Delete composite alarm
aws cloudwatch delete-alarms --alarm-names composite-alarm
```

## Anomaly Detection

```bash
# Create anomaly detection band
aws cloudwatch put-anomaly-detector \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --stat Average \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0

# Describe anomaly detectors
aws cloudwatch describe-anomaly-detectors

# Delete anomaly detector
aws cloudwatch delete-anomaly-detector \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --stat Average \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0

# Create alarm with anomaly detection
aws cloudwatch put-metric-alarm \
  --alarm-name anomaly-alarm \
  --metrics file://anomaly-metrics.json
```

## Contributor Insights

```bash
# Put contributor insights rule
aws logs put-contributor-insight-rule \
  --rule-name top-error-codes \
  --rule-source file://rule.json

# List rules
aws logs describe-contributor-insight-rules

# Enable rule
aws logs start-contributor-insight-rules \
  --rule-names top-error-codes

# Disable rule
aws logs stop-contributor-insight-rules \
  --rule-names top-error-codes

# Get results
aws logs get-contributor-insight-rule-results \
  --rule-name top-error-codes
```

## Canaries

```bash
# Create canary
aws synthetics create-canary \
  --name my-canary \
  --code S3Bucket=my-bucket,S3Key=canary-script.zip,Handler=canary.handler \
  --schedule Expression="rate(5 minutes)" \
  --run-config TimeoutInSeconds=60 \
  --success-retention-period-in-days 7 \
  --failure-retention-period-in-days 30

# List canaries
aws synthetics list-canaries

# Describe canary
aws synthetics describe-canaries --name my-canary

# Start canary
aws synthetics start-canary --name my-canary

# Stop canary
aws synthetics stop-canary --name my-canary

# Delete canary
aws synthetics delete-canary --name my-canary
```

## RUM (Real User Monitoring)

```bash
# Create app monitor
aws rum create-app-monitor \
  --name my-app \
  --domain myapp.example.com

# List app monitors
aws rum list-app-monitors

# Update app monitor
aws rum update-app-monitor \
  --name my-app \
  --app-monitor-configuration file://config.json

# Delete app monitor
aws rum delete-app-monitor --name my-app
```

## Common Use Cases

### Monitor EC2 CPU Usage
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name high-cpu-alarm \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:alerts
```

### Monitor Lambda Errors
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name lambda-errors-alarm \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=my-function \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:alerts
```

### Log Lambda Errors
```bash
aws logs put-metric-filter \
  --log-group-name /aws/lambda/my-function \
  --filter-name lambda-errors \
  --filter-pattern "[level=*ERROR*]" \
  --metric-transformations \
    metricName=LambdaErrors,metricNamespace=MyApp,metricValue=1

aws cloudwatch put-metric-alarm \
  --alarm-name lambda-error-log-alarm \
  --metric-name LambdaErrors \
  --namespace MyApp \
  --statistic Sum \
  --period 60 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1
```

### Auto Scaling Based on Metrics
```bash
# Scale up
aws cloudwatch put-metric-alarm \
  --alarm-name scale-up-alarm \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=AutoScalingGroupName,Value=my-asg \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:policy-id:autoScalingGroupName/my-asg

# Scale down
aws cloudwatch put-metric-alarm \
  --alarm-name scale-down-alarm \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 30 \
  --comparison-operator LessThanThreshold \
  --dimensions Name=AutoScalingGroupName,Value=my-asg \
  --evaluation-periods 5 \
  --alarm-actions arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:policy-id:autoScalingGroupName/my-asg
```
