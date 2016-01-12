(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceDashPane', ['Ticket', 'Auth', function (Ticket, Auth) {
  return {
    templateUrl: 'app/directives/ceDashPane/ceDashPane.html',
    restrict: 'EA',
    scope: {
      user: '=',
      tickets: '=',
      isLoading: '=',
      isReadonly: '=',
      filter: '='
    },
    link: function (scope, element, attrs) {
      
      scope.auth = Auth;
      scope.aggregated = {};
      
      function aggregateStatuses(tickets) {
        return _.assign(
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
      }
      
      scope.setFilter = function (filter) {
        scope.filter = scope.filter == filter ? '' : filter;
      }
      
      scope.$watch('auth.getCurrentUser()', function (user) {
        if (Auth.isLoggedIn() && user && !user.name) {
          scope.openModal(user);
        }
      });
      
      /**
       * Watches for changes in tickets
       * and sets scope.wipTickets to the tickets which are yet to be submitted.
       */
      scope.$watch('tickets', function (tickets) {
        
        scope.aggregated = aggregateStatuses(tickets);
      }, true);
    }
  };
}]);

})();