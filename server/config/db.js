var db = require('mongoose');
db.connect('mongodb://localhost:27017/notely');

module.exports = db;
