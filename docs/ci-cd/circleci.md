# CircleCI

CI/CD platform that automates the software development process. Uses declarative configuration to build, test, and deploy applications.

## CircleCI Architecture

| Component | Description |
|-----------|-------------|
| **CircleCI Cloud** | Hosted CI/CD service |
| **CircleCI Runner** | Self-hosted runners for private resources |
| **Config File** | `.circleci/config.yml` - Pipeline definition |
| **Orbs** | Reusable configuration packages |
| **Workflows** | Coordinate multiple jobs |

## CircleCI Setup

### GitHub Integration

1. **Create CircleCI Account**
   - Sign up at https://circleci.com
   - Authorize GitHub access

2. **Add Project**
   - Click "Add Projects"
   - Select repository
   - Follow setup instructions

### Bitbucket Integration

1. **Create CircleCI Account**
   - Sign up at https://circleci.com
   - Authorize Bitbucket access

2. **Add Project**
   - Click "Add Projects"
   - Select repository
   - Follow setup instructions

### GitLab Integration

1. **Create CircleCI Account**
   - Sign up at https://circleci.com
   - Authorize GitLab access

2. **Add Project**
   - Click "Add Projects"
   - Select repository
   - Follow setup instructions

## CircleCI Config File

### Basic Structure

```yaml
# .circleci/config.yml
version: 2.1

jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run: python -m pip install -r requirements.txt
      - run: pytest

workflows:
  version: 2
  build_and_test:
    jobs:
      - build
```

### CircleCI Config Version

| Version | Description |
|---------|-------------|
| `2` | Original v2 config syntax |
| `2.1` | Latest syntax with orbs support |

## CircleCI Executors

### Docker Executor

```yaml
jobs:
  build:
    docker:
      - image: circleci/python:3.9
      - image: circleci/postgres:12
        environment:
          POSTGRES_USER: postgres
          POSTGRES_DB: test_db
    steps:
      - checkout
      - run: python -m pytest
```

### Machine Executor

```yaml
jobs:
  build:
    machine:
      image: ubuntu-2004:202101-01
    resource_class: medium
    steps:
      - checkout
      - run: npm install
      - run: npm test
```

### macOS Executor

```yaml
jobs:
  build:
    macos:
      xcode: 13.4.0
    steps:
      - checkout
      - run: xcodebuild test
```

### Windows Executor

```yaml
jobs:
  build:
    windows:
      image: windows-server-2022-vs2022:2022.05.01
    steps:
      - checkout
      - run: npm install
      - run: npm test
```

## CircleCI Steps

### Built-in Steps

| Step | Description |
|-------|-------------|
| `checkout` | Clone repository code |
| `setup_remote_docker` | Set up remote Docker environment |
| `restore_cache` | Restore cached dependencies |
| `save_cache` | Save dependencies to cache |
| `persist_to_workspace` | Persist files to workspace |
| `attach_workspace` | Attach files from workspace |
| `store_artifacts` | Upload build artifacts |
| `store_test_results` | Upload test results |
| `run` | Execute command |
| `when` | Conditional step execution |

### Checkout Step

```yaml
jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run: python -m pip install -r requirements.txt
      - run: pytest
```

### Run Step

```yaml
jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: pip install -r requirements.txt
      - run:
          name: Run tests
          command: pytest
          when: on_success
```

### Cache Steps

```yaml
jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "requirements.txt" }}
            - v1-dependencies-
      - run: python -m pip install -r requirements.txt
      - save_cache:
          key: v1-dependencies-{{ checksum "requirements.txt" }}
          paths:
            - /home/circleci/.local/lib/python3.9/site-packages
```

### Workspace Steps

```yaml
jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run: python -m pytest
      - persist_to_workspace:
          root: /tmp
          paths:
            - dist

  deploy:
    docker:
      - image: circleci/python:3.9
    steps:
      - attach_workspace:
          at: /tmp
      - run: echo "Deploying build"
```

### Artifacts Step

```yaml
jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run: python -m pip install -r requirements.txt
      - run: python setup.py sdist
      - store_artifacts:
          path: dist/
          destination: python-packages
```

### Test Results Step

```yaml
jobs:
  test:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run: python -m pip install -r requirements.txt
      - run: python -m pytest --junitxml=test-results.xml
      - store_test_results:
          path: test-results.xml
```

## CircleCI Workflows

### Simple Workflow

```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run: python -m pytest

workflows:
  version: 2
  build_workflow:
    jobs:
      - build
```

### Parallel Jobs

```yaml
version: 2.1

jobs:
  test-1:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run: python -m pytest tests/test1.py

  test-2:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run: python -m pytest tests/test2.py

workflows:
  version: 2
  test_workflow:
    jobs:
      - test-1
      - test-2
```

### Sequential Jobs

```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run: python -m pytest

  deploy:
    docker:
      - image: circleci/python:3.9
    steps:
      - run: echo "Deploying"

workflows:
  version: 2
  build_and_deploy:
    jobs:
      - build
      - deploy:
          requires:
            - build
```

### Branch Filtering

```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run: python -m pytest

  deploy:
    docker:
      - image: circleci/python:3.9
    steps:
      - run: echo "Deploying to production"

workflows:
  version: 2
  build_and_deploy:
    jobs:
      - build
      - deploy:
          requires:
            - build
          filters:
            branches:
              only: main
```

### Scheduled Workflows

```yaml
version: 2.1

jobs:
  scheduled-job:
    docker:
      - image: circleci/python:3.9
    steps:
      - run: echo "Running scheduled job"

workflows:
  version: 2
  scheduled-workflow:
    triggers:
      - schedule:
          cron: "0 0 * * *"
          filters:
            branches:
              only:
                - main
    jobs:
      - scheduled-job
```

## CircleCI Orbs

### Using Orbs

```yaml
version: 2.1

orbs:
  node: circleci/node@5.0.0

jobs:
  build:
    docker:
      - image: cimg/node:16.10.0
    steps:
      - checkout
      - node/install:
          node-version: '16.10.0'
      - run: npm test
```

### Popular Orbs

| Orb | Description |
|-----|-------------|
| `circleci/node` | Node.js utilities |
| `circleci/python` | Python utilities |
| `circleci/docker` | Docker commands |
| `circleci/aws-ecr` | AWS ECR integration |
| `circleci/azure-aci` | Azure Container Instances |
| `circleci/ssh` | SSH utilities |
| `circleci/slack` | Slack notifications |

### Custom Orb

```yaml
# orb.yml
version: 2.1

description: "My custom orb"

commands:
  mycommand:
    description: "My custom command"
    steps:
      - run:
          name: "My Command"
          command: echo "Running custom command"
```

```yaml
# Using custom orb
version: 2.1

orbs:
  myorb: myorg/myorb@1.0.0

jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - myorb/mycommand
```

## CircleCI Environment Variables

### Project Variables

```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: circleci/python:3.9
    environment:
      VAR1: $PROJECT_VAR1
      VAR2: $PROJECT_VAR2
    steps:
      - run: echo $VAR1
      - run: echo $VAR2
```

### Contexts

```yaml
version: 2.1

jobs:
  deploy:
    docker:
      - image: circleci/python:3.9
    steps:
      - run: echo $DEPLOY_KEY
    context: production

workflows:
  version: 2
  deploy_workflow:
    jobs:
      - deploy:
          context: production
```

### Built-in Environment Variables

| Variable | Description |
|-----------|-------------|
| `CIRCLECI` | Always `true` |
| `CIRCLE_BRANCH` | Branch name |
| `CIRCLE_SHA1` | Commit SHA |
| `CIRCLE_BUILD_NUM` | Build number |
| `CIRCLE_BUILD_URL` | Build URL |
| `CIRCLE_REPOSITORY_URL` | Repository URL |
| `CIRCLE_TAG` | Tag name (if tagged build) |
| `CIRCLE_JOB` | Job name |
| `CIRCLE_USERNAME` | Username who triggered build |

## CircleCI Deployment

### Deploy to AWS S3

```yaml
version: 2.1

orbs:
  aws-s3: circleci/aws-s3@3.0.0

jobs:
  deploy:
    docker:
      - image: cimg/base:stable
    steps:
      - checkout
      - run: npm run build
      - aws-s3/sync:
          from: ./dist
          to: s3://my-bucket/
          arguments: --acl public-read
```

### Deploy to Heroku

```yaml
version: 2.1

jobs:
  deploy:
    docker:
      - image: circleci/node:13.11.0
    steps:
      - checkout
      - run: npm install
      - run: npm run build
      - run:
          name: Deploy to Heroku
          command: git push https://heroku:$HEROKU_API_KEY@git.heroku.com/$HEROKU_APP_NAME.git HEAD
```

### Deploy to Docker Hub

```yaml
version: 2.1

jobs:
  build-and-push:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - setup_remote_docker
      - run:
          name: Build Docker image
          command: docker build -t myorg/myapp:latest .
      - run:
          name: Push to Docker Hub
          command: docker push myorg/myapp:latest
```

## CircleCI Caching

### Docker Layer Caching

```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - restore_cache:
          keys:
            - myapp-docker-{{ checksum "Dockerfile" }}
            - myapp-docker-
      - run: docker build -t myapp .
      - save_cache:
          key: myapp-docker-{{ checksum "Dockerfile" }}
          paths:
            - /tmp/docker-archives
```

### Dependency Caching

```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - restore_cache:
          keys:
            - pip-dependencies-{{ checksum "requirements.txt" }}
            - pip-dependencies-
      - run: python -m pip install -r requirements.txt
      - save_cache:
          key: pip-dependencies-{{ checksum "requirements.txt" }}
          paths:
            - /home/circleci/.local/lib/python3.9/site-packages
```

## CircleCI Test Splitting

### Test Splitting by Timings

```yaml
version: 2.1

jobs:
  test:
    docker:
      - image: circleci/python:3.9
    parallelism: 4
    steps:
      - checkout
      - restore_cache:
          keys:
            - pip-dependencies-{{ checksum "requirements.txt" }}
      - run: python -m pip install -r requirements.txt
      - save_cache:
          key: pip-dependencies-{{ checksum "requirements.txt" }}
          paths:
            - /home/circleci/.local/lib/python3.9/site-packages
      - run:
          name: Run tests
          command: |
            TESTFILES=$(circleci tests glob "tests/**/*.py" | circleci tests split --split-by=timings)
            python -m pytest $TESTFILES
      - store_test_results:
          path: test-results
```

### Test Splitting by Filename

```yaml
version: 2.1

jobs:
  test:
    docker:
      - image: circleci/python:3.9
    parallelism: 4
    steps:
      - checkout
      - run:
          name: Run tests
          command: |
            TESTFILES=$(circleci tests glob "tests/**/*.py" | circleci tests split --split-by=filesize)
            python -m pytest $TESTFILES
```

## CircleCI Notifications

### Slack Notifications

```yaml
version: 2.1

orbs:
  slack: circleci/slack@4.0.0

jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run: python -m pytest
      - slack/notify:
          event: fail
          template: basic_fail_1

workflows:
  version: 2
  build_workflow:
    jobs:
      - build
```

### Email Notifications

```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run: python -m pytest
      - slack/notify:
          event: fail
          template: basic_fail_1
```

## CircleCI CLI

### Installation

```bash
# Using curl
curl -fLSs https://raw.githubusercontent.com/CircleCI-Public/circleci-cli/master/install.sh | bash

# Using Homebrew
brew install circleci
```

### CLI Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `circleci version` | Show CLI version |
| `circleci config validate` | Validate config file |
| `circleci config process` | Process and expand config |
| `circleci local execute` | Run job locally |
| `circleci config pack` | Pack config files |
| `circleci orb init` | Initialize new orb |

### Local Execution

```bash
# Validate config
circleci config validate

# Run job locally
circleci local execute --job build

# Run with Docker
circleci local execute --job build --docker-image circleci/python:3.9
```

## CircleCI Best Practices

1. **Use Caching** - Cache dependencies to speed up builds
2. **Parallelize Tests** - Split tests across multiple containers
3. **Use Workspace** - Share files between jobs
4. **Filter Workflows** - Only run jobs on relevant branches
5. **Use Orbs** - Leverage pre-built configurations
6. **Test Config Locally** - Use CLI to validate config
7. **Use Environment Variables** - Separate config from code
8. **Set Resource Limits** - Choose appropriate resource class
9. **Use Conditional Steps** - Execute steps conditionally
10. **Monitor Build Times** - Optimize slow jobs

## CircleCI vs Other CI/CD Tools

| Feature | CircleCI | GitHub Actions | GitLab CI | Jenkins |
|----------|-----------|---------------|-----------|---------|
| **Hosted** | Yes | Yes | Yes | Self-hosted option |
| **Config Format** | YAML | YAML | YAML | Groovy |
| **Pricing** | Per minute | Per minute | Per minute | Self-hosted |
| **Orbs** | Yes | Marketplace | Templates | Plugins |
| **Parallel Jobs** | Yes | Yes | Yes | Yes |
| **Self-hosted** | Yes | Yes | Yes | Native |
| **Learning Curve** | Easy | Easy | Easy | Moderate |

## Useful Tips

### Debugging Failures

```yaml
jobs:
  build:
    docker:
      - image: circleci/python:3.9
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: pip install -r requirements.txt
          when: on_fail
      - run:
          name: Run tests
          command: python -m pytest
```

### Conditional Execution

```yaml
jobs:
  deploy:
    docker:
      - image: circleci/python:3.9
    steps:
      - run:
          name: Deploy
          command: echo "Deploying"
          when: on_success
```

### Resource Classes

| Class | CPU | RAM |
|-------|-----|-----|
| `small` | 1 vCPU | 2GB |
| `medium` | 2 vCPU | 4GB |
| `large` | 4 vCPU | 8GB |
| `xlarge` | 8 vCPU | 16GB |
| `2xlarge` | 16 vCPU | 32GB |

```yaml
jobs:
  build:
    machine:
      image: ubuntu-2004:202101-01
      resource_class: large
    steps:
      - checkout
      - run: npm test
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Config validation error | Use `circleci config validate` |
| Build fails locally | Check Docker image compatibility |
| Cache not working | Verify cache key and paths |
| Secrets not available | Check environment variables |
| Slow builds | Enable caching, parallelize tests |

### CircleCI Pricing

| Plan | Free | Performance |
|------|-------|------------|
| **Free** | 6000 minutes/month | 1 concurrent job |
| **Performance** | 10000+ minutes/month | 10 concurrent jobs |
| **Scale** | Custom | Unlimited concurrent jobs |

**Pricing Factors**:
- Execution time (Linux/Windows/macOS)
- Concurrent jobs
- Self-hosted runners (free with Enterprise plan)
