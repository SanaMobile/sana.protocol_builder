#!/bin/bash

cloc \
    --exclude-list-file=cloc-ignore.txt \
    --read-lang-def=cloc-definitions.txt \
    \
    ../mockups \
    ../docs \
    ../src-backend \
    ../src-frontend
