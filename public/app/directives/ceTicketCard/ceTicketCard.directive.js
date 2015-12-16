(function () {

angular.module('customerEngineApp')
.directive('ceTicketCard',['Ticket', function (Ticket) {
  return {
    templateUrl: 'app/directives/ceTicketCard/ceTicketCard.html',
    restrict: 'EA',
    scope: {
      ticket: '=',
      isReadonly: '='
    },
    link: function (scope, element, attrs) {
      
      /**
       * Returns an array of the different category names.
       * 
       * @param {Object} ticket (Ticket)
       * @return {Array}
       */
      scope.plainCategory = function (ticket) {
        if (!ticket) { return []; }
        
        return _.filter([
          (ticket.category && ticket.category ? ticket.category.categoryName : ''),
          (ticket.subcategory && ticket.subcategory ? ticket.subcategory.subcategoryName : ''),
          (ticket.descriptor && ticket.descriptor ? ticket.descriptor.descriptorName : '')
        ]);
        
      }
      
      /**
       * Watches for changes in ticket.status
       * and updates the status of the ticket
       * if it's different from the old.
       */
      scope.$watch('ticket.status', function (status, oldStatus) {
        // Only update the status when *status* doesn't match *oldStatus*
        // and *oldStatus* us truthy
        if (status != oldStatus && !!oldStatus) {
          Ticket.updateStatus(scope.ticket)
          .then(function (data) {
            if (scope.ticket.status === 'Closed') {
              scope.ticket.ticketDateEnd = new Date();
            }
          })
          ['catch'](function (err) {
            console.log(err);
          });
        }
      });
    }
  };
}]);

})();