require('dotenv').load();
var express = require('express');
var notelyServerApp = express();
var Note = require('./models/note');
var bodyParser = require('body-parser');

// Allow ourselves to use `req.body` to work with form data
notelyServerApp.use(bodyParser.json());

// Cross-Origin Resource Sharing (CORS) middleware
notelyServerApp.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

notelyServerApp.get('/notes', function(req, res) {
  Note.find().then(function(notes) {
    res.json(notes);
  });
});

notelyServerApp.post('/notes', function(req, res) {
  var note = new Note({
    title: req.body.note.title,
    body_html: req.body.note.body_html
  });

  note.save().then(function(noteData) {
    res.json({
      message: 'Saved!',
      note: noteData
    });
  });
});

notelyServerApp.listen(3030, function() {
  console.log('Listening on http://localhost:3030');
});
