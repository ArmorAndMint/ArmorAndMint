// This file handles the express-specific logic,
// such as server setup and request handling

// External modules
var express = require('express');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');

// Internal modules
var config = require('./config');
var utils = require('./utils');

// Modular variables
var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/../views/');

// Express configuration
// may use something like dev || combined ->OR-> config.logState
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: config.secret
}));

// passport config
// this could maybe be moved to the files that need it
var User = require('../models/user.model');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Server setup, files, and routing are exported from here
module.exports = function() {

  // index - basically everything comes through this route
  app.get('/', function(req, res){
    utils.renderIndex(req, res);
   });

  // could make this its own express router?
  // -> http://expressjs.com/api.html#router
  require('../routes/user.routes.js')(app);

  // add an api route for handling content posts and requests
  // this should always be authenticated for POST events
  require('../routes/article.routes.js')(app);
  // themes route
  require('../routes/theme.routes.js')(app);

  app.use(express.static(path.join(__dirname, '../../client'), {index: false})); //static files served, index:false allows custom '/' routing

  // handle 404s (or dont - this case always send the index.html)
  app.use(function(req, res, next) {
    // always just send index if they have an invalid route
    res.redirect('/');
    //res.status(404).send('Sorry cant find that!');
  });

  // start the server
  app.listen(config.port);
  console.log('Listening on port ' + config.port);

  return app;
};
