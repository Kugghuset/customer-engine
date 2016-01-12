(function () {
'use strict'

angular.module('ticketyApp')
.directive('cePane', function () {
  return {
    templateUrl: 'app/directives/cePane/cePane.html',
    restrict : 'EA',
    transclude: true,
    scope: {
      color: '@',
      childClass: '@'
    },
    link: function (scope, element, attrs, ctrl, transclude) {
      
    }
  }
});

})();