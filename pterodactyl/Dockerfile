FROM node:18-alpine

LABEL org.cosmonautical.discord-gpt.authors="support@cosmonautical.cloud"

RUN apk add --no-cache --update curl ca-certificates openssl git tar bash sqlite fontconfig sudo \
    && addgroup -S sudo && adduser -G sudo --disabled-password --home /home/container container

# Create app directory
WORKDIR /etc/discord-gpt

RUN echo "Copying source to '$(pwd)'."

# Copy app source
COPY ../ /etc/discord-gpt/
# Install app dependencies
RUN sudo npm install


RUN sudo chmod u+x /etc/discord-gpt/*
RUN sudo chown -R container /etc/discord-gpt

RUN echo "Working Directory contents: '$(ls -l /etc/discord-gpt)'."

RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Create container user
USER container
ENV USER=container HOME=/home/container

CMD [ "/bin/bash", "/etc/discord-gpt/pterodactyl/entrypoint.sh" ]
