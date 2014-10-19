![Travis Status](https://magnum.travis-ci.com/SanaMobile/sana.protocol_builder.svg?token=ZGEsLaeuqpxx3zs2nxUA&branch=master)

Setting up database (dev)
===

##Linux

After running the `dev_setup_linux.bash` script, enter these into the terminal:

```
sudo -u postgres createuser --superuser sana_builder
sudo -u postgres psql
```

Inside the Postgres terminal enter:

```
\password sana_builder
```

Once prompted for the password enter `sana_builder` again and then exit with `Ctrl+D`. Finally enter:

```
sudo -u postgres createdb sana_builder
```

##O SX


After running the `dev_setup_osx.bash` script, start the postgres server in a terminal by entering:

```
postgres -D /usr/local/var/postgres
```
Then enter these into a separate terminal:

```
sudo su _postgres
createuser --superuser sana_builder
```

Inside the Postgres terminal enter:

```
\password sana_builder
```

Once prompted for the password enter `sana_builder` again and then exit with `Ctrl+D`. Finally enter:

```
createdb sana_builder
```

