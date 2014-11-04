#
# Cookbook Name:: sana-protocol-builder
# Recipe:: default
#

include_recipe 'git'
include_recipe 'nginx'
include_recipe 'supervisor'

git '/opt/' do
  repository 'git@github.com:SanaMobile/sana.protocol_builder.git'
  revision 'master'
  action :sync
end

cookbook_file '/etc/nginx/sites-available/sanaprotocolbuilder.me.conf' do
  source 'sanaprotocolbuilder.me.conf'
  action :create
end

link '/etc/nginx/sites-enabled/sanaprotocolbuilder.me.conf' do
  to '/etc/nginx/sites-available/sanaprotocolbuilder.me.conf'
end

service 'nginx' do
  action [:enable, :start, :reload]
end

supervisor_service 'gunicorn' do
  autostart true
  autorestart true

  command '/root/.virtualenvs/sana_protocol_builder/bin/gunicorn sana_builder.wsgi:application -c config/gunicorn.conf.py'
  directory '/opt/sana.protocol_builder'
  environment 'PATH' => '/root/.virtualenvs/sana_protocol_builder/bin'

  redirect_stderr true
end
