var express = require('express');
var notelyServerApp = express();
var Note = require('./models/note');

// Cross-Origin Resource Sharing (CORS) middleware
notelyServerApp.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

notelyServerApp.get('/', function(req, res) {
  Note.find().then(function(notes) {
    res.json(notes);
  });
});

notelyServerApp.listen(3030, function() {
  console.log('Listening on http://localhost:3030');
});
