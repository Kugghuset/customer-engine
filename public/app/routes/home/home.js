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
.controller('HomeCtrl', ['$scope', 'Auth', 'Customer', 'Country', 'Notification', 'Ticket', 'Category', function ($scope, Auth, Customer, Country, Notification, Ticket, Category) {
  
  $scope.user = {};
  $scope.auth = Auth;
  
  $scope.ticket = {
    ticketDate: new Date(),
    user: Auth.getCurrentUser()
  }
  
  $scope.getCustomer = function (val) {
    // Get customer based on org. number or name
    return Customer.getFuzzy(val);
  }
  
  Category.getAllCategories()
  .then(function (result) {
    $scope.categories = result.categories;
    $scope.subcategories = result.subcategories;
    $scope.descriptors = result.descriptors;
  })
  .catch(function (err) {
    console.log(err);
  });
  
  /**
   * @param {Object} item
   * @param {String} itemName
   * @return {String}
   */
  $scope.matched = function (item, itemName) {
    if (_.isUndefined(itemName)) { itemName = ''; }
    
    return _.chain(item)
      .filter(function (v, key) { return key != itemName + 'Id' })
      .map(function (value) { return value; })
      .filter() // Remove empty posts
      .value()
      .join(', ');
  }
  
  // Gets all countries
  $scope.countries = Country.getShortAndNames();
  
  // Submits a ticket to the system.
  $scope.submit = function (_ticket) {
    
    Ticket.create(_.assign({}, _ticket, { user: Auth.getCurrentUser() }))
    .then(function (ticket) {
      Notification('Ticket submitted');
      console.log(ticket);
      
      $scope.ticket = {
        ticketDate: new Date(),
        user: Auth.getCurrentUser()
      }
    })
    ['catch'](function (err) {
      console.log(err);
    });
  };
  
  $scope.hideSubcategory = function (ticket) {
    return _.some([
      !ticket.category,
      ticket.category && !$scope.subcategories[ticket.category.categoryId],
      ticket.category && ticket.subcategory && ticket.category.categoryId != ticket.subcategory.categoryId,
    ]);
  }
  
  $scope.hideDescriptor = function (ticket) {
    return _.some([
      !ticket.subcategory,
      ticket.subcategory && !$scope.descriptors[ticket.subcategory.subcategoryId],
      ticket.subcategory && ticket.descriptor && ticket.subcategory.subcategoryId != ticket.descriptor.subcategoryId
    ]);
  }
  
  // Watches for changes in user :)
  $scope.$watch('auth.getCurrentUser()', function (user) {
    $scope.user = user;
  });
  
  $scope.$watch('ticket', function (ticket) {
    if (!ticket) { return; }
    
    if ($scope.hideSubcategory(ticket)) { ticket.subcategory = undefined; }
    if ($scope.hideDescriptor(ticket)) { ticket.descriptor = undefined; }
    
  }, true);
}]);

})();