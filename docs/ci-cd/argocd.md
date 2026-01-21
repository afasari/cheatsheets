# ArgoCD

GitOps continuous delivery tool for Kubernetes.

## Installation

### Using kubectl
```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Verify installation
kubectl get pods -n argocd
```

### Using Helm
```bash
# Add repository
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

# Install ArgoCD
helm install argocd argo/argo-cd -n argocd --create-namespace
```

## Authentication

### Initial Password
```bash
# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath='{.data.password}' | base64 -d
```

### Login via CLI
```bash
# Login
argocd login <ARGOCD_SERVER>

# Using username/password
argocd login localhost:8080 --username admin --password <password>

# Using token
argocd login localhost:8080 --auth-token <token>

# Using certificate
argocd login localhost:8080 --grpc-web
```

## Applications

### Create Application
```bash
# Create from Git repo
argocd app create myapp \
  --repo https://github.com/afasari/cheatsheets.git \
  --path k8s \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default

# Create from directory
argocd app create myapp \
  --repo https://github.com/afasari/cheatsheets.git \
  --path helm/myapp \
  --helm-set image.tag=v1.0.0

# Create from Helm chart
argocd app create myapp \
  --repo https://charts.bitnami.com/bitnami \
  --chart nginx \
  --revision 13.2.0 \
  --helm-set service.type=LoadBalancer
```

### List Applications
```bash
# List all apps
argocd app list

# List with details
argocd app get myapp

# List apps with status
argocd app list -l app.kubernetes.io/name=myapp
```

### Sync Application
```bash
# Sync application
argocd app sync myapp

# Sync specific resource
argocd app sync myapp --resource Deployment/myapp

# Sync with dry-run
argocd app sync myapp --dry-run

# Force sync
argocd app sync myapp --force
```

### Delete Application
```bash
# Delete application
argocd app delete myapp

# Delete with cascade
argocd app delete myapp --cascade
```

## ApplicationSet

### List ApplicationSet
```bash
# List ApplicationSets
argocd appset list

# Get ApplicationSet details
argocd appset get myappset

# Sync ApplicationSet
argocd appset sync myappset
```

### Example ApplicationSet
```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: guestbook
spec:
  generators:
    - list:
        elements:
          - cluster: engineering
            url: https://kubernetes.default.svc
          - cluster: production
            url: https://production-cluster
  template:
    metadata:
      name: '{{cluster}}-guestbook'
    spec:
      project: default
      source:
        repoURL: https://github.com/afasari/cheatsheets.git
        targetRevision: HEAD
        path: guestbook
      destination:
        server: '{{url}}'
        namespace: guestbook
```

## Rollouts

### Get Rollouts
```bash
# List rollouts
argocd app rollouts list myapp

# Get rollout details
argocd app rollouts history myapp

# Retry rollout
argocd app rollouts retry myapp
```

## Rollback

### Rollback Application
```bash
# List history
argocd app history myapp

# Rollback to revision
argocd app rollback myapp <revision-id>

# Rollback with prune
argocd app rollback myapp <revision-id> --prune
```

## App-of-Apps

### Create App-of-Apps
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: apps
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/afasari/cheatsheets.git
    targetRevision: HEAD
    path: apps
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
```

## Repositories

### Add Repository
```bash
# Add Git repo
argocd repo add https://github.com/afasari/cheatsheets.git

# Add with username/password
argocd repo add https://github.com/afasari/cheatsheets.git \
  --username git \
  --password secret

# Add with SSH
argocd repo add git@github.com:afasari/cheatsheets.git \
  --ssh-private-key-path ~/.ssh/id_rsa

# Add Helm repo
argocd repo add https://charts.bitnami.com/bitnami \
  --name bitnami \
  --type helm
```

### List Repositories
```bash
# List all repos
argocd repo list

# Get repo details
argocd repo get https://github.com/afasari/cheatsheets.git
```

### Delete Repository
```bash
# Delete repo
argocd repo rm https://github.com/afasari/cheatsheets.git
```

## Projects

### Create Project
```bash
# Create project
argocd proj create myproject

# Create from file
argocd proj create -f myproject.yaml
```

### List Projects
```bash
# List all projects
argocd proj list

# Get project details
argocd proj get myproject
```

## Clusters

### Add Cluster
```bash
# Add cluster from kubeconfig
argocd cluster add mycluster

# Add external cluster
argocd cluster add https://192.168.1.1 --name mycluster

# Add with service account
argocd cluster add mycluster --service-account argocd-server
```

### List Clusters
```bash
# List all clusters
argocd cluster list

# Get cluster details
argocd cluster get mycluster
```

### Delete Cluster
```bash
# Delete cluster
argocd cluster rm mycluster
```

## Application CRD

### Application Example
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/afasari/cheatsheets.git
    targetRevision: HEAD
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

## Sync Policies

### Automated Sync
```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
    allowEmpty: false
  syncOptions:
    - CreateNamespace=true
    - PrunePropagationPolicy=foreground
    - PruneLast=true
```

### Manual Sync
```yaml
syncPolicy:
  syncOptions:
    - CreateNamespace=true
```

## Hooks

### Pre-Sync Hook
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: myapp-pre-sync-hook
  annotations:
    argocd.argoproj.io/hook: PreSync
spec:
  template:
    spec:
      containers:
      - name: hook
        image: busybox
        command: ["/bin/sh", "-c", "echo pre-sync hook"]
      restartPolicy: Never
```

## Notifications

### Enable Notifications
```bash
# Add notification channel
argocd notifications add channel slack --service-token <token>
```

### Notification Example
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-notifications-cm
data:
  service.slack: |
    token: $slack-token
  template.app-deployed: |
    message: |
      Application {{.app.metadata.name}} is synced at {{.app.status.sync.revision}}
    slack:
      attachments: |
        [{
          "title": "{{ .app.metadata.name}}",
          "title_link":"{{.context.argocdUrl}}/applications/{{.app.metadata.name}}",
          "color": "#18be52",
          "fields": [{
            "title": "Sync Status",
            "value": "{{.app.status.sync.status}}",
            "short": true
          }, {
            "title": "Repository",
            "value": "{{.app.spec.source.repoURL}}",
            "short": true
          }]
        }]
```

## Useful Commands

### Watch Application
```bash
argocd app wait myapp --timeout 60s
```

### Get Diff
```bash
argocd app diff myapp
```

### Export Application
```bash
argocd app get myapp -o json > myapp.json
```

### Import Application
```bash
argocd app create -f myapp.json
```

### Generate Manifest
```bash
argocd app manifests myapp
```

## Best Practices

- Use ApplicationSets for managing multiple applications
- Implement automated sync policies for production
- Use separate projects for different teams/environments
- Implement pre-sync and post-sync hooks
- Use resource policies to control what can be synced
- Use App-of-Apps pattern for managing clusters
- Implement notifications for sync status
- Use Rollouts for zero-downtime deployments
- Regularly review and prune unused applications
- Use secrets management for sensitive data
- Implement backup and restore procedures

::: tip
Use ArgoCD's UI at `https://<argocd-server>` to visually monitor and manage your applications.
:::
