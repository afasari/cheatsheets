# Google Cloud CLI (gcloud)

Command line interface for Google Cloud Platform.

## Authentication & Configuration

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud auth login` | Login to Google Cloud |
| `gcloud auth list` | List authenticated accounts |
| `gcloud config set project PROJECT_ID` | Set default project |
| `gcloud config set compute/region us-central1` | Set default region |
| `gcloud config set compute/zone us-central1-a` | Set default zone |
| `gcloud config list` | View configuration |
| `gcloud init` | Initialize gcloud configuration |

## Compute Engine (VMs)

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud compute instances list` | List VM instances |
| `gcloud compute instances create myvm --zone us-central1-a --machine-type e2-medium` | Create VM instance |
| `gcloud compute instances start myvm --zone us-central1-a` | Start VM |
| `gcloud compute instances stop myvm --zone us-central1-a` | Stop VM |
| `gcloud compute instances delete myvm --zone us-central1-a` | Delete VM |
| `gcloud compute instances describe myvm --zone us-central1-a` | Get instance details |
| `gcloud compute instances ssh myvm --zone us-central1-a` | SSH into instance |
| `gcloud compute instances add-metadata myvm --zone us-central1-a --metadata key=value` | Add metadata |

## Cloud Storage

| COMMAND | DESCRIPTION |
| --- | --- |
| `gsutil ls` | List buckets |
| `gsutil mb gs://my-bucket` | Create bucket |
| `gsutil rb gs://my-bucket` | Delete bucket |
| `gsutil ls gs://my-bucket` | List objects in bucket |
| `gsutil cp file.txt gs://my-bucket/` | Upload file |
| `gsutil cp gs://my-bucket/file.txt .` | Download file |
| `gsutil cp -r dir/ gs://my-bucket/` | Upload directory |
| `gsutil rsync -r local-dir gs://my-bucket/` | Sync directory |
| `gsutil rm gs://my-bucket/file.txt` | Delete object |
| `gsutil du gs://my-bucket` | Show bucket usage |
| `gsutil versioning set on gs://my-bucket` | Enable versioning |

## Cloud Functions

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud functions list` | List functions |
| `gcloud functions deploy myfunc --runtime nodejs18 --trigger-http` | Deploy function |
| `gcloud functions describe myfunc` | Get function details |
| `gcloud functions delete myfunc` | Delete function |
| `gcloud functions logs read myfunc` | Read function logs |
| `gcloud functions call myfunc --data '{"key":"value"}'` | Call function |

## App Engine

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud app describe` | Get app details |
| `gcloud app versions list` | List versions |
| `gcloud app deploy` | Deploy application |
| `gcloud app browse` | Open application in browser |
| `gcloud app logs read` | Read application logs |

## Cloud SQL

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud sql instances list` | List SQL instances |
| `gcloud sql instances create mydb --tier db-f1-micro --region us-central1` | Create instance |
| `gcloud sql instances describe mydb` | Get instance details |
| `gcloud sql databases list --instance mydb` | List databases |
| `gcloud sql databases create mydb --instance mydb` | Create database |
| `gcloud sql users list --instance mydb` | List users |
| `gcloud sql users create --instance mydb --username myuser --password mypassword` | Create user |
| `gcloud sql instances delete mydb` | Delete instance |

## Kubernetes Engine (GKE)

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud container clusters list` | List GKE clusters |
| `gcloud container clusters create mycluster --num-nodes 3 --zone us-central1-a` | Create cluster |
| `gcloud container clusters get-credentials mycluster --zone us-central1-a` | Get cluster credentials |
| `gcloud container clusters resize mycluster --num-nodes 5 --zone us-central1-a` | Resize cluster |
| `gcloud container clusters delete mycluster --zone us-central1-a` | Delete cluster |
| `gcloud container node-pools list --cluster mycluster --zone us-central1-a` | List node pools |

## Cloud Pub/Sub

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud pubsub topics list` | List topics |
| `gcloud pubsub topics create mytopic` | Create topic |
| `gcloud pubsub topics publish mytopic --message "hello"` | Publish message |
| `gcloud pubsub subscriptions list` | List subscriptions |
| `gcloud pubsub subscriptions create mysub --topic mytopic` | Create subscription |

## BigQuery

| COMMAND | DESCRIPTION |
| --- | --- |
| `bq ls` | List datasets |
| `bq mk mydataset` | Create dataset |
| `bq query "SELECT * FROM \`mydataset.table\` LIMIT 10"` | Run query |
| `bq show dataset.table` | Show table details |
| `bq load --source_format=CSV mydataset.table data.csv` | Load data |
| `bq extract mydataset.table gs://bucket/file.csv` | Export data |
| `bq rm -r mydataset` | Delete dataset |

## Cloud IAM

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud iam roles list` | List IAM roles |
| `gcloud projects get-iam-policy PROJECT_ID` | Get IAM policy |
| `gcloud projects add-iam-policy-binding PROJECT_ID --member=user:email@example.com --role=roles/editor` | Add IAM binding |
| `gcloud service-accounts list` | List service accounts |
| `gcloud iam service-accounts create my-sa --display-name "My Service Account"` | Create service account |
| `gcloud iam service-accounts keys create key.json --iam-account=my-sa@PROJECT_ID.iam.gserviceaccount.com` | Create service account key |

## Cloud Logging

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud logging logs list` | List logs |
| `gcloud logging read "resource.type=gce_instance" --limit 10` | Read log entries |
| `gcloud logging tail "resource.type=gce_instance"` | Tail logs |

## Cloud Monitoring

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud monitoring time-series list` | List time series |
| `gcloud monitoring policies list` | List alert policies |
| `gcloud monitoring policies create my-policy.json` | Create alert policy |

## VPC Networks

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud compute networks list` | List networks |
| `gcloud compute networks create mynetwork --subnet-mode custom` | Create network |
| `gcloud compute networks subnets list` | List subnets |
| `gcloud compute networks subnets create mysubnet --network mynetwork --region us-central1 --range 10.0.0.0/24` | Create subnet |
| `gcloud compute firewall-rules list` | List firewall rules |
| `gcloud compute firewall-rules create myrule --allow tcp:80 --network mynetwork` | Create firewall rule |

## Cloud Build

| COMMAND | DESCRIPTION |
| --- | --- |
| `gcloud builds list` | List builds |
| `gcloud builds submit --tag gcr.io/PROJECT_ID/myimage` | Submit build |
| `gcloud builds log BUILD_ID` | View build logs |
| `gcloud builds delete BUILD_ID` | Delete build |

## Useful Queries

### Get VM external IP
```bash
gcloud compute instances describe myvm --zone us-central1-a \
  --format="get(networkInterfaces[0].accessConfigs[0].natIP)"
```

### List all running VMs
```bash
gcloud compute instances list --filter="status:RUNNING"
```

### Get project ID
```bash
gcloud config get-value project
```

### Get service account email
```bash
gcloud iam service-accounts list \
  --filter="displayName:My Service Account" \
  --format="value(email)"
```

### List buckets by size
```bash
gsutil du -h gs://my-bucket | sort -rh
```

### Download entire bucket
```bash
gsutil -m cp -r gs://my-bucket/* ./local-dir/
```

### Get function URL
```bash
gcloud functions describe myfunc --format="value(httpsTrigger.url)"
```

## Best Practices

- Use projects to organize resources
- Always specify zones and regions explicitly in scripts
- Use IAM roles with least privilege principle
- Enable logging and monitoring for all services
- Use Cloud KMS for encryption keys
- Use Cloud Asset Inventory for auditing
- Enable VPC Service Controls for sensitive data
- Use resource labels for cost tracking
- Set up budget alerts for cost management
- Use Cloud Build for CI/CD pipelines
- Regularly rotate service account keys

::: tip
Use `--format` flag with `gcloud` commands to format output as table, json, yaml, or csv for easier parsing.
:::
