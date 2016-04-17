var db = require('../config/db');
var sanitizeHtml = require('sanitize-html');
var htmlToText = require('html-to-text');

var NoteSchema = db.Schema({
  title: String,
  body_html: String,
  body_text: String,
  user: { type: db.Schema.Types.ObjectId, ref: 'User' },
  updated_at: { type: Date, default: Date.now }
});

NoteSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  this.body_html = sanitizeHtml(this.body_html);
  this.body_text = htmlToText.fromString(this.body_html);
  next();
});

module.exports = NoteSchema;
