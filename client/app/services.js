// services.js
//
// Handles all crud requests for our article element
// server should conform to RESTful routes
//
// This is implemented barebones, and could use much refinement.
angular.module('lightCMS.Services', [])
  // this is really authentication
  .factory('User', function($http, $state){

    var user = {};
    // use this for storing info
    // about the user when we get it
    user.data = null;

    // track hero info - this should be on its own service
    user.hero = {};

    user.update = function(newUserInfo){
      // TODO: some results handling
      return $http.post('/user', newUserInfo);
    };

    //change the users password
    user.changePassword = function(newPassword, callback) {
      $http.post('/user/password', {password: newPassword})
        .success(function(){
          callback();
        })
        .error(function(){
          callback("Error");
        });
    };

    // now user.data gets set about our user at server render/client load
    user.isAuthed = function() {
      // if user.data is null then we are not an authed user
      // its going to be checked by the server anyway
      return user.data !== null;
    };

    // send user credentials to the server
    // it responds with a user object if successfull
    // error handling could be worked on
    user.signin = function(credentials, callback) {
      $http.post('/signin', credentials)
        .success(function(data){
          user.data = data.user;
          $state.go('articles');
        })
        .error(function(err){
          toastr.error('Failed to login', err);
          callback(err);
        });
    };

    user.signout = function() {
      // tell the server we want to sign out
      // set our user data to null
      // and reload the articles list
      $http.post('/signout');
      user.data = null;
      $state.go('articles');
    };

    return user;
  })
  .factory('Articles', function($http) {
    var article = {};

    // used currently to start the app viewing an article
    article.currentArticle = null;

    // returns a promise
    // that in turn tries to return all articles
    article.fetchAll = function(){
      return $http.get('/api/articles');
    };

    // takes an article id as a string
    // returns a promise that will try to
    // provide one article or (null? err? what?)
    article.fetchOne = function(id){
      return $http.get('/api/articles/' + id);
    };

    // takes an article object
    // it should have at least a title and a body property
    article.create = function(article){
      // TODO: do some validation here?
      return $http.post('/api/articles', article);
    };

    // pass in an article object with the updated properties
    // and 'PUT' it to the server
    article.update = function(article){
      return $http.put('/api/articles/' + article.id, article);
    };

    // TODO: delete
    article.delete = function(article){
      return $http.delete('/api/articles/' + article.id, article);
    };

    return article;
})

.factory('Themes', function($http) {
  var themes = {};
  themes.fetchAll = function () {
    return $http.get('/api/themes');
  }
  return themes;

});
