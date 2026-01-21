# Docker

Containerization platform for developing, shipping, and running applications.

## Basic Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `docker run <image>` | Run a container from an image |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers (including stopped) |
| `docker stop <container>` | Stop a running container |
| `docker start <container>` | Start a stopped container |
| `docker restart <container>` | Restart a container |
| `docker rm <container>` | Remove a container |
| `docker rmi <image>` | Remove an image |

## Images

| COMMAND | DESCRIPTION |
| --- | --- |
| `docker pull <image>` | Pull an image from a registry |
| `docker images` | List locally available images |
| `docker build -t <name> .` | Build an image from Dockerfile |
| `docker tag <image> <new-tag>` | Tag an image |
| `docker push <image>` | Push an image to registry |
| `docker inspect <image>` | Show image details |
| `docker history <image>` | Show image history |

## Container Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `docker exec -it <container> /bin/bash` | Execute command in container |
| `docker logs <container>` | Show container logs |
| `docker logs -f <container>` | Follow log output |
| `docker port <container>` | Show port mappings |
| `docker stats` | Show live container stats |
| `docker cp <src> <dest>` | Copy files between host/container |
| `docker diff <container>` | Show container filesystem changes |

## Network & Volumes

| COMMAND | DESCRIPTION |
| --- | --- |
| `docker network ls` | List networks |
| `docker network create <name>` | Create a network |
| `docker network connect <net> <container>` | Connect container to network |
| `docker volume ls` | List volumes |
| `docker volume create <name>` | Create a volume |
| `docker volume rm <volume>` | Remove a volume |

## Docker Compose

| COMMAND | DESCRIPTION |
| --- | --- |
| `docker-compose up` | Create and start services |
| `docker-compose up -d` | Start services in background |
| `docker-compose down` | Stop and remove services |
| `docker-compose ps` | List services |
| `docker-compose logs` | View service logs |
| `docker-compose exec <service> <cmd>` | Execute command in service |
| `docker-compose build` | Rebuild services |
| `docker-compose pull` | Pull service images |

## Cleanup

| COMMAND | DESCRIPTION |
| --- | --- |
| `docker system prune` | Remove unused data |
| `docker system prune -a` | Remove all unused data |
| `docker container prune` | Remove stopped containers |
| `docker image prune -a` | Remove unused images |
| `docker volume prune` | Remove unused volumes |

## Advanced Usage

### Run with Options
```bash
# Run in background with port mapping
docker run -d -p 8080:80 --name myapp nginx

# Mount volume
docker run -v /host/path:/container/path nginx

# Set environment variables
docker run -e KEY=value nginx

# Auto-restart on failure
docker run --restart=on-failure:5 nginx
```

### Resource Limits
```bash
# Limit memory
docker run -m 512m nginx

# Limit CPU (0.5 = 50% of 1 core)
docker run --cpus=0.5 nginx

# Set memory reservation
docker run --memory-reservation=256m nginx
```

## Debugging

```bash
# View container details
docker inspect <container>

# Check container process
docker top <container>

# View live resource usage
docker stats

# Export container filesystem
docker export <container> > backup.tar
```

## Security

| COMMAND | DESCRIPTION |
| --- | --- |
| `docker scan <image>` | Scan image for vulnerabilities |
| `docker run --read-only` | Run with read-only filesystem |
| `docker run --user nobody` | Run as non-root user |
| `docker run --cap-drop=ALL` | Drop all Linux capabilities |

## Best Practices

- Use specific image versions, not `latest`
- Use `.dockerignore` to exclude unnecessary files
- Combine RUN commands to reduce layers
- Use multi-stage builds for smaller images
- Scan images for security vulnerabilities
- Don't run containers as root user
- Set resource limits for production containers

::: tip
Use `docker-compose` for multi-container applications and Docker Swarm for orchestration at scale.
:::
