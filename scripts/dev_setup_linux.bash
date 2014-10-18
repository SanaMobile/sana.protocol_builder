#!/bin/bash

# Update package lists
sudo apt-get update

# Install python, pip
sudo apt-get install -y python
sudo apt-get install -y python-pip
sudo pip install -r ../requirements.txt

# Install Postgres
sudo apt-get install -y postgresql
sudo apt-get install -y python-psycopg2

# Install npm
sudo apt-get install -y npm

# Install less compiler
sudo npm install -g less
