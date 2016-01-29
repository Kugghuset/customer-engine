(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceDashPane', ['Ticket', 'Auth', function (Ticket, Auth) {
  return {
    templateUrl: 'directives/ceDashPane/ceDashPane.html',
    restrict: 'EA',
    scope: {
      user: '=',
      tickets: '=',
      statusTickets: '=',
      isLoading: '=',
      isReadonly: '=',
      filter: '='
    },
    link: function (scope, element, attrs) {
      
      scope.auth = Auth;
      var aggregated = undefined;
      var current = undefined;
      
      function aggregateStatuses(tickets) {
        
        // Merge in the new tickets
        scope.statusTickets = Ticket.merge(scope.statusTickets, tickets);
        
        current = _.assign(
          _.chain(tickets)
            .groupBy(function (item) {
              if (item.status === 'Closed' && item.transferred) {
                // If the item is closed AND transferred, use 'ClosedTransferred'
                return 'ClosedTransferred';
              } else {
                // Otherwise use the status
                return item.status;
              }
            })
            .map(function (v, k) { return [ _.camelCase(k), v.length ] })
            .zipObject()
            .value()
        , { total: tickets.length });
        
        // Calculate stuff
        return _.assign(
          _.chain(scope.statusTickets)
            .groupBy(function (item) {
              if (item.status === 'Closed' && item.transferred) {
                // If the item is closed AND transferred, use 'ClosedTransferred'
                return 'ClosedTransferred';
              } else {
                // Otherwise use the status
                return item.status;
              }
            })
            .map(function (v, k) { return [ _.camelCase(k), v.length ] })
            .zipObject()
            .value()
        , { total: scope.statusTickets.length });
      }
      
      scope.setFilter = function (filter) {
        scope.filter = scope.filter == filter ? '' : filter;
      }
      
      scope.$watch('auth.getCurrentUser()', function (user) {
        if (Auth.isLoggedIn() && user && !user.name) {
          scope.openModal(user);
        }
      });
      
      scope.getStatus = function (status) {
        if (!aggregated) { return '0 (0)'; }
        return '' + (aggregated[status] || 0) + ' (' + (current[status] || 0) +')';
      }
      
      /**
       * Watches for changes in tickets
       * and sets scope.wipTickets to the tickets which are yet to be submitted.
       */
      scope.$watch('tickets', function (tickets) {
        
        aggregated = aggregateStatuses(tickets);
      }, true);
      
      scope.$watch('statusTickets', function (tickets) {
        aggregated = aggregateStatuses(scope.tickets);
      }, true);
    }
  };
}]);

})();