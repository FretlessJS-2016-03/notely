var express = require('express');
var notelyServerApp = express();

notelyServerApp.get('/', function(req, res) {
  res.send('I <3 Express!');
});

notelyServerApp.listen(3030, function() {
  console.log('Listening on http://localhost:3030');
});
