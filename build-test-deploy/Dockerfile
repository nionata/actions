FROM ubuntu:latest
RUN curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]