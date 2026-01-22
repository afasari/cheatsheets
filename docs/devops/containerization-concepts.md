# Containerization Concepts

## What is Containerization?

Containerization is the practice of encapsulating an application and its dependencies into a lightweight, portable, isolated container that includes everything needed to run: code, runtime, system tools, and libraries. It treats infrastructure as software code, enabling version control, reproducibility and consistency.

## Benefits

### Portability
```bash
# Same container runs everywhere
docker run myapp:latest
docker run myapp:latest
docker run -d myapp:latest

# Runs on:
# - Local laptop
# - Cloud VM
# - Kubernetes cluster
# - Any Docker-compatible platform
```

### Consistency
```bash
# Build once, deploy anywhere
docker build -t myapp:latest

# Same environment
docker run -e ENV=production myapp:latest
docker run -e "DEBUG=false" myapp:latest

# Guaranteed behavior
# Same dependencies
docker run myapp:latest
```

### Isolation
```yaml
# Process isolation
# Each app in its own container
# No dependency conflicts
# Clean shutdown
```

## Containers vs Virtual Machines

| Aspect | Containers | Virtual Machines |
|---------|-----------|--------|
| Boot Time | Seconds | Minutes |
| Size | MBs | GBs |
| Portability | Anywhere | Same OS |
| Density | 100s/VM | 1-10/VM |
| Isolation | Process-level | Full VM |
| Migration | Copy image | Reinstall |
| Scalability | Easy | Manual |
| Efficiency | High | Medium |
```

## Container Images

### Image Layers
```yaml
# Multi-stage Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "index.js"]
```

### Layer Caching
```yaml
# Cache dependencies
FROM python:3.9-slim AS base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
```

### Image Size Optimization
```dockerfile
# Good - Alpine Linux
FROM alpine:3.18
# Bad - Full OS
FROM ubuntu:22.04  # 800MB+
```

### Multi-stage builds
```dockerfile
# Only include final stage in image
FROM node:18-alpine AS builder
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "index.js"]
```

### Image Tags
```dockerfile
# Use semantic versioning
FROM node:18-alpine AS builder
ARG VERSION=1.0.0
LABEL version=${VERSION}
```

## Container Orchestration

### Kubernetes Pods
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
spec:
  containers:
  - name: app
    image: myapp:latest
    ports:
      - containerPort: 80
      env:
        - name: ENV
          value: production
    resources:
      requests:
        memory: "256Mi"
        cpu: "500m"
      limits:
        memory: "512Mi"
        cpu: "1000m"
```

### Kubernetes Deployments
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:latest
        ports:
          - containerPort: 80
        env:
          - name: ENV
            value: production
        resources:
          requests:
            memory: "256Mi"
            cpu: "500m"
```

### Kubernetes Services
```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

## Resource Management

### Resource Limits
```yaml
resources:
  limits:
    memory: "1Gi"
    cpu: "500m"
  requests:
    memory: "512Mi"
    cpu: "1000m"

# Maximum resources
resources:
  limits:
    cpu: "500m"
  requests:
    memory: "512Mi"
```

### Resource Quality of Service
```yaml
# Define QoS class
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    resources:
      requests:
        cpu: "100m"
        memory: "256Mi"
      limits:
        cpu: "500m"
        memory: "512Mi"
```

## Container Security

### Rootless Containers
```yaml
# Don't run as root
FROM alpine:3.18
RUN addgroup -g appuser -u 1000
USER appuser

# Drop capabilities
securityContext:
  capabilities:
    drop:
      - ALL
```

### Read-Only Filesystem
```yaml
# Container can't write
FROM alpine:3.18
RUN chmod -R a-wrx /app
RUN chmod -R a-wrx /app

# Or use read-only mount
volumes:
  - /app/data:ro
```

### Seccomp Profiles
```yaml
# Docker runtime security profile
seccomp-profile: runtime/default

# Drop dangerous syscalls
# No file system write
```

## Container Networking

### Bridge Network
```yaml
version: "3.8"

services:
  web:
    networks:
      - frontend

networks:
  frontend:
    driver: bridge

  db:
    networks:
      - frontend
```

### Host Network
```yaml
services:
  web:
    network_mode: host
    ports:
      - "80:80"

# Overlay Network
```yaml
networks:
  backend:
    driver: overlay
```

## Container Storage

### Volumes
```bash
# Named volume
docker volume create mydata

# Bind mount
docker run -v /host/path:/container/path myapp

# Volume driver
docker volume create \
  --driver local \
  --opt type=none \
  --opt device=/mnt/data \
  --opt o=bind
```

### Volume Permissions
```yaml
# Set owner
volumes:
  mydata:
    driver: local
    driver_opts:
      type: none
      device: /mnt/data
      o: bind

# Use in container
services:
  app:
    volumes:
      - mydata:/app/data
```

### Persistent Storage
```yaml
# PVC in Kubernetes
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myapp-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
      requests:
        storage: "1Gi"
```

## Container Lifecycle

### Container States

### Created
```bash
# Created
docker run myapp

# Running
docker ps

# Paused
docker pause myapp

# Stopped
docker stop myapp

# Removed
docker rm myapp
```

### Restart Policies
```yaml
# Always restart
restart: always

# On failure
restart: on-failure

# Never restart
restart: no
```

## Container Patterns

### Sidecar Pattern
```yaml
# Sidecar container
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    image: myapp:latest
  - name: logger
    image: log-collector:latest
      # Collects logs from /var/log
```

### Init Containers
```yaml
# Setup before main app
apiVersion: v1
kind: Pod
spec:
  initContainers:
  - name: setup
    image: myapp:latest
    command: ["python", "setup.py"]
    containers:
      - name: app
        image: myapp:latest
          # Depends on setup
```

### Ambassador Pattern
```yaml
# Ambassador proxies to external service
apiVersion: v1
kind: Service
metadata:
  name: myapp-proxy
spec:
  selector:
    app: myapp
  ports:
      - port: 80
        targetPort: 80
  targetPort: 80
```

## Monitoring

### Resource Usage
```bash
# Check container stats
docker stats myapp

# Check logs
docker logs myapp

# Inspect container
docker inspect myapp
```
