(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceCardAreaHeader', ['Utils', function (Utils) {
  return {
    templateUrl: 'directives/ceCardAreaHeader/ceCardAreaHeader.html',
    restrict : 'EA',
    scope: {
      tickets: '=',
      title: '@'
    },
    link: function (scope, element, attrs) {

      scope.query = undefined;

      function showTicket(ticket, query) {

        if (_.isUndefined(query) || '' === query) {
          return true;
        }

        return _.some(ticket, function (val, key) {
          if (key === '$$hashKey' || key === 'hide') { return false; }

          if (_.isBoolean(val) && val) {
            return Utils.literalRegExp(query, 'gi').test(key);
          }

          if (_.isDate(val) || key === 'ticketDate') {
            // Check dates
            return Utils.literalRegExp(query, 'gi').test(moment(val).format('YYYY-MM-DD, HH:mm'));
          } else if (_.isObject(val)) {
            // Recursion for objects
            return showTicket(val, query);
          }

          return Utils.literalRegExp(query, 'gi').test(val);
        })
      }

      scope.queryTickets = function (_query) {
        scope.query = _query;

        // Mark tickets with 'hide'
        _.forEach(scope.tickets, function (ticket) {
          if (!showTicket(ticket, scope.query)) {
            ticket.hide = true;
          } else {
            ticket.hide = undefined;
          }
        });
      }

      scope.$watch('tickets', function (params) {
        scope.queryTickets(scope.query);
      })

      scope.$watch('query', function (query) {

        scope.queryTickets(query);

      })

    }
  }
}]);

})();
