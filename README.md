[![Travis Status](https://travis-ci.org/SanaMobile/sana.protocol_builder.svg?branch=master)](https://travis-ci.org/SanaMobile/sana.protocol_builder)

Configuration with Chef
=======================

##Dependencies

On your local machine, you will need the following packages to configure a server with Chef:

- Git
- Ruby
- Bundler
- Python
- Fabric

This will vary depending on your OS, but here's an example using Ubuntu:

```shell
apt-get update
apt-get install git
apt-get install bundler
apt-get install python-pip
pip install fabric
```

Now, enter the `chef` subdirectory and run `bundle install`:

```shell
cd chef
bundle install
cd ..
```

This will install Chef as well as Librarian, a cookbook manager (Chef's equivalent of bundler).

##Configuring the server

Before proceeding, make sure your machine's public SSH key is in the server's `authorized_keys` file. It should also be authorized for this repository on GitHub.

In order to decrypt the secrets stored in `data_bags/secrets/sana_protocol_builder.json`, you will need to place the data bag key in `chef/.chef/data_bag_key`. If you are unable to acquire this key from one of the project maintainers, you can generate new secrets and encrypt the data bag with your own key.

Now, we can install Chef on the server and fully configure it. The `knife solo` command will follow the steps defined in `chef/nodes/sanaprotocolbuilder.me.json`, resolving the cookbook dependencies and uploading them to the server for us.

```shell
knife solo bootstrap root@sanaprotocolbuilder.me --bootstrap-version 11.16.4
```

Deploying
=========

Now that the server is fully configured, we are ready to deploy our application.

```shell
fab deploy
```

Setting up database (dev)
===

##Linux

After running the `dev_setup_linux.bash` script, enter these into the terminal:

```
sudo -u postgres createuser --superuser sample_db_user
sudo -u postgres psql -c "ALTER USER sample_db_user WITH PASSWORD 'sample_db_password';"
sudo -u postgres createdb sample_db_name
```

Finally, export the required environment variables:

```
export DJANGO_SECRET_KEY='sample_secret_key'
export DJANGO_DB_NAME='sample_db_name'
export DJANGO_DB_USER='sample_db_user'
export DJANGO_DB_PASSWORD='sample_db_password'
```

##OS X


After running the `dev_setup_osx.bash` script, start the postgres server in a terminal by entering:

```
postgres -D /usr/local/var/postgres
```
Then enter these into a separate terminal:

```
sudo su _postgres
createuser --superuser sample_db_user
```

Inside the Postgres terminal enter:

```
\password sample_db_password
```

Once prompted for the password enter `sample_db_password` again and then exit with `Ctrl+D`. Finally enter:

```
createdb sample_db_name
```

Finally, export the required environment variables:

```
export DJANGO_SECRET_KEY='sample_secret_key'
export DJANGO_DB_NAME='sample_db_name'
export DJANGO_DB_USER='sample_db_user'
export DJANGO_DB_PASSWORD='sample_db_password'
```
