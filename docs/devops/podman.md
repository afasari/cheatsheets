# Podman Cheatsheet

## Essential Commands

```bash
# Basic operations (same as Docker)
podman run -d --name mycontainer nginx
podman ps -a
podman stop mycontainer
podman rm mycontainer
podman images
podman rmi nginx

# Build and push
podman build -t myapp .
podman push myapp docker.io/user/myapp
podman pull docker.io/user/myapp

# Execute
podman exec -it mycontainer sh
podman logs -f mycontainer
```

## Rootless Containers

```bash
# Check rootless setup
podman info

# Run as non-root user
podman run -d --name web nginx
podman run -d --name app -p 8080:8080 myapp

# User namespace
podman run --userns=keep-id -d myapp
```

## Pods (Container Groups)

```bash
# Create a pod
podman pod create --name mypod -p 80:80 -p 443:443

# Add containers to pod
podman run -d --pod mypod --name nginx nginx
podman run -d --pod mypod --name app myapp

# List pods
podman pod ls
podman pod inspect mypod

# Stop and remove
podman pod stop mypod
podman pod rm mypod
podman pod rm -f mypod  # Force removal

# Pod stats
podman pod top mypod
podman pod logs mypod
```

## Podman Compose

```bash
# Install podman-compose
pip install podman-compose

# Use like docker-compose
podman-compose up -d
podman-compose down
podman-compose ps
podman-compose logs

# With specific compose file
podman-compose -f docker-compose.yml up -d
```

## Networks

```bash
# List networks
podman network ls
podman network inspect bridge

# Create network
podman network create mynet

# Connect container to network
podman network connect mynet mycontainer

# Disconnect
podman network disconnect mynet mycontainer

# Remove network
podman network rm mynet

# Create network with subnet
podman network create --subnet=192.168.1.0/24 mynet
```

## Volumes

```bash
# List volumes
podman volume ls
podman volume inspect myvol

# Create volume
podman volume create myvol
podman volume create --opt type=tmpfs --opt device=tmpfs --opt o=size=1g mytmp

# Use volume
podman run -d -v myvol:/data myapp

# Remove volume
podman volume rm myvol

# Cleanup unused volumes
podman volume prune -f
```

## System Integration

```bash
# Generate systemd service
podman generate systemd --name mycontainer --files

# Generate for pod
podman generate systemd --name mypod --files

# Enable and start service
systemctl --user enable --now container-mycontainer.service
systemctl --user enable --now pod-mypod.service

# Systemd user services (rootless)
systemctl --user status
systemctl --user start container-web.service
```

## Kubernetes YAML Generation

```bash
# Generate Kubernetes YAML from container
podman generate kube mycontainer > deployment.yaml

# Generate from pod
podman generate kube mypod > pod.yaml

# Generate with service
podman generate kube --service mycontainer > deployment.yaml

# Apply to Kubernetes
kubectl apply -f deployment.yaml

# Generate multiple containers
podman generate kube --name myproject web db app > full-deployment.yaml
```

## Machine Management

```bash
# Create new VM
podman machine init myvm

# Start VM
podman machine start myvm

# Stop VM
podman machine stop myvm

# List machines
podman machine ls

# Remove VM
podman machine rm myvm

# SSH into machine
podman machine ssh myvm

# List images in VM
podman machine images myvm
```

## Health Checks

```bash
# Run with health check
podman run -d --name web \
  --health-cmd "curl -f http://localhost/" \
  --health-interval=5s \
  --health-retries=3 \
  --health-timeout=3s \
  --health-start-period=10s \
  nginx

# Check health
podman healthcheck run web
podman inspect --format='{{.State.Health.Status}}' web
```

## Security Features

```bash
# Read-only filesystem
podman run --read-only --tmpfs /tmp nginx

# Drop capabilities
podman run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx

# Run as specific user
podman run --user 1000:1000 myapp

# Set seccomp profile
podman run --security-opt seccomp=unconfined myapp
podman run --security-opt seccomp=myprofile.json myapp

# Set AppArmor profile
podman run --security-opt apparmor=myprofile myapp

# No-new-privileges
podman run --security-opt no-new-privileges myapp

# SELinux label
podman run --security-opt label=level:s0:c100,c200 myapp
```

## Resource Limits

```bash
# CPU limits
podman run --cpus=1.5 myapp
podman run --cpu-shares=512 myapp

# Memory limits
podman run --memory=512m myapp
podman run --memory-swap=1g myapp

# Block I/O
podman run --blkio-weight=500 myapp

# Device access
podman run --device=/dev/sda:/dev/xvda myapp
```

## Image Management

```bash
# Search images
podman search nginx

# Pull specific tag
podman pull nginx:alpine

# Multi-arch builds
podman build --platform linux/amd64,linux/arm64 -t myapp .

# Inspect image
podman inspect nginx

# Image history
podman history nginx

# Tag image
podman tag nginx:latest myregistry.com/nginx:1.0

# Sign image
podman image sign docker.io/user/myapp

# Trust images
podman image trust set --type signedBy docker.io/user/myapp
```

## Registries

```bash
# Login to registry
podman login docker.io
podman login myregistry.com

# Logout
podman logout docker.io

# Push with tag
podman push myapp:latest docker.io/user/myapp:latest

# Pull from private registry
podman pull myregistry.com/myapp:1.0
podman pull --creds=username:password myregistry.com/myapp:1.0

# Configure registries (registries.conf)
[registries.search]
registries = ['docker.io', 'quay.io', 'myregistry.com']

[registries.insecure]
registries = ['my-registry.local']

[registries.block]
registries = ['untrusted.registry.com']
```

## Podman vs Docker Cheat Sheet

| Docker Command | Podman Equivalent |
|----------------|-------------------|
| `docker run` | `podman run` |
| `docker ps` | `podman ps` |
| `docker images` | `podman images` |
| `docker build` | `podman build` |
| `docker-compose` | `podman-compose` |
| `docker swarm` | `podman pod` |
| `docker service` | N/A (use pods) |
| `docker stack` | N/A (use pods) |
| `systemctl start docker` | `systemctl --user enable podman` |

## Troubleshooting

```bash
# Check Podman info
podman info

# Check logs
journalctl -xe -u podman

# Debug mode
podman --log-level=debug run nginx

# Check network
podman network inspect bridge

# Test rootless setup
podman run --rm hello-world

# Check user namespace
podman run --rm alpine id

# Cleanup everything
podman system prune -a -f --volumes
```

## Integration with CI/CD

```yaml
# GitHub Actions
- name: Login to registry
  run: podman login -u ${{ secrets.USER }} -p ${{ secrets.PASS }} myregistry.com

- name: Build image
  run: podman build -t myapp:${{ github.sha }} .

- name: Push image
  run: podman push myapp:${{ github.sha }} myregistry.com/myapp:${{ github.sha }}

- name: Generate K8s YAML
  run: podman generate kube myapp > deployment.yaml
```

## Advanced: Quadlet (systemd integration)

```ini
# /etc/containers/systemd/mycontainer.container
[Unit]
Description=My Container
After=network-online.target
Wants=network-online.target

[Container]
Image=docker.io/library/nginx:latest
ContainerName=nginx
PublishPort=8080:80
Volume=/data:/usr/share/nginx/html

[Service]
Restart=always
TimeoutStartSec=900

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
systemctl daemon-reload
systemctl enable --now mycontainer.service
```
