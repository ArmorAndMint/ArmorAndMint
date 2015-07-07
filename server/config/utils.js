// renders an index page with data it might need
var User = require('../models/user.model');

// this checks to see if this session is logged in
// if its not it returns some json with an error
// otherwise it calls next and lets the ball keep rolling
module.exports.checkAuth = function(req, res, next){
  if (req.user){
    return next();
  }
  res.json({error: 'must be authed to view that content'});
};


// takes an optional article that the server will then render
module.exports.renderIndex = function(req, res, article){
  var options = {root: __dirname + '/../../client/', dotfiles: 'deny'};

  var render = function(owner, heroInfo, article) {
    res.render('index', {owner: owner, hero: heroInfo, article: article});
  };

  // hero is the db userinfo that will populate the page as author
  var BuildPageDataObjects = function(hero){
    // use an article if we get passed one
    article = article || null;

    // owner is info for a signed in page owners view
    var owner = null;

    // hero data is used to populate the page view with info about the content author
    var heroInfo = { id: hero._id,
                     username: hero.username,
                     bio: hero.bio,
                     author: hero.author,
                     theme: hero.theme,
                     path: hero.path,
                     email: hero.email,
                     disqus_shortname: hero.disqus_shortname
                   };

    // if we have an authed user
    if (req.user) {
      // lets build a user object of the data we want
      // to return/render to the user
      owner = { _id: req.user._id,
                username: req.user.username };

    } else {
      owner = null;
    }
    render(owner, heroInfo, article);
  };

  // find our hero user data
  // should be a better way so we dont have to hit the DB on every call here
  User.find(function(err, results){
    if (err){
      console.error(err);
      return;
    }
    // if there is no user then we need to register
    if(results.length === 0){
      // lets instead render index here with a different state?
      // that way once registration is complete, no reload is needed?
      res.sendFile('app/user/register.html', options);
    } else {
      // pass in the first DB user result
      BuildPageDataObjects(results[0]);
    }
  });

};
