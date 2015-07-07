// ArticleController
// handles all requests that the Article(s) views/templates might need

angular.module('lightCMS.article', [])

    // interact with a list of articles
    .controller('ArticlesController', function($scope, Articles, User){

      // track our user so we can determine if he has edit rights or not
      $scope.user = User;

      // Update our list of articles when the controller gets loaded
      // Articles.fetchAll() returns a promise, so we can treat it as such
      Articles.fetchAll()
        .then(
          function(data){
            // console.log('Recieved: ', data);
            $scope.articles = data.data;
          },
          function(data, status, headers, config){
            console.error(data, status, headers, config);
          });
    })
    // This may indeed be an abuse of controllers
    // I seperated these pieces down into so many controllers
    // in my attempt to better utilize ui-router
    // aka: use the browsers back button from within 'a single page app'


    // view one article
    // check out the state for 'view' in app.js
    // to see where $stateParams.id is set by ui-router
    .controller('ArticleController', function($scope, Articles, User, $stateParams){
      $scope.user = User;
      $scope.currentArticle = {};
      if (Articles.currentArticle){
        // this is the droid we are looking for
        $scope.currentArticle = Articles.currentArticle;
      } else {
        Articles.fetchOne($stateParams.id)
          .then(
            function(data){
              $scope.currentArticle = data.data;
            },
            function(data, status, headers, config){
              console.error(data, status, headers, config);
            });
      }
    })

    // edit an article
    .controller('EditArticleController', function($scope, Articles, $state, $stateParams){
      $scope.currentArticle = {};
      $scope.confirmingDelete = false;
      $scope.update = function(){
        Articles.update({
          title: $scope.currentArticle.title,
          body: $scope.currentArticle.body,
          id: $scope.currentArticle._id
        })
        .then(function(data){
          $state.go('articles');
          toastr.success('Post successfully updated');
        },
        function(err){
          console.error('There was an error updating this article', err);
        });
      };

      $scope.confirmDelete = function(){
          $scope.confirmingDelete = true;
      };

      $scope.cancel = function(){
          $scope.confirmingDelete = false;
      };

      $scope.destroy = function(){
        $scope.confirmingDelete = false;

        Articles.delete({
          title: $scope.currentArticle.title,
          body: $scope.currentArticle.body,
          id: $scope.currentArticle._id
        })
        .then(function(data){
          toastr.success('Post successfully deleted.');
          $state.go('articles');

        },
        function(err){
          toastr.error('There was an error deleting this article', err);
        });
      };

      Articles.fetchOne($stateParams.id)
        .then(
          function(data){
            $scope.currentArticle = data.data;
          },
          function(data, status, headers, config){
            console.error(data, status, headers, config);
          });
    })

    // create a new article
    .controller('CreateArticleController', function($scope, Articles, $location){
      // check for saved data in session storage
      $scope.article = {
        title: sessionStorage.title || '',
        body: sessionStorage.body || ''
      }
      
      $scope.create = function() {
        Articles.create($scope.article)
          .then(
            function(data){
              // redirect since we know we are good?
              $location.url('articles');
              toastr.success('Post successfully created');
              // empty sessionStorage
              sessionStorage.removeItem('title');
              sessionStorage.removeItem('body');
            },
            function(err){
              // alert the user to why we couldnt create the article
              console.error(err);
            }
          );
      };

      // watch article, as well as article.title & article.body
      $scope.$watchCollection('article', function(scope){
        // scope = {title: "Angular", body: "Keeps an eye out for you."}
        // save changes to sessionStorage
        sessionStorage.setItem('title', scope.title);
        sessionStorage.setItem('body', scope.body);
      });
    });
