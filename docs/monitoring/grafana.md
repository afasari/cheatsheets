# Grafana

Open-source analytics and interactive visualization platform.

## Installation

### Docker
```bash
# Run Grafana
docker run -d \
  -p 3000:3000 \
  --name grafana \
  grafana/grafana

# Run with persistent storage
docker run -d \
  -p 3000:3000 \
  -v grafana-storage:/var/lib/grafana \
  --name grafana \
  grafana/grafana

# Run with custom config
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/grafana.ini:/etc/grafana/grafana.ini \
  --name grafana \
  grafana/grafana
```

### Binary
```bash
# Download
wget https://dl.grafana.com/oss/release/grafana-10.2.0.linux-amd64.tar.gz

# Extract
tar -zxvf grafana-10.2.0.linux-amd64.tar.gz

# Run
cd grafana-10.2.0
./bin/grafana-server web
```

## Authentication

| COMMAND | DESCRIPTION |
| --- | --- |
| `admin/admin` | Default credentials |
| Settings > Users > Change Password | Change password |
| Settings > Users > Invite | Invite users |
| Settings > Users > Add User | Add user |

## Data Sources

### Add Data Source
1. Go to Configuration > Data Sources
2. Click "Add data source"
3. Select type (Prometheus, InfluxDB, etc.)
4. Configure connection
5. Click "Save & Test"

### API Commands

```bash
# List data sources
curl -X GET \
  -H "Authorization: Bearer <api_key>" \
  http://localhost:3000/api/datasources

# Add data source
curl -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prometheus",
    "type": "prometheus",
    "url": "http://localhost:9090",
    "access": "proxy"
  }' \
  http://localhost:3000/api/datasources

# Delete data source
curl -X DELETE \
  -H "Authorization: Bearer <api_key>" \
  http://localhost:3000/api/datasources/uid/<uid>
```

## Dashboards

### Create Dashboard
1. Go to Create > Dashboard
2. Add panels with visualization
3. Configure queries
4. Set up variables
5. Save dashboard

### Import Dashboard
1. Go to Create > Import
2. Enter dashboard ID or upload JSON
3. Select data source
4. Click Import

### API Commands

```bash
# List dashboards
curl -X GET \
  -H "Authorization: Bearer <api_key>" \
  http://localhost:3000/api/search?query=dashboard

# Get dashboard
curl -X GET \
  -H "Authorization: Bearer <api_key>" \
  http://localhost:3000/api/dashboards/uid/<uid>

# Create dashboard
curl -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "dashboard": {
      "title": "My Dashboard",
      "panels": []
    },
    "overwrite": true
  }' \
  http://localhost:3000/api/dashboards/db

# Delete dashboard
curl -X DELETE \
  -H "Authorization: Bearer <api_key>" \
  http://localhost:3000/api/dashboards/uid/<uid>
```

## Panels

### Panel Types

| TYPE | DESCRIPTION |
| --- | --- |
| `Graph` | Time series visualization |
| `Stat` | Single metric visualization |
| `Gauge` | Metric with threshold |
| `Table` | Tabular data |
| `Bar Chart` | Categorical data |
| `Pie Chart` | Distribution |
| `Heatmap` | Time series density |
| `Geomap` | Geographic data |
| `Logs` | Log visualization |
| `Trace` | Distributed tracing |

### Panel Queries

### Prometheus
```promql
# Rate
rate(http_requests_total[5m])

# Sum by label
sum(rate(http_requests_total[5m])) by (method)

# Average
avg(rate(http_requests_total[5m]))

# With filters
rate(http_requests_total{status="200"}[5m])
```

### InfluxDB
```sql
SELECT mean(value) FROM "cpu" WHERE $timeFilter GROUP BY time($__interval)
```

### Loki
```logql
{job="myapp"} |= "error"
```

## Variables

### Query Variable
1. Go to Dashboard Settings > Variables
2. Click "Add variable"
3. Select type: Query
4. Select data source
5. Enter query
6. Configure options

### Interval Variable
1. Go to Dashboard Settings > Variables
2. Add variable
3. Select type: Interval
4. Add intervals: 30s, 1m, 5m, 10m, 30m

### Custom Variable
1. Go to Dashboard Settings > Variables
2. Add variable
3. Select type: Custom
4. Add values: dev, staging, prod

### Using Variables
```
# In queries
rate(metric{instance="$instance"}[5m])

# In panel titles
Requests for $instance
```

## Annotations

### Add Annotation
1. Go to Dashboard Settings > Annotations
2. Add annotation query
3. Configure query
4. Set tags and colors

### API Commands

```bash
# List annotations
curl -X GET \
  -H "Authorization: Bearer <api_key>" \
  http://localhost:3000/api/annotations

# Create annotation
curl -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "dashboardId": 1,
    "time": 1640995200000,
    "timeEnd": 1640995800000,
    "tags": ["deployment"],
    "text": "Deployed version 1.0.0"
  }' \
  http://localhost:3000/api/annotations
```

## Alerts

### Create Alert Rule
1. Edit panel
2. Go to "Alert" tab
3. Set condition
4. Set threshold
5. Configure notification
6. Save dashboard

### Alert Notification Channels
1. Go to Alerting > Notification channels
2. Add channel
3. Select type (Email, Slack, PagerDuty, etc.)
4. Configure settings
5. Test notification

## Alerting

### Alert Rule Syntax
```
# Condition
avg(metric) > threshold

# Reduce
avg()

# Evaluate every
every 1m

# For duration
for 5m
```

## Folders

### Create Folder
1. Go to Dashboards > Manage
2. Create folder
3. Add dashboards to folder

### API Commands

```bash
# List folders
curl -X GET \
  -H "Authorization: Bearer <api_key>" \
  http://localhost:3000/api/folders

# Create folder
curl -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Folder"
  }' \
  http://localhost:3000/api/folders
```

## Organizations

### Create Organization
1. Go to Configuration > Users
2. Create new organization
3. Invite users

### Switch Organization
1. Click user menu
2. Select organization

## Users & Teams

### Create Team
1. Go to Configuration > Teams
2. Create team
3. Add members

### Manage Permissions
1. Go to Configuration > Users
2. Edit user
3. Assign roles: Viewer, Editor, Admin

## Plugins

### Install Plugin
1. Go to Configuration > Plugins
2. Find plugin
3. Click "Install"

### API Commands

```bash
# List plugins
curl http://localhost:3000/api/plugins

# Install plugin
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "grafana-piechart-panel",
    "version": "1.3.0"
  }' \
  http://localhost:3000/api/plugins/install
```

## Provisioning

### Datasource Provisioning (INI)
```ini
[datasources]
[datasources.prometheus]
type = prometheus
url = http://localhost:9090
```

### Dashboard Provisioning (YAML)
```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://localhost:9090

dashboards:
  - name: 'My Dashboard'
    folder: ''
    type: file
    options:
      path: /var/lib/grafana/dashboards
```

## Snapshots

### Create Snapshot
1. Go to Share > Snapshot
2. Set expiration
3. Create snapshot
4. Share URL

## Export & Import

### Export Dashboard
1. Go to Dashboard settings
2. Click "Export JSON"
3. Save file

### Import Dashboard
1. Go to Create > Import
2. Upload JSON file
3. Configure data source
4. Click Import

## Best Practices

- Use folders to organize dashboards
- Use variables for dynamic dashboards
- Set up alerting for critical metrics
- Use annotations to mark events
- Provision configuration as code
- Regularly review and update dashboards
- Use appropriate panel types for data
- Set up user roles and permissions
- Use SSL/TLS for production
- Backup Grafana configuration and dashboards
- Monitor Grafana itself

::: tip
Use Grafana's Explore feature for ad-hoc querying before building dashboards.
:::
