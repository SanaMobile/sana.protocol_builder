#!/bin/bash

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

export PATH="/usr/local/bin:$PATH"
source ~/.bash_profile

brew update

brew install python
sudo pip install -r ../requirements.txt

# Install Postgres
brew install postgresql

brew install npm

sudo npm install -g less
