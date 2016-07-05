var express = require('express');

var app = express();

app.use('/', express.static(__dirname + '/docs/'));
app.get([
  '/',
  '/installation',
  '/contributing',
  '/styleguide',
  '/bootstrap'
], function(req, res) {
  return res.sendFile(__dirname + '/docs/index.html');
});

app.use('/build', express.static(__dirname + '/build'));
app.use('/fonts/bootstrap', express.static(__dirname + '/build/fonts'));

module.exports = app;
