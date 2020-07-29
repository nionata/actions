#!/bin/sh

docker build -f Dockerfile.build -t docker.pkg.github.com/stem-c/casmm/build .
docker push docker.pkg.github.com/stem-c/casmm/build