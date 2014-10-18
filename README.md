!(https://magnum.travis-ci.com/SanaMobile/sana.protocol_builder.svg?token=ZGEsLaeuqpxx3zs2nxUA&branch=master)

Setting up database (dev)

After running the `dev_setup_*` scripts, enter these into the terminal:
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

