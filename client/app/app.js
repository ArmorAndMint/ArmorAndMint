var app = angular.module('lightCMS', [
  'ui.router',
  'lightCMS.user',
  'lightCMS.article',
  'lightCMS.Services',
  'hc.marked',
  'ui-gravatar'
  ])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    // For any unmatched url
      // redirect to "articles"
    $urlRouterProvider.otherwise("articles");

    // set up the states
    // these have the url to our partial/template
    // as well as the controller to use when rendering that view
    // see: https://github.com/angular-ui/ui-router
    $stateProvider
      .state('articles', {
        url: "/articles",
        templateUrl: "app/article/list.html",
        controller: 'ArticlesController'
      })
      .state('view', {
        url: "/articles/:id",
        templateUrl: "app/article/article.html",
        controller: 'ArticleController'
      })
      .state('create', {
        url: "/create",
        templateUrl: "app/article/create.html",
        controller: 'CreateArticleController'
      })
      .state('edit', {
        url: "/edit/:id",
        templateUrl: "app/article/edit.html",
        controller: 'ArticleController'
      })
      .state('editProfile', {
        url: "/user/editProfile",
        templateUrl: "app/user/profile.html",
        controller: 'UserController'
      })
      .state('signin', {
        url: "/user/signin",
        templateUrl: "app/user/signin.html",
        controller: 'UserController'
      });
      /////////

      // use the HTML5 History API
      $locationProvider.html5Mode(true);
  });

// this gets run once; after config, but before anything else
  // inject some data onto the global object
  // through express rendering, and then check that here
  // and set some state based on it...
    // we might want to load a single article view by id?
    // or start a user off authenticated
app.run(function($rootScope, User, Articles, $location){

  // see if a hero (a.k.a: authenticated user) exists
  // this is a variable set (or not) by the server when
  // it renders the page
  try {
    if (window.owner){
      // set our user service to this thing!
      User.data = window.owner;
    }
    if(window.heroInfo){
      User.hero = window.heroInfo;
    }
    if(window.article){
      Articles.currentArticle = window.article;
    }
  }
  catch (e) {
    console.error(e);
  }

});

//enable git flavoured markdown (gfm)
app.config(['markedProvider', function(markedProvider) {
  markedProvider.setOptions({
    gfm: true,
    tables: true,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });

  //TODO - use this to render links to other posts if href is a relative path
  /*
  markedProvider.setRenderer({
    link: function(href, title, text) {
      return "<a href='" + href + "' title='" + title + "' target='_blank'>" + text + "</a>";
    }
  });
  */
}]);
