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
      statusInfo: '=',
      isLoading: '=',
      isReadonly: '=',
      filter: '='
    },
    link: function (scope, element, attrs) {

      scope.auth = Auth;
      var aggregated = undefined;

      function aggregateStatuses(tickets) {
        return _.chain(scope.tickets)
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
          .value();
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
        return [
          status === 'total' ? scope.tickets.length : aggregated[status] || 0,
          ' (',
          _.get(scope.statusInfo, status === 'total' ? 'totalCount' : 'statuses.' + _.capitalize(status)) || 0,
          ')',
        ].join('');
      }

      /**
       * Watches for changes in tickets
       * and sets scope.wipTickets to the tickets which are yet to be submitted.
       */
      scope.$watch('tickets', function (tickets) {
        aggregated = aggregateStatuses(tickets || []);
      }, true);

    }
  };
}]);

})();