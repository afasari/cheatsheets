# Backend & DevOps Cheat Sheets

A modern, fast, and comprehensive collection of cheat sheets for backend engineering and DevOps tools, hosted on GitHub Pages.

![GitHub stars](https://img.shields.io/github/stars/afasari/cheatsheets?style=social)
![GitHub forks](https://img.shields.io/github/forks/afasari/cheatsheets?style=social)

## 🚀 Live Demo

Visit the live site at: **https://afasari.github.io/cheatsheets/**

## ✨ Features

- 🌓 **Dark/Light Mode**: Toggle between themes
- 🔍 **Full-text Search**: Search across all cheat sheets instantly
- 📱 **Responsive Design**: Works perfectly on all devices
- ⚡ **Fast Loading**: Built with VitePress for optimal performance
- 📚 **Well Organized**: Categorized by technology and use case
- 🎨 **Clean UI**: Modern, distraction-free interface with Tailwind v4

## 📖 Categories

### DevOps
- Docker, Kubernetes, Terraform, Helm, Ansible

### Cloud Platforms
- AWS, Azure, Google Cloud

### CI/CD
- GitHub Actions, GitLab CI, Jenkins, ArgoCD

### Databases
- PostgreSQL, MySQL, Redis, MongoDB, SQLite

### Monitoring & Logging
- Prometheus, Grafana, ELK Stack, Loki

### Security
- OpenSSL, SSH, TLS, OAuth

### Other Tools
- Git, Linux, Network Tools, HTTP Codes

## 🛠️ Tech Stack

- **Framework**: VitePress
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Hosting**: GitHub Pages

## 🚦 Getting Started

### Clone the Repository

```bash
git clone https://github.com/afasari/cheatsheets.git
cd cheatsheets
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the site.

### Build for Production

```bash
npm run build
```

The built files will be in the `docs/.vitepress/dist` directory.

## 📁 Project Structure

```
cheatsheets/
├── docs/
│   ├── .vitepress/       # VitePress configuration
│   │   ├── config.ts
│   │   └── theme/
│   ├── guides/           # Usage guides
│   ├── devops/           # DevOps cheat sheets
│   ├── cloud/            # Cloud CLI commands
│   ├── ci-cd/            # CI/CD workflows
│   ├── databases/        # Database references
│   ├── monitoring/       # Monitoring tools
│   ├── security/         # Security resources
│   ├── other/            # General tools
│   ├── index.md          # Home page
│   └── README.md         # Documentation
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Issues**: Found a bug or have a suggestion? Open an issue.
2. **Add Content**: Add new cheat sheets or improve existing ones.
3. **Fix Typos**: Correct any typos or errors.
4. **Improve Documentation**: Enhance the guides and documentation.

### Adding a New Cheat Sheet

1. Navigate to the appropriate category folder (e.g., `docs/devops/`)
2. Create a new markdown file (e.g., `docker-compose.md`)
3. Follow the existing format with tables for commands
4. Update the sidebar in `docs/.vitepress/config.ts`

## 📝 Format

Cheat sheets use markdown tables for commands:

```markdown
# Tool Name

## Category

| COMMAND | DESCRIPTION |
| --- | --- |
| `command` | Description of what it does |
| `another command` | Another useful command |
```

## 🌟 Inspiration

This project is inspired by the excellent [ChristianLempa/cheat-sheets](https://github.com/ChristianLempa/cheat-sheets) repository, with added features like:

- Modern web interface
- Dark/light mode toggle
- Full-text search
- Breadcrumb navigation
- Mobile responsiveness

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [VitePress](https://vitepress.dev/) for the excellent static site generator
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [ChristianLempa](https://github.com/ChristianLempa) for the original cheat sheets inspiration

## 📧 Contact

Feel free to reach out with questions, feedback, or just to say hi!

---

Made with ❤️ for backend engineers and DevOps professionals
