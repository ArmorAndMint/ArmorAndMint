// user.routes.js
//
// passes control to the user controller
// for given routes (signin, signout, register)
//
var User = require('../controllers/user.controller.js');
var passport = require('passport');

module.exports = function(app) {

  app.post('/register', function(req, res, next) {
    User.register(req, res, next);
  });

  app.post('/signin', passport.authenticate('local'), function(req, res, next) {
    User.signin(req, res, next);
  });

  app.post('/signout', function(req, res, next){
    User.signout(req, res, next);
  });
};
