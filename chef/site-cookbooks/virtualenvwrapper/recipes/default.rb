#
# Cookbook Name:: virtualenvwrapper
# Recipe:: default
#

include_recipe 'python'
include_recipe 'line'

python_pip 'virtualenvwrapper'

append_if_no_line 'export WORKON_HOME' do
  path '/root/.bashrc'
  line 'export WORKON_HOME=$HOME/.virtualenvs'
end

append_if_no_line 'export PROJECT_HOME' do
  path '/root/.bashrc'
  line 'export PROJECT_HOME=$HOME'
end

append_if_no_line 'source virtualenvwrapper' do
  path '/root/.bashrc'
  line 'source /usr/local/bin/virtualenvwrapper.sh'
end

bash 'source /root/.bashrc' do
  user 'root'
  group 'root'
end
