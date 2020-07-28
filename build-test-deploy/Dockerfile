FROM ubuntu:latest
RUN sudo snap install --classic heroku
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]