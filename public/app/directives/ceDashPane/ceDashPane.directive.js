(function () {
'use strict'

angular.module('customerEngineApp')
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
      scope.lastTicket = {};
      
      function getLastUpdated(tickets) {
        return _.last(_.map(tickets).sort(function (a, b) {
          return new Date(a.dateUpdated) - new Date(b.dateUpdated);
        }));
      }
      
      function aggregateStatuses(tickets) {
        return _.assign(
          _.chain(tickets)
          .groupBy('status')
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
        
        scope.lastTicket = getLastUpdated(tickets);
        
        scope.aggregated = aggregateStatuses(tickets);
      }, true);
    }
  };
}]);

})();