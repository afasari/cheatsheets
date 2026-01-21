# GitLab CI/CD

Continuous integration and delivery platform for GitLab.

## Pipeline Configuration

### Basic .gitlab-ci.yml
```yaml
stages:
  - build
  - test
  - deploy

job1:
  stage: build
  script:
    - echo "Building..."

job2:
  stage: test
  script:
    - echo "Testing..."

job3:
  stage: deploy
  script:
    - echo "Deploying..."
```

## Stages & Jobs

| KEYWORD | DESCRIPTION |
| --- | --- |
| `stages` | Define pipeline stages |
| `before_script` | Commands run before each job |
| `after_script` | Commands run after each job |
| `script` | Commands to execute |
| `image` | Docker image for the job |
| `services` | Docker services to link |

## Variables

### GitLab CI Variables
| VARIABLE | DESCRIPTION |
| --- | --- |
| `CI_COMMIT_SHA` | Commit SHA |
| `CI_COMMIT_REF_NAME` | Branch name |
| `CI_COMMIT_TAG` | Tag name |
| `CI_PIPELINE_ID` | Pipeline ID |
| `CI_JOB_ID` | Job ID |
| `CI_PROJECT_DIR` | Project directory |
| `CI_REGISTRY` | Container registry URL |
| `CI_REGISTRY_USER` | Registry username |

### Defining Variables
```yaml
variables:
  DEPLOY_ENV: production
  NODE_ENV: production

job:
  variables:
    NODE_ENV: development
  script:
    - echo $NODE_ENV
```

### Using Variables
```yaml
job:
  script:
    - echo "Running on branch: $CI_COMMIT_REF_NAME"
    - echo "Project: $CI_PROJECT_NAME"
```

## Artifacts & Caching

### Artifacts
```yaml
job1:
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
```

### Cache
```yaml
job:
  cache:
    paths:
      - node_modules/
  script:
    - npm install
    - npm test
```

## Docker

### Build & Push
```yaml
build_image:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY/myimage:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY/myimage:$CI_COMMIT_SHA
```

### Using Kaniko
```yaml
build:
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  script:
    - echo "{\"auths\":{\"$CI_REGISTRY\":{\"username\":\"$CI_REGISTRY_USER\",\"password\":\"$CI_REGISTRY_PASSWORD\"}}}" > /kaniko/.docker/config.json
    - /kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG
```

## Kubernetes Deployment

### Deploy to K8s
```yaml
deploy:
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context my-cluster
    - kubectl set image deployment/myapp myapp=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/myapp
```

## Pipeline Triggers

### Trigger on Push
```yaml
job:
  script:
    - echo "Running on push"
  only:
    - main
    - develop
```

### Trigger on Merge Request
```yaml
job:
  script:
    - echo "Running on MR"
  only:
    - merge_requests
```

### Trigger on Tag
```yaml
job:
  script:
    - echo "Running on tag"
  only:
    - tags
```

### Trigger Manually
```yaml
deploy_production:
  stage: deploy
  script:
    - echo "Deploying to production"
  when: manual
  only:
    - main
```

## Rules

### Complex Rules
```yaml
job:
  script:
    - echo "Conditional job"
  rules:
    - if: '$CI_COMMIT_REF_NAME == "main"'
      when: manual
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: on_success
    - when: never
```

## Environments

### Define Environments
```yaml
deploy_staging:
  stage: deploy
  environment:
    name: staging
    url: https://staging.example.com
  script:
    - echo "Deploy to staging"

deploy_production:
  stage: deploy
  environment:
    name: production
    url: https://example.com
  script:
    - echo "Deploy to production"
  when: manual
```

## Include & Templates

### Include Templates
```yaml
include:
  - template: Auto-DevOps.gitlab-ci.yml
  - project: 'my-org/ci-templates'
    file: '/lint.yml'
    ref: main
```

### Reusable Components
```yaml
# .gitlab-ci.yml
include:
  - local: '/templates/.gitlab-ci-template.yml'

stages:
  - test
  - build

test:
  extends: .node_test

build:
  extends: .node_build
```

```yaml
# templates/.gitlab-ci-template.yml
.node_test:
  image: node:18
  script:
    - npm install
    - npm test

.node_build:
  image: node:18
  script:
    - npm install
    - npm run build
```

## Dependencies

### Job Dependencies
```yaml
job1:
  stage: build
  script:
    - echo "Building"

job2:
  stage: deploy
  needs:
    - job1
  script:
    - echo "Deploying after job1"
```

## Parallel Jobs

```yaml
test1:
  stage: test
  script:
    - npm run test:unit

test2:
  stage: test
  script:
    - npm run test:integration
```

## Matrix

```yaml
test:
  stage: test
  parallel:
    matrix:
      - NODE_VERSION: [14, 16, 18]
        OS: [alpine, debian]
  script:
    - echo "Testing Node $NODE_VERSION on $OS"
```

## Notifications

### Email Notifications
```yaml
notify:
  stage: deploy
  script:
    - echo "Notify team"
  after_script:
    - mail -s "Pipeline $CI_PIPELINE_ID finished" team@example.com <<< "Deployment complete"
```

## Security

### SAST
```yaml
include:
  - template: Security/SAST.gitlab-ci.yml
```

### Dependency Scanning
```yaml
include:
  - template: Security/Dependency-Scanning.gitlab-ci.yml
```

### Container Scanning
```yaml
include:
  - template: Security/Container-Scanning.gitlab-ci.yml
```

## Pages

### Deploy Static Site
```yaml
pages:
  stage: deploy
  script:
    - npm run build
    - mv dist public
  artifacts:
    paths:
      - public
  only:
    - main
```

## Useful Commands

```bash
# Run pipeline locally
gitlab-runner exec docker job_name

# Validate .gitlab-ci.yml
gitlab-ci-lint .gitlab-ci.yml

# Get pipeline status
curl --header "PRIVATE-TOKEN: $TOKEN" https://gitlab.com/api/v4/projects/$PROJECT_ID/pipelines/$PIPELINE_ID
```

## Best Practices

- Use `.gitlab-ci.yml` at repository root
- Use stages to organize jobs logically
- Use artifacts to share data between jobs
- Use cache to speed up builds
- Use environments for deployments
- Use rules for complex conditions
- Include security scanning templates
- Use CI/CD variables for sensitive data
- Test pipelines in merge requests
- Use manual jobs for production deployments
- Use project templates for consistency
- Monitor pipeline performance

::: tip
Use GitLab's `ci/lint` feature to validate your `.gitlab-ci.yml` before committing.
:::
