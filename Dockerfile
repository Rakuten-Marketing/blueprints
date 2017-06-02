FROM node:6.9
MAINTAINER patrick henry <patrick.henry@rakuten.com>

RUN mkdir -p /blueprints
RUN mkdir -p /blueprints/build
ADD docs /blueprints/docs
ADD src /blueprints/src
ADD Gruntfile.js /blueprints/
ADD package.json /blueprints/
ADD server.js /blueprints/

RUN mkdir -p /root/.ssh
RUN chmod 700 /root/.ssh

ADD deploy.key /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
RUN eval $(ssh-agent)
RUN echo "Host github.private.linksynergy.com\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

WORKDIR /blueprints
RUN npm install

RUN rm /root/.ssh/id_rsa

CMD npm start
