(function () {
'use strict'

angular.module('customerEngineApp')
.directive('ceModalCustomer', ['$uibModal', 'Notification', 'Customer', '$timeout', function ($uibModal, Notification, Customer, $timeout) {
  return {
    template: '<div></div>',
    restrict : 'EA',
    scope: {
      openModal: '=',
      customer: '='
    },
    link: function (scope, element, attrs, ctrl) {
      
      scope.openModal = function (user) {

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/directives/ceModalCustomer/ceModalCustomer.html',
          controller: 'CustomerModalInstanceCtrl',
          resolve: {
            Customer: function () {
              return Customer;
            },
            Notification: function () {
              return Notification;
            }
          }
        });
        
        modalInstance.result.then(function (customer) {
          $timeout(function () {
            scope.customer = customer;
          });
        }, function () {
          // Cancelled
        });
      };
  }
}}])
.controller('CustomerModalInstanceCtrl', function ($scope, $uibModalInstance, Customer, Department, Notification) {
  
  var existingCustomer = undefined;
  $scope.customer = {};
  
  /**
   * Compares the similarities of *source* and *target*
   * and returns a boolean value for whether they are similar or not.
   * 
   * @param {Object} source
   * @param {Object} target
   * @return {Boolean}
   */
  function customersMatch(source, target) {
    if (!(_.isObject(source) && _.isObject(target))) {
      // Either one or both are falsy, I.E. aren't similar enough.
      return false;
    }
    
    return _.every([
      source.orgNr === target.orgNr,
      source.orgName === target.orgName,
      source.customerNumber === target.customerNumber,
    ]);
  }
  
  /**
   * If $scope.customer has a customerId, clean all other values
   * to allow for creating new customers.
   * 
   * @param {String} colName
   */
  function cleanOther(colName) {
    
    // If an existing customer already is chosen but there's been an edit to it,
    // empty the other fields.
    if (!!$scope.customer && !!$scope.customer.customerId) {
      // Empty fields which aren't the one being edited.
      _.chain(['orgNr', 'orgName', 'customerNumber', 'customerId'])
        .filter(function (col) { return col != colName; })
        .map(function (col) { $scope.customer[col] = undefined; })
        .value();
    }
  }
  
  /**
   * Fuzzy searches the customer database.
   * 
   * @param {String} query
   * @param {String} colName
   * @return {Promise} -> {Array}
   */
  $scope.getCustomer = function (query, colName) {
    
    // Clean if not saved customer
    cleanOther(colName);
    
    // Actually get customers
    return Customer.getFuzzyBy(query, colName);
  }
  
  $scope.onSelected = function ($item, $model, $label) {
    // When an existing customer is found, copy it to $scope.customer
    $scope.customer = angular.copy($item);
    
    existingCustomer = $item;
  }
  
  $scope.isNew = function (customer) {
    // No customer means "It's new", same if it lacks customerId
    return !customer || (customer && !customer.customerId);
  }
  
  $scope.ok = function () {
    
    if (!$scope.isNew($scope.customer)) {
      // Existing customer, close and return it!
      $uibModalInstance.close($scope.customer);
    } else {
      // Customer is new, create it then close and return it!
      Customer.create($scope.customer)
      .then(function (customer) {
        Notification.success('Added new customer ' + customer.orgName + ' to database.');
        $uibModalInstance.close(customer);
      })
      ['catch'](function (err) {
        Notification.error('Something went wrong when trying to create the customer.')
      })
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
});

})();