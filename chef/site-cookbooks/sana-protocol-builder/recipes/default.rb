#
# Cookbook Name:: sana-protocol-builder
# Recipe:: default
#

include_recipe 'git'
include_recipe 'ssh_known_hosts'
include_recipe 'supervisor'
include_recipe "database::postgresql"
include_recipe "nodejs"

nodejs_npm 'gulp'

package 'libffi-dev' do
  action :install
end

secrets = Chef::EncryptedDataBagItem.load("secrets", "sana_protocol_builder")

environment = {
  'PATH' => '/root/.virtualenvs/sana_protocol_builder/bin',
  'DJANGO_SECRET_KEY' => secrets['django_secret_key'],
  'DJANGO_DB_NAME' => secrets['django_db_name'],
  'DJANGO_DB_USER' => secrets['django_db_user'],
  'DJANGO_DB_PASSWORD' => secrets['django_db_password'],
  'EMAIL_FROM' => secrets['email_from'],
  'EMAIL_HOST' => secrets['email_host'],
  'EMAIL_HOST_USER' => secrets['email_host_user'],
  'EMAIL_HOST_PASSWORD' => secrets['email_host_password']
}

file '/root/.ssh/id_rsa' do
  content secrets['ssh_private_key']
  owner 'root'
  group 'root'
  mode '0600'
  action :create_if_missing
end

file '/root/.ssh/id_rsa.pub' do
  content secrets['ssh_public_key']
  owner 'root'
  group 'root'
  mode '0644'
  action :create_if_missing
end

file '/etc/ssl/private/sana_protocol_builder.key' do
  content secrets['ssl_key']
  owner 'root'
  group 'root'
  mode '0600'
  action :create_if_missing
end

file '/etc/ssl/certs/sana_protocol_builder.crt' do
  content secrets['ssl_crt']
  owner 'root'
  group 'root'
  mode '0644'
  action :create_if_missing
end

ssh_known_hosts_entry 'github.com'

git '/opt/sana.protocol_builder' do
  repository 'git@github.com:SanaMobile/sana.protocol_builder.git'
  revision 'master'
  enable_checkout false
  action :sync
end

cookbook_file '/etc/nginx/sites-available/sanaprotocolbuilder.me.conf' do
  source 'sanaprotocolbuilder.me.conf'
  action :create_if_missing
end

link '/etc/nginx/sites-enabled/sanaprotocolbuilder.me.conf' do
  to '/etc/nginx/sites-available/sanaprotocolbuilder.me.conf'
end

service 'nginx' do
  action [:enable, :start, :reload]
end

bash 'create sana_protocol_builder virtualenv' do
  user 'root'
  group 'root'
  code <<-EOH
    source /root/.bashrc
    source /usr/local/bin/virtualenvwrapper.sh
    mkvirtualenv sana_protocol_builder
  EOH
  creates '/root/.virtualenvs/sana_protocol_builder'
end

template '/root/.virtualenvs/postactivate' do
  source 'postactivate.erb'
  owner 'root'
  group 'root'
  mode '0644'
  variables(
    :django_secret_key => secrets['django_secret_key'],
    :django_db_name => secrets['django_db_name'],
    :django_db_user => secrets['django_db_user'],
    :django_db_password => secrets['django_db_password'],
    :email_from => secrets['email_from'],
    :email_host => secrets['email_host'],
    :email_host_user => secrets['email_host_user'],
    :email_host_password => secrets['email_host_password']
  )
  action :create
end

postgres_connection_info = {
  :host      => '127.0.0.1',
  :port      => 5432,
  :username  => 'postgres',
  :password  => secrets['postgres_password']
}

postgresql_database secrets['django_db_name'] do
  connection postgres_connection_info
  action :create
end

postgresql_database_user secrets['django_db_user'] do
  connection postgres_connection_info
  password secrets['django_db_password']
  action :create
end

postgresql_database_user 'sana_protocol_builder' do
  connection postgres_connection_info
  database_name secrets['django_db_name']
  privileges [:all]
  action :grant
end

supervisor_service 'gunicorn' do
  autostart true
  autorestart true

  command '/root/.virtualenvs/sana_protocol_builder/bin/gunicorn sanaprotocolbuilder.wsgi:application --bind 127.0.0.1:8001'
  directory '/opt/sana.protocol_builder/src-django'
  environment(environment)

  redirect_stderr true
end

directory '/var/log/celery' do
  action :create
end

supervisor_service 'sanaprotocolbuilder-celery' do
  autostart true
  autorestart true

  startsecs 10
  stopwaitsecs 60
  killasgroup true
  command '/root/.virtualenvs/sana_protocol_builder/bin/celery --app=sanaprotocolbuilder.celery:app worker --loglevel=INFO'
  directory '/opt/sana.protocol_builder/src-django'
  environment(environment)

  stdout_logfile '/var/log/celery/worker.log'
  stderr_logfile '/var/log/celery/worker.log'
end
