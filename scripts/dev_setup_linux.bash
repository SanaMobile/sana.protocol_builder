#!/bin/bash

# Postgres
sudo apt-get install -y postgresql
sudo apt-get install python-psycopg2

# Pip and all the other python dependencies
sudo apt-get install -y python-pip
pip install -r ../requirements.txt

# Misc
sudo npm install -g less
