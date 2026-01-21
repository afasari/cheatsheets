# Backend & DevOps Cheat Sheets

A comprehensive collection of cheat sheets for backend engineering and DevOps tools, built with [VitePress](https://vitepress.dev/) and [Tailwind CSS v4](https://tailwindcss.com/).

## Features

- 🚀 **Fast & Modern**: Built with VitePress and Tailwind v4 for optimal performance
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 🔍 **Search**: Built-in full-text search across all cheat sheets
- 📱 **Responsive**: Mobile-friendly design
- 📦 **Organized**: Categorized by topic (DevOps, Cloud, CI/CD, Databases, etc.)
- ✨ **Clean UI**: Simple, distraction-free interface

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/afasari/cheatsheets.git
cd cheatsheets

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build the site
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
cheatsheets/
├── docs/
│   ├── .vitepress/       # VitePress configuration
│   │   ├── config.ts     # Main configuration
│   │   └── theme/        # Custom theme and styles
│   ├── guides/           # Usage guides
│   ├── devops/           # DevOps tools
│   ├── cloud/            # Cloud platforms
│   ├── ci-cd/            # CI/CD tools
│   ├── databases/        # Database references
│   ├── monitoring/       # Monitoring tools
│   ├── security/         # Security resources
│   └── other/            # General tools
├── package.json
└── README.md
```

## Categories

### DevOps
- [Docker](/devops/docker) - Container management
- [Kubernetes](/devops/kubernetes) - Container orchestration
- [Terraform](/devops/terraform) - Infrastructure as code
- [Helm](/devops/helm) - Kubernetes package manager
- [Ansible](/devops/ansible) - Configuration management

### Cloud Platforms
- [AWS CLI](/cloud/aws) - Amazon Web Services
- [Azure CLI](/cloud/azure) - Microsoft Azure
- [Google Cloud](/cloud/gcp) - Google Cloud Platform

### CI/CD
- [GitHub Actions](/ci-cd/github-actions) - Workflow automation
- [GitLab CI](/ci-cd/gitlab-ci) - GitLab pipelines
- [Jenkins](/ci-cd/jenkins) - Continuous integration
- [ArgoCD](/ci-cd/argocd) - GitOps continuous delivery

### Databases
- [PostgreSQL](/databases/postgresql) - Relational database
- [MySQL](/databases/mysql) - MySQL database
- [Redis](/databases/redis) - In-memory data store
- [MongoDB](/databases/mongodb) - NoSQL database
- [SQLite](/databases/sqlite) - Embedded database

### Monitoring & Logging
- [Prometheus](/monitoring/prometheus) - Metrics collection
- [Grafana](/monitoring/grafana) - Visualization platform
- [ELK Stack](/monitoring/elk) - Elasticsearch, Logstash, Kibana
- [Loki](/monitoring/loki) - Log aggregation

### Security
- [OpenSSL](/security/openssl) - SSL/TLS certificates
- [SSH Keys](/security/ssh) - Secure Shell
- [TLS Certificates](/security/tls) - Transport Layer Security
- [OAuth 2.0](/security/oauth) - Authorization framework

### Other Tools
- [Git](/other/git) - Version control
- [Linux Commands](/other/linux) - Linux reference
- [Network Tools](/other/network) - Networking utilities
- [HTTP Status Codes](/other/http-codes) - HTTP reference

## Contributing

Contributions are welcome! Feel free to:

1. Report issues or suggest new features
2. Submit pull requests with improvements
3. Add new cheat sheets
4. Fix typos or errors

## Inspiration

This project is inspired by [ChristianLempa/cheat-sheets](https://github.com/ChristianLempa/cheat-sheets) and aims to provide a modern, web-based alternative with enhanced features.

## License

MIT License - feel free to use this project for your own learning and reference.

## Technologies

- [VitePress](https://vitepress.dev/) - Static site generator
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [GitHub Pages](https://pages.github.com/) - Hosting

---

Made with ❤️ for backend engineers and DevOps professionals
