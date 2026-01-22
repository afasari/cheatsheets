# Prometheus

Open-source monitoring and alerting toolkit.

## Installation

### Docker
```bash
# Run Prometheus
docker run -d \
  -p 9090:9090 \
  -v prometheus-data:/prometheus \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus

# Run with node exporter
docker run -d \
  --name node-exporter \
  -p 9100:9100 \
  prom/node-exporter
```

### Binary
```bash
# Download
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz

# Extract
tar xvfz prometheus-2.45.0.linux-amd64.tar.gz

# Run
cd prometheus-2.45.0.linux-amd64
./prometheus --config.file=prometheus.yml
```

## Configuration

### Basic prometheus.yml
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
```

### Scrape Configuration
| PARAMETER | DESCRIPTION |
| --- | --- |
| `scrape_interval` | How often to scrape targets |
| `scrape_timeout` | Timeout for scraping |
| `evaluation_interval` | How often to evaluate rules |
| `external_labels` | Labels for external systems |

## Targets

| COMMAND | DESCRIPTION |
| --- | --- |
| `http://localhost:9090/api/v1/targets` | List all targets |
| `http://localhost:9090/api/v1/targets?state=active` | List active targets |
| `http://localhost:9090/api/v1/targets?state=down` | List down targets |

## PromQL (Prometheus Query Language)

### Basic Queries

```sql
# Simple metric
metric_name

# Filter by label
metric_name{label="value"}

# Multiple labels
metric_name{label1="value1", label2="value2"}

# Regex match
metric_name{label=~"pattern"}

# Not match
metric_name{label!="value"}

# Regex not match
metric_name{label!~"pattern"}
```

### Operators

| OPERATOR | DESCRIPTION |
| --- | --- |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Modulo |
| `^` | Exponentiation |
| `==` | Equality |
| `!=` | Not equal |
| `>` | Greater than |
| `>=` | Greater or equal |
| `<` | Less than |
| `<=` | Less or equal |
| `and` | Logical AND |
| `or` | Logical OR |
| `unless` | Logical negation |

### Time-based Queries

```sql
# Last 5 minutes
metric_name[5m]

# Last hour
metric_name[1h]

# Rate over 5 minutes
rate(metric_name[5m])

# Increase over 5 minutes
increase(metric_name[5m])

# Delta over 5 minutes
delta(metric_name[5m])

# Average over 5 minutes
avg_over_time(metric_name[5m])

# Max over 5 minutes
max_over_time(metric_name[5m])

# Min over 5 minutes
min_over_time(metric_name[5m])

# Sum over time
sum_over_time(metric_name[5m])
```

### Aggregation Functions

```sql
# Sum by label
sum(metric_name) by (label)

# Average by label
avg(metric_name) by (label)

# Max by label
max(metric_name) by (label)

# Min by label
min(metric_name) by (label)

# Count by label
count(metric_name) by (label)

# Quantile
quantile(0.95, metric_name)

# Top N
topk(5, metric_name)

# Bottom N
bottomk(5, metric_name)

# Standard deviation
stddev(metric_name)

# Standard variance
stdvar(metric_name)
```

### Examples

```sql
# CPU usage
rate(process_cpu_seconds_total[5m])

# Memory usage
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Disk usage
(1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100

# HTTP request rate
rate(http_requests_total[5m])

# Request duration
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Uptime
time() - process_start_time_seconds

# Service availability
avg(up{job="my_service"})
```

## Recording Rules

```yaml
groups:
  - name: cpu_rules
    interval: 30s
    rules:
      - record: job:node_cpu_seconds:rate5m
        expr: rate(node_cpu_seconds_total[5m])
      - record: job:node_cpu_seconds:avg1m
        expr: avg_over_time(rate(node_cpu_seconds_total[5m])[1m:])
```

## Alerting Rules

```yaml
groups:
  - name: alerts
    rules:
      - alert: HighCPU
        expr: rate(process_cpu_seconds_total[5m]) > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is above 80% for 5 minutes"

      - alert: HighMemory
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) > 0.9
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is above 90% for 10 minutes"

      - alert: InstanceDown
        expr: up == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Instance is down"
          description: "{{ $labels.instance }} has been down for 5 minutes"
```

## Alerts API

| COMMAND | DESCRIPTION |
| --- | --- |
| `http://localhost:9090/api/v1/alerts` | List all alerts |
| `http://localhost:9090/api/v1/alerts?silenced=false` | List unsilenced alerts |
| `http://localhost:9090/api/v1/rules` | List alerting rules |

## Exporters

| EXPORTER | DESCRIPTION |
| --- | --- |
| `node_exporter` | System metrics (CPU, memory, disk) |
| `blackbox_exporter` | HTTP, TCP, ICMP probes |
| `mysqld_exporter` | MySQL metrics |
| `postgres_exporter` | PostgreSQL metrics |
| `redis_exporter` | Redis metrics |
| `mongodb_exporter` | MongoDB metrics |
| `nginx_prometheus_exporter` | Nginx metrics |

## Service Discovery

### Static
```yaml
scrape_configs:
  - job_name: 'web'
    static_configs:
      - targets: ['web1.example.com:80', 'web2.example.com:80']
        labels:
          env: production
```

### File-based
```yaml
scrape_configs:
  - job_name: 'web'
    file_sd_configs:
      - files:
          - '/etc/prometheus/file_sd/*.json'
          - '/etc/prometheus/file_sd/*.yml'
```

### DNS
```yaml
scrape_configs:
  - job_name: 'dns'
    dns_sd_configs:
      - names:
          - 'web.example.com'
        type: 'A'
        port: 80
```

## Remote Write

```yaml
remote_write:
  - url: http://remote-storage/api/v1/write
    headers:
      X-Remote-Write-Header: "value"
    basic_auth:
      username: user
      password: pass
```

## Relabeling

```yaml
scrape_configs:
  - job_name: 'node'
    relabel_configs:
      - source_labels: [__address__]
        regex: '([^:]+)(:[0-9]+)?'
        target_label: __address__
        replacement: '${1}:9100'
```

## Federation

```yaml
scrape_configs:
  - job_name: 'federate'
    honor_labels: true
    metrics_path: '/federate'
    static_configs:
      - targets:
          - 'source-prometheus:9090'
    params:
      'match[]':
        - '{job="prometheus"}'
        - '{__name__=~"job:.*"}'
```

## Useful Queries

### Find all metrics
```bash
curl http://localhost:9090/api/v1/label/__name__/values
```

### Query range
```bash
curl 'http://localhost:9090/api/v1/query_range?query=up&start=1640995200&end=1640998800&step=15s'
```

### Instant query
```bash
curl 'http://localhost:9090/api/v1/query?query=up'
```

## Best Practices

- Use recording rules for complex queries
- Use appropriate scrape intervals (usually 15s-60s)
- Label consistently across all metrics
- Use relabeling to clean up labels
- Set up proper retention based on storage
- Use alertmanager for alert routing
- Test alert rules before deployment
- Use federation for distributed monitoring
- Regularly review and update alerts
- Use service discovery for dynamic environments
- Monitor Prometheus itself

::: tip
Use `promtool` to validate Prometheus configuration: `promtool check config prometheus.yml`
:::
