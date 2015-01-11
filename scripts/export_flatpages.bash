#!/bin/bash

./sana_builder/manage.py dumpdata sites flatpages --indent=4 > ./sana_builder/fixtures/pages.json

