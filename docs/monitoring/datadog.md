# Datadog

Cloud monitoring and analytics platform for infrastructure, applications, and logs. Provides unified monitoring across servers, databases, tools, and services.

## Datadog Agent

### Agent Installation

| Platform | Installation Command |
|----------|---------------------|
| **Debian/Ubuntu** | `DD_API_KEY=<your-api-key> bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)"` |
| **CentOS/RHEL** | `DD_API_KEY=<your-api-key> bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script_agent7.sh)"` |
| **macOS** | `brew install datadog-agent` |
| **Docker** | `docker run -d --name datadog-agent -v /var/run/docker.sock:/var/run/docker.sock:ro -v /proc/:/host/proc/:ro -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro -e DD_API_KEY=<your-api-key> gcr.io/datadoghq/agent:latest` |
| **Kubernetes** | `kubectl apply -f https://raw.githubusercontent.com/DataDog/datadog-agent/master/Dockerfiles/manifests/dancer-agent.yaml` |

### Agent Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `sudo systemctl start datadog-agent` | Start Datadog agent |
| `sudo systemctl stop datadog-agent` | Stop Datadog agent |
| `sudo systemctl restart datadog-agent` | Restart Datadog agent |
| `sudo systemctl status datadog-agent` | Check agent status |
| `sudo datadog-agent status` | View detailed agent status |
| `sudo datadog-agent configcheck` | Validate agent configuration |
| `sudo datadog-agent diagnose` | Run agent diagnostics |
| `sudo datadog-agent health` | Check agent health |
| `sudo datadog-agent flare <case-id>` | Collect diagnostic info |

### Agent Configuration

| File | Location | Description |
|------|-----------|-------------|
| `datadog.yaml` | `/etc/datadog-agent/datadog.yaml` | Main configuration file |
| `conf.d/` | `/etc/datadog-agent/conf.d/` | Integration configurations |

### Basic Configuration

```yaml
# datadog.yaml
api_key: <your-api-key>
site: datadoghq.com  # or datadoghq.eu for EU

# Enable process monitoring
process_config:
  enabled: true

# Enable logs collection
logs_enabled: true

# Enable trace collection
apm_config:
  enabled: true

# Enable dogstatsd
use_dogstatsd: true
dogstatsd_port: 8125
```

### Integrations Configuration

```yaml
# conf.d/nginx.yaml
init_config:

instances:
  - nginx_status_url: http://localhost/nginx_status/
    tags:
      - env:production
      - service:web
```

```yaml
# conf.d/postgres.yaml
init_config:

instances:
  - host: localhost
    port: 5432
    username: datadog
    password: <password>
    dbname: postgres
    tags:
      - env:production
```

## Datadog CLI (dog)

### Installation

```bash
# Using pip
pip install datadog

# Using Homebrew
brew install datadog-cli
```

### Monitor Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `dog metric post <metric_name> <value>` | Submit custom metric |
| `dog metric query "avg:system.cpu.user"` | Query metric |
| `dog event post <title>` | Post event |
| `dog event post "Deployment" --text "Deployed version 1.0.0"` | Post event with details |
| `dog tag assign <host_id> "env:production,service:web"` | Assign tags to host |
| `dog monitor list` | List all monitors |
| `dog monitor get <monitor_id>` | Get monitor details |
| `dog monitor create --type <type> --name <name> --query <query>` | Create monitor |
| `dog monitor delete <monitor_id>` | Delete monitor |
| `dog downtimes list` | List scheduled downtimes |
| `dog downtimes create` | Create downtime |

### Monitor Examples

```bash
# Create alert monitor
dog monitor create --type metric alert \
  --name "High CPU Usage" \
  --query "avg(last_5m):avg:system.cpu.user{host:web-01} > 80" \
  --message "CPU usage is above 80%" \
  --tags env:production,team:ops

# Create log alert
dog monitor create --type log alert \
  --name "Error Logs" \
  --query "logs(\"service:web status:error\").count() > 10" \
  --message "Too many error logs"

# Create synthetic test
dog monitor create --type synthetics alert \
  --name "Website Availability" \
  --query "average(last_1h):avg:synthetics.check{service:web-01} < 1" \
  --message "Website is down"
```

## Datadog Metrics

### Metric Types

| Type | Description | Example |
|------|-------------|---------|
| **Gauge** | Value that can go up or down | `system.cpu.user` |
| **Rate** | Rate per second | `nginx.requests.rate` |
| **Count** | Counter | `web.requests.total` |
| **Histogram** | Distribution of values | `sql.query.time` |

### Custom Metrics

```bash
# Submit custom metric via agent
curl -X POST -H "Content-type: text/json" \
  -d '{"series": [{"metric":"custom.metric", "points":[[1634567890, 42]], "tags":["env:production"]}]' \
  'https://api.datadoghq.com/api/v1/series?api_key=<your-api-key>'

# Submit via dogstatsd
echo "custom.metric:42|g|#env:production" | nc -u -w 1 127.0.0.1 8125

# Submit in code (Python)
from datadog import initialize, statsd

statsd = statsd.Statsd(host='localhost', port=8125)
statsd.gauge('custom.metric', 42, tags=['env:production'])
```

## Datadog Monitors

### Monitor Types

| Type | Description | Example |
|------|-------------|---------|
| **Metric Alert** | Alert on metric threshold | `avg:system.cpu.user > 80` |
| **Log Alert** | Alert on log patterns | `logs("error").count() > 10` |
| **Process Alert** | Alert on process status | `process.name{process_name:nginx}.exists() < 1` |
| **Network Alert** | Alert on network issues | `network.http.response_time > 1000` |
| **Synthetic Alert** | Alert on synthetic test | `synthetics.check{test:website} < 1` |
| **CI Monitor** | Alert on CI failures | `ci.pipeline.result{pipeline:deploy} = 0` |

### Monitor Query Syntax

```yaml
# Metric alert
avg(last_5m):avg:system.cpu.user{host:web-01} > 80

# Log alert
logs("service:web status:error").count() > 10

# Process alert
process.name{process_name:nginx}.exists() < 1

# Network alert
network.http.response_time{url:https://example.com} > 1000

# Synthetics alert
synthetics.check{test:website} < 1
```

### Monitor Configuration

```json
{
  "name": "High CPU Usage",
  "type": "metric alert",
  "query": "avg(last_5m):avg:system.cpu.user{host:web-01} > 80",
  "message": "CPU usage is above 80% on {{host.name}}",
  "tags": ["env:production", "team:ops"],
  "options": {
    "thresholds": {
      "critical": 80,
      "warning": 70
    },
    "notify_no_data": false,
    "notify_audit": false,
    "timeout_h": 60
  }
}
```

## Datadog Logs

### Log Collection

```yaml
# Enable logs in datadog.yaml
logs_enabled: true

# Collect logs from file
logs:
  - type: file
    path: "/var/log/nginx/access.log"
    service: nginx
    source: nginx

  - type: file
    path: "/var/log/app/application.log"
    service: app
    source: app
```

### Log Queries

| Query | Description |
|--------|-------------|
| `service:nginx` | Logs from nginx service |
| `status:error` | Error logs |
| `service:nginx status:error` | Nginx error logs |
| `service:nginx status:error OR status:warning` | Error or warning logs |
| `@env:production` | Production environment logs |
| `service:nginx @env:production` | Production nginx logs |
| `"timeout"` | Logs containing "timeout" |
| `service:nginx | count()` | Count nginx logs |

### Log Pipelines

```yaml
# Add custom fields
- grok:
    pattern: "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}"
    source: "application"
- add_tags:
    tags:
      - "env:production"
- date:
    match_rules:
      - "timestamp:dd/MMM/yyyy:HH:mm:ss Z"
```

## Datadog APM (Application Performance Monitoring)

### APM Configuration

```yaml
# datadog.yaml
apm_config:
  enabled: true

# Environment variables
DD_APM_ENABLED=true
DD_SERVICE_NAME=my-app
DD_ENV=production
DD_TRACE_ANALYTICS_ENABLED=true
```

### APM Integration Examples

```python
# Python
from ddtrace import tracer

@tracer.wrap(service='my-app', resource='endpoint')
def handle_request():
    pass

# Distributed tracing
from ddtrace import patch_all
patch_all()
```

```javascript
// Node.js
const tracer = require('dd-trace').init({
  service: 'my-app',
  env: 'production',
  logInjection: true
});

app.use(tracer.expressMiddleware());
```

```java
// Java
import datadog.trace.api.DDTags;
import datadog.trace.api.Tracer;

Tracer tracer = GlobalTracer.get();
tracer.buildSpan("operation")
  .withTag(DDTags.SERVICE_NAME, "my-app")
  .start()
  .finish();
```

## Datadog Dashboards

### Create Dashboard via CLI

```bash
# Create dashboard
dog dashboard create \
  --title "System Overview" \
  --description "Main system metrics" \
  --widgets '[{
    "definition": {
      "type": "timeseries",
      "requests": [{
        "q": "avg:system.cpu.user{host:web-01}"
      }]
    },
    "layout": {"x": 0, "y": 0, "w": 6, "h": 4}
  }]'
```

### Dashboard Widgets

| Type | Description |
|------|-------------|
| **timeseries** | Time series graph |
| **query_value** | Single value |
| **toplist** | Top values |
| **geomap** | Geographic map |
| **hostmap** | Host topology |
| **log_stream** | Live log stream |
| **note** | Text note |

### Dashboard Example

```json
{
  "title": "Web Application Dashboard",
  "description": "Application and infrastructure metrics",
  "widgets": [
    {
      "definition": {
        "type": "timeseries",
        "requests": [
          {"q": "avg:system.cpu.user{service:web}", "display_type": "line"}
        ],
        "title": "CPU Usage"
      },
      "layout": {"x": 0, "y": 0, "w": 6, "h": 4}
    },
    {
      "definition": {
        "type": "timeseries",
        "requests": [
          {"q": "avg:nginx.net.request_per_s{service:web}", "display_type": "area"}
        ],
        "title": "Request Rate"
      },
      "layout": {"x": 6, "y": 0, "w": 6, "h": 4}
    }
  ]
}
```

## Datadog Tags

### Tag Best Practices

| Best Practice | Example |
|--------------|---------|
| Use consistent naming | `env:production`, not `env:prod` |
| Use lowercase | `service:web`, not `Service:web` |
| Use hyphens for multi-word | `team:ops`, not `team:ops_team` |
| Use consistent value types | `env:production`, not `env:prod` |
| Limit tags per metric | ~50 tags maximum |
| Use tag prefixes | `team:`, `env:`, `service:` |

### Common Tags

| Tag | Values | Purpose |
|-----|---------|---------|
| `env` | `production`, `staging`, `dev` | Environment separation |
| `service` | `web`, `api`, `database` | Service identification |
| `team` | `ops`, `dev`, `security` | Team responsibility |
| `version` | `1.0.0`, `2.1.3` | Version tracking |
| `region` | `us-east-1`, `eu-west-1` | Geographic location |
| `tier` | `frontend`, `backend`, `data` | Application tier |

## Datadog Alerts and Notifications

### Alert Thresholds

```yaml
options:
  thresholds:
    critical: 90
    warning: 70
    critical_recovery: 80
    warning_recovery: 65
```

### Notification Channels

| Channel | Configuration |
|---------|---------------|
| **Email** | Specify email addresses |
| **Slack** | Configure Slack webhook |
| **PagerDuty** | Configure PagerDuty service key |
| **Webhook** | POST to custom endpoint |
| **SMS** | Phone number (paid feature) |

### Alert Routing

```yaml
# Route to specific team
tags:
  - team:ops
  - severity:critical

# Multiple notifications
notifications:
  - "@webhook-https://hooks.slack.com/services/..."
  - "pagerduty@team-ops"

# Warning vs Critical
options:
  thresholds:
    critical: 90
    warning: 70
notification_channels:
  - slack
  - email
```

## Datadog Synthetics

### Synthetic Test Types

| Type | Description |
|------|-------------|
| **API Test** | HTTP endpoint monitoring |
| **Browser Test** | Multi-step browser tests |
| **TCP Test** | Port and protocol testing |
| **DNS Test** | DNS resolution monitoring |

### Create API Test

```bash
# Create API synthetic test
dog synthetics create \
  --type api \
  --subtype http \
  --name "API Health Check" \
  --url "https://api.example.com/health" \
  --request_method GET \
  --assertions '[{"operator":"is","type":"statusCode","target":200}]'
```

### Create Browser Test

```bash
# Create browser synthetic test
dog synthetics create \
  --type browser \
  --name "Login Test" \
  --config '{"locations":["us-east-1"]}'
```

## Datadog RUM (Real User Monitoring)

### RUM Configuration

```html
<!-- JavaScript RUM integration -->
<script>
  (function(h,o,u,n,d) {
    h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
    d=o.createElement(u);d.async=1;d.src=n
    n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
  })(window,document,"script","https://www.datadoghq-browser-agent.com/datadog-rum-v4.js","DD_RUM")
  DD_RUM.onReady(function() {
    DD_RUM.init({
      clientToken: '<client-token>',
      applicationId: '<app-id>',
      site: 'datadoghq.com',
      sampleRate: 100,
      trackInteractions: true
    })
  })
</script>
```

## Datadog Integrations

### Popular Integrations

| Integration | Description |
|--------------|-------------|
| **AWS** | CloudWatch, EC2, S3, RDS |
| **Kubernetes** | Pod, node, and service metrics |
| **Docker** | Container metrics and logs |
| **Nginx** | Web server metrics |
| **PostgreSQL** | Database metrics |
| **Redis** | Cache metrics |
| **Elasticsearch** | Search engine metrics |
| **Jenkins** | CI/CD metrics |

### Integration Setup

```bash
# Install integration
# 1. Enable integration in datadog.yaml
# 2. Create config file in conf.d/
# 3. Restart agent

# Example: PostgreSQL integration
# conf.d/postgres.yaml
init_config:

instances:
  - host: localhost
    port: 5432
    username: datadog
    password: <password>
    dbname: postgres
    tags:
      - env:production
```

## Datadog Best Practices

1. **Use Tags Effectively** - Organize metrics with tags
2. **Set Appropriate Thresholds** - Avoid alert fatigue
3. **Use Dashboards** - Visualize metrics proactively
4. **Monitor Key Metrics** - Focus on business-critical metrics
5. **Set Up Alerts** - Get notified early on issues
6. **Use Synthetics** - Monitor from user perspective
7. **Enable APM** - Understand application performance
8. **Collect Logs** - Correlate logs with metrics
9. **Use RUM** - Monitor real user experience
10. **Review Alerts Regularly** - Optimize alert rules

## Datadog Pricing

| Metric Type | Pricing Model |
|--------------|---------------|
| **Host Metrics** | Per host |
| **Custom Metrics** | Per custom metric |
| **Logs** | Per GB ingested and retained |
| **APM** | Per traced request |
| **Synthetics** | Per test run |
| **RUM** | Per session |

## Useful Tips

### Agent Troubleshooting

```bash
# Check agent status
sudo datadog-agent status

# Validate configuration
sudo datadog-agent configcheck

# Run diagnostics
sudo datadog-agent diagnose

# View logs
sudo tail -f /var/log/datadog/agent.log
```

### API Usage

```bash
# Submit metric
curl -X POST "https://api.datadoghq.com/api/v1/series?api_key=<your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "series": [{
      "metric": "system.cpu.user",
      "points": [[1634567890, 42.0]],
      "tags": ["host:web-01", "env:production"]
    }]
  }'

# Query metrics
curl -X GET "https://api.datadoghq.com/api/v1/query?query=avg:system.cpu.user&from=1634567890&to=1634654290&api_key=<your-api-key>"

# List monitors
curl -X GET "https://api.datadoghq.com/api/v1/monitor?api_key=<your-api-key>"
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Agent not reporting | Check `datadog-agent status` and API key |
| High log volume | Filter logs, reduce log level |
| False positives | Adjust thresholds, add more context |
| Slow APM traces | Increase sampling rate, optimize code |
| Dashboard lag | Reduce query time range, limit widgets |

### Datadog vs Other Monitoring Tools

| Feature | Datadog | Prometheus | New Relic |
|----------|-----------|------------|-----------|
| **SaaS vs Self-Hosted** | SaaS | Self-hosted | SaaS |
| **Learning Curve** | Easy | Moderate | Moderate |
| **Integrations** | 400+ | 100+ | 100+ |
| **APM** | Yes | Yes (Jaeger) | Yes |
| **Logs** | Yes | Needs Loki/ELK | Yes |
| **Pricing** | Per host | Free | Per user/host |
| **Alerting** | Native | Alertmanager | Native |
