![Travis Status](https://magnum.travis-ci.com/SanaMobile/sana.protocol_builder.svg?token=ZGEsLaeuqpxx3zs2nxUA&branch=master)

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
