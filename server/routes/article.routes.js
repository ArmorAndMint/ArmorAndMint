var Article = require('../controllers/article.controller.js');
var passport = require('passport');
var utils = require('../config/utils');

// article routes
//  where /:articleID is an actual article id in this case
//
// GET /articles  - returns a list of articles
// GET /articles/:articleID - returns a single article with articleID (articleID)
// POST /articles  - creates a new post using the posted form data
// PUT /articles/:articleID - edits an article
// DELETE /articles/:articleID - delete an article

module.exports = function(app) {

  // all routes that need auth will have it by adding passport.authenticate()
  // to the beggining of the action parameters list

  app.route('/articles/:id')
    .get(function(req, res, next){
      // search the db
      Article.findById(req, res, next);
  });
  
  // main articles routes
  app.route('/api/articles')
    // Call the article controller and ask for a list of articles
    .get(function(req, res) {
      Article.findAll(res);
    })
    // create a new article
    .post(utils.checkAuth,
      function(req, res) {
      Article.create(req, res);
    });

    // specific article crud
    app.route('/api/articles/:article_id')
      .get(function(req, res) {
        // retrieve and return 1 article
        Article.findOne(req, res);
      })
      .put(utils.checkAuth,
        function(req, res){
        // update a single article
        Article.update(req, res);
      })
      .delete(utils.checkAuth,
        function(req, res){
        // delete an article
        Article.remove(req, res);
      });
};
