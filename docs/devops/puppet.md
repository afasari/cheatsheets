# Puppet

Configuration management tool that uses a declarative language to define infrastructure as code. Manages system configurations through client-server or masterless architectures.

## Puppet Architecture

| Component | Description |
|-----------|-------------|
| **Puppet Master** | Central server managing configuration |
| **Puppet Agent** | Runs on nodes, fetches and applies configurations |
| **PuppetDB** | Database for storing puppet data |
| **Puppet Server** | Next-generation puppet master |
| **Puppet Enterprise** | Commercial puppet with additional features |

## Puppet Agent Commands

### Agent Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `puppet agent -t` | Test run (one-time) |
| `puppet agent -t --noop` | No-op mode (dry-run) |
| `puppet agent -t --debug` | Run with debug output |
| `puppet agent -t --verbose` | Verbose output |
| `puppet agent -t --environment production` | Run in specific environment |
| `puppet agent -t --certname myhost.example.com` | Use custom certname |
| `puppet agent --waitforcert 60` | Wait for certificate (seconds) |
| `puppet agent --disable 'Reason'` | Disable puppet agent |
| `puppet agent --enable` | Enable puppet agent |

### Configuration

| COMMAND | DESCRIPTION |
| --- | --- |
| `puppet config print server` | Print puppet master server |
| `puppet config print --section agent` | Print agent configuration |
| `puppet config set server puppet.example.com --section agent` | Set puppet master server |
| `puppet config --section master` | Print master configuration |

### Resource Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `puppet resource user root` | Show user resource state |
| `puppet resource package nginx` | Show package resource state |
| `puppet resource service nginx` | Show service resource state |
| `puppet resource file /etc/hosts` | Show file resource state |
| `puppet resource user john ensure=present` | Apply user resource |
| `puppet resource package nginx ensure=installed` | Install package |
| `puppet resource service nginx ensure=running` | Start service |

## Puppet Server Commands

### Server Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `puppetserver ca list` | List all certificates |
| `puppetserver ca sign hostname.example.com` | Sign certificate |
| `puppetserver ca sign --all` | Sign all pending certificates |
| `puppetserver ca revoke hostname.example.com` | Revoke certificate |
| `puppetserver ca clean hostname.example.com` | Remove certificate |
| `puppetserver ca generate hostname.example.com` | Generate certificate |

### Compilation and Catalog

| COMMAND | DESCRIPTION |
| --- | --- |
| `puppet master --compile hostname.example.com` | Compile catalog for node |
| `puppet master --compile hostname.example.com --debug` | Compile with debug output |
| `puppet master --compile hostname.example.com > catalog.json` | Output catalog to file |

### PuppetDB Queries

| COMMAND | DESCRIPTION |
| --- | --- |
| `puppet query "nodes { }"` | List all nodes |
| `puppet query "nodes { certname = 'hostname.example.com' }"` | Query specific node |
| `puppet query "resources { type = 'User' and title = 'john' }"` | Query resources |
| `puppet query "facts { name = 'operatingsystem' }"` | Query facts |
| `puppet fact find hostname.example.com` | Get facts for node |

## Puppet Resources

Puppet uses declarative resources to define desired state.

### Common Resource Types

| Type | Description | Example |
|------|-------------|---------|
| `package` | Install/remove packages | `package { 'nginx': }` |
| `service` | Manage services | `service { 'nginx': }` |
| `file` | Manage files | `file { '/etc/hosts': }` |
| `directory` | Manage directories | `directory { '/var/www': }` |
| `exec` | Execute commands | `exec { 'command': }` |
| `user` | Manage users | `user { 'deploy': }` |
| `group` | Manage groups | `group { 'deploy': }` |
| `cron` | Manage cron jobs | `cron { 'backup': }` |
| `mount` | Manage mounts | `mount { '/mnt/data': }` |
| `host` | Manage hosts entries | `host { 'myhost': }` |

### Package Resource

```puppet
# Install package
package { 'nginx':
  ensure => installed,
}

# Ensure specific version
package { 'nginx':
  ensure => '1.18.0',
}

# Remove package
package { 'nginx':
  ensure => absent,
}

# Install from specific provider
package { 'nginx':
  ensure => installed,
  provider => 'apt',
}
```

### Service Resource

```puppet
# Start and enable service
service { 'nginx':
  ensure     => running,
  enable     => true,
  hasrestart => true,
  hasstatus  => true,
}

# Stop service
service { 'nginx':
  ensure => stopped,
  enable => false,
}

# Restart service if config changes
service { 'nginx':
  ensure => running,
  enable => true,
  subscribe => File['/etc/nginx/nginx.conf'],
}
```

### File Resource

```puppet
# Create file with content
file { '/etc/config.conf':
  ensure  => file,
  content => "setting1=value1\nsetting2=value2\n",
  owner   => 'root',
  group   => 'root',
  mode    => '0644',
}

# Create directory
file { '/var/www/html':
  ensure => directory,
  owner  => 'www-data',
  group  => 'www-data',
  mode   => '0755',
}

# Delete file
file { '/tmp/old_file.txt':
  ensure => absent,
}

# File from template (see Templates section)
file { '/etc/nginx/nginx.conf':
  ensure  => file,
  content => template('nginx/nginx.conf.erb'),
  owner   => 'root',
  group   => 'root',
  mode    => '0644',
}
```

### Directory Resource

```puppet
# Create directory
directory { '/var/www/myapp':
  ensure  => directory,
  owner   => 'www-data',
  group   => 'www-data',
  mode    => '0755',
  require => User['www-data'],
}

# Recursive directory
directory { '/var/log/app':
  ensure  => directory,
  recurse => true,
  mode    => '0755',
}
```

### Exec Resource

```puppet
# Execute command
exec { 'install_package':
  command => 'apt-get install -y nginx',
  path    => ['/usr/bin', '/bin'],
  unless  => '/usr/bin/dpkg -l nginx',
}

# Execute with refreshonly
exec { 'reload_nginx':
  command     => '/usr/sbin/nginx -s reload',
  refreshonly => true,
}

# Execute creates file
exec { 'download_app':
  command => 'wget -O /tmp/app.tar.gz http://example.com/app.tar.gz',
  creates => '/tmp/app.tar.gz',
}
```

### User Resource

```puppet
# Create user
user { 'deploy':
  ensure     => present,
  uid        => '1000',
  gid        => 'deploy',
  home       => '/home/deploy',
  shell      => '/bin/bash',
  managehome => true,
}

# Delete user
user { 'deploy':
  ensure => absent,
}
```

### Group Resource

```puppet
# Create group
group { 'deploy':
  ensure => present,
  gid    => '1000',
  system => false,
}
```

### Cron Resource

```puppet
# Create cron job
cron { 'backup':
  command => '/usr/local/bin/backup.sh',
  user    => 'root',
  hour    => 2,
  minute  => 0,
  weekday => '0',
}

# Remove cron job
cron { 'backup':
  ensure => absent,
}
```

## Puppet Templates (ERB)

### Template Example

```erb
# nginx.conf.erb
user <%= @nginx_user %>;
worker_processes <%= @worker_processes %>;

events {
    worker_connections <%= @worker_connections %>;
}

http {
    server {
        listen <%= @port %>;
        server_name <%= @server_name %>;

        location / {
            root <%= @document_root %>;
        }
    }
}
```

### Template Usage

```puppet
file { '/etc/nginx/nginx.conf':
  ensure  => file,
  content => template('nginx/nginx.conf.erb'),
  owner   => 'root',
  group   => 'root',
  mode    => '0644',
}
```

### Template Variables

```puppet
# Define variables in class
class nginx (
  $nginx_user         = 'www-data',
  $worker_processes  = 4,
  $worker_connections = 1024,
  $port              = 80,
  $server_name       = $::fqdn,
  $document_root     = '/var/www/html',
) {
  # Template has access to all parameters
  file { '/etc/nginx/nginx.conf':
    ensure  => file,
    content => template('nginx/nginx.conf.erb'),
  }
}
```

### ERB Syntax

| Syntax | Description |
|---------|-------------|
| `<%= variable %>` | Output variable value |
| `<% code %>` | Execute Ruby code (no output) |
| `<% if condition %>` | Conditional block |
| `<% else %>` | Else block |
| `<% elsif condition %>` | Elsif block |
| `<% end %>` | End block |
| `<% array.each do |item| %>` | Loop through array |
| `<% end %>` | End loop |

## Puppet Classes and Modules

### Class Definition

```puppet
# manifests/init.pp
class nginx (
  $package_name  = 'nginx',
  $service_name  = 'nginx',
  $config_file  = '/etc/nginx/nginx.conf',
  $port         = 80,
  $worker_processes = 4,
) {
  # Install package
  package { $package_name:
    ensure => installed,
  }

  # Create configuration
  file { $config_file:
    ensure  => file,
    content => template("nginx/nginx.conf.erb"),
    require => Package[$package_name],
  }

  # Start service
  service { $service_name:
    ensure     => running,
    enable     => true,
    subscribe  => File[$config_file],
  }
}
```

### Using Class

```puppet
# Include class
include nginx

# Include with parameters
class { 'nginx':
  port              => 8080,
  worker_processes  => 8,
}

# Hiera-based parameters
include nginx
```

### Module Structure

```
nginx/
├── manifests/
│   ├── init.pp              # Main class
│   ├── config.pp           # Additional classes
│   └── params.pp           # Default parameters
├── templates/
│   └── nginx.conf.erb      # ERB templates
├── files/
│   └── default.conf        # Static files
├── lib/
│   └── facter/            # Custom facts
├── spec/
│   └── spec_helper.rb     # Tests
└── metadata.json           # Module metadata
```

### Create Module

```bash
# Using puppet module generate
puppet module generate my_module

# Using puppet module skeleton
puppet module skeleton my_module
```

### metadata.json

```json
{
  "name": "example-nginx",
  "version": "1.0.0",
  "author": "Your Name",
  "summary": "Nginx configuration module",
  "license": "Apache-2.0",
  "source": "https://github.com/example/puppet-nginx",
  "project_page": "https://github.com/example/puppet-nginx",
  "issues_url": "https://github.com/example/puppet-nginx/issues",
  "dependencies": [
    {
      "name": "puppetlabs/stdlib",
      "version_requirement": ">= 4.0.0"
    }
  ],
  "operatingsystem_support": [
    {
      "operatingsystem": "Ubuntu",
      "operatingsystemrelease": ["18.04", "20.04"]
    },
    {
      "operatingsystem": "CentOS",
      "operatingsystemrelease": ["7", "8"]
    }
  ]
}
```

## Puppet Hiera

### Hiera Configuration

```yaml
# hiera.yaml
---
version: 5
hierarchy:
  - name: "Per-node data"
    path: "nodes/%{trusted.certname}.yaml"
  - name: "Per-environment data"
    path: "environments/%{environment}.yaml"
  - name: "Common data"
    path: "common.yaml"
```

### Hiera Data Files

```yaml
# data/common.yaml
nginx::port: 80
nginx::worker_processes: 4
nginx::document_root: '/var/www/html'

# data/production.yaml
nginx::port: 8080
nginx::worker_processes: 8

# data/nodes/web01.example.com.yaml
nginx::server_name: 'web01.example.com'
```

### Hiera Lookup

```puppet
# Automatic parameter lookup (Puppet 4+)
class nginx (
  $port = hiera('nginx::port', 80),
  $worker_processes = hiera('nginx::worker_processes', 4),
) {
  # Use parameters
}

# Explicit lookup
$value = hiera('nginx::port', 80)
$value = lookup('nginx::port', {'default_value' => 80})
```

## Puppet Ordering and Dependencies

### Relationships

| Metaparameter | Description | Example |
|---------------|-------------|---------|
| `require` | Resource must exist | `require => File['/etc/config']` |
| `before` | Resource must run after | `before => Service['nginx']` |
| `notify` | Resource notifies another | `notify => Service['nginx']` |
| `subscribe` | Resource subscribes to | `subscribe => File['/etc/config']` |

### Relationship Examples

```puppet
# Require - file must exist before service
file { '/etc/nginx/nginx.conf':
  ensure => file,
  content => template('nginx/nginx.conf.erb'),
}

service { 'nginx':
  ensure  => running,
  enable  => true,
  require => File['/etc/nginx/nginx.conf'],
}

# Before - package before file
package { 'nginx':
  ensure => installed,
  before => File['/etc/nginx/nginx.conf'],
}

# Notify - file notifies service
file { '/etc/nginx/nginx.conf':
  ensure  => file,
  content => template('nginx/nginx.conf.erb'),
  notify => Service['nginx'],
}

# Subscribe - service subscribes to file
service { 'nginx':
  ensure     => running,
  enable     => true,
  subscribe  => File['/etc/nginx/nginx.conf'],
}
```

### Chaining

```puppet
# Chaining notation
Package['nginx'] -> File['/etc/nginx/nginx.conf'] ~> Service['nginx']

# Complex chaining
Package['nginx'] -> File['/etc/nginx/nginx.conf'] ~>
  Service['nginx'] -> File['/var/www/html/index.html']
```

## Puppet Conditionals and Logic

### If/Else

```puppet
if $facts['os']['family'] == 'Debian' {
  $package_name = 'nginx'
} elsif $facts['os']['family'] == 'RedHat' {
  $package_name = 'nginx-plus'
} else {
  fail('Unsupported OS')
}

package { $package_name:
  ensure => installed,
}
```

### Case Statement

```puppet
case $facts['os']['family'] {
  'Debian': {
    $package_name = 'nginx'
    $service_name = 'nginx'
  }
  'RedHat': {
    $package_name = 'nginx-plus'
    $service_name = 'nginx'
  }
  default: {
    fail('Unsupported OS')
  }
}

package { $package_name:
  ensure => installed,
}

service { $service_name:
  ensure => running,
}
```

### Selector

```puppet
$nginx_port = $facts['networking']['hostname'] ? {
  /^prod/ => 8080,
  /^dev/  => 8000,
  default => 80,
}

file { '/etc/nginx/nginx.conf':
  content => template('nginx/nginx.conf.erb'),
}
```

## Puppet Best Practices

1. **Use Modules for Reusability** - Package related resources
2. **Use Templates for Configuration** - Don't hardcode values
3. **Use Hiera for Data** - Separate code from data
4. **Use Version Control** - Git for all modules
5. **Test Locally** - Use puppet apply for testing
6. **Use Class Parameters** - Keep classes flexible
7. **Document Modules** - Include README.md files
8. **Use Facts** - Leverage system information
9. **Use Ordering** - Explicitly define dependencies
10. **Monitor Puppet Runs** - Check logs and reports

## Puppet vs Other Config Management

| Feature | Puppet | Chef | Ansible |
|----------|---------|-------|---------|
| **Language** | Puppet DSL | Ruby | YAML |
| **Agent Required** | Yes | Yes | No |
| **Learning Curve** | Steep | Steep | Easy |
| **Push Mode** | MCollective | Knife bootstrap | Yes |
| **Pull Mode** | Yes | Yes | No |
| **Maturity** | Mature | Mature | Mature |
| **Enterprise Support** | Puppet Enterprise | Chef Automate | Ansible Tower |

## Useful Tips

### Local Testing with puppet apply

```bash
# Apply manifest locally
puppet apply site.pp

# Apply with debug output
puppet apply site.pp --debug

# Apply in no-op mode
puppet apply site.pp --noop

# Apply with modules path
puppet apply site.pp --modulepath=/etc/puppetlabs/code/modules
```

### Debugging

```bash
# Enable debug logging
puppet agent -t --debug

# No-op mode to see changes
puppet agent -t --noop

# Check configuration
puppet config print --section agent

# View compiled catalog
puppet agent -t --compile > catalog.json

# Validate manifest syntax
puppet parser validate site.pp

# Linting with puppet-lint
puppet-lint manifests/
```

### Common Issues

| Issue | Solution |
|-------|----------|
| `Could not find class` | Check module path and class name |
| `Could not parse` | Validate syntax with `puppet parser validate` |
| `Catalog compilation failed` | Check resource dependencies and parameters |
| `Duplicate declaration` | Ensure resource names are unique |
| `Failed to apply catalog` | Check resource types and parameters |
| `Certificate not signed` | Sign certificate on puppet master |

### Puppet Installation

```bash
# Install puppet agent on Ubuntu/Debian
wget https://apt.puppetlabs.com/puppet7-release-focal.deb
sudo dpkg -i puppet7-release-focal.deb
sudo apt-get update
sudo apt-get install puppet-agent

# Install puppet agent on CentOS/RHEL
sudo rpm -Uvh https://yum.puppetlabs.com/puppet7-release-el-8.noarch.rpm
sudo yum install puppet-agent

# Configure puppet master
sudo /opt/puppetlabs/bin/puppet config set server puppet.example.com --section agent

# Enable and start puppet agent
sudo /opt/puppetlabs/bin/puppet resource service puppet ensure=running enable=true

# Run puppet agent
sudo /opt/puppetlabs/bin/puppet agent -t
```

### Module Management

```bash
# Install module from Puppet Forge
puppet module install puppetlabs-nginx

# List installed modules
puppet module list

# Uninstall module
puppet module uninstall puppetlabs-nginx

# Update module
puppet module upgrade puppetlabs-nginx

# Search for modules
puppet module search nginx
```

## Puppet Server Setup

```bash
# Install puppet server
sudo apt-get install puppetserver

# Configure memory (optional)
sudo sed -i 's/-Xms2g/-Xms4g/' /etc/default/puppetserver
sudo sed -i 's/-Xmx2g/-Xmx4g/' /etc/default/puppetserver

# Start puppet server
sudo systemctl start puppetserver
sudo systemctl enable puppetserver

# Sign agent certificate
sudo puppetserver ca list
sudo puppetserver ca sign hostname.example.com
```
