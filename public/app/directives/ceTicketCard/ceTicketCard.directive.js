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
       * @param {String} status
       */
      scope.onStatusChanged = function (status) {
        scope.ticket.status = status;
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
    }
  };
}]);

})();