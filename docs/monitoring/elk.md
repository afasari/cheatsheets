# ELK Stack

Elasticsearch, Logstash, Kibana, and Beats for log management.

## Installation

### Docker Compose
```yaml
version: '3'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    ports:
      - "9200:9200"
      - "9300:9300"
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    ports:
      - "5044:5044"
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

## Elasticsearch

### Index Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `PUT /index_name` | Create index |
| `DELETE /index_name` | Delete index |
| `GET /index_name` | Get index info |
| `GET /_cat/indices?v` | List all indices |
| `GET /_cat/indices/index_name?v` | Show index details |
| `POST /index_name/_refresh` | Refresh index |
| `POST /index_name/_forcemerge` | Force merge index |

### Document Operations

| COMMAND | DESCRIPTION |
| --- | --- |
| `PUT /index/_doc/id` | Create/update document |
| `GET /index/_doc/id` | Get document |
| `DELETE /index/_doc/id` | Delete document |
| `POST /index/_doc` | Create document (auto ID) |
| `POST /index/_update/id` | Update document |
| `GET /index/_search` | Search documents |

### Search Queries

### Basic Search
```json
GET /index/_search
{
  "query": {
    "match": {
      "field": "value"
    }
  }
}
```

### Multi-match
```json
{
  "query": {
    "multi_match": {
      "query": "search term",
      "fields": ["title", "description"]
    }
  }
}
```

### Bool Query
```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "field1": "value1" } }
      ],
      "must_not": [
        { "match": { "field2": "value2" } }
      ],
      "should": [
        { "match": { "field3": "value3" } }
      ]
    }
  }
}
```

### Range Query
```json
{
  "query": {
    "range": {
      "price": {
        "gte": 10,
        "lte": 100
      }
    }
  }
}
```

### Aggregation
```json
{
  "size": 0,
  "aggs": {
    "avg_price": {
      "avg": { "field": "price" }
    },
    "by_category": {
      "terms": {
        "field": "category.keyword",
        "size": 10
      }
    }
  }
}
```

## Logstash

### Configuration
```ini
input {
  file {
    path => "/var/log/*.log"
    start_position => "beginning"
  }
}

filter {
  grok {
    match => { "message" => "%{COMBINEDAPACHELOG}" }
  }
  date {
    match => [ "timestamp", "dd/MMM/yyyy:HH:mm:ss Z" ]
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
}
```

### Inputs

| INPUT | DESCRIPTION |
| --- | --- |
| `file` | Read from file |
| `beats` | Receive from Beats |
| `tcp` | TCP input |
| `udp` | UDP input |
| `http` | HTTP input |
| `stdin` | Standard input |

### Filters

| FILTER | DESCRIPTION |
| --- | --- |
| `grok` | Parse unstructured data |
| `date` | Parse date fields |
| `mutate` | Modify fields |
| `geoip` | Add geo information |
| `useragent` | Parse user-agent |
| `csv` | Parse CSV data |
| `json` | Parse JSON data |

### Outputs

| OUTPUT | DESCRIPTION |
| --- | --- |
| `elasticsearch` | Send to Elasticsearch |
| `file` | Write to file |
| `stdout` | Write to stdout |
| `kafka` | Send to Kafka |
| `http` | HTTP output |

## Kibana

### Management
| COMMAND | DESCRIPTION |
| --- | --- |
| `Kibana > Management > Index Patterns` | Create index pattern |
| `Kibana > Discover` | Explore data |
| `Kibana > Visualize` | Create visualizations |
| `Kibana > Dashboard` | Create dashboards |
| `Kibana > Dev Tools` | Console for queries |

### Create Index Pattern
1. Go to Stack Management > Index Patterns
2. Click "Create index pattern"
3. Enter pattern (e.g., `logs-*`)
4. Select time field
5. Click "Create index pattern"

### Dev Tools Queries

```json
// Create index
PUT /my-index
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "price": { "type": "float" }
    }
  }
}

// Index document
PUT /my-index/_doc/1
{
  "title": "Product",
  "price": 100.0
}

// Search
GET /my-index/_search
{
  "query": {
    "match": {
      "title": "Product"
    }
  }
}
```

## Filebeat

### Configuration
```yaml
filebeat.inputs:
  - type: log
    paths:
      - /var/log/*.log

output.elasticsearch:
  hosts: ["http://elasticsearch:9200"]
  index: "filebeat-%{+yyyy.MM.dd}"

setup.kibana:
  host: "http://kibana:5601"
```

### Modules

```bash
# List modules
filebeat modules list

# Enable module
filebeat modules enable nginx

# Configure module
vim /etc/filebeat/modules.d/nginx.yml

# Test configuration
filebeat test config
```

## Metricbeat

### Configuration
```yaml
metricbeat.modules:
  - module: system
    metricsets: ["cpu", "memory", "network"]
    enabled: true

output.elasticsearch:
  hosts: ["http://elasticsearch:9200"]
```

## Packetbeat

### Configuration
```yaml
packetbeat.flows:
  - timeout: 30s
    record: true

packetbeat.protocols.http:
  ports: [80, 8080, 8000]

output.elasticsearch:
  hosts: ["http://elasticsearch:9200"]
```

## Useful Queries

### Get cluster health
```bash
curl -X GET "localhost:9200/_cluster/health?pretty"
```

### List all indices
```bash
curl -X GET "localhost:9200/_cat/indices?v"
```

### Get index stats
```bash
curl -X GET "localhost:9200/index_name/_stats?pretty"
```

### Delete index
```bash
curl -X DELETE "localhost:9200/index_name"
```

### Search documents
```bash
curl -X GET "localhost:9200/index_name/_search?pretty" \
  -H 'Content-Type: application/json' \
  -d'
{
  "query": {
    "match_all": {}
  }
}'
```

### Bulk index
```bash
curl -X POST "localhost:9200/_bulk" \
  -H 'Content-Type: application/x-ndjson' \
  --data-binary @data.json
```

## Logstash Patterns

### Grok Patterns
```text
# Apache combined log
%{COMBINEDAPACHELOG}

# Syslog
%{SYSLOGBASE}

# JSON
{ "message": "%{GREEDYDATA:message}" }
```

### Custom Patterns
```text
# In patterns directory
MYNUM \d+
MYWORD \w+
```

## Best Practices

- Use index templates for consistent mappings
- Use proper data types in mappings
- Use aliases for index management
- Regularly delete old indices
- Use ILM (Index Lifecycle Management)
- Use Beats for log collection
- Use proper grok patterns for parsing
- Use Kibana for visualization
- Monitor cluster health
- Use replicas for high availability
- Use proper hardware sizing
- Use security features

::: tip
Use Kibana's Dev Tools to test and debug Elasticsearch queries before implementing them.
:::
