# Jaeger

Distributed tracing platform for monitoring and troubleshooting transactions in complex, microservices-based systems. Helps visualize the flow of requests across services.

## Jaeger Architecture

| Component | Description |
|-----------|-------------|
| **Jaeger Client** | Libraries for instrumenting applications |
| **Jaeger Agent** | Network daemon that listens for spans |
| **Jaeger Collector** | Receives traces and writes to storage |
| **Jaeger UI** | Web interface for query and visualization |
| **Jaeger Storage** | Backend storage for traces (Elasticsearch, Cassandra, Kafka) |

## Jaeger Installation

### Docker

```bash
# Run Jaeger all-in-one
docker run -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -p 5775:5775/udp \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 14268:14268 \
  -p 14250:14250 \
  -p 9411:9411 \
  jaegertracing/all-in-one:latest
```

### Docker Compose

```yaml
version: '3'
services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
      - "16686:16686"
      - "14268:14268"
      - "14250:14250"
      - "9411:9411"
    environment:
      - COLLECTOR_ZIPKIN_HOST_PORT=:9411
```

### Kubernetes

```bash
# Install Jaeger Operator
kubectl create namespace observability
kubectl apply -f https://raw.githubusercontent.com/jaegertracing/jaeger-operator/main/deploy/crds/jaegertracing.io_jaegers_crd.yaml
kubectl apply -f https://raw.githubusercontent.com/jaegertracing/jaeger-operator/main/deploy/service_account.yaml
kubectl apply -f https://raw.githubusercontent.com/jaegertracing/jaeger-operator/main/deploy/role.yaml
kubectl apply -f https://raw.githubusercontent.com/jaegertracing/jaeger-operator/main/deploy/role_binding.yaml
kubectl apply -f https://raw.githubusercontent.com/jaegertracing/jaeger-operator/main/deploy/operator.yaml

# Create Jaeger instance
kubectl apply -f -n observability -f - <<EOF
apiVersion: jaegertracing.io/v1
kind: Jaeger
metadata:
  name: simplest
EOF
```

### Binary

```bash
# Download Jaeger binary
curl -L https://github.com/jaegertracing/jaeger/releases/download/v1.44.0/jaeger-1.44.0-linux-amd64.tar.gz | tar xz

# Run Jaeger all-in-one
./jaeger-1.44.0-linux-amd64/jaeger-all-in-one
```

## Jaeger UI

### Access Jaeger UI

| URL | Description |
|-----|-------------|
| `http://localhost:16686` | Jaeger UI (main interface) |
| `http://localhost:16687` | Jaeger metrics (Prometheus) |

### UI Features

| Feature | Description |
|----------|-------------|
| **Search Traces** | Find traces by service, operation, tags |
| **Trace Detail View** | View individual trace with all spans |
| **Dependency Graph** | Visualize service dependencies |
| **Trace Timeline** | Timeline view of spans |
| **Span Details** | View span attributes and logs |
| **Compare Traces** | Compare multiple traces |

## Jaeger Client Libraries

### Python

```bash
# Install Jaeger client
pip install jaeger-client
```

```python
from jaeger_client import Config

# Initialize Jaeger tracer
config = Config(
    config={
        'sampler': {
            'type': 'const',
            'param': 1,
        },
        'logging': True,
        'reporter_batch_size': 100,
    },
    service_name='my-service',
)
tracer = config.initialize_tracer()

# Create a span
with tracer.start_span('operation-name') as span:
    span.set_tag('key', 'value')
    span.log_kv({'event': 'database-query', 'query': 'SELECT * FROM users'})
    
    # Do work here
    result = query_database()
    
    # Set span status
    span.set_tag('success', True)
```

### JavaScript/Node.js

```bash
# Install Jaeger client
npm install jaeger-client
```

```javascript
const initTracer = require('jaeger-client').initTracer;

// Initialize Jaeger tracer
const tracer = initTracer(
  'my-service',
  new UDPSender({
    host: 'localhost',
    port: 6831
  })
);

// Create a span
const span = tracer.startSpan('operation-name');
span.setTag('key', 'value');
span.log({ event: 'database-query', query: 'SELECT * FROM users' });

// Do work here
const result = queryDatabase();

// Finish span
span.setTag('success', true);
span.finish();
```

### Go

```bash
# Install Jaeger client
go get -u github.com/uber/jaeger-client-go
```

```go
package main

import (
    "github.com/uber/jaeger-client-go"
    jaegercfg "github.com/uber/jaeger-client-go/config"
)

func main() {
    // Initialize Jaeger tracer
    cfg := jaegercfg.Configuration{
        Sampler: &jaegercfg.SamplerConfig{
            Type:  jaeger.SamplerTypeConst,
            Param:  1,
        },
        Reporter: &jaegercfg.ReporterConfig{
            LogSpans: true,
        },
    }
    tracer, closer, _ := cfg.New("my-service", jaegercfg.NewLogger(jaeger.StdLogger))
    defer closer.Close()

    // Create a span
    span := tracer.StartSpan("operation-name")
    span.SetTag("key", "value")
    span.LogFields(log.Field{Event: "database-query", Query: "SELECT * FROM users"})

    // Do work here
    result := queryDatabase()

    // Finish span
    span.SetTag("success", true)
    span.Finish()
}
```

### Java

```xml
<!-- Maven dependency -->
<dependency>
    <groupId>io.jaegertracing</groupId>
    <artifactId>jaeger-client</artifactId>
    <version>1.8.0</version>
</dependency>
```

```java
import io.jaegertracing.Configuration;

// Initialize Jaeger tracer
Configuration.SamplerConfiguration samplerConfig = Configuration.SamplerConfiguration.fromEnv().withType("const").withParam(1);
Configuration.ReporterConfiguration reporterConfig = Configuration.ReporterConfiguration.fromEnv().withLogSpans(true);
Configuration configuration = new Configuration("my-service", samplerConfig, reporterConfig);
Tracer tracer = configuration.getTracer();

// Create a span
Span span = tracer.buildSpan("operation-name").start();
span.setTag("key", "value");
span.log(Map.of("event", "database-query", "query", "SELECT * FROM users"));

// Do work here
Object result = queryDatabase();

// Finish span
span.setTag("success", true);
span.finish();
```

## Jaeger OpenTelemetry Integration

### Python with OpenTelemetry

```bash
pip install opentelemetry-exporter-jaeger
```

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter

# Configure Jaeger exporter
jaeger_exporter = JaegerExporter(
    agent_host_name="localhost",
    agent_port=6831,
)

# Set up tracer provider
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Add Jaeger exporter
span_processor = BatchSpanProcessor(jaeger_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

# Create span
with tracer.start_as_current_span("operation-name") as span:
    span.set_attribute("key", "value")
```

### JavaScript with OpenTelemetry

```bash
npm install @opentelemetry/exporter-trace-jaeger
```

```javascript
const { JaegerExporter } = require('@opentelemetry/exporter-trace-jaeger');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');

// Configure Jaeger exporter
const exporter = new JaegerExporter({
  serviceName: 'my-service',
  host: 'localhost',
  port: 6831,
});

// Set up tracer provider
const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
```

## Jaeger Querying

### UI Search

| Field | Description | Example |
|--------|-------------|---------|
| **Service** | Service name | `frontend`, `api` |
| **Operation** | Operation name | `GET /users`, `db.query` |
| **Tags** | Key-value pairs | `env:production`, `user:123` |
| **Start Time** | Trace start time | Select from calendar |
| **Duration** | Trace duration | `min: 10ms, max: 1s` |
| **Limit** | Number of results | `10`, `50`, `100` |

### Query Examples

```
# Find traces for service
service: frontend

# Find traces with tag
service: frontend tag: env:production

# Find traces for operation
service: api operation: GET /users

# Find traces by duration
service: api minDuration: 10ms maxDuration: 1s

# Combine queries
service: api tag: env:production operation: POST /users
```

### API Querying

```bash
# Query traces via API
curl -X GET "http://localhost:16686/api/traces?service=api&limit=10"

# Query traces with operation
curl -X GET "http://localhost:16686/api/traces?service=api&operation=GET%20/users&limit=10"

# Query traces with tags
curl -X GET "http://localhost:16686/api/traces?service=api&tag=env:production&limit=10"

# Get trace by ID
curl -X GET "http://localhost:16686/api/traces/{trace-id}"
```

## Jaeger Storage Backends

### Elasticsearch

```yaml
# Jaeger configuration with Elasticsearch
es:
  server-urls: http://elasticsearch:9200
  index-prefix: jaeger-
  username: elastic
  password: changeme
```

### Cassandra

```yaml
# Jaeger configuration with Cassandra
cassandra:
  servers: cassandra
  keyspace: jaeger_v1_dc1
  username: cassandra
  password: changeme
```

### Kafka (for buffering)

```yaml
# Jaeger configuration with Kafka
kafka:
  topic: jaeger-spans
  brokers: kafka:9092
```

## Jaeger Sampling

### Sampler Types

| Sampler | Description |
|----------|-------------|
| **Const** | Sample all or none traces |
| **Probabilistic** | Sample percentage of traces |
| **Rate Limiting** | Sample up to X traces per second |
| **Remote** | Controlled by remote sampler |

### Sampling Configuration

```python
# Python - Const sampler (100%)
config = Config(
    config={
        'sampler': {
            'type': 'const',
            'param': 1,
        },
    },
    service_name='my-service',
)

# Python - Probabilistic sampler (10%)
config = Config(
    config={
        'sampler': {
            'type': 'probabilistic',
            'param': 0.1,
        },
    },
    service_name='my-service',
)

# Python - Rate limiting sampler (100 traces/sec)
config = Config(
    config={
        'sampler': {
            'type': 'ratelimiting',
            'param': 100,
        },
    },
    service_name='my-service',
)
```

### Sampling Best Practices

1. **Use Probabilistic Sampling** in production to reduce load
2. **Sample 100%** in development/staging for debugging
3. **Use Rate Limiting** to control maximum trace rate
4. **Sample Based on Service Importance** - Critical services: 100%, others: 10%
5. **Adjust Sampling Rate** based on storage capacity

## Jaeger Tags and Logs

### Adding Tags

```python
# Python
span.set_tag('http.method', 'GET')
span.set_tag('http.url', '/api/users')
span.set_tag('http.status_code', 200)
span.set_tag('user.id', '123')
```

### Adding Logs

```python
# Python
span.log_kv({
    'event': 'database-query-started',
    'query': 'SELECT * FROM users WHERE id = 123',
    'timestamp': time.time()
})

span.log_kv({
    'event': 'database-query-completed',
    'rows_affected': 5,
    'duration_ms': 42
})
```

### Standard Tags

| Tag | Description | Example |
|-----|-------------|---------|
| `http.method` | HTTP method | `GET`, `POST` |
| `http.url` | HTTP URL | `/api/users` |
| `http.status_code` | HTTP status code | `200`, `404` |
| `db.statement` | Database query | `SELECT * FROM users` |
| `db.type` | Database type | `postgresql`, `mysql` |
| `error` | Error flag | `true`, `false` |
| `span.kind` | Span type | `client`, `server`, `producer`, `consumer` |

## Jaeger Best Practices

1. **Use Service Naming Convention** - Use consistent naming (e.g., `service-name`)
2. **Add Meaningful Tags** - Add business context to spans
3. **Use Proper Sampling** - Balance detail with storage costs
4. **Add Logs to Spans** - Mark important events
5. **Use Child Spans** - Break long operations into logical parts
6. **Monitor Jaeger Health** - Track collector and storage health
7. **Archive Old Traces** - Set up trace retention policy
8. **Use Production-like Sampling** in development
9. **Correlate with Metrics** - Link traces with metrics
10. **Use OpenTelemetry** - Future-proof instrumentation

## Jaeger Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| No traces in UI | Check agent connectivity, collector health |
| Incomplete traces | Ensure context propagation across services |
| High storage usage | Adjust sampling rate, add retention policy |
| Slow queries | Optimize Elasticsearch indexes, reduce trace duration limit |
| Missing spans | Check sampler configuration, network connectivity |

### Debugging

```bash
# Check Jaeger agent logs
docker logs jaeger

# Check Jaeger collector logs
docker logs jaeger-collector

# Check Elasticsearch connection
curl -X GET http://localhost:9200/_cluster/health

# Check Cassandra connection
cqlsh cassandra
```

## Jaeger vs Other Tracing Tools

| Feature | Jaeger | Zipkin | Datadog |
|----------|---------|--------|-----------|
| **Open Source** | Yes | Yes | No |
| **Vendor** | CNCF | OpenZipkin | SaaS |
| **Storage** | Multiple | Multiple | Proprietary |
| **UI** | Web | Web | Web |
| **Sampling** | Built-in | Basic | Advanced |
| **Integration** | OpenTelemetry | OpenTelemetry | Native |

## Useful Tips

### Running Jaeger in Production

```yaml
# Production Jaeger deployment
version: '3'
services:
  collector:
    image: jaegertracing/jaeger-collector:latest
    environment:
      - SPAN_STORAGE_TYPE=elasticsearch
      - ES_SERVER_URLS=http://elasticsearch:9200
    ports:
      - "14250:14250/tcp"
      - "9411:9411/tcp"
  
  query:
    image: jaegertracing/jaeger-query:latest
    environment:
      - SPAN_STORAGE_TYPE=elasticsearch
      - ES_SERVER_URLS=http://elasticsearch:9200
    ports:
      - "16686:16686"
  
  agent:
    image: jaegertracing/jaeger-agent:latest
    command: ["--reporter.grpc.host-port=collector:14250"]
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
```

### Jaeger Configuration File

```yaml
# jaeger-config.yaml
sampling:
  default_strategy:
    type: probabilistic
    param: 0.1  # 10% sampling

storage:
  type: elasticsearch
  elasticsearch:
    servers: http://elasticsearch:9200
    index_prefix: jaeger-
    username: elastic
    password: changeme

query:
  base-path: /
```

### Run with Custom Config

```bash
jaeger-all-in-one --config-file jaeger-config.yaml
```
