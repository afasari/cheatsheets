# Chef

Configuration management tool that uses Ruby to define infrastructure as code. Automates infrastructure provisioning and configuration.

## Chef Architecture

| Component | Description |
|-----------|-------------|
| **Chef Workstation** | Where you author cookbooks and recipes |
| **Chef Server** | Central hub that stores cookbooks and node data |
| **Chef Client** | Runs on nodes, applies configurations from server |
| **Chef Supermarket** | Community cookbook repository |

## Chef Client Commands

### Client Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `chef-client` | Run chef client and apply cookbooks |
| `chef-client -j attributes.json` | Run with custom attributes |
| `chef-client -W` | Why-run mode (dry-run) |
| `chef-client -l debug` | Run with debug logging |
| `chef-client -F json` | Output in JSON format |
| `chef-client -z` | Local mode (no server) |

### Configuration

| COMMAND | DESCRIPTION |
| --- | --- |
| `chef-client -c client.rb` | Use specified config file |
| `chef-client -k /path/to/client.pem` | Specify client key |
| `chef-client -s https://chef.example.com/organizations/myorg` | Specify chef server URL |
| `chef-client -N nodename` | Specify node name |

## Knife Commands

Knife is Chef's command-line tool for managing the Chef Server.

### Client Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `knife client list` | List all registered clients |
| `knife client show CLIENT_NAME` | Show client details |
| `knife client create CLIENT_NAME` | Create new client |
| `knife client delete CLIENT_NAME` | Delete a client |
| `knife client reregister CLIENT_NAME` | Regenerate client key |
| `knife client bulk delete REGEX` | Delete clients matching regex |

### Node Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `knife node list` | List all nodes |
| `knife node show NODE_NAME` | Show node details |
| `knife node edit NODE_NAME` | Edit node attributes |
| `knife node delete NODE_NAME` | Delete a node |
| `knife node from file FILENAME` | Create node from file |
| `knife node run_list add NODE_NAME 'recipe[cookbook::recipe]'` | Add recipe to node |
| `knife node run_list remove NODE_NAME 'recipe[cookbook::recipe]'` | Remove recipe from node |
| `knife node run_list set NODE_NAME 'recipe[cookbook::recipe]'` | Set node run list |

### Role Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `knife role list` | List all roles |
| `knife role show ROLE_NAME` | Show role details |
| `knife role create ROLE_NAME` | Create new role |
| `knife role edit ROLE_NAME` | Edit role |
| `knife role delete ROLE_NAME` | Delete a role |
| `knife role from file FILENAME` | Create role from file |
| `knife role run_list add ROLE_NAME 'recipe[cookbook::recipe]'` | Add recipe to role |

### Cookbook Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `knife cookbook list` | List all cookbooks on server |
| `knife cookbook show COOKBOOK_NAME VERSION` | Show cookbook details |
| `knife cookbook upload COOKBOOK_NAME` | Upload cookbook to server |
| `knife cookbook upload --all` | Upload all cookbooks |
| `knife cookbook delete COOKBOOK_NAME VERSION` | Delete cookbook from server |
| `knife cookbook download COOKBOOK_NAME` | Download cookbook from server |

### Knife from Supermarket

| COMMAND | DESCRIPTION |
| --- | --- |
| `knife cookbook site search KEYWORD` | Search cookbooks in supermarket |
| `knife cookbook site show COOKBOOK_NAME` | Show cookbook details |
| `knife cookbook site install COOKBOOK_NAME` | Install cookbook from supermarket |
| `knife cookbook site download COOKBOOK_NAME` | Download cookbook |
| `knife cookbook site share COOKBOOK_NAME CATEGORY` | Share cookbook to supermarket |

### Bootstrap (Bootstrapping Nodes)

| COMMAND | DESCRIPTION |
| --- | --- |
| `knife bootstrap HOSTNAME` | Bootstrap a new node |
| `knife bootstrap HOSTNAME -x USERNAME -P PASSWORD` | Bootstrap with username/password |
| `knife bootstrap HOSTNAME -i IDENTITY_FILE` | Bootstrap with SSH key |
| `knife bootstrap HOSTNAME --sudo` | Bootstrap with sudo |
| `knife bootstrap HOSTNAME -r 'recipe[cookbook::recipe]'` | Bootstrap with run list |
| `knife bootstrap HOSTNAME -N NODE_NAME` | Bootstrap with custom node name |
| `knife bootstrap HOSTNAME -E ENVIRONMENT` | Bootstrap in environment |

### Search

| COMMAND | DESCRIPTION |
| --- | --- |
| `knife search node 'role:web'` | Search nodes by role |
| `knife search node 'platform:centos'` | Search nodes by platform |
| `knife search node 'chef_environment:production'` | Search nodes by environment |
| `knife search node 'recipes:apache2'` | Search nodes by recipe |
| `knife search node 'ipaddress:10.0.0.*'` | Search nodes by IP |
| `knife search node -a hostname` | Return specific attribute |

## Chef Resources

Chef resources are the building blocks of recipes.

### Common Resources

| Resource | Description | Example |
|-----------|-------------|---------|
| `package` | Install/remove packages | `package 'nginx'` |
| `service` | Manage services | `service 'nginx'` |
| `file` | Manage files | `file '/etc/config'` |
| `directory` | Manage directories | `directory '/var/www'` |
| `template` | Create file from template | `template '/etc/nginx.conf'` |
| `execute` | Run commands | `execute 'command'` |
| `user` | Manage users | `user 'deploy'` |
| `group` | Manage groups | `group 'deploy'` |
| `cron` | Manage cron jobs | `cron 'backup'` |
| `git` | Manage git repositories | `git '/opt/app'` |

### Package Resource

```ruby
package 'nginx' do
  action :install
end

# With version
package 'nginx' do
  version '1.18.0'
  action :install
end

# Remove package
package 'nginx' do
  action :remove
end
```

### Service Resource

```ruby
service 'nginx' do
  supports status: true, restart: true, reload: true
  action [:enable, :start]
end

# With conditions
service 'nginx' do
  action [:enable, :start]
  only_if { File.exist?('/etc/nginx/nginx.conf') }
end
```

### File Resource

```ruby
file '/etc/config.conf' do
  content 'my config content'
  owner 'root'
  group 'root'
  mode '0644'
  action :create
end

# Delete file
file '/tmp/old_file.txt' do
  action :delete
end
```

### Directory Resource

```ruby
directory '/var/www/myapp' do
  owner 'www-data'
  group 'www-data'
  mode '0755'
  recursive true
  action :create
end
```

### Template Resource

```ruby
template '/etc/nginx/nginx.conf' do
  source 'nginx.conf.erb'
  owner 'root'
  group 'root'
  mode '0644'
  variables({
    port: 80,
    server_name: node['fqdn']
  })
  action :create
end
```

### Execute Resource

```ruby
execute 'run_install_script' do
  command '/tmp/install.sh'
  cwd '/tmp'
  user 'root'
  action :run
  not_if { File.exist?('/opt/app/installed') }
end
```

### User Resource

```ruby
user 'deploy' do
  comment 'Deployment user'
  uid '1000'
  gid 'deploy'
  home '/home/deploy'
  shell '/bin/bash'
  action :create
end
```

### Group Resource

```ruby
group 'deploy' do
  gid '1000'
  members ['deploy']
  action :create
end
```

## Chef Templates (ERB)

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

```ruby
template '/etc/nginx/nginx.conf' do
  source 'nginx.conf.erb'
  variables(
    nginx_user: 'www-data',
    worker_processes: 4,
    worker_connections: 1024,
    port: 80,
    server_name: node['fqdn'],
    document_root: '/var/www/html'
  )
end
```

### ERB Syntax

| Syntax | Description |
|---------|-------------|
| `<%= variable %>` | Output variable value |
| `<% code %>` | Execute Ruby code (no output) |
| `<% if condition %>` | Conditional block |
| `<% else %>` | Else block |
| `<% end %>` | End block |
| `<% array.each do |item| %>` | Loop through array |
| `<% end %>` | End loop |

## Chef Attributes

### Attribute Types

| Type | Description | Example |
|------|-------------|---------|
| `default` | Lowest precedence | `default['nginx']['port'] = 80` |
| `normal` | Same as default | `normal['nginx']['port'] = 80` |
| `override` | Higher precedence | `override['nginx']['port'] = 8080` |
| `automatic` | From Ohai (read-only) | `node['ipaddress']` |

### Attributes File (attributes/default.rb)

```ruby
# attributes/default.rb
default['nginx']['port'] = 80
default['nginx']['worker_processes'] = 4
default['nginx']['worker_connections'] = 1024
default['nginx']['document_root'] = '/var/www/html'

# Override in specific environment
override['nginx']['port'] = 8080 if node.chef_environment == 'production'
```

### Using Attributes

```ruby
# In recipe
port = node['nginx']['port']
worker_processes = node['nginx']['worker_processes']

# With default value
port = node['nginx']['port'] || 80

# In template
# nginx.conf.erb
listen <%= node['nginx']['port'] %>;
```

## Chef Recipes

### Recipe Structure

```ruby
# recipes/default.rb

# Install package
package 'nginx' do
  action :install
end

# Create directory
directory '/var/www/html' do
  owner 'www-data'
  group 'www-data'
  mode '0755'
  action :create
end

# Create configuration from template
template '/etc/nginx/sites-available/default' do
  source 'default.erb'
  variables(
    port: node['nginx']['port'],
    server_name: node['fqdn']
  )
  notifies :reload, 'service[nginx]', :immediately
end

# Enable and start service
service 'nginx' do
  action [:enable, :start]
end
```

### Notification

```ruby
# Notifies another resource
template '/etc/nginx/nginx.conf' do
  source 'nginx.conf.erb'
  notifies :reload, 'service[nginx]', :immediately
end

# Subscribes to another resource
service 'nginx' do
  action [:enable, :start]
  subscribes :reload, 'template[/etc/nginx/nginx.conf]', :immediately
end
```

### Guards

```ruby
# Only run if file exists
execute 'install_package' do
  command 'apt-get install -y nginx'
  not_if { File.exist?('/usr/sbin/nginx') }
end

# Only run if file doesn't exist
file '/tmp/marker' do
  content 'created'
  only_if { Dir.exist?('/var/www/html') }
end
```

## Chef Cookbooks

### Cookbook Structure

```
cookbook_name/
├── attributes/
│   └── default.rb          # Default attributes
├── definitions/
│   └── my_definition.rb    # Resource definitions
├── files/
│   └── default/
│       └── config.conf     # Static files
├── libraries/
│   └── helpers.rb         # Custom Ruby libraries
├── metadata.rb            # Cookbook metadata
├── recipes/
│   └── default.rb         # Default recipe
├── templates/
│   └── default/
│       └── config.erb     # ERB templates
└── README.md              # Cookbook documentation
```

### Create Cookbook

```bash
# Using chef generate
chef generate cookbook my_cookbook

# Generate specific item
chef generate recipe my_cookbook my_recipe
chef generate template my_cookbook my_template
chef generate attribute my_cookbook my_attribute
```

### Metadata.rb

```ruby
name 'my_cookbook'
maintainer 'Your Name'
maintainer_email 'you@example.com'
license 'Apache-2.0'
description 'Installs and configures my application'
version '1.0.0'

supports 'ubuntu'
supports 'centos'

depends 'nginx', '~> 10.0'
depends 'mysql', '~> 8.0'
```

## Chef Environments

### Environment Management

| COMMAND | DESCRIPTION |
| --- | --- |
| `knife environment list` | List all environments |
| `knife environment show ENVIRONMENT` | Show environment details |
| `knife environment create ENVIRONMENT` | Create new environment |
| `knife environment edit ENVIRONMENT` | Edit environment |
| `knife environment delete ENVIRONMENT` | Delete environment |

### Environment File

```ruby
# environments/production.rb
name "production"
description "Production environment"
cookbook_versions({
  "nginx" => "= 10.0.0",
  "mysql" => "= 8.0.0"
})
override_attributes({
  "nginx" => {
    "port" => 8080
  }
})
```

## Chef Best Practices

1. **Use Cookbooks for Reusability** - Package related recipes
2. **Use Templates for Configuration** - Don't hardcode values
3. **Use Attributes for Customization** - Keep recipes flexible
4. **Test Locally** - Use Test Kitchen or Chef Solo
5. **Version Control Cookbooks** - Git for all cookbooks
6. **Use Community Cookbooks** - Don't reinvent the wheel
7. **Follow Naming Conventions** - `cookbook_name::recipe_name`
8. **Document Cookbooks** - Include README.md files
9. **Use Roles and Environments** - Organize configurations
10. **Monitor Chef Runs** - Check logs for errors

## Chef vs Other Config Management

| Feature | Chef | Puppet | Ansible |
|----------|-------|--------|---------|
| **Language** | Ruby | Puppet DSL | YAML |
| **Agent Required** | Yes | Yes | No |
| **Learning Curve** | Steep | Steep | Easy |
| **Push Mode** | Knife bootstrap | MCollective | Yes |
| **Pull Mode** | Yes | Yes | No |
| **Maturity** | Mature | Mature | Mature |

## Useful Tips

### Local Testing with Chef Solo

```bash
# Run chef solo
chef-solo -c solo.rb -j attributes.json

# solo.rb configuration
file_cache_path "/tmp/chef-solo"
cookbook_path "/tmp/cookbooks"

# attributes.json
{
  "run_list": [
    "recipe[nginx]"
  ]
}
```

### Debugging

```bash
# Enable debug logging
chef-client -l debug

# Use why-run mode
chef-client -W

# Check configuration
chef-client --config-file client.rb -c

# Search node data
knife node show NODE_NAME -a attributes
```

### Common Issues

| Issue | Solution |
|-------|----------|
| `Permission denied` | Check sudo permissions |
| `Chef::Exceptions::CookbookNotFound` | Upload cookbook to server |
| `Template not found` | Check template path |
| `Package not found` | Update package cache |
| `Syntax error` | Validate recipe syntax with `chef exec ruby -c recipe.rb` |

### Chef Workstation Installation

```bash
# Download from Chef website
curl -L https://omnitruck.chef.io/install.sh | sudo bash

# Install specific version
curl -L https://omnitruck.chef.io/install.sh | sudo bash -s -- -v 18.0

# Verify installation
chef --version
knife --version
```
