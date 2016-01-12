(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceUserCircle', ['$location', 'Auth', 'Notification', function ($location, Auth, Notification) {
  return {
    templateUrl: 'app/directives/ceUserCircle/ceUserCircle.html',
    restrict : 'EA',
    scope: {
      user: '='
    },
    link: function (scope, element, attrs) {
      
      scope.getContent = function (user) {
        
        if (!user) { return ''; }
        
        if (user.name) {
          
          return _.map(user.name.split(' '), function (part) {
          return _.first(part);
        }).join('').toUpperCase()
          
        }
      };
    }
  }
}]);

})();