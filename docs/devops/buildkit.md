# Buildkit Cheatsheet

## Enabling Buildkit

```bash
# Environment variable
export DOCKER_BUILDKIT=1

# Daemon configuration (/etc/docker/daemon.json)
{
  "features": {
    "buildkit": true
  }
}

# Docker CLI config
{
  "features": {
    "buildkit": true
  }
}

# Podman (buildkit enabled by default)
podman build --buildkit=true -t myapp .
```

## Basic Build Commands

```bash
# Build with BuildKit
DOCKER_BUILDKIT=1 docker build -t myapp .

# Specify BuildKit frontend
docker build --build-arg BUILDKIT_SYNTAX=docker/dockerfile:1 -t myapp .

# Parallel builds
docker build --progress=plain -t myapp .

# Export cache
docker build --cache-from myapp:latest -t myapp .

# Import cache
docker build --cache-to type=inline -t myapp .

# Multi-platform build
docker buildx build --platform linux/amd64,linux/arm64 -t myapp .
```

## Inline Caches

```bash
# Inline cache (embedded in image)
docker build --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from myapp:latest \
  -t myapp:latest .

# Registry cache
docker build --cache-to type=registry,ref=myregistry.com/myapp:cache \
  --cache-from type=registry,ref=myregistry.com/myapp:cache \
  -t myapp .

# Local cache
docker build --cache-to type=local,dest=/tmp/buildkit-cache \
  --cache-from type=local,src=/tmp/buildkit-cache \
  -t myapp .

# GHA cache (GitHub Actions)
docker build --cache-to type=gha \
  --cache-from type=gha \
  -t myapp .
```

## Buildx (Multi-Platform)

```bash
# List builders
docker buildx ls

# Create new builder
docker buildx create --name mybuilder --use

# Use default builder
docker buildx use default

# Inspect builder
docker buildx inspect

# Multi-platform build
docker buildx build --platform linux/amd64,linux/arm64 -t myapp .

# Build and push
docker buildx build --platform linux/amd64,linux/arm64 \
  -t myapp:latest \
  -t myregistry.com/myapp:latest \
  --push .

# Load specific platform
docker buildx build --platform linux/amd64 \
  -t myapp:latest \
  --load .

# Cross-compilation
docker buildx build --platform linux/arm64 \
  --build-arg ARCH=arm64 \
  -t myapp:arm64 .
```

## Advanced Caching Strategies

### Cache Mounts

```dockerfile
# Mount cache directory (dependencies)
RUN --mount=type=cache,target=/var/cache/apk \
    apk add --no-cache python3 py3-pip

# Mount cache for pip
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# Mount cache for npm
RUN --mount=type=cache,target=/root/.npm \
    npm install

# Multiple cache mounts
RUN --mount=type=cache,target=/var/cache/apk \
    --mount=type=cache,target=/root/.cache/pip \
    apk add --no-cache python3 && \
    pip install -r requirements.txt
```

### Bind Mounts

```dockerfile
# Mount local directory during build
RUN --mount=type=bind,source=. ,target=/src \
    cp -r /src /app

# Read-only bind mount
RUN --mount=type=bind,source=./config,target=/config,readonly \
    cp /config/*.conf /etc/

# Secret mount (build-time secrets)
RUN --mount=type=secret,id=aws,target=/root/.aws \
    aws s3 cp s3://bucket/file /app/file

# Usage
docker build --secret id=aws,src=$HOME/.aws -t myapp .
```

### SSH Mounts

```dockerfile
# SSH mount for private repositories
RUN --mount=type=ssh \
    git clone git@github.com:user/private-repo.git /app

# Usage
docker build --ssh default -t myapp .
docker build --ssh agent=$SSH_AUTH_SOCK -t myapp .
```

## Multi-Stage Builds with BuildKit

```dockerfile
# Use build arguments efficiently
ARG VERSION=1.0
FROM node:${VERSION}-alpine AS builder
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

## Build Secrets

```dockerfile
# Define secret mount
RUN --mount=type=secret,id=GITHUB_TOKEN \
    curl -H "Authorization: token $GITHUB_TOKEN" \
    https://api.github.com/user > /tmp/user.json

# Use secret in COPY
COPY --from=builder --chown=app:app /app/dist /dist

# Runtime secrets
RUN --mount=type=secret,id=app_secrets,target=/app/secrets \
    cat /app/secrets/config.yml > /etc/app/config.yml
```

```bash
# Build with secrets
docker build --secret id=GITHUB_TOKEN \
  --secret id=app_secrets,src=secrets.yml \
  -t myapp .
```

## Remote Build

```bash
# Build on remote machine
docker buildx build --remote=https://mybuilder.example.com -t myapp .

# Build with remote cache
docker buildx build \
  --cache-to type=registry,ref=myregistry.com/cache \
  --cache-from type=registry,ref=myregistry.com/cache \
  -t myapp .
```

## Output Formats

```bash
# Load to local Docker
docker buildx build --load -t myapp .

# Push to registry
docker buildx build --push -t myregistry.com/myapp .

# Export to tar
docker buildx build -o type=tar,dest=myapp.tar .

# Export to local directory
docker buildx build -o type=local,dest=./output .

# Export to OCI directory
docker buildx build -o type=oci,dest=./oci-dir .
```

## Performance Optimization

```dockerfile
# Organize COPY commands (most frequently changed last)
COPY package*.json ./
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt
COPY . .

# Use .dockerignore to reduce context
# .dockerignore
.git
.gitignore
node_modules
*.log
.env
__pycache__

# Leverage layer caching
# Separate installation and copy steps

# Parallel builds
docker buildx build --progress=plain -t myapp .
```

## Dockerfile Extensions

### Syntax Directives

```dockerfile
# Specify syntax version
# syntax=docker/dockerfile:1.4
# syntax=docker/dockerfile:1.5-experimental

# Enable experimental features
# syntax=docker/dockerfile:1.5-labs

# Use custom syntax extension
# syntax=example.com/my-syntax-extension
```

### Run Mounts

```dockerfile
# Cache mount (persistent across builds)
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
    apk add --no-cache python3

# Bind mount (from host)
RUN --mount=type=bind,source=./scripts,target=/tmp/scripts,readonly \
    bash /tmp/scripts/setup.sh

# Tmpfs mount (in-memory)
RUN --mount=type=tmpfs,target=/tmp \
    ./configure && make && make install

# Secret mount (build-time secrets)
RUN --mount=type=secret,id=mysecret,target=/run/secrets \
    cat /run/secrets/mysecret

# SSH mount (for git operations)
RUN --mount=type=ssh \
    git clone git@github.com:user/repo.git /app
```

## Troubleshooting

```bash
# Debug BuildKit
DOCKER_BUILDKIT=1 docker build --progress=plain -t myapp .

# Check BuildKit logs
journalctl -u buildkit -f

# Inspect builder
docker buildx inspect --bootstrap

# Clear BuildKit cache
docker builder prune -af
docker buildx prune -af

# Check disk usage
du -sh ~/.buildkit
du -sh /var/lib/docker/buildkit

# Check cache mounts
docker build --progress=plain -t myapp 2>&1 | grep -i cache

# Inspect image layers
docker history myapp
docker inspect myapp
```

## Registry Cache Configuration

```bash
# Push cache to registry
docker buildx build \
  --cache-to type=registry,ref=myregistry.com/myapp:cache,mode=max \
  --cache-from type=registry,ref=myregistry.com/myapp:cache \
  -t myapp .

# Cache modes
# mode=max: cache all layers
# mode=min: cache only final layers

# Multiple caches
docker buildx build \
  --cache-from type=registry,ref=myregistry.com/myapp:cache \
  --cache-from type=local,src=/tmp/cache \
  -t myapp .
```

## GitHub Actions Integration

```yaml
- name: Build with BuildKit
  run: |
    docker buildx build \
      --platform linux/amd64,linux/arm64 \
      --cache-from type=gha \
      --cache-to type=gha,mode=max \
      -t myapp:${{ github.sha }} \
      -t myapp:latest \
      --push .

- name: Load image (single platform)
  run: |
    docker buildx build \
      --platform linux/amd64 \
      --load \
      -t myapp .
```

## Advanced Patterns

### Conditional Builds

```dockerfile
ARG BUILD_TYPE=production
RUN if [ "$BUILD_TYPE" = "development" ]; then \
      apk add --no-cache git vim; \
    fi
```

### Dynamic COPY

```dockerfile
ARG COPY_TARGET=app
COPY --from=builder /app/${COPY_TARGET} /usr/share/nginx/html/
```

### Cross-Platform Support

```dockerfile
ARG TARGETPLATFORM
RUN if [ "$TARGETPLATFORM" = "linux/arm64" ]; then \
      apk add --no-cache qemu-arm; \
    fi
```

## BuildKit Standalone

```bash
# Start BuildKit daemon
buildkitd --addr=unix:///run/buildkit/buildkitd.sock

# Use buildctl CLI
buildctl build \
  --frontend=dockerfile.v0 \
  --local context=. \
  --local dockerfile=. \
  --output type=image,name=myapp:latest \
  --export-cache type=registry,ref=myregistry.com/myapp:cache \
  --import-cache type=registry,ref=myregistry.com/myapp:cache

# Build with args
buildctl build \
  --frontend=dockerfile.v0 \
  --opt target=production \
  --opt build-arg:VERSION=1.0 \
  --local context=. \
  --output type=image,name=myapp:latest
```
