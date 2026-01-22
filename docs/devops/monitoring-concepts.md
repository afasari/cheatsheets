# Monitoring Concepts

## The Three Pillars of Observability

Observability is the ability to understand the internal state of your systems by examining their external outputs. It consists of three pillars:

1. **Metrics** - Numerical data collected over time
2. **Logs** - Timestamped records of discrete events
3. **Traces** - Request flow through distributed systems

## Metrics

### What are Metrics?

Numerical measurements that represent the health and performance of your systems collected at regular intervals.

### Metric Types
```yaml
# Counter metric
metric_name_total_requests_total
# Tracks total count

# Gauge metric
metric_name_current_users
# Current value at time of scrape

# Histogram metric
metric_name_request_duration_seconds
# Distribution of values

# Summary metric
metric_name_response_bytes
# Sum of values
```

### Key Metrics to Monitor

#### Application Metrics
```yaml
# Request rate
http_requests_total
http_requests_per_second
http_request_duration_seconds
http_request_duration_seconds_summary

# Error rate
http_requests_5xx_total
http_requests_4xx_total
http_requests_3xx_total
http_requests_2xx_total

# Throughput
http_requests_per_second
bytes_sent_total
bytes_received_total
```

#### Infrastructure Metrics
```yaml
# CPU
cpu_usage_percent
cpu_user_seconds_total

# Memory
memory_usage_bytes
memory_available_bytes
page_faults_total

# Disk
disk_usage_percent
disk_io_time_seconds_total
disk_available_bytes
disk_io_time_seconds_total

# Network
network_receive_bytes_total
network_transmit_bytes_total
network_errors_total
```

#### Business Metrics
```yaml
# User engagement
active_users_total
page_views_total
session_duration_seconds

# Transactions
orders_total
revenue_total
cart_abandoned_total
```

### Metric Aggregation

### Temporal Aggregation
```yaml
# Over time ranges
# Last 5 minutes
rate(http_requests_total[5m])

# Over window
increase(http_requests_total[5m])

# Average
avg(http_request_duration_seconds)
```

### Aggregation Functions

| Function | Description | Example |
|----------|-------------|--------|
| `rate()` | Per-second average of counter | `rate(http_requests_total[5m])` |
| `increase()` | Total increase in range | `increase(http_requests_total[1h])` |
| `avg()` | Average value | `avg(temperature[5m])` |
| `max()` | Maximum value | `max(memory_usage)` |
| `min()` | Minimum value | `min(disk_available)` |
| `sum()` | Sum of values | `sum(bytes_sent_total)` |
| `count()` | Count of series elements | `count(up)` |

### Metric Cardinality

```yaml
# Avoid high cardinality
# Bad: One metric per host
http_requests_host_1_total
http_requests_host_2_total

# Good: Use labels
http_requests_total{host="1"}
http_requests_total{host="2"}
```

## Service Level Objectives (SLOs)

### What are SLOs?

Service Level Objectives are specific, measurable criteria for a service that include:

### SLO Types

| Type | Description | Example |
|------|-------------|--------|
| **Latency-Based** | Target percentage of requests under threshold | 95% of requests < 100ms |
| **Error-Based** | Maximum error rate allowed | < 0.1% error rate |
| **Availability** | Uptime guarantee | 99.9% uptime |
| **Throughput** | Minimum requests per second | 1000 RPS |

### Error Budget

```yaml
# Allow specific error rate per hour
# Alert if exceeded
error_budget:
  name: api-errors
  budget: 100      # 100 errors per hour
  window: 1h         # Rolling hour window

# Alerting
alert:
  alert: error_budget_apis > 0
```

### Latency Budget

```yaml
# Allow slow requests
# Percentage under SLA
latency_budget:
  name: api-latency
  budget: 5          # 5% of requests can be > 100ms
  window: 5m

# Alerting
alert:
  alert: rate(api_request_duration_seconds:5m{le="0.95"}) > 0.05
```

### SLO Calculation

```yaml
# Success rate
slo_success = (sum(rate(http_requests_total[5m])) / (sum(increase(http_requests_total[5m])) * 100

# Error rate
slo_errors = (sum(rate(http_requests_5xx_total[5m])) / (sum(increase(http_requests_total[5m])) * 100

# Latency
slo_latency = histogram_quantile(http_request_duration_seconds[5m], 0.95)
```

## Golden Signals

### Four Key Signals

```yaml
1. **Latency** - Request duration
   golden_metric: api_request_duration_seconds
   query: |
     histogram_quantile(api_request_duration_seconds, 0.95)

2. **Traffic** - Request rate
   golden_metric: http_requests_per_second
   query: |
     rate(http_requests_total[5m])

3. **Errors** - Error rate
   golden_metric: http_requests_5xx_total
   query: |
     rate(http_requests_5xx_total[5m])

4. **Saturation** - Resource utilization
   golden_metric: cpu_usage_percent
   query: |
     avg(rate(cpu_usage_percent[5m]))
```

## Alerts

### Alerting Rules

```yaml
# Alert on threshold breach
alert:
  expr: rate(http_requests_total[5m]) > 1000
  for: 5m
  annotations:
    severity: critical

# Alert on error spike
alert: rate(http_requests_5xx_total[5m]) > 10
  for: 5m
  annotations:
    severity: warning

# Alert on high latency
alert: histogram_quantile(http_request_duration_seconds[5m], 0.99) > 0.5
  for: 5m
  annotations:
    severity: warning
```

### Alert Severity

| Severity | When to Use | Response Time |
|----------|-------------|---------------|
| Critical | Service down, data loss, security breach | Immediate (1-5 min) |
| Warning | Performance degradation, approaching limit | Within 1 hour |
| Info | Informative, maintenance notice | When convenient |

## Logs

### What are Logs?

Structured, timestamped records of events that happened in your system. Logs provide context for what happened at a specific point in time.

### Log Levels

| Level | When to Use | Example |
|-------|-------------|--------|
| **DEBUG** | Detailed troubleshooting info | `Database connection: Host unreachable` |
| **INFO** | Normal operations | `User logged in successfully` |
| **WARN** | Potentially harmful issues | `Disk space low: 85%` |
| **ERROR** | Application errors | `Connection refused: Connection timed out` |
| **FATAL** | Critical failures | `Cannot start server: Port already in use` |

### Log Best Practices

### Structured Logging
```json
{
  "timestamp": "2024-01-22T10:30:45Z",
  "level": "info",
  "service": "api",
  "message": "Request received",
  "request_id": "abc123",
  "duration_ms": 45
}
```

### Log Context
```json
// Add context to logs
{
  "timestamp": "2024-01-22T10:30:45Z",
  "level": "error",
  "service": "api",
  "message": "Database connection failed",
  "user_id": "user123",
  "request_id": "abc123",
  "error": {
    "code": "ECONNREFUSED",
    "message": "Connection refused"
  },
  "stack_trace": [
    "at /app/api/handler.js:45"
  ]
}
```

### Log Rotation
```yaml
# Rotate logs to prevent disk fill
logging:
  file:
    maxsize: 100M
    maxage: 30
    maxfiles: 10

# Compress old logs
logging:
  files:
    - compress: true
    maxage: 7
```

### Log Aggregation

```bash
# Centralize logs from all services
# Collect logs from:
# - Containers
# - Kubernetes pods
# - Cloud services
# - On-prem servers
# - Edge locations

# Ship to log aggregation platform
# - Elasticsearch
# - Loki
# - CloudWatch Logs
# - DataDog
```

## Tracing

### What is Distributed Tracing?

Tracing tracks the complete path of a request as it flows through various services in a microservices architecture. It helps identify bottlenecks and understand dependencies between services.

### Span

```yaml
# Trace structure
{
  "trace_id": "abc123",
  "name": "GET /api/users",
  "timestamp": 1705974000,
  "duration_ms": 250,
  "root_span_id": "root123",
  "spans": [
    {
      "span_id": "span456",
      "name": "auth-service",
      "timestamp": 1705974000,
      "duration_ms": 50,
      "tags": ["auth"]
    },
    {
      "span_id": "span789",
      "name": "database",
      "timestamp": 1705974050,
      "duration_ms": 150,
      "tags": ["database"]
    },
    {
      "span_id": "span012",
      "name": "api-handler",
      "timestamp": 1705974200,
      "duration_ms": 50,
      "tags": ["api"]
    }
  ]
}
```

### Span Attributes

| Attribute | Description | Example |
|-----------|-------------|--------|
| `trace_id` | Unique identifier | `abc123` |
| `span_id` | Child span ID | `span456` |
| `parent_id` | Parent span ID | `root123` |
| `name` | Operation name | `auth-service` |
| `timestamp` | Start time | `1705974000` |
| `duration_ms` | Duration | `250` |
| `tags` | Metadata | `["auth", "database"] |
| `status` | Status | `ok` |

### Trace Sampling

```yaml
# Sample 1% of traces
# Don't trace every request
# Reduces overhead
# Still provides insights

# Adaptive sampling
sample_rate: 1% for high traffic
sample_rate: 10% for normal traffic
sample_rate: 0.1% for low traffic
```

### Distributed Tracing Architecture

```yaml
# Components

# Instrumentation
# - Add trace headers to requests
# - Create spans for operations
# - Propagate trace context

# Collector
# - Receives traces from services
# - Aggregates traces
# - Stores in backend

# Storage
# - Elasticsearch
# - Jaeger
# - Tempo
# - DataDog

# Query UI
# - Jaeger UI
# - Grafana
# - DataDog APM
```

## Observability Patterns

### RED Method

### Reliability
```yaml
# Errors (how many, how critical)
alerts:
  - name: error_rate
    expr: rate(http_requests_5xx_total[5m]) > 10

### Errors
alerts:
  - name: http_5xx_errors
    expr: increase(http_requests_5xx_total[5m]) > 0

### Duration
alerts:
  - name: p95_latency
    expr: histogram_quantile(http_request_duration_seconds[5m], 0.95) > 0.5

### Saturation
alerts:
  - name: cpu_saturation
    expr: avg(rate(cpu_usage_percent[5m])) > 80
```

## Monitoring Strategy

### Three-Tier Monitoring

```yaml
# Tier 1: Infrastructure
# CPU, memory, disk, network
# Host health
# Container resource usage

# Tier 2: Application
# Custom metrics
# Business KPIs
# Error rates

# Tier 3: User Experience
# Frontend metrics
# API latency
# Uptime
```

### Monitoring Stack

```
┌─────────────┐
│   Frontend   │
│              │
│   Backend    │◄──►┐
│              │         │
│              │◄──►┐  │
┐            │         │     │
│──────────────┴     │     │
┐              │         │
│  Frontend   │     │
└──────────────┘     │
                 │
┌─────────────┐     │
│   Metrics    │     │
└──────────────┘     │
                 │
          ┌─────────────┐
          │  Tracing    │
          └──────────────┘
```

## Metrics Dashboard

### Key Metrics Dashboard

```yaml
# Top metrics to display
metrics:
  - throughput_mps:
      query: rate(http_requests_total[5m])
  - error_rate:
      query: rate(http_requests_5xx_total[5m])
  - p50_latency:
      query: histogram_quantile(http_request_duration_seconds[5m], 0.5)
  - p95_latency:
      query: histogram_quantile(http_request_duration_seconds[5m], 0.95)
  - p99_latency:
      query: histogram_quantile(http_request_duration_seconds[5m], 0.99)
  - availability:
      query: avg(up{job="api-service"})
  - active_users:
      query: count(up{job="web-frontend"})
```

## Alerting Strategy

### Alert Fatigue

```yaml
# Avoid alert fatigue
# - Prioritize critical alerts
# - Batch informational alerts
# - Rate limit warning alerts
# - Deduplicate similar alerts

# Aggregation
# - Group related alerts
# - Send notifications in batches
# - Include all affected services
```

## Observability Maturity

### Levels

| Level | Description | Example |
|-------|-------------|--------|
| **Basic** | Metrics only, basic alerting | `prometheus`, `statsd` |
| **Intermediate** | Metrics + logs | `prometheus` + `grafana` + `ELK` |
| **Advanced** | Metrics + logs + traces | `prometheus` + `loki` + `jaeger` |
| **Mature** | Full observability stack + SLOs | `prometheus` + `grafana` + `jaeger` + `tempo` |

### Observability Tools

| Tool | Metrics | Logs | Traces | Notes |
|-------|--------|-------|--------|-------|
| Prometheus | ✅ | ❌ | ❌ | Time-series database |
| Grafana | ✅ | ❌ | ❌ | Visualization |
| ELK Stack | ✅ | ✅ | ❌ | Log management |
| Loki | ✅ | ❌ | ❌ | Log aggregation |
| Jaeger | ❌ | ❌ | ✅ | Distributed tracing |
| Tempo | ❌ | ❌ | ✅ | Distributed tracing |
| Datadog | ✅ | ✅ | ✅ | ✅ | Full stack |
| New Relic | ✅ | ✅ | ✅ | ✅ | Full stack |
| OpenTelemetry | ✅ | ✅ | ✅ ✅ | Vendor-neutral |

### Observability Best Practices

### 1. Instrument Early
```yaml
# Add tracing from day one
# Auto-instrument frameworks
# Trace all external calls

# Benefits
# End-to-end visibility
# Debug production issues
# Performance insights
```

### 2. Use Structured Data
```json
// Structured logs
{
  "timestamp": "2024-01-22T10:30:00Z",
  "level": "info",
  "service": "api",
  "message": "Request received"
}

// Structured metrics
{
  "metric": {
    "name": "http_requests_total",
    "help": "Total HTTP requests"
  }
}
```

### 3. Correlation IDs
```yaml
# Trace correlation
trace_id: "abc123"
# Appears in all logs
# Links metrics, logs, traces

# Request ID
request_id: "xyz789"
# Links trace to metrics and logs
```

### 4. Golden Signals
```yaml
# Focus on user experience
latency_budget:
  budget: 5
  window: 5m

# Simple dashboard
# 4 golden metrics
# Easy to understand
# Quick diagnosis
```
