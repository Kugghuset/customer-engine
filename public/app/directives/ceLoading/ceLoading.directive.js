(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceLoading', function () {
  return {
    templateUrl: 'app/directives/ceLoading/ceLoading.html',
    restrict : 'EA',
    scope: {
      isLoading: '=',
    },
    link: function (scope, element, attrs) {
      
    }
  }
});

})();