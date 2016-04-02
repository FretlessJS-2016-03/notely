var bcrypt = require('bcryptjs');
var router = require('express').Router();
var User = require('../models/user');

router.post('/', function(req, res) {
  var salt = bcrypt.genSaltSync(10);

  var user = new User({
    username: req.body.user.username,
    name: req.body.user.name,
    password_digest: bcrypt.hashSync(req.body.user.password, salt)
  });

  user.save().then(function(userData) {
    res.json({
      message: 'Thanks for signing up!',
      user: userData
    });
  },
  function(err) {
    console.log(err);
  });
});

module.exports = router;
