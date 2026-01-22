import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Backend & DevOps Cheat Sheets',
  description: 'Personal knowledge-base with code snippets, documentation, and command reference for backend engineering and DevOps tools',
  lang: 'en',
  
  base: '/cheatsheets/',
  appearance: 'dark',
  
  ignoreDeadLinks: true,
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico' }],
    ['meta', { name: 'description', content: 'Quick reference for software engineers - Backend & DevOps cheat sheets and LeetCode data structures and algorithms with implementations in Go, Rust, Python, and JavaScript' }],
    ['meta', { name: 'keywords', content: 'cheat sheets, devops, docker, kubernetes, terraform, helm, ansible, aws, azure, gcp, leetcode, data structures, algorithms, go, rust, python, javascript, backend, infrastructure, ci/cd, github actions, gitlab ci, jenkins, databases, postgresql, mysql, redis, mongodb, monitoring, prometheus, grafana, elk stack, loki, security, openssl, ssh, tls, oauth' }],
    ['meta', { name: 'author', content: 'Afasari' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { property: 'og:title', content: 'Backend & DevOps Cheat Sheets with LeetCode' }],
    ['meta', { property: 'og:description', content: 'Quick reference for backend engineers and DevOps with LeetCode data structures and algorithms in Go, Rust, Python, and JavaScript' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://afasari.github.io/cheatsheets/' }],
    ['meta', { property: 'og:image', content: 'https://afasari.github.io/cheatsheets/logo.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Backend & DevOps Cheat Sheets with LeetCode' }],
    ['meta', { name: 'twitter:description', content: 'Quick reference for backend engineers and DevOps with LeetCode data structures and algorithms' }],
    ['link', { rel: 'canonical', href: 'https://afasari.github.io/cheatsheets/' }]
  ],

  themeConfig: {
    siteTitle: '',
    logo: '/logo.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'LeetCode', link: '/leetcode/' },
      { text: 'Guides', link: '/guides/' },
      { text: 'GitHub', link: 'https://github.com/afasari/cheatsheets' }
    ],

     sidebar: [
      {
         text: 'Getting Started',
         items: [
           { text: 'Overview', link: '/' },
           { text: 'Introduction', link: '/getting-started' },
           { text: 'How to Use', link: '/guides/how-to-use' },
           { text: 'Best Practices', link: '/guides/best-practices' }
          ]
      },
      {
        text: 'LeetCode',
        items: [
          { text: 'Overview', link: '/leetcode/' },
          { text: 'Big O Complexity', link: '/leetcode/big-o' },
          {
            text: 'Data Structures',
            collapsed: true,
            items: [
              { text: 'Array', link: '/leetcode/data-structures/array' },
              { text: 'Linked List', link: '/leetcode/data-structures/linked-list' },
              { text: 'Stack', link: '/leetcode/data-structures/stack' },
              { text: 'HashMap', link: '/leetcode/data-structures/hash-map' },
              { text: 'Binary Tree', link: '/leetcode/data-structures/binary-tree' },
              { text: 'Heap', link: '/leetcode/data-structures/heap' },
              { text: 'Queue', link: '/leetcode/data-structures/queue' },
              { text: 'Trie', link: '/leetcode/data-structures/trie' }
            ]
          },
          {
            text: 'Algorithms',
            collapsed: true,
            items: [
              { text: 'Two Pointers', link: '/leetcode/algorithms/two-pointers' },
              { text: 'Sliding Window', link: '/leetcode/algorithms/sliding-window' },
              { text: 'Binary Search', link: '/leetcode/algorithms/binary-search' },
              { text: 'Dynamic Programming', link: '/leetcode/algorithms/dynamic-programming' },
              { text: 'Graph Algorithms', link: '/leetcode/algorithms/graph' },
              { text: 'Sorting Algorithms', link: '/leetcode/algorithms/sorting' },
              { text: 'Bit Manipulation', link: '/leetcode/algorithms/bit-manipulation' }
            ]
          }
        ]
      },
      {
        text: 'DevOps',
        items: [
          { text: 'Overview', link: '/devops/' },
          {
            text: 'Concepts',
            collapsed: true,
            items: [
              { text: 'IaC Concepts', link: '/devops/iac-concepts' },
              { text: 'Containerization Concepts', link: '/devops/containerization-concepts' },
              { text: 'CI/CD Concepts', link: '/devops/cicd-concepts' },
              { text: 'Monitoring Concepts', link: '/devops/monitoring-concepts' }
            ]
          },
          {
            text: 'Container Tools',
            collapsed: true,
            items: [
              { text: 'Docker', link: '/devops/docker' },
              { text: 'Docker Compose', link: '/devops/docker-compose' },
              { text: 'Podman', link: '/devops/podman' },
              { text: 'BuildKit', link: '/devops/buildkit' },
              { text: 'Registry', link: '/devops/registry' },
              { text: 'Systemd', link: '/devops/systemd' }
            ]
          },
          {
            text: 'Orchestration',
            collapsed: true,
            items: [
              { text: 'Kubernetes (kubectl)', link: '/devops/kubernetes' },
              { text: 'Helm', link: '/devops/helm' }
            ]
          },
          {
            text: 'Infrastructure as Code',
            collapsed: true,
            items: [
              { text: 'Terraform', link: '/devops/terraform' },
              { text: 'Ansible', link: '/devops/ansible' },
              { text: 'Azure DevOps', link: '/devops/azure-devops' }
            ]
          }
        ]
      },
      {
        text: 'Cloud Platforms',
        items: [
          { text: 'Overview', link: '/cloud/' },
          { text: 'Cloud Networking', link: '/cloud/cloud-networking' },
          { text: 'Terraform Cloud', link: '/cloud/terraform-cloud' },
          {
            text: 'AWS',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/cloud/aws/' },
              { text: 'AWS CLI', link: '/cloud/aws/aws-cli' },
              { text: 'S3 (Storage)', link: '/cloud/aws/aws-s3' },
              { text: 'EC2 (Compute)', link: '/cloud/aws/aws-ec2' },
              { text: 'Lambda (Serverless)', link: '/cloud/aws/aws-lambda' },
              { text: 'IAM (Security)', link: '/cloud/aws/aws-iam' },
              { text: 'CloudWatch', link: '/cloud/aws/cloudwatch-alerting' }
            ]
          },
          {
            text: 'Azure',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/cloud/azure/' },
              { text: 'Azure CLI', link: '/cloud/azure' }
            ]
          },
          { text: 'Google Cloud (gcloud)', link: '/cloud/gcp' }
        ]
      },
      {
        text: 'CI/CD',
        items: [
          { text: 'Overview', link: '/ci-cd/' },
          { text: 'GitHub Actions', link: '/ci-cd/github-actions' },
          { text: 'GitLab CI', link: '/ci-cd/gitlab-ci' },
          { text: 'Jenkins', link: '/ci-cd/jenkins' },
          { text: 'ArgoCD', link: '/ci-cd/argocd' }
        ]
      },
      {
        text: 'Databases',
        items: [
          { text: 'Overview', link: '/databases/' },
          {
            text: 'Relational',
            collapsed: true,
            items: [
              { text: 'PostgreSQL', link: '/databases/postgresql' },
              { text: 'PostgreSQL Internals', link: '/databases/postgresql-internals' },
              { text: 'MySQL', link: '/databases/mysql' },
              { text: 'SQLite', link: '/databases/sqlite' },
              { text: 'SQLite Optimization', link: '/databases/sqlite-optimization' }
            ]
          },
          {
            text: 'NoSQL',
            collapsed: true,
            items: [
              { text: 'MongoDB', link: '/databases/mongodb' },
              { text: 'MongoDB Aggregation', link: '/databases/mongodb-aggregation' },
              { text: 'Redis', link: '/databases/redis' },
              { text: 'Redis Patterns', link: '/databases/redis-patterns' }
            ]
          }
        ]
      },
      {
        text: 'Monitoring & Logging',
        items: [
          { text: 'Overview', link: '/monitoring/' },
          { text: 'Prometheus', link: '/monitoring/prometheus' },
          { text: 'Grafana', link: '/monitoring/grafana' },
          { text: 'ELK Stack', link: '/monitoring/elk' },
          { text: 'Loki', link: '/monitoring/loki' }
        ]
      },
      {
        text: 'Security',
        items: [
          { text: 'Overview', link: '/security/' },
          { text: 'OpenSSL', link: '/security/openssl' },
          { text: 'SSH Keys', link: '/security/ssh' },
          { text: 'TLS Certificates', link: '/security/tls' },
          { text: 'OAuth 2.0', link: '/security/oauth' }
        ]
      },
      {
        text: 'Other Tools',
        items: [
          { text: 'Overview', link: '/other/' },
          { text: 'Git', link: '/other/git' },
          { text: 'Linux Commands', link: '/other/linux' },
          { text: 'Network Tools', link: '/other/network' },
          { text: 'HTTP Status Codes', link: '/other/http-codes' }
        ]
      }
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search'
              },
              modal: {
                noResultsText: 'No results',
                resetButtonTitle: 'Clear search query',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close'
                }
              }
            }
          }
        }
      }
    },

    editLink: {
      pattern: 'https://github.com/afasari/cheatsheets/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Last Updated',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/afasari/cheatsheets' }
    ],

    footer: {
      message: 'Released under MIT License.',
      copyright: 'Copyright © 2026-present'
    }
  }
})