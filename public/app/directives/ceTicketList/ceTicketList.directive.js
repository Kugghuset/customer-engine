(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceTicketList', function () {
  return {
    templateUrl: 'app/directives/ceTicketList/ceTicketList.html',
    restrict: 'EA',
    scope: {
      tickets: '='
    },
    link: function (scope, element, attrs) {
      // Add logic? nah
    }
  };
});

})();