FROM ubuntu:latest
RUN snap install --classic heroku
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]