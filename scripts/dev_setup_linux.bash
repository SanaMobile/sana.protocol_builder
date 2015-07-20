#!/bin/bash

# Update package lists
sudo apt-get update

# Install python, pip
sudo apt-get install -y python
sudo apt-get install -y python-pip
pip install -r ../requirements.txt

# Install Postgres
sudo apt-get install -y postgresql
sudo apt-get install -y python-psycopg2

# Install less compiler (for django compressor)
sudo apt-get install -y node-less

# Install node, grunt
sudo apt-get install -y npm
