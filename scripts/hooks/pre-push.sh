#!/bin/bash

fab_command="fab verify"

$fab_command

if [ $? -ne 0 ]; then
    echo "failed $fab_command, please fix before pushing"
    exit 1
fi
exit 0
