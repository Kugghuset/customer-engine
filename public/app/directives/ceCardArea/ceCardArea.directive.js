(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceCardArea', function () {
  return {
    templateUrl: 'directives/ceCardArea/ceCardArea.html',
    restrict : 'EA',
    transclude: true,
    scope:  {
      childClass: '@',
      childNgClass: '='
    },
    link: function (scope, element, attrs) {
      
    }
  }
});

})();