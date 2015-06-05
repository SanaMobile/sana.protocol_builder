#!/bin/bash

cloc \
    --exclude-list-file=cloc-ignore.txt \
    --read-lang-def=cloc-definitions.txt \
    --exclude-dir=tmp,dist,node_modules,bower_components \
    \
    ../mockups \
    ../docs \
    ../src-backend \
    ../src-frontend
