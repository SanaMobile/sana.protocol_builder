#!/bin/bash

# Pip and all the other python dependencies
sudo apt-get install -y python
sudo apt-get install -y python-pip
sudo pip install -r ../requirements.txt

# Postgres
sudo apt-get install -y postgresql
sudo apt-get install -y python-psycopg2

# Misc
sudo npm install -g less
