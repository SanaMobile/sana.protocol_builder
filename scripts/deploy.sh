#!/bin/bash

if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    openssl aes-256-cbc -K $encrypted_a0fbdc5ae723_key -iv $encrypted_a0fbdc5ae723_iv -in .travis/deploy_key.pem.enc -out .travis/deploy_key.pem -d
    chmod 600 .travis/deploy_key.pem
    eval "$(ssh-agent)"
    ssh-add .travis/deploy_key.pem
    fab travis_deploy
fi
