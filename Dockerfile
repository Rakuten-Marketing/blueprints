FROM node:wheezy
MAINTAINER patrick henry <patrick.henry@rakuten.com>

RUN mkdir -p /blueprints
ADD docs /blueprints/docs
ADD src /blueprints/src
ADD Gruntfile.js /blueprints/
ADD package.json /blueprints/
ADD server.js /blueprints/

WORKDIR /blueprints
RUN npm install
RUN ./node_modules/.bin/grunt docs:build

CMD npm start
