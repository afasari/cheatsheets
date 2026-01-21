# Kubernetes (kubectl)

Container orchestration platform for automating deployment, scaling, and management.

## Basic Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `kubectl get pods` | List all pods |
| `kubectl get svc` | List all services |
| `kubectl get deploy` | List all deployments |
| `kubectl get nodes` | List cluster nodes |
| `kubectl get all` | List all resources |
| `kubectl get <resource> -n <namespace>` | List resources in namespace |

## Creating & Applying

| COMMAND | DESCRIPTION |
| --- | --- |
| `kubectl apply -f file.yaml` | Apply configuration |
| `kubectl create -f file.yaml` | Create resource from file |
| `kubectl delete -f file.yaml` | Delete resources from file |
| `kubectl run <name> --image=<image>` | Run a pod |

## Pod Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `kubectl describe pod <pod>` | Show pod details |
| `kubectl logs <pod>` | Show pod logs |
| `kubectl logs -f <pod>` | Follow pod logs |
| `kubectl exec -it <pod> -- /bin/bash` | Execute command in pod |
| `kubectl port-forward <pod> 8080:80` | Forward port to local |
| `kubectl delete pod <pod>` | Delete a pod |
| `kubectl top pod <pod>` | Show pod resource usage |

## Deployment Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `kubectl scale deploy <name> --replicas=3` | Scale deployment |
| `kubectl rollout status deploy/<name>` | Check rollout status |
| `kubectl rollout history deploy/<name>` | Show deployment history |
| `kubectl rollout undo deploy/<name>` | Rollback to previous |
| `kubectl rollout undo deploy/<name> --to-revision=2` | Rollback to specific version |

## Namespace Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `kubectl create namespace <name>` | Create namespace |
| `kubectl delete namespace <name>` | Delete namespace |
| `kubectl config set-context --current --namespace=<name>` | Set default namespace |

## ConfigMaps & Secrets

| COMMAND | DESCRIPTION |
| --- | --- |
| `kubectl create configmap <name> --from-file=path` | Create ConfigMap from file |
| `kubectl create secret generic <name> --from-literal=key=value` | Create secret |
| `kubectl get secrets` | List secrets |
| `kubectl get configmaps` | List ConfigMaps |

## Service & Ingress

| COMMAND | DESCRIPTION |
| --- | --- |
| `kubectl expose pod <pod> --port=80 --type=LoadBalancer` | Expose pod as service |
| `kubectl get ingress` | List ingress resources |
| `kubectl describe ingress <name>` | Show ingress details |

## Troubleshooting

| COMMAND | DESCRIPTION |
| --- | --- |
| `kubectl describe <resource> <name>` | Show detailed information |
| `kubectl logs <pod> --previous` | Show logs from previous container |
| `kubectl get events --sort-by=.metadata.creationTimestamp` | List cluster events |
| `kubectl cluster-info` | Show cluster info |
| `kubectl get componentstatuses` | Check component status |

## YAML Examples

### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

### Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

### ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.properties: |
    key=value
    debug=true
```

## Useful Flags

| FLAG | DESCRIPTION |
| --- | --- |
| `-o yaml` | Output in YAML format |
| `-o json` | Output in JSON format |
| `-o wide` | Show more details |
| `--watch` | Watch for changes |
| `--all-namespaces` | Show all namespaces |
| `--field-selector` | Filter by field |

## Resource Management

```bash
# Edit resource
kubectl edit <resource> <name>

# Get resource in specific format
kubectl get pod <pod> -o yaml

# Get resource as JSON
kubectl get pod <pod> -o json

# Copy file from pod
kubectl cp <pod>:/path/file ./local-file
```

## Labels & Selectors

```bash
# Add label
kubectl label pod <pod> key=value

# Remove label
kubectl label pod <pod> key-

# Select by label
kubectl get pods -l app=nginx

# Select with multiple labels
kubectl get pods -l env=prod,tier=frontend
```

## Context Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `kubectl config get-contexts` | List contexts |
| `kubectl config use-context <name>` | Switch context |
| `kubectl config current-context` | Show current context |
| `kubectl config set-credentials <name>` | Set credentials |

## Quick Checks

```bash
# Check cluster health
kubectl get nodes
kubectl get cs

# Check pod status
kubectl get pods -o wide

# Check resource usage
kubectl top nodes
kubectl top pods

# Check everything
kubectl get all --all-namespaces
```

## Best Practices

- Always use resource requests and limits
- Implement health checks (liveness, readiness probes)
- Use namespaces to organize resources
- Use labels and annotations for organization
- Use ConfigMaps for configuration, Secrets for sensitive data
- Implement pod disruption budgets for critical services
- Use taints and tolerations for node scheduling
- Regularly audit RBAC policies

::: tip
Use `kubectl explain <resource>` to get documentation about Kubernetes resources and fields.
:::
