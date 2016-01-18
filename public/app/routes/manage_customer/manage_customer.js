(function () {
'use strict'

angular.module('ticketyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.customer', {
    url: '/customer',
    templateUrl: 'routes/manage_customer/manage_customer.html',
    controller: 'CustomerCtrl',
    title: 'Customer'
  });
}])
.controller('CustomerCtrl', ['$scope', '$timeout', 'Auth', 'Customer', function ($scope, $timeout, Auth, Customer) {
  
  $scope.customersLoading = false;
  
  $scope.currentCustomer = {};
  
  function resetCurrentCustomer() {
    $scope.currentCustomer = {
      orgNr: '',
      orgName: '',
      customerNumber: ''
    }
  }
  
  /**
   * Gets all local customers from the DB.
   * 
   * @param {Boolean} showLoading - defaults to true
   */
  function getLocalCustomers(showLoading) {
    
    $scope.customersLoading = _.isUndefined(showLoading) ? true : showLoading;
  
    Customer.getLocal()
    .then(function (customers) {
      $scope.customersLoading = false;
      $scope.customers = customers;
      $scope.filteredCustomers = _.map($scope.customers);
    })
    ['catch'](function (err) {
      $scope.customersLoading = false;
      console.log(err);
    })
    
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
  
  $scope.newCustomer = function () {
    resetCurrentCustomer();
  }
  
  /**
   * Fuzzy searches the customer database.
   * 
   * @param {String} query
   * @param {String} colName
   * @return {Promise} -> {Array}
   */
  $scope.getFuzzy = function (query, colName) {
    
    // Clean if not saved customer
    cleanOther(colName);
    
    // Actually get customers
    return Customer.getFuzzyBy(query, colName);
  }
  
  getLocalCustomers();
  
}]);

})();