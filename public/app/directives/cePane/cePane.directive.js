(function () {
'use strict'

angular.module('customerEngineApp')
.directive('cePane', function () {
  return {
    templateUrl: 'app/directives/cePane/cePane.html',
    restrict : 'E',
    transclude: true,
    scope: {
      color: '@'
    },
    link: function (scope, element, attrs) {
      
    }
  }
});

})();