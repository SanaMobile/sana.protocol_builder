#!/bin/bash

SCRIPTS_DIR="scripts"
HOOKS_DIR="hooks"

current_directory=${PWD##*/}

if [ $current_directory = $SCRIPTS_DIR ]
then
    cd ../
fi

hooks=($(ls hooks/ | sed 's/\.sh//'))


for i in "${hooks[@]}"
do
    chmod +x $HOOKS_DIR/$i.sh
    echo "Symlinking $i..."
    ln -s -f ../../hooks/$i.sh .git/hooks/$i
done