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
    ['link', { rel: 'alternate icon', href: '/favicon.ico' }]
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
              { text: 'HashMap', link: '/leetcode/data-structures/hash-map' }
            ]
          },
          {
            text: 'Algorithms',
            collapsed: true,
            items: [
              { text: 'Two Pointers', link: '/leetcode/algorithms/two-pointers' },
              { text: 'Sliding Window', link: '/leetcode/algorithms/sliding-window' },
              { text: 'Binary Search', link: '/leetcode/algorithms/binary-search' }
            ]
          }
        ]
      },
      {
        text: 'DevOps',
        items: [
          { text: 'Docker', link: '/devops/docker' },
          { text: 'Kubernetes (kubectl)', link: '/devops/kubernetes' },
          { text: 'Terraform', link: '/devops/terraform' },
          { text: 'Helm', link: '/devops/helm' },
          { text: 'Ansible', link: '/devops/ansible' }
        ]
      },
      {
        text: 'Cloud Platforms',
        items: [
          { text: 'AWS CLI', link: '/cloud/aws' },
          { text: 'Azure CLI', link: '/cloud/azure' },
          { text: 'Google Cloud (gcloud)', link: '/cloud/gcp' },
          { text: 'Terraform Cloud', link: '/cloud/terraform-cloud' }
        ]
      },
      {
        text: 'CI/CD',
        items: [
          { text: 'GitHub Actions', link: '/ci-cd/github-actions' },
          { text: 'GitLab CI', link: '/ci-cd/gitlab-ci' },
          { text: 'Jenkins', link: '/ci-cd/jenkins' },
          { text: 'ArgoCD', link: '/ci-cd/argocd' }
        ]
      },
      {
        text: 'Databases',
        items: [
          { text: 'PostgreSQL', link: '/databases/postgresql' },
          { text: 'MySQL', link: '/databases/mysql' },
          { text: 'Redis', link: '/databases/redis' },
          { text: 'MongoDB', link: '/databases/mongodb' },
          { text: 'SQLite', link: '/databases/sqlite' }
        ]
      },
      {
        text: 'Monitoring & Logging',
        items: [
          { text: 'Prometheus', link: '/monitoring/prometheus' },
          { text: 'Grafana', link: '/monitoring/grafana' },
          { text: 'ELK Stack', link: '/monitoring/elk' },
          { text: 'Loki', link: '/monitoring/loki' }
        ]
      },
      {
        text: 'Security',
        items: [
          { text: 'OpenSSL', link: '/security/openssl' },
          { text: 'SSH Keys', link: '/security/ssh' },
          { text: 'TLS Certificates', link: '/security/tls' },
          { text: 'OAuth 2.0', link: '/security/oauth' }
        ]
      },
      {
        text: 'Other Tools',
        items: [
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