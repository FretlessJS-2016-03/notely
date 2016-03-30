var db = require('../config/db');

var NoteSchema = db.Schema({
  title: String,
  body_html: String
});

module.exports = NoteSchema;
