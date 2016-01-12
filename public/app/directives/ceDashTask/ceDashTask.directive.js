(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceDashTask', function () {
  return {
    templateUrl: 'app/directives/ceDashTask/ceDashTask.html',
    restrict : 'EA',
    scope: {
      name: '@',
      taskRoute: '@'
    },
    link: function (scope, element, attrs) {
      
    }
  }
});

})();