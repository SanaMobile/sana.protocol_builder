#
# Cookbook Name:: postgres_password
# Recipe:: default
#

secrets = Chef::EncryptedDataBagItem.load("secrets", "sana_protocol_builder")
node.default['postgresql']['password']['postgres'] = secrets['postgres_password_hash']
