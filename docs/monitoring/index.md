# Monitoring & Logging Overview

Monitoring and logging are essential for understanding system behavior, detecting issues, and ensuring reliability. This section covers the three pillars of observability: metrics, logs, and traces.

## The Three Pillars of Observability

| Pillar | Purpose | Examples | Tools |
|--------|---------|----------|-------|
| **Metrics** | Numerical data over time | CPU usage, request rate, latency | Prometheus, CloudWatch |
| **Logs** | Discrete events with context | Error messages, debug info | ELK Stack, Loki |
| **Traces** | Request path across services | Distributed transaction tracking | Jaeger, Zipkin, Grafana Tempo |

## Metrics

### Metric Types

| Type | Description | Example |
|------|-------------|---------|
| **Counter** | Monotonically increasing value | Total requests, errors |
| **Gauge** | Value that can go up or down | Memory usage, queue size |
| **Histogram** | Distribution of values | Request latency buckets |
| **Summary** | Similar to histogram with quantiles | Response time percentiles |

### Metric Naming Best Practices
- Use snake_case: `http_requests_total`
- Include units: `request_duration_seconds`
- Be consistent: always use same base name with labels
- Use labels for dimensions: `http_requests_total{method="GET", status="200"}`

### Common Metrics to Monitor

| Category | Metrics | Thresholds |
|----------|---------|------------|
| **Availability** | Uptime, service health | 99.9% SLA |
| **Latency** | P50, P95, P99 response times | <500ms P95 |
| **Traffic** | Requests per second, throughput | Baseline-dependent |
| **Errors** | Error rate, 5xx responses | <1% error rate |
| **Saturation** | CPU, memory, disk usage | <80% utilization |

## Logging

### Log Levels

| Level | Usage | When to Use |
|-------|-------|--------------|
| **FATAL** | System-critical errors | Application cannot continue |
| **ERROR** | Error conditions | Errors that need investigation |
| **WARN** | Warning conditions | Potential issues, not critical |
| **INFO** | Informational messages | Normal operation, key events |
| **DEBUG** | Debugging details | Development, troubleshooting |
| **TRACE** | Fine-grained debugging | Detailed flow information |

### Structured Logging
JSON-formatted logs with consistent fields.

**Example**:
```json
{
  "timestamp": "2024-01-22T10:30:00Z",
  "level": "INFO",
  "service": "api",
  "request_id": "abc123",
  "method": "GET",
  "path": "/api/users",
  "status": 200,
  "duration_ms": 45
}
```

**Benefits**:
- Easy to parse and query
- Consistent structure
- Rich context
- Machine-readable

### Log Aggregation Patterns
**Centralized Logging**: All logs sent to central system
- **Pros**: Single source of truth, powerful search
- **Cons**: Network overhead, scalability challenges

**Distributed Logging**: Logs kept locally, queried remotely
- **Pros**: Lower network overhead, faster local access
- **Cons**: Complex setup, eventual consistency

## Alerting

### Alerting Principles

| Principle | Description |
|-----------|-------------|
| **Actionability** | Every alert should require action |
| **Relevance** | Alert the right person/team |
| **Timeliness** | Alert early enough to prevent impact |
| **Clarity** | Include context for troubleshooting |
| **Frequency** | Avoid alert fatigue with proper rate limiting |

### Alerting Strategies

**Threshold-Based Alerting**: Alert when metric exceeds fixed threshold
```yaml
alert: HighErrorRate
expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
```

**Anomaly Detection Alerting**: Alert on unusual behavior
- ML-based detection
- Statistical outlier detection
- Compare to historical baselines

**Composite Alerting**: Multiple conditions
```yaml
alert: ServiceDown
expr: up{job="api"} == 0
for: 2m
annotations:
  summary: "API service is down"
  description: "Service has been down for 2 minutes"
```

### Alert Routing
**Route alerts to appropriate channels**:
- **Critical**: PagerDuty, on-call phone
- **High Priority**: Slack, email
- **Medium Priority**: Slack channel
- **Low Priority**: Email digest

## Monitoring Architecture

### Components

| Component | Purpose | Tools |
|-----------|---------|-------|
| **Metric Collector** | Scrape metrics from applications | Prometheus agent |
| **Metric Storage** | Time-series database | Prometheus, VictoriaMetrics |
| **Visualization** | Dashboards and charts | Grafana |
| **Log Collector** | Aggregate logs from applications | Fluentd, Logstash |
| **Log Storage** | Index and store logs | Elasticsearch |
| **Alert Manager** | Process and route alerts | Alertmanager, PagerDuty |

### Common Patterns

**Push Model**: Applications push metrics to collector
- Simpler application setup
- Less control over collection

**Pull Model**: Collector scrapes metrics from applications (Prometheus)
- Easier discovery and monitoring
- More control over collection frequency

## Distributed Tracing

### Trace Components
- **Span**: Single operation or unit of work
- **Trace**: Tree of spans representing a request
- **Trace ID**: Unique identifier for entire request
- **Span ID**: Unique identifier for individual span

### When to Use Distributed Tracing
- Microservices architecture
- Performance troubleshooting across services
- Understanding request flow
- Identifying bottlenecks

### Tracing Implementation
```python
# Example with OpenTelemetry
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("operation"):
    # Do work here
    pass
```

## Common Scenarios

### Scenario: Web Application Monitoring
**Stack**: Prometheus + Grafana
**Metrics**: Request rate, latency, error rate, system resources
**Alerts**: High error rate, slow response, service down

### Scenario: Log Analysis
**Stack**: ELK Stack (Elasticsearch + Logstash + Kibana)
**Logs**: Application logs, nginx logs, system logs
**Search**: Error logs by service, IP address filtering, time-based queries

### Scenario: Kubernetes Monitoring
**Stack**: Prometheus + Grafana + Loki
**Metrics**: Pod metrics, node resources, cluster health
**Logs**: Container logs, application logs
**Alerts**: Pod crashes, resource exhaustion, deployment failures

### Scenario: Distributed Tracing
**Stack**: Jaeger + OpenTelemetry
**Traces**: Request across multiple services
**Insights**: Service dependencies, slow operations, error propagation

## Monitoring Best Practices

1. **Start Simple**: Begin with basic metrics and logs
2. **Instrument Early**: Add monitoring from development
3. **Monitor the Monitoring**: Alert on monitoring system failures
4. **Review Regularly**: Update metrics and alerts as system evolves
5. **Include Context**: Add labels, tags, and metadata
6. **Test Alerts**: Verify alerts fire and don't spam
7. **Document Runbooks**: Clear procedures for common issues

## Further Reading

- [Prometheus](./prometheus) - Metric collection and querying
- [Grafana](./grafana) - Visualization and dashboards
- [ELK Stack](./elk) - Elasticsearch, Logstash, Kibana
- [Loki](./loki) - Prometheus-style logging
- [Monitoring Concepts](../devops/monitoring-concepts) - Deep dive into monitoring strategies
