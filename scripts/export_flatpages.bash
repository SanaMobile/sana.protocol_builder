#!/bin/bash

./src/manage.py dumpdata sites flatpages --indent=4 > ./src/fixtures/pages.json

