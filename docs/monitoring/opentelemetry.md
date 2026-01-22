# OpenTelemetry

Open-source observability framework for generating, collecting, analyzing, and exporting telemetry data (logs, metrics, and traces). Vendor-agnostic standard for observability.

## OpenTelemetry Components

| Component | Description |
|-----------|-------------|
| **API** | Programming interfaces for telemetry |
| **SDK** | Language-specific implementations of API |
| **Collector** | Service to receive, process, and export telemetry |
| **Instrumentation** | Libraries for instrumenting applications |
| **Exporters** | Send telemetry to backends (Jaeger, Prometheus, Datadog) |
| **Processors** | Process telemetry before export |
| **Receivers** | Receive telemetry from external sources |

## OpenTelemetry Concepts

### Signals

| Signal | Description | Examples |
|--------|-------------|----------|
| **Traces** | Request lifecycle across services | HTTP requests, database queries |
| **Metrics** | Numerical measurements over time | Request count, CPU usage |
| **Logs** | Text records with metadata | Application logs, error logs |

### Key Concepts

| Concept | Description |
|----------|-------------|
| **Span** | Single operation or unit of work |
| **Trace** | Tree of spans representing a request |
| **Trace ID** | Unique identifier for entire request |
| **Span ID** | Unique identifier for individual span |
| **Parent Span** | Span that initiated another span |
| **Root Span** | First span in a trace |
| **Context** | Propagates trace information across services |
| **Baggage** | Key-value pairs propagated across spans |
| **Attributes** | Key-value pairs attached to spans |
| **Events** | Timed events within a span |
| **Links** | Relationship between spans |

## OpenTelemetry Installation

### Python

```bash
# Install SDK and exporters
pip install opentelemetry-api opentelemetry-sdk
pip install opentelemetry-instrumentation-flask
pip install opentelemetry-instrumentation-requests
pip install opentelemetry-exporter-jaeger
pip install opentelemetry-exporter-prometheus
pip install opentelemetry-exporter-otlp
```

### JavaScript/Node.js

```bash
# Install SDK and exporters
npm install @opentelemetry/api
npm install @opentelemetry/sdk-node
npm install @opentelemetry/auto-instrumentations-node
npm install @opentelemetry/exporter-trace-jaeger
npm install @opentelemetry/exporter-metrics-prometheus
npm install @opentelemetry/exporter-trace-otlp
```

### Go

```bash
# Install SDK and exporters
go get go.opentelemetry.io/otel
go get go.opentelemetry.io/otel/sdk
go get go.opentelemetry.io/otel/exporters/jaeger
go get go.opentelemetry.io/otel/exporters/prometheus
go get go.opentelemetry.io/otel/exporters/otlp
```

### Java

```xml
<!-- Maven dependency -->
<dependency>
  <groupId>io.opentelemetry</groupId>
  <artifactId>opentelemetry-api</artifactId>
  <version>1.0.0</version>
</dependency>
<dependency>
  <groupId>io.opentelemetry</groupId>
  <artifactId>opentelemetry-sdk</artifactId>
  <version>1.0.0</version>
</dependency>
<dependency>
  <groupId>io.opentelemetry</groupId>
  <artifactId>opentelemetry-exporter-jaeger</artifactId>
  <version>1.0.0</version>
</dependency>
```

## OpenTelemetry Tracing (Python)

### Basic Tracing Setup

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor

# Configure tracer provider
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Add console exporter
span_processor = SimpleSpanProcessor(ConsoleSpanExporter())
trace.get_tracer_provider().add_span_processor(span_processor)

# Create a span
with tracer.start_as_current_span("operation"):
    # Do work here
    pass
```

### Jaeger Exporter

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter

# Configure tracer provider
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Add Jaeger exporter
jaeger_exporter = JaegerExporter(
    agent_host_name="localhost",
    agent_port=6831,
)
span_processor = BatchSpanProcessor(jaeger_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

# Create span with attributes
with tracer.start_as_current_span("operation") as span:
    span.set_attribute("operation.name", "my_operation")
    span.set_attribute("operation.type", "sync")
```

### OTLP Exporter

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

# Configure tracer provider
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Add OTLP exporter
otlp_exporter = OTLPSpanExporter(endpoint="http://localhost:4317")
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)
```

### Manual Instrumentation

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

# Create root span
with tracer.start_as_current_span("parent-operation") as parent_span:
    parent_span.set_attribute("user.id", "123")
    
    # Create child span
    with tracer.start_as_current_span("child-operation") as child_span:
        child_span.set_attribute("db.query", "SELECT * FROM users")
        
        # Add event
        child_span.add_event(
            "database-query-started",
            attributes={"query": "SELECT * FROM users"}
        )
        
        # Do work
        result = query_database()
        
        # Set status
        child_span.set_status(Status(StatusCode.OK))
```

### Automatic Instrumentation (Flask)

```python
from flask import Flask
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter

app = Flask(__name__)

# Set up tracing
trace.set_tracer_provider(TracerProvider())
FlaskInstrumentor().instrument_app(app)

@app.route('/')
def hello():
    return "Hello, World!"
```

### Automatic Instrumentation (Requests)

```python
import requests
from opentelemetry import trace
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.sdk.trace import TracerProvider

# Set up tracing
trace.set_tracer_provider(TracerProvider())
RequestsInstrumentor().instrument()

# This request will be automatically traced
response = requests.get('https://api.example.com/data')
```

## OpenTelemetry Metrics (Python)

### Basic Metrics Setup

```python
from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider

# Configure meter provider
metrics.set_meter_provider(MeterProvider())
meter = metrics.get_meter(__name__)

# Create a counter
counter = meter.create_counter(
    "requests",
    description="Number of requests",
)

# Record a metric
counter.add(1, {"endpoint": "/api/users", "method": "GET"})
```

### Gauge

```python
# Create a gauge
gauge = meter.create_gauge(
    "cpu_usage",
    description="CPU usage percentage",
)

# Record a gauge value
gauge.set(75.5, {"host": "web-01", "cpu": "cpu0"})
```

### Histogram

```python
# Create a histogram
histogram = meter.create_histogram(
    "request_duration",
    description="Request duration in seconds",
)

# Record a histogram value
histogram.record(0.123, {"endpoint": "/api/users", "method": "GET"})
```

### Prometheus Exporter

```python
from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export.controller import PushController
from opentelemetry.exporter.prometheus import PrometheusMetricReader

# Set up Prometheus exporter
reader = PrometheusMetricReader()
metrics.set_meter_provider(MeterProvider(metric_readers=[reader]))
meter = metrics.get_meter(__name__)

# Create and record metrics
counter = meter.create_counter("requests")
counter.add(1, {"endpoint": "/"})
```

## OpenTelemetry Logs (Python)

### Basic Logs Setup

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk._logs import LoggerProvider
from opentelemetry.sdk._logs.export import SimpleLogRecordProcessor
from opentelemetry.sdk._logs.export import ConsoleLogRecordExporter

# Set up logging
trace.set_tracer_provider(TracerProvider())
logger_provider = LoggerProvider()
log_processor = SimpleLogRecordProcessor(ConsoleLogRecordExporter())
logger_provider.add_log_record_processor(log_processor)

# Create logger
logger = logger_provider.get_logger(__name__)

# Log an event
logger.info("User logged in", attributes={"user_id": "123", "ip": "192.168.1.1"})
```

## OpenTelemetry Collector

### Collector Architecture

```
Receivers → Processors → Exporters
```

| Component | Description | Examples |
|-----------|-------------|----------|
| **Receivers** | Receive telemetry from external sources | OTLP, Jaeger, Prometheus, Zipkin |
| **Processors** | Process and transform telemetry | Batch, Attributes, Sampling |
| **Exporters** | Send telemetry to backends | Jaeger, Prometheus, Datadog, OTLP |

### Collector Installation

```bash
# Download collector binary
curl -LO https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v0.68.0/otelcol_0.68.0_linux_amd64.tar.gz
tar -xzf otelcol_0.68.0_linux_amd64.tar.gz

# Run collector
./otelcol --config=config.yaml
```

### Collector Configuration (YAML)

```yaml
receivers:
  # Receive OTLP traces
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

  # Receive Prometheus metrics
  prometheus:
    config:
      scrape_configs:
        - job_name: 'otel-collector'
          scrape_interval: 10s
          static_configs:
            - targets: ['0.0.0.0:8888']

processors:
  # Batch traces
  batch:
    timeout: 5s
    max_queue_size: 1000

  # Add attributes
  attributes:
    actions:
      - key: environment
        value: production
        action: insert

exporters:
  # Export to Jaeger
  jaeger:
    endpoint: jaeger:14250
    tls:
      insecure: true

  # Export to Prometheus
  prometheus:
    endpoint: "0.0.0.0:8889"

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch, attributes]
      exporters: [jaeger]

    metrics:
      receivers: [otlp, prometheus]
      processors: [batch]
      exporters: [prometheus]
```

### Collector Exporters

| Exporter | Description | Configuration |
|-----------|-------------|---------------|
| **Jaeger** | Export traces to Jaeger | `jaeger: endpoint: localhost:14250` |
| **Prometheus** | Export metrics to Prometheus | `prometheus: endpoint: 0.0.0.0:8889` |
| **Datadog** | Export to Datadog | `datadog: api: { key: "your-api-key" }` |
| **OTLP** | Export to OTLP endpoint | `otlp: endpoint: http://localhost:4317` |
| **Zipkin** | Export traces to Zipkin | `zipkin: endpoint: http://localhost:9411/api/v2/spans` |
| **Logging** | Export to logs | `logging: loglevel: debug` |

## OpenTelemetry Best Practices

1. **Use Automatic Instrumentation** - Start with auto-instrumentation libraries
2. **Use Semantic Conventions** - Follow naming standards for attributes
3. **Sample Appropriately** - Don't sample 100% in production
4. **Use Context Propagation** - Propagate context across services
5. **Add Meaningful Attributes** - Add business context to spans
6. **Use Spans for Long Operations** - Break long operations into child spans
7. **Add Events to Spans** - Mark important moments in spans
8. **Use Baggage for Propagation** - Propagate user context
9. **Configure Exporters Carefully** - Choose appropriate exporters
10. **Monitor Collector Health** - Monitor collector resource usage

## OpenTelemetry vs Other Tools

| Feature | OpenTelemetry | Jaeger | Prometheus | Datadog |
|----------|----------------|---------|------------|-----------|
| **Vendor Agnostic** | Yes | No | No | No |
| **Tracing** | Yes | Yes | No | Yes |
| **Metrics** | Yes | No | Yes | Yes |
| **Logs** | Yes | No | No | Yes |
| **Language Support** | Multiple | Multiple | Go/Java | Multiple |
| **Backend Required** | Yes | Yes | Yes | Yes |
| **Open Source** | Yes | Yes | Yes | No |
| **Standard** | CNCF standard | Tool | Tool | SaaS |

## OpenTelemetry Semantic Conventions

### Common Span Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `http.method` | HTTP method | `GET`, `POST` |
| `http.url` | Full HTTP URL | `https://api.example.com/users` |
| `http.status_code` | HTTP status code | `200`, `404` |
| `http.scheme` | HTTP scheme | `http`, `https` |
| `http.host` | HTTP host | `api.example.com` |
| `db.system` | Database system | `postgresql`, `mysql` |
| `db.name` | Database name | `mydb` |
| `db.operation` | Database operation | `SELECT`, `INSERT` |
| `net.peer.name` | Remote hostname | `db.example.com` |
| `net.peer.port` | Remote port | `5432` |

### Common Metric Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `service.name` | Service name | `my-service` |
| `service.version` | Service version | `1.0.0` |
| `deployment.environment` | Deployment environment | `production` |
| `host.name` | Hostname | `web-01` |

## OpenTelemetry Resources

### Resource Configuration

```python
from opentelemetry.sdk.resources import Resource, SERVICE_NAME

# Create resource
resource = Resource.create({
    SERVICE_NAME: "my-service",
    "service.version": "1.0.0",
    "deployment.environment": "production",
    "host.name": "web-01"
})

# Use resource with tracer provider
from opentelemetry.sdk.trace import TracerProvider

provider = TracerProvider(resource=resource)
trace.set_tracer_provider(provider)
```

## Common Use Cases

### Use Case: Microservices Tracing

```python
# Service A
import requests
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

@tracer.start_as_current_span("process-request")
def handle_request(user_id):
    with tracer.start_as_current_span("fetch-user") as span:
        span.set_attribute("user.id", user_id)
        response = requests.get(f"http://service-b/users/{user_id}")
        return response.json()

# Service B
@tracer.start_as_current_span("get-user")
def get_user(user_id):
    # Query database
    with tracer.start_as_current_span("query-database") as span:
        span.set_attribute("db.system", "postgresql")
        return query_db(user_id)
```

### Use Case: Metrics Collection

```python
from opentelemetry import metrics

meter = metrics.get_meter(__name__)

# Request counter
request_counter = meter.create_counter("http_requests")

@app.route("/api/users")
def get_users():
    request_counter.add(1, {"endpoint": "/api/users", "method": "GET"})
    return jsonify(users=[])

# Request duration histogram
duration_histogram = meter.create_histogram("http_request_duration")

@app.route("/api/users")
def get_users():
    start_time = time.time()
    result = jsonify(users=[])
    duration_histogram.record(time.time() - start_time)
    return result
```

## Useful Tips

### Debugging Tracing

```python
# Enable debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Export to console for debugging
from opentelemetry.sdk.trace.export import ConsoleSpanExporter
from opentelemetry.sdk.trace.export import SimpleSpanProcessor

exporter = ConsoleSpanExporter()
processor = SimpleSpanProcessor(exporter)
trace.get_tracer_provider().add_span_processor(processor)
```

### Sampling Configuration

```python
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.sampling import TraceIdRatioBased

# Configure 10% sampling
tracer_provider = TracerProvider(
    sampler=TraceIdRatioBased(0.1)
)
trace.set_tracer_provider(tracer_provider)
```

### Batching Configuration

```python
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Configure batch processor
batch_processor = BatchSpanProcessor(
    exporter,
    max_queue_size=2048,
    schedule_delay_millis=5000,
    max_export_batch_size=512
)
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Traces not appearing | Check exporter configuration, network connectivity |
| High CPU usage | Reduce sampling rate, adjust batch size |
| Missing context | Ensure context propagation is enabled |
| Spans not linked | Check trace ID propagation |

### OpenTelemetry Collector Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `otelcol --config config.yaml` | Run collector with config file |
| `otelcol --config=config.yaml --health-check` | Run with health check |
| `otelcol --version` | Show collector version |
| `otelcol validate config.yaml` | Validate collector configuration |
