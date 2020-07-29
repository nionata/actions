#!/bin/bash

set -e

for dir in `ls`;
do
    # make sure file is a javascript based action directory
    if [ -d "$dir" ] && [ -f "$dir/action.yml" ] && [ -f "$dir/handler.js" ];
    then
        echo "----- building $dir -----"
        cd "$dir"
        ncc build handler.js -o build
        cd ../
    fi
done