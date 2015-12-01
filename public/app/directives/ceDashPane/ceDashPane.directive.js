(function () {
'use strict'

angular.module('customerEngineApp')
.directive('ceDashPane', ['Ticket', function (Ticket) {
  return {
    templateUrl: 'app/directives/ceDashPane/ceDashPane.html',
    restrict: 'EA',
    scope: {
      user: '=',
      tickets: '=',
      isLoading: '='
    },
    link: function (scope, element, attrs) {
      
      /**
       * Watches for changes in tickets
       * and sets scope.pendingTickets to the tickets which are yet to be submitted.
       */
      scope.$watch('tickets', function (tickets) {
        scope.pendingTickets = _.filter(tickets, function (ticket) {
          return !ticket.isSubmitted;
        });
        scope.tickets = tickets;
      });
      
    }
  };
}]);

})();