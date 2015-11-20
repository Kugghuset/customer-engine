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
.controller('HomeCtrl', ['$scope', 'Auth', 'Customer', 'Country', 'Notification', function ($scope, Auth, Customer, Country, Notification) {
  
  $scope.user = {};
  $scope.auth = Auth;
  
  $scope.ticket = {
    ticketDate: new Date()
  }
  
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
      .filter() // Remove empty posts
      .value()
      .join(', ');
  }
  
  $scope.countries = Country.getNames();
  
  $scope.categories = [
    { name: 'Acquiring' },
    { name: 'ECommerce' },
    { name: 'Invoice' },
    { name: 'Conact information' },
    { name: 'Terminations' },
    { name: 'Terminal' },
    { name: 'Orders' },
    { name: 'BAX' }
  ];
  
  $scope.datepickerOptions = {
    // add something?
  };
  
  $scope.submit = function (ticket) {
    console.log(ticket);
    
    Notification('Ticket submitted');
    
    $scope.ticket = {
      ticketDate: new Date()
    }
  }
  
}]);

})();