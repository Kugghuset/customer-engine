(function () {
'use strict'

angular.module('customerEngineApp')
.directive('ceDashPane', ['Ticket', function (Ticket) {
  return {
    templateUrl: 'app/directives/ceDashPane/ceDashPane.html',
    restrict: 'EA',
    scope: {
      user: '='
    },
    link: function (scope, element, attrs) {
      // Add logic? nah
      
      /**
       * Gets all stored pending tickets and filters out
       * any tickets which are not owned by the user.
       * @param {String} userId
       */
      function getNonSubmitted(userId) {
        Ticket.getNonSubmitted(userId)
        .then(function (tickets) {
          scope.pendingTickets = tickets;
        })
        ['catch'](function (err) {
          console.log(err);
        });
      }
      
      scope.$watch('user', function (user) {
        if (user && user.userId) {
          getNonSubmitted(user.userId);
        }
      });
      
      // Get the 
      if (scope.user && scope.user.userId) {
        getNonSubmitted(scope.user.userId);
      } 
    }
  };
}]);

})();