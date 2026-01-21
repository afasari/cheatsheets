# Jenkins

Open-source automation server for continuous integration and delivery.

## Installation

### Using Docker
```bash
# Run Jenkins
docker run -d -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts

# Get initial password
docker exec -it <container-id> cat /var/jenkins_home/secrets/initialAdminPassword
```

### Using Apt (Ubuntu/Debian)
```bash
# Add Jenkins repository
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

## Jenkinsfile

### Basic Pipeline
```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'make build'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                sh 'make test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh 'make deploy'
            }
        }
    }
}
```

## Stages

| STAGE | DESCRIPTION |
| --- | --- |
| `agent` | Where the pipeline runs (any, label, docker, etc.) |
| `stages` | Define pipeline stages |
| `steps` | Commands to execute |
| `environment` | Define environment variables |
| `tools` | Define tools to install |
| `options` | Pipeline configuration options |

## Declarative Pipeline Syntax

### Environment Variables
```groovy
pipeline {
    agent any
    environment {
        APP_NAME = 'myapp'
        VERSION = '1.0.0'
        CREDENTIALS = credentials('my-credentials')
    }
    stages {
        stage('Build') {
            steps {
                sh "echo $APP_NAME $VERSION"
            }
        }
    }
}
```

### Parameters
```groovy
pipeline {
    agent any
    parameters {
        string(name: 'DEPLOY_ENV', defaultValue: 'staging', description: 'Deployment environment')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip tests?')
    }
    stages {
        stage('Build') {
            steps {
                echo "Deploying to ${params.DEPLOY_ENV}"
            }
        }
    }
}
```

### Post Actions
```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'make build'
            }
        }
    }
    post {
        success {
            echo 'Pipeline succeeded!'
            mail to: 'team@example.com',
                 subject: 'Build Success',
                 body: 'Build completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
            mail to: 'team@example.com',
                 subject: 'Build Failed',
                 body: 'Build failed!'
        }
        always {
            echo 'This always runs!'
            cleanWs()
        }
    }
}
```

## Build Triggers

### Cron-based
```groovy
pipeline {
    agent any
    triggers {
        cron('H 2 * * *')  // Runs daily at 2 AM
    }
    stages {
        stage('Build') {
            steps {
                sh 'make build'
            }
        }
    }
}
```

### Poll SCM
```groovy
pipeline {
    agent any
    triggers {
        pollSCM('H/5 * * * *')  // Poll every 5 minutes
    }
    stages {
        stage('Build') {
            steps {
                sh 'make build'
            }
        }
    }
}
```

### Upstream Projects
```groovy
pipeline {
    agent any
    triggers {
        upstream(upstreamProjects: 'my-upstream-job',
                 threshold: hudson.model.Result.SUCCESS)
    }
    stages {
        stage('Build') {
            steps {
                sh 'make build'
            }
        }
    }
}
```

## Docker Agents

### Using Docker
```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v $HOME/.m2:/root/.m2'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
    }
}
```

### Multiple Docker Images
```groovy
pipeline {
    agent none
    stages {
        stage('Node Build') {
            agent { docker 'node:18' }
            steps {
                sh 'npm install && npm run build'
            }
        }
        stage('Python Test') {
            agent { docker 'python:3.11' }
            steps {
                sh 'pip install -r requirements.txt && pytest'
            }
        }
    }
}
```

## Parallel Execution

```groovy
pipeline {
    agent any
    stages {
        stage('Parallel Tests') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
                stage('E2E Tests') {
                    steps {
                        sh 'npm run test:e2e'
                    }
                }
            }
        }
    }
}
```

## Input & Approval

```groovy
pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                sh 'make deploy-prod'
            }
        }
    }
}
```

## Credentials

### Using Credentials
```groovy
pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'aws-creds',
                                  usernameVariable: 'AWS_ACCESS_KEY_ID',
                                  passwordVariable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh 'aws s3 ls'
                }
            }
        }
    }
}
```

### Using Secret Files
```groovy
pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig',
                                variable: 'KUBECONFIG')]) {
                    sh 'kubectl --kubeconfig=$KUBECONFIG apply -f k8s/'
                }
            }
        }
    }
}
```

## Shared Libraries

```groovy
@Library('my-shared-library') _

pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                buildApp()
            }
        }
        stage('Test') {
            steps {
                testApp()
            }
        }
    }
}
```

## Tools

```groovy
pipeline {
    agent any
    tools {
        maven 'Maven 3.9'
        nodejs 'Node 18'
        go 'Go 1.21'
    }
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean install'
            }
        }
    }
}
```

## Notifiers

### Email Notifications
```groovy
pipeline {
    agent any
    post {
        failure {
            mail to: 'team@example.com',
                 subject: "Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Build failed: ${env.BUILD_URL}"
        }
    }
}
```

### Slack Notifications
```groovy
pipeline {
    agent any
    post {
        success {
            slackSend(color: 'good',
                     message: "Build succeeded: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
        failure {
            slackSend(color: 'danger',
                     message: "Build failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
    }
}
```

## Useful Functions

### Clean Workspace
```groovy
cleanWs()  // Clean workspace
```

### Checkout Code
```groovy
checkout scm
```

### Archive Artifacts
```groovy
archiveArtifacts artifacts: 'dist/**/*',
                fingerprint: true,
                allowEmptyArchive: true
```

### Publish Test Results
```groovy
junit testResults: 'test-results/**/*.xml'
```

### Archive JUnit Reports
```groovy
step([
    $class: 'JUnitResultArchiver',
    testResults: '**/target/surefire-reports/*.xml'
])
```

## Multi-branch Pipeline

```groovy
pipeline {
    agent any
    triggers {
        scm('*/5 * * * *')
    }
    stages {
        stage('Build') {
            when {
                branch 'main'
            }
            steps {
                sh 'make build'
            }
        }
    }
}
```

## Best Practices

- Use declarative pipelines over scripted
- Use environment variables for configuration
- Use credentials plugin for secrets
- Use shared libraries for reusable code
- Use parallel stages for faster builds
- Use input steps for production deployments
- Archive build artifacts
- Publish test results
- Set up notifications for failures
- Use Docker agents for consistent builds
- Clean workspace between builds
- Version control Jenkinsfile with application code

::: tip
Use the Jenkins Pipeline Syntax generator to help create valid Jenkinsfile syntax.
:::
