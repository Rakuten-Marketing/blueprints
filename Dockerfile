FROM node:wheezy
MAINTAINER patrick henry <patrick.henry@rakuten.com>

RUN mkdir -p /blueprints
RUN mkdir -p /blueprints/build
ADD docs /blueprints/docs
ADD src /blueprints/src
ADD Gruntfile.js /blueprints/
ADD package.json /blueprints/
ADD server.js /blueprints/

WORKDIR /blueprints
RUN npm install

CMD npm start
