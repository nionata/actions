#!/bin/sh -l

set -e

if [[ "$#" != 6 ]];
then 
    echo "Not all environment vars were set!"
    exit 0
fi;

image_name=$1
image_tag=$2
app_name=$3
app_type=$4
github_token=$5
HEROKU_API_KEY=$6

gpr_image_name="docker.pkg.github.com/stem-c/casmm/$image_name"
heroku_image_name="registry.heroku.com/$app_name/$app_type"

# Build and tag image 
echo "$github_token" | docker login docker.pkg.github.com -u "$GITHUB_ACTOR" --password-stdin
docker pull "$gpr_image_name" || true
docker build -t "$gpr_image_name:$image_tag" -t "$gpr_image_name:latest" -t "$heroku_image_name" --cache-from "$gpr_image_name" .

# Test
# docker-compose up -d
# ready=false
# do
#     ready=docker-compose logs | grep "strapi ready"
# while ("$ready" = false)
# cd test 
# yarn functional
# yarn integration
# yarn performance

# Push gpr image
docker push "$gpr_image_name"

# Push heroku image
heroku container:login
docker push "$heroku_image_name"

# Deploy app
heroku container:release -a "$app_name" web