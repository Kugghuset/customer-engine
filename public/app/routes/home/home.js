(function () {
'use strict'

angular.module('customerEngineApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.home', {
    url: '/hem',
    templateUrl: 'app/routes/home/home.html',
    controller: 'HomeCtrl'
  });
}])
.controller('HomeCtrl', ['$scope', 'Auth', 'Customer', function ($scope, Auth, Customer) {
  
  $scope.user = {};
  $scope.auth = Auth;
  
  $scope.getCustomer = function (val) {
    // Get customer based on org. number or name
    return Customer.getFuzzy(val);
  }
  
  /**
   * @param {Object} (Customer)
   * @return {String}
   */
  $scope.matched = function (customer) {
    return _.chain(customer)
      .filter(function (v, key) { return key != 'customerId' })
      .map(function (value) { return value; })
      .value()
      .join(', ');
  }
  
}]);

})();