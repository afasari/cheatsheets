# GitHub Actions

CI/CD platform for automating software workflows directly in GitHub.

## Workflow Syntax

### Basic Workflow
```yaml
name: Workflow Name
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run script
        run: echo "Hello World"
```

## Triggers

### Push Events
```yaml
on:
  push:
    branches:
      - main
      - 'release/**'
    tags:
      - 'v*'
    paths:
      - 'src/**'
      - '.github/workflows/**'
```

### Pull Request Events
```yaml
on:
  pull_request:
    branches:
      - main
    types: [opened, synchronize, reopened]
```

### Schedule Events
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Runs daily at 2 AM UTC
```

### Manual Triggers
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment'
        required: true
        type: choice
        options:
          - dev
          - staging
          - prod
```

## Jobs

### Sequential Jobs
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Build
        run: make build

  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Test
        run: make test
```

### Parallel Jobs
```yaml
jobs:
  test-lint:
    runs-on: ubuntu-latest
    steps:
      - name: Lint
        run: make lint

  test-unit:
    runs-on: ubuntu-latest
    steps:
      - name: Unit tests
        run: make test-unit
```

### Matrix Strategy
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14, 16, 18]
        os: [ubuntu-latest, windows-latest]
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - name: Test
        run: npm test
```

## Steps

### Checkout Code
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Fetch all history
    submodules: recursive
```

### Setup Languages
```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'

# Python
- uses: actions/setup-python@v5
  with:
    python-version: '3.11'
    cache: 'pip'

# Go
- uses: actions/setup-go@v5
  with:
    go-version: '1.21'
    cache: true

# Java
- uses: actions/setup-java@v4
  with:
    distribution: 'temurin'
    java-version: '17'
```

### Cache Dependencies
```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Docker Build
```yaml
- name: Build Docker image
  run: docker build -t myapp:${{ github.sha }} .

- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Push image
  run: docker push myapp:${{ github.sha }}
```

### Kubernetes Deploy
```yaml
- name: Deploy to Kubernetes
  uses: azure/k8s-deploy@v4
  with:
    manifests: |
      deployment.yaml
      service.yaml
    images: |
      myapp:${{ github.sha }}
    kubectl-version: 'latest'
```

## Environment Variables

### Setting Variables
```yaml
env:
  NODE_ENV: production
  API_KEY: ${{ secrets.API_KEY }}

steps:
  - name: Use env var
    run: echo $NODE_ENV
```

### Conditional Variables
```yaml
- name: Set env var
  run: echo "VERSION=${{ github.sha }}" >> $GITHUB_ENV
```

### Output Variables
```yaml
- name: Build
  id: build
  run: echo "artifact=app-${{ github.sha }}" >> $GITHUB_OUTPUT

- name: Use output
  run: echo "Built ${{ steps.build.outputs.artifact }}"
```

## Secrets

### Using Secrets
```yaml
- name: Deploy
  run: |
    curl -X POST \
      -H "Authorization: Bearer ${{ secrets.API_TOKEN }}" \
      https://api.example.com/deploy
```

### Encrypted Secrets
```yaml
- name: Decrypt secrets
  uses: slsa-framework/slsa-github-generator/.github/actions/deploy-secrets@v1.5.0
  with:
    secrets: ${{ secrets.GPG_PRIVATE_KEY }}
```

## Artifacts

### Upload Artifacts
```yaml
- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-artifact@v4
  with:
    name: build-artifact
    path: dist/
    retention-days: 7
```

### Download Artifacts
```yaml
- name: Download artifact
  uses: actions/download-artifact@v4
  with:
    name: build-artifact
    path: ./dist
```

## Common Workflows

### Node.js CI/CD
```yaml
name: Node.js CI

on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

### Docker Build & Push
```yaml
name: Docker Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: ${{ github.event_name == 'push' && github.ref == 'refs/heads/main' }}
          tags: myapp:${{ github.sha }},myapp:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Deploy to Kubernetes
```yaml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig --name my-cluster --region us-east-1

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}
          kubectl rollout status deployment/myapp
```

### Lint PR
```yaml
name: Lint PR

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Check for errors
        if: failure()
        run: echo "Linting failed. Please fix the errors."
```

## Contexts

### GitHub Context
```yaml
- name: Print GitHub context
  run: |
    echo "Event: ${{ github.event_name }}"
    echo "Branch: ${{ github.ref_name }}"
    echo "Actor: ${{ github.actor }}"
    echo "SHA: ${{ github.sha }}"
    echo "Repository: ${{ github.repository }}"
```

### Runner Context
```yaml
- name: Print runner info
  run: |
    echo "OS: ${{ runner.os }}"
    echo "Arch: ${{ runner.arch }}"
    echo "Temp: ${{ runner.temp }}"
```

## Conditional Execution

```yaml
- name: Run on main branch
  if: github.ref == 'refs/heads/main'
  run: echo "This runs only on main"

- name: Run on pull request
  if: github.event_name == 'pull_request'
  run: echo "This runs on PRs"

- name: Run on success
  if: success()
  run: echo "Previous step succeeded"

- name: Run on failure
  if: failure()
  run: echo "Previous step failed"

- name: Run on always
  if: always()
  run: echo "Always runs"
```

## Best Practices

- Use specific versions for actions
- Pin action versions with `@v4` syntax
- Cache dependencies for faster builds
- Use matrix strategy for testing multiple configurations
- Separate lint, test, and build jobs
- Use environments for deployment protection rules
- Never log secrets in output
- Use pull_request events for testing, push for production
- Implement proper error handling
- Use workflow templates for consistency
- Document complex workflows

::: tip
Use `act` (https://github.com/nektos/act) to run GitHub Actions locally before pushing to the repository.
:::
