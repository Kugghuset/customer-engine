(function () {
'use strict'

angular.module('ticketyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.customer', {
    url: '/customer',
    templateUrl: 'routes/manage_customer/manage_customer.html',
    controller: 'CustomerCtrl',
    title: 'Manage customers'
  });
}])
.controller('CustomerCtrl', ['$scope', '$timeout', 'Auth', 'Customer', 'Notification', function ($scope, $timeout, Auth, Customer, Notification) {
  
  $scope.customersLoading = false;
  
  $scope.filteredCustomers = 0;
  
  $scope.state = {
    currentPage: 1,
    customerCount: 0
  };
  
  /**
   * Gets all local customers from the DB.
   * 
   * @param {Boolean} showLoading - defaults to true
   */
  function getLocalCustomers(showLoading, pageNum) {
    
    pageNum = _.isUndefined(pageNum) ? 1 : pageNum;
    
    $scope.customersLoading = _.isUndefined(showLoading) ? true : showLoading;
    
    Customer.getLocal(20, pageNum)
    .then(function (data) {
      $scope.customersLoading = false;
      $scope.customers = data.customers;
      $scope.state.customerCount = data.customerCount;
      $scope.filteredCustomers = _.map($scope.customers);
    })
    ['catch'](function (err) {
      $scope.customersLoading = false;
      console.log(err);
    })
  }
  
  $scope.onClose = function (customer, allowSubmit) {
    
    // If allowSubmit is falsy, don't do anything.
    if (!allowSubmit || !customer || !_.every([
        !!customer.orgName,
        (!!customer.orgNr || !!customer.customerNumber)
      ])) { return; }
    
    Customer.createOrUpdate(customer)
    .then(function (_customer) {
      
      // Try to find the customer
      var _c = _.find($scope.customers, function (c) { return c.customerId == _customer.customerId; });
      
      // If it exists, set that customer to the new customer
      if (!!_c) {
        $scope.customers = _.map($scope.customers, function (customer) {
          
          return (customer.customerId === _c.customerId)
            ? _customer
            : customer;
        });
        Notification.success(customer.orgName + ' updated.');
      } else {
        // Otherwise push the customer
        Notification.success('Added new customer ' + customer.orgName + ' to database.');
        $scope.customers.push(_customer);
      }
      
      $scope.filteredCustomers = _.map($scope.customers);
      
    })
    ['catch'](function (err) {
      Notification.error('Something went wrong.');
    });
    
  }
  
  $scope.deleteCustomer = function (customer) {
    
    Customer.delete(customer)
    .then(function () {
      Notification.success(customer.orgName + ' deleted.');
      $scope.customers = _.filter($scope.customers, function (c) { return c.customerId != customer.customerId; });
      $scope.filteredCustomers = _.map($scope.customers);
    })
    ['catch'](function (err) {
      Notification.error('Couldn\'t delete ' + customer.orgName + ' probably because of it\'s associated with a ticket.');
    })
  }
  
  $scope.editCustomer = function (customer) {
    
    $timeout(function () {
      if (_.isFunction($scope.openEditCustomer)) {
        $scope.openEditCustomer(customer);
      }
    }, 100);
    
  }
  
  $scope.showCustomer = function (customer) {
    return customer && !customer.hide;
  }
  
  $scope.$watch('state.currentPage', function (currentPage, prevPage) {
    // return early if they are the same
    if (currentPage === prevPage) { return; }
    
    getLocalCustomers(undefined, currentPage);
  });
  
  getLocalCustomers();
  
}]);

})();