(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceModalEditCustomer', ['$uibModal', 'Notification', 'Customer', '$timeout', function ($uibModal, Notification, Customer, $timeout) {
  return {
    template: '<div></div>',
    restrict : 'EA',
    scope: {
      openModal: '=',
      customer: '=',
      modalIsOpen: '=',
      onClose: '='
    },
    link: function (scope, element, attrs, ctrl) {
      
      var modalInstance;
      
      scope.openModal = function (customer) {
        
        if (scope.modalIsOpen) {
          // Only one instance can be open.
          return;
        }
        
        $timeout(function () {
          scope.modalIsOpen = true;
        });
        
        customer = customer || {};
        
         modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'directives/ceModalEditCustomer/ceModalEditCustomer.html',
          controller: 'CustomerEditModalInstanceCtrl',
          resolve: {
            currentCustomer: function () {
              return customer;
            },
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
            if (_.isFunction(scope.onClose)) { scope.onClose(customer, true); }
            scope.modalIsOpen = false;
          });
        }, function () {
          // Cancelled
          $timeout(function () {
            scope.modalIsOpen = false;
          });
        });
      };
      
      scope.$on('$destroy', function (event) {
        if(modalInstance) {
          modalInstance.close();
        }
      });
  }
}}])
.controller('CustomerEditModalInstanceCtrl', ['$scope', '$q', '$uibModalInstance', 'currentCustomer', 'Customer', 'Notification',
  function ($scope, $q, $uibModalInstance, currentCustomer, Customer, Notification) {
  
  var existingCustomer = undefined;
  $scope.customer = angular.copy(currentCustomer);
  
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
   * Fuzzy searches the customer database.
   * 
   * @param {String} query
   * @param {String} colName
   * @return {Promise} -> {Array}
   */
  $scope.getFuzzy = function (query, colName) {
    
    return $q(function (resolve, reject) {
      // Actually get customers
      Customer.getFuzzyBy(query, colName)
      .then(function (customers) {
        resolve(_.filter(customers, function (c) { return $scope.customer && c.customerId != $scope.customer.customerId; }));
      })
      ['catch'](reject);
    });
    
  }
  
  $scope.isEditable = function (customer) {
    return !!customer && customer.isLocal;
  }
  
  /**
   * @param {Object} customer
   * @return {Boolean}
   */
  $scope.allowSubmit = function (customer) {
    return _.every([
      
      _.every([
        !!customer,
        !!customer.orgName,
        (!!customer.orgNr || !!customer.customerNumber)
      ]),
      
      _.some([
        $scope.isNew(customer),
        $scope.isEditable(customer) && customer.customerId,
      ])
      
    ]);
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
  
  $scope.submit = function () {
    
    if (!$scope.allowSubmit($scope.customer)) {
      return; // Early
    }
    
    $uibModalInstance.close($scope.customer);
    
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
}]);

})();