FROM nodesource/centos7:5.8.0
MAINTAINER patrick henry <patrick.henry@rakuten.com>

RUN mkdir -p /blueprints
ADD docs/ /blueprints/
ADD src/ /blueprints/
ADD Gruntfile.js /blueprints/
ADD package.json /blueprints/
ADD server.js /blueprints/
WORKDIR /blueprints

RUN npm install

CMD ['./blueprints/node_modules/.bin/grunt', 'docs']
