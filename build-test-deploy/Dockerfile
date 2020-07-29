FROM node:alpine
RUN apk add docker
RUN yarn global add heroku
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]