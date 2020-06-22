#!/bin/bash

set -e

for dir in `ls`;
do
    # make sure file is a directory and it is an action
    if [ -d "$dir" ] && [ -f "$dir/action.yml" ];
    then
        echo "building $dir"
        cd "$dir"
        ncc build handler.js -o build
        cd ../
    fi
done