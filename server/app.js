// Load environment variables
require('dotenv').load();

var express = require('express');
var notelyServerApp = express();

// Allow ourselves to use `req.body` to work with form data
var bodyParser = require('body-parser');
notelyServerApp.use(bodyParser.json());

notelyServerApp.use(require('./middleware/headers'));

// Routes
notelyServerApp.use('/notes', require('./routes/note-routes.js'));
notelyServerApp.use('/users', require('./routes/user-routes.js'));
notelyServerApp.use('/sessions', require('./routes/sessions.js'));

notelyServerApp.listen(3030, function() {
  console.log('Listening on http://localhost:3030');
});
