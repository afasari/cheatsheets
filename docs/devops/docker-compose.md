# Docker Compose Cheatsheet

## Essential Commands

```bash
# Basic operations
docker-compose up                    # Start services (detached: -d)
docker-compose down                  # Stop and remove containers
docker-compose up -d --force-recreate  # Recreate all containers
docker-compose restart                # Restart services
docker-compose pause                  # Pause services
docker-compose unpause                # Unpause services

# Build and run
docker-compose build                  # Build images
docker-compose up --build             # Build and start
docker-compose build --no-cache       # Build without cache
docker-compose build --parallel       # Build images in parallel

# Execute commands
docker-compose exec <service> <cmd>   # Execute in running container
docker-compose run --rm <service> <cmd>  # Run one-off command
docker-compose ps                     # List containers
docker-compose logs -f                # Follow logs
docker-compose logs <service>         # Service-specific logs
```

## Compose File Structure

```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./html:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    environment:
      - ENV=production
    env_file:
      - .env
    networks:
      - frontend
    depends_on:
      - db
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    networks:
      - backend
    restart: always

volumes:
  postgres_data:

networks:
  frontend:
    driver: bridge
  backend:
    internal: true
```

## Multi-Stage Builds

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
      args:
        VERSION: "1.0"
    image: myapp:latest
```

## Production Patterns

```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

  redis:
    image: redis:alpine
    command: redis-server --appendonly yes
    sysctls:
      - net.core.somaxconn=1024
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
```

## Environment Variables

```yaml
# .env file
DB_HOST=localhost
DB_PORT=5432
DB_PASSWORD=secret

# docker-compose.yml
services:
  app:
    environment:
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_PASSWORD=${DB_PASSWORD}
    env_file:
      - .env
      - .env.production
```

## Network Configuration

```yaml
services:
  frontend:
    networks:
      - webnet
      - dbnet

  backend:
    networks:
      - dbnet
    expose:
      - "8000"

networks:
  webnet:
    driver: bridge
  dbnet:
    driver: bridge
    internal: true
```

## Volume Management

```yaml
services:
  db:
    volumes:
      # Named volume (managed by Docker)
      - db_data:/var/lib/lib/mysql

      # Bind mount (host directory)
      - ./data:/var/lib/mysql

      # Read-only volume
      - ./config:/etc/mysql:ro

      # Tmpfs (in-memory)
      - /tmp/cache:tmpfs

volumes:
  db_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /data/mysql
```

## Development vs Production

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    volumes:
      - .:/app
    environment:
      - DEBUG=true

  db:
    image: postgres:15-alpine

---
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: myapp:${VERSION}
    environment:
      - DEBUG=false
    restart: always

# Usage: docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## Common Services

### PostgreSQL + pgAdmin
```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Redis + Redis Commander
```yaml
services:
  redis:
    image: redis:alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  redis-commander:
    image: rediscommander/redis-commander
    environment:
      - REDIS_HOSTS=local:redis:6379
    ports:
      - "8081:8081"
    depends_on:
      - redis

volumes:
  redis_data:
```

### Nginx Reverse Proxy
```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./static:/usr/share/nginx/html:ro
    depends_on:
      - app
    restart: always

  app:
    build: .
    expose:
      - "3000"
    restart: always
```

## Troubleshooting

```bash
# View container logs
docker-compose logs -f --tail=100 <service>

# Execute in container
docker-compose exec <service> sh

# Remove all containers and volumes
docker-compose down -v

# Check resource usage
docker-compose top

# Validate compose file
docker-compose config

# Debug port conflicts
docker-compose config --services

# Run container with all env vars
docker-compose run --rm <service> env
```

## Performance Tips

```yaml
services:
  app:
    # Limit build context
    build:
      context: .
      dockerfile: Dockerfile

    # Multi-stage builds reduce image size
    # Use .dockerignore to exclude files
    # Cache dependencies separately

    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
```

## .dockerignore

```
.git
.gitignore
node_modules
npm-debug.log
.env
__pycache__
*.pyc
.coverage
.DS_Store
```
