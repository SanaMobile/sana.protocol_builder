#!/bin/bash

# Install brew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

export PATH="/usr/local/bin:$PATH"
source ~/.bash_profile

# Ensure brew is up to date
brew update

# Install Python + dependencies
brew install python
pip install -r ../requirements.txt

# Install Postgres
brew install postgresql

# Install npm
brew install npm
