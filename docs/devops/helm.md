# Helm

Package manager for Kubernetes that helps you manage Kubernetes applications.

## Basic Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `helm search repo <keyword>` | Search for charts |
| `helm repo add <name> <url>` | Add chart repository |
| `helm repo list` | List repositories |
| `helm repo update` | Update repositories |
| `helm install <release> <chart>` | Install a chart |
| `helm upgrade <release> <chart>` | Upgrade a release |
| `helm uninstall <release>` | Uninstall a release |
| `helm list` | List releases |

## Release Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `helm status <release>` | Show release status |
| `helm history <release>` | Show release history |
| `helm rollback <release> <revision>` | Rollback to revision |
| `helm get values <release>` | Show release values |
| `helm get manifest <release>` | Show Kubernetes manifests |
| `helm get all <release>` | Show all information |
| `helm ls --all-namespaces` | List all releases |

## Chart Development

| COMMAND | DESCRIPTION |
| --- | --- |
| `helm create <name>` | Create a new chart |
| `helm lint <chart>` | Lint a chart |
| `helm package <chart>` | Package a chart |
| `helm dependency update` | Update chart dependencies |
| `helm template <release> <chart>` | Render templates locally |

## Values & Configuration

| COMMAND | DESCRIPTION |
| --- | --- |
| `helm install -f values.yaml <release> <chart>` | Install with custom values |
| `helm install --set key=value <release> <chart>` | Set individual values |
| `helm install --set-file key=path <release> <chart>` | Set values from file |
| `helm show values <chart>` | Show default values |

## Useful Flags

| FLAG | DESCRIPTION |
| --- | --- |
| `-n <namespace>` | Specify namespace |
| `--create-namespace` | Create namespace if needed |
| `--dry-run` | Simulate install without making changes |
| `--debug` | Enable verbose output |
| `--wait` | Wait until resources are ready |
| `--timeout 5m` | Set timeout duration |
| `--version <version>` | Install specific chart version |

## Chart Structure

```
mychart/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default values
├── values.schema.json  # Values schema
├── charts/             # Chart dependencies
├── templates/          # Template files
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── _helpers.tpl    # Template helpers
│   └── NOTES.txt       # Usage notes
└── README.md           # Chart documentation
```

## Chart.yaml

```yaml
apiVersion: v2
name: mychart
description: A Helm chart for Kubernetes
type: application
version: 0.1.0
appVersion: "1.16.0"

keywords:
  - mychart
  - kubernetes

maintainers:
  - name: Your Name
    email: your@email.com

dependencies:
  - name: postgresql
    version: 10.x.x
    repository: https://charts.bitnami.com/bitnami
```

## Template Functions

### Basic Functions
```yaml
{{ .Values.replicaCount }}
{{ .Release.Name }}
{{ .Chart.Name }}
{{ .Values.image.repository }}:{{ .Values.image.tag }}
```

### Conditionals
```yaml
{{- if .Values.enabled }}
# Only rendered if enabled is true
{{- end }}

{{- if ne .Values.service.type "LoadBalancer" }}
# Only if service type is NOT LoadBalancer
{{- end }}

{{- if or .Values.featureA .Values.featureB }}
# If featureA OR featureB is true
{{- end }}
```

### Loops
```yaml
{{- range .Values.list }}
- name: {{ .name }}
  port: {{ .port }}
{{- end }}

{{- range $key, $value := .Values.dict }}
{{ $key }}: {{ $value }}
{{- end }}
```

### Default Values
```yaml
image: {{ .Values.image.repository | default "nginx" }}
```

### String Manipulation
```yaml
# Upper case
{{ "hello" | upper }}

# Lower case
{{ "HELLO" | lower }}

# Title case
{{ "hello world" | title }}

# Trim
{{ "  hello  " | trim }}

# Quote
{{ "hello" | quote }}
```

## Common Templates

### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mychart.fullname" . }}
  labels:
    {{- include "mychart.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "mychart.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "mychart.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.service.port }}
              protocol: TCP
```

### Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "mychart.fullname" . }}
  labels:
    {{- include "mychart.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "mychart.selectorLabels" . | nindent 4 }}
```

### ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "mychart.fullname" . }}-config
  labels:
    {{- include "mychart.labels" . | nindent 4 }}
data:
  {{- toYaml .Values.config | nindent 2 }}
```

### Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "mychart.fullname" . }}-secret
  labels:
    {{- include "mychart.labels" . | nindent 4 }}
type: Opaque
data:
  password: {{ .Values.secret.password | b64enc }}
```

## Helper Functions

### Common helpers.tpl
```yaml
{{/*
Expand the name of the chart.
*/}}
{{- define "mychart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "mychart.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create default fully qualified app name.
*/}}
{{- define "mychart.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version.
*/}}
{{- define "mychart.labels" -}}
helm.sh/chart: {{ include "mychart.chart" . }}
{{ include "mychart.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "mychart.selectorLabels" -}}
app.kubernetes.io/name: {{ include "mychart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
```

## Examples

### Install with custom values
```bash
helm install myapp ./mychart -f values-prod.yaml
```

### Install from repository
```bash
helm install myapp bitnami/nginx --set service.type=LoadBalancer
```

### Upgrade a release
```bash
helm upgrade myapp ./mychart -f values.yaml
```

### Rollback
```bash
helm rollback myapp 1
```

### Template rendering (dry-run)
```bash
helm template myapp ./mychart -f values.yaml
```

### Show chart info
```bash
helm show chart bitnami/nginx
helm show values bitnami/nginx
helm show readme bitnami/nginx
```

## Best Practices

- Use semantic versioning for charts
- Document all values in README
- Use values.schema.json for validation
- Include NOTES.txt for post-install instructions
- Use helper functions for common labels and names
- Keep templates simple and readable
- Use proper indentation
- Add comments for complex logic
- Test charts with `helm lint` and `helm template`
- Use dependencies instead of copying code
- Follow Kubernetes best practices

::: tip
Use `helm diff upgrade <release> <chart>` to preview changes before upgrading (requires helm-diff plugin).
:::
