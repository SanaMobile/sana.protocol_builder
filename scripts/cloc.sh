#!/bin/bash

cloc \
    --exclude-list-file=cloc-ignore.txt \
    --read-lang-def=cloc-definitions.txt \
    --exclude-dir=dist,node_modules,bower_components \
    \
    ../src-django \
    ../src-backbone
