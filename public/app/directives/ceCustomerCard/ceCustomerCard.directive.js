(function () {

angular.module('ticketyApp')
.directive('ceCustomerCard',['Customer', 'Notification', function (Customer, Notification) {
  return {
    templateUrl: 'directives/ceCustomerCard/ceCustomerCard.html',
    restrict: 'EA',
    scope: {
      customer: '=',
      onDelete: '=',
      onConfirm: '='
    },
    link: function (scope, element, attrs) {
      
      function deleteCustomer(customer) {
        if (_.isFunction(scope.onDelete)) {
          scope.onDelete(customer);
        } else {
          Customer.delete(customer)
          .then(function (customer) {
            Notification.success(customer.orgName + ' deleted.');
          })
          ['catch'](function (err) {
            Notification.error('Couldn\'t delete ' + customer.orgName);
          })
        }
      }
      
      scope.delete = function (customer) {
          
        if (_.isFunction(scope.onConfirm)) {
          scope.onConfirm('Delete customer?'
        , 'Are you sure you want delete ' + customer.orgName + '?\nThis will delete it completely from the system.'
        , function (result) {
            if (result) {
              deleteCustomer(customer);
            }
          });
        } else {
          if (confirm('Are you sure you want delete ' + customer.orgName + '?\nThis will delete it completely from the system.')) {
            deleteCustomer(customer);
          }
        }
      }
      
    }
  };
}]);

})();