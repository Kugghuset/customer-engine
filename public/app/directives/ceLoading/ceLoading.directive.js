(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceLoading', function () {
  return {
    templateUrl: 'directives/ceLoading/ceLoading.html',
    restrict : 'EA',
    scope: {
      isLoading: '=',
    },
    link: function (scope, element, attrs) {
      
    }
  }
});

})();