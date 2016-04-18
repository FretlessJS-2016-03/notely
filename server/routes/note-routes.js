var router = require('express').Router();
var Note = require('../models/note');

router.get('/', function(req, res) {
  Note.find({ user: req.user })
    .sort({ updated_at: 'desc' })
    .then(function(notes) {
      res.json(notes);
    });
});

router.post('/', function(req, res) {
  var note = new Note({
    title: req.body.note.title,
    body_html: req.body.note.body_html,
    user: req.user
  });

  note.save().then(
    function(noteData) {
      res.json({
        message: 'Saved!',
        note: noteData
      });
    },
    function() {
      res.status(500).json({
        message: 'Oops! There was problem creating that note.'
      });
    }
  );
});

router.put('/:noteId', function(req, res) {
  Note.findOne({ _id: req.params.noteId, user: req.user }).then(function(note) {
    note.title = req.body.note.title;
    note.body_html = req.body.note.body_html;
    note.save().then(
      function() {
        res.json({
          message: 'Saved!',
          note: note
        });
      },
      function() {
        res.status(500).json({
          message: 'Oops! There was a problem updating that note.'
        });
      }
    );
  });
});

router.delete('/:noteId', function(req, res) {
  Note.findOne({ _id: req.params.noteId, user: req.user }).then(function(note) {
    note.remove().then(function() {
      res.json({
        message: 'That note has been deleted.',
        note: note
      });
    });
  });
});

module.exports = router;
