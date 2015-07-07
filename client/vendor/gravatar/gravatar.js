angular.module('ui-gravatar', [])
  .directive('gravatar', ['md5', function (md5) {
    return {
      restrict: 'E',
      link:function(scope, element, attrs) {
        scope.$watch(attrs.email, function(email) {
          var tag = '';
          var hash = ""
          if ((email !== null) && (email !== undefined) && (email !== '')){
            var hash = md5.createHash(email.toLowerCase());
            var src = 'https://secure.gravatar.com/avatar/' + hash + '?s=200'
            tag = '<img src=' + src + ' class="main-avatar"/>'
            element.html(tag);
          }
        });
      }
    };
  }]);
