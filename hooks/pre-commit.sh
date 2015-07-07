#!/bin/bash

fab_command="fab lint"

$fab_command

if [ $? -ne 0 ]; then
    echo "failed $fab_command, can't commit"
    exit 1
fi
exit 0
