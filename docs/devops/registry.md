# Container Registry Cheatsheet

## Docker Hub

```bash
# Login
docker login

# Push image
docker tag myapp:latest username/myapp:latest
docker push username/myapp:latest

# Push with tag
docker tag myapp:1.0 username/myapp:1.0
docker push username/myapp:1.0

# Search images
docker search nginx

# Pull image
docker pull username/myapp:latest
docker pull username/myapp@sha256:abc123
```

## GitHub Container Registry (GHCR)

```bash
# Login with GitHub token
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Tag and push
docker tag myapp:latest ghcr.io/username/myapp:latest
docker push ghcr.io/username/myapp:latest

# Pull
docker pull ghcr.io/username/myapp:latest

# Organization images
docker tag myapp ghcr.io/orgname/myapp:latest
docker push ghcr.io/orgname/myapp:latest
```

## Google Artifact Registry (GAR)

```bash
# Configure authentication
gcloud auth configure-docker us-central1-docker.pkg.dev

# Push
docker tag myapp:latest us-central1-docker.pkg.dev/project-id/repo/myapp:latest
docker push us-central1-docker.pkg.dev/project-id/repo/myapp:latest

# Pull
docker pull us-central1-docker.pkg.dev/project-id/repo/myapp:latest

# List repositories
gcloud artifacts repositories list

# List images
gcloud artifacts docker images list us-central1-docker.pkg.dev/project-id/repo
```

## Amazon Elastic Container Registry (ECR)

```bash
# Login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Create repository
aws ecr create-repository --repository-name myapp

# Tag and push
docker tag myapp:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest

# Pull
docker pull 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:latest

# List repositories
aws ecr describe-repositories

# List images
aws ecr list-images --repository-name myapp

# Delete image
aws ecr batch-delete-image --repository-name myapp --image-ids imageTag=latest
```

## Azure Container Registry (ACR)

```bash
# Login
az acr login --name myregistry

# Push
docker tag myapp:latest myregistry.azurecr.io/myapp:latest
docker push myregistry.azurecr.io/myapp:latest

# Pull
docker pull myregistry.azurecr.io/myapp:latest

# List repositories
az acr repository list --name myregistry

# List tags
az acr repository show-tags --name myregistry --repository myapp

# Delete image
az acr repository delete --name myregistry --image myapp:latest
```

## Quay.io

```bash
# Login
docker login quay.io

# Push
docker tag myapp:latest quay.io/username/myapp:latest
docker push quay.io/username/myapp:latest

# Pull
docker pull quay.io/username/myapp:latest

# Create repository (web UI or API)
curl -X POST -H "Authorization: Bearer $TOKEN" \
  https://quay.io/api/v1/repository
```

## Harbor

```bash
# Login
docker login harbor.example.com

# Push
docker tag myapp:latest harbor.example.com/project/myapp:latest
docker push harbor.example.com/project/myapp:latest

# Pull
docker pull harbor.example.com/project/myapp:latest

# Create project (web UI or API)
curl -X POST -H "Authorization: Basic $TOKEN" \
  https://harbor.example.com/api/v2.0/projects
```

## OCI Images

```bash
# Pull by digest
docker pull myapp@sha256:abc123...

# Push by digest
docker push myapp@sha256:abc123...

# Inspect image manifest
docker manifest inspect myapp:latest

# Create manifest list
docker manifest create myapp:multi \
  myapp:amd64 \
  myapp:arm64

# Push manifest list
docker manifest push myapp:multi

# Annotate manifest
docker manifest annotate myapp:multi myapp:amd64 --os linux --arch amd64
```

## Registry Authentication

### Docker Login
```bash
# Docker Hub
docker login -u username -p password

# Token-based
echo $TOKEN | docker login registry.example.com -u token --password-stdin

# Service principal (AWS)
aws ecr get-login-password | docker login --username AWS --password-stdin

# Service account (GCP)
gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://us-central1-docker.pkg.dev
```

### Podman Login
```bash
# Same as Docker
podman login registry.example.com

# With credentials file
podman login --authfile authfile.json registry.example.com

# Check login status
podman login registry.example.com --get-login
```

### Kubernetes Image Pull Secrets
```bash
# Create secret
kubectl create secret docker-registry regcred \
  --docker-server=registry.example.com \
  --docker-username=username \
  --docker-password=password \
  --docker-email=user@example.com

# Use in pod
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: myapp
    image: registry.example.com/myapp:latest
  imagePullSecrets:
  - name: regcred
```

## Image Management

### Tagging Strategy
```bash
# Semantic versioning
docker tag myapp:1.2.3 registry.com/myapp:1.2.3
docker tag myapp:1.2.3 registry.com/myapp:1.2
docker tag myapp:1.2.3 registry.com/myapp:1

# Latest
docker tag myapp:1.2.3 registry.com/myapp:latest

# Git SHA
docker tag myapp:latest registry.com/myapp:$(git rev-parse --short HEAD)

# Date-based
docker tag myapp:latest registry.com/myapp:$(date +%Y%m%d)
```

### Multi-Architecture
```bash
# Build and push multi-arch
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 \
  -t registry.com/myapp:latest \
  --push .

# Manifest list
docker manifest create registry.com/myapp:latest \
  registry.com/myapp:amd64 \
  registry.com/myapp:arm64

docker manifest push registry.com/myapp:latest
```

## Scanning and Security

```bash
# Trivy scan
trivy image registry.com/myapp:latest

# Grype scan
grype registry.com/myapp:latest

# Docker Scout
docker scout quickview registry.com/myapp:latest
docker scout cves registry.com/myapp:latest

# Configure scan policy
trivy image --severity HIGH,CRITICAL registry.com/myapp:latest
```

## Rate Limiting

```bash
# Check rate limits (Docker Hub)
docker pull hello-world
docker pull busybox
docker pull alpine

# View limit in logs
# Login: https://hub.docker.com/settings

# Increase limits (Docker Hub Pro/Team)
# Upgrade account: https://www.docker.com/pricing

# Cache locally to reduce pulls
docker tag registry.com/myapp:latest myapp:local
```

## Caching Proxies

```bash
# Docker Hub proxy
docker run -d -p 5000:5000 \
  -e REGISTRY_PROXY_REMOTEURL=https://registry-1.docker.io \
  registry:2

# Google Mirror
docker run -d -p 5000:5000 \
  -e REGISTRY_PROXY_REMOTEURL=https://mirror.gcr.io \
  registry:2

# Multiple registries
docker run -d -p 5000:5000 \
  -v /etc/registry/config.yml:/etc/docker/registry/config.yml \
  registry:2
```

## Cleanup

```bash
# Remove local images
docker rmi registry.com/myapp:latest

# Remove unused images
docker image prune -af

# Remove remote image (ECR)
aws ecr batch-delete-image \
  --repository-name myapp \
  --image-ids imageTag=latest

# Remove remote image (GAR)
gcloud artifacts docker images delete \
  us-central1-docker.pkg.dev/project-id/repo/myapp:latest

# Remove remote image (GHCR)
gh api --method DELETE \
  /orgs/username/packages/container/myapp/versions/ID
```

## Automated Workflows

### GitHub Actions
```yaml
- name: Login to registry
  uses: docker/login-action@v2
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Build and push
  uses: docker/build-push-action@v4
  with:
    push: true
    tags: ghcr.io/${{ github.repository }}:latest
```

### GitLab CI
```yaml
docker-build:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

### CircleCI
```yaml
- run:
    name: Build and push
    command: |
      echo $DOCKER_PASSWORD | docker login -u $DOCKER_USER --password-stdin
      docker build -t myapp:latest .
      docker tag myapp:latest registry.com/myapp:latest
      docker push registry.com/myapp:latest
```

## Troubleshooting

```bash
# Check login status
docker login --get-login registry.example.com

# Logout
docker logout registry.example.com

# Clear credentials
rm ~/.docker/config.json

# Check image availability
docker pull registry.com/myapp:latest --all-tags

# Check manifest
docker manifest inspect registry.com/myapp:latest

# Debug authentication
docker login registry.example.com --debug
```
