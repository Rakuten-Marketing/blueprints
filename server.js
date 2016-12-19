var express = require('express'),
    path = require('path'),
    app = express();

app.use('/build', express.static(__dirname + '/build/'));
app.use('/node_modules', express.static(__dirname + '/node_modules/'));
app.use(express.static(__dirname + '/docs/'));

app.get([
  '/',
  '/foundation/*',
  '/elements/*',
  '/components/*'
], function(request, response) {
  response.sendFile(path.join(__dirname + '/docs/index.html'));
});


module.exports = app;
