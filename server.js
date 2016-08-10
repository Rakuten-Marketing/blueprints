var express = require('express'),
    path = require('path'),
    app = express();

app.use(express.static(__dirname + '/docs/'));
app.get('*', function(request, response) {
  var req = '/docs/index.html';

  if (request.url.lastIndexOf('/build') !== -1 ||
  request.url.lastIndexOf('.html') !== -1) {
    req = request.url;
  }

  response.sendFile(path.join(__dirname + req));
});


module.exports = app;