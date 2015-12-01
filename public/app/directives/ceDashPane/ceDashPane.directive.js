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
      isLoading: '=',
      isReadonly: '='
    },
    link: function (scope, element, attrs) {
      
      scope.aggregated = {};
      
      function aggregateStatuses(tickets) {
        return _.assign(
          _.chain(tickets)
          .groupBy('status')
          .map(function (v, k) { return [ _.camelCase(k === 'Work in progress' ? 'wip' : k), v.length ] })
          .zipObject()
          .value()
        , { total: tickets.length });
      }
      
      /**
       * Watches for changes in tickets
       * and sets scope.wipTickets to the tickets which are yet to be submitted.
       */
      scope.$watch('tickets', function (tickets) {
        scope.wipTickets = _.filter(tickets, function (ticket) {
          return ticket.status === 'Work in progress';
        });
        scope.tickets = tickets;
        scope.aggregated = aggregateStatuses(tickets);
      }, true);
      
    }
  };
}]);

})();