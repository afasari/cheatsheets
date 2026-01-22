# Loki

Log aggregation system inspired by Prometheus.

## Installation

### Docker
```bash
# Run Loki
docker run -d \
  --name loki \
  -p 3100:3100 \
  -v loki-data:/loki \
  grafana/loki:latest \
  -config.file=/etc/loki/local-config.yaml

# Run Promtail
docker run -d \
  --name promtail \
  -v $(pwd)/promtail-config.yml:/etc/promtail/config.yml \
  -v /var/log:/var/log \
  grafana/promtail:latest \
  -config.file=/etc/promtail/config.yml
```

### Binary
```bash
# Download Loki
wget https://github.com/grafana/loki/releases/download/v2.9.0/loki-linux-amd64.zip

# Download Promtail
wget https://github.com/grafana/loki/releases/download/v2.9.0/promtail-linux-amd64.zip

# Extract and run
unzip loki-linux-amd64.zip
unzip promtail-linux-amd64.zip

./loki-linux-amd64 -config.file=config.yml
./promtail-linux-amd64 -config.file=config.yml
```

## Configuration

### Loki Config
```yaml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1:7946
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  filesystem:
    directory: /loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
```

### Promtail Config
```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://localhost:3100/loki/api/v1/push

scrape_configs:
  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*log
```

## LogQL (Loki Query Language)

### Basic Queries

```sql
# Label selector
{job="varlogs"}

# Multiple labels
{job="varlogs", filename="/var/log/syslog"}

# Label regex
{job=~".*logs"}

# Label not match
{job!="varlogs"}

# Exact match
{job="varlogs", level="error"}
```

### Line Filter

```sql
{job="varlogs"} |= "error"
{job="varlogs"} |= "error" | grep "database"
{job="varlogs"} != "debug"
{job="varlogs"} |~ "error.*database"
```

### Pipeline Operators

### Line Format
```sql
{job="varlogs"} | line_format "{{.level}}: {{.message}}"
```

### Labels Format
```sql
{job="varlogs"} | label_format level={{.level}},service={{.service}}
```

### JSON Parser
```sql
{job="varlogs"} | json level="level", message="msg"
```

### Regexp Parser
```sql
{job="varlogs"} | regexp "(?P<level>\\w+): (?P<message>.*)"
```

### Unwrap
```sql
{job="varlogs"} | unwrap duration_ms
```

### Label Extractor
```sql
{job="varlogs"} | label_format status={{status}}
```

## Aggregation Operators

```sql
# Count
count_over_time({job="varlogs"}[5m])

# Sum
sum_over_time({job="varlogs"}[5m])

# Rate
rate({job="varlogs"}[5m])

# Bytes rate
bytes_rate({job="varlogs"}[5m])

# Top labels
topk(10, sum by (level) ({job="varlogs"}))

# Bottom labels
bottomk(10, sum by (level) ({job="varlogs"}))
```

## Binary Operators

| OPERATOR | DESCRIPTION |
| --- | --- |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Modulo |
| `^` | Exponentiation |
| `==` | Equality |
| `!=` | Inequality |
| `>` | Greater than |
| `>=` | Greater or equal |
| `<` | Less than |
| `<=` | Less or equal |
| `and` | Logical AND |
| `or` | Logical OR |
| `unless` | Logical negation |

## Examples

### Search by content
```sql
{job="app"} |= "error" | grep "database"
```

### Count errors over time
```sql
sum(count_over_time({level="error"}[5m]))
```

### Error rate
```sql
rate({level="error"}[5m])
```

### Filter by time
```sql
{job="varlogs"} | line_format "{{.timestamp}} {{.message}}"
```

### Parse JSON logs
```sql
{job="app"} | json | level="error"
```

### Extract labels from logs
```sql
{job="app"} | regexp "(?P<method>\\w+) (?P<path>\\S+)" | method
```

### Combine queries
```sql
{job="app"} |= "error" or {job="app"} |= "warning"
```

### Log volume by service
```sql
sum by (service) (count_over_time({job="app"}[1h]))
```

## Grafana Integration

### Add Loki Data Source
1. Go to Configuration > Data Sources
2. Click "Add data source"
3. Select "Loki"
4. Configure URL: `http://localhost:3100`
5. Click "Save & Test"

### Query in Grafana
```sql
{job="varlogs"} |= "error"
```

## API

### Ingest Logs
```bash
# Push logs
curl -X POST http://localhost:3100/loki/api/v1/push \
  -H 'Content-Type: application/json' \
  -d '{
    "streams": [
      {
        "stream": {
          "job": "myapp",
          "level": "info"
        },
        "values": [
          ["1640995200000000000", "log message 1"],
          ["1640995260000000000", "log message 2"]
        ]
      }
    ]
  }'
```

### Query Logs
```bash
# Query logs
curl -X GET "http://localhost:3100/loki/api/v1/query_range?query={job=\"varlogs\"}&start=1640995200&end=1640998800&limit=100"
```

### Label Values
```bash
# Get label values
curl -X GET "http://localhost:3100/loki/api/v1/labels?start=1640995200&end=1640998800"
```

### Label Values for Specific Label
```bash
curl -X GET "http://localhost:3100/loki/api/v1/label/job/values"
```

## Promtail Relabeling

```yaml
scrape_configs:
  - job_name: system
    pipeline_stages:
      - json:
          expressions:
            level: level
            service: service
      - labels:
          level:
          service:
      - regex:
          expression: '(?P<service>\w+)'
          source: filename
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*log
```

## Troubleshooting

### Check Loki Status
```bash
curl http://localhost:3100/ready
```

### Check Promtail Status
```bash
curl http://localhost:9080/metrics
```

### View Promtail Logs
```bash
docker logs promtail
```

### View Loki Logs
```bash
docker logs loki
```

## Best Practices

- Use appropriate retention policies
- Use labels wisely (high cardinality is expensive)
- Use log sampling for high-volume logs
- Use Loki clusters for high availability
- Use Promtail for log collection
- Use proper parsing with pipeline stages
- Use Grafana for visualization
- Regularly review and optimize queries
- Use index patterns for efficient querying
- Monitor Loki performance
- Use proper storage backend

::: tip
Use Loki's playground at `http://localhost:3100` to test LogQL queries.
:::
