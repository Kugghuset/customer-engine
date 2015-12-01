(function () {
'use strict'

angular.module('customerEngineApp')
.directive('ceCardArea', function () {
  return {
    templateUrl: 'app/directives/ceCardArea/ceCardArea.html',
    restrict : 'E',
    transclude: true,
    link: function (scope, element, attrs) {
      
    }
  }
});

})();