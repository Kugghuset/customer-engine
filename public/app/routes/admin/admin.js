(function () {
'use strict'

angular.module('ticketyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.admin', {
    url: '/admin',
    templateUrl: 'routes/admin/admin.html',
    controller: 'AdminCtrl',
    title: 'Admin'
  });
}])
.controller('AdminCtrl', ['$scope', '$state', 'Auth', 'CallBack', 'Customer', function ($scope, $state, Auth, CallBack, Customer) {

  $scope.auth = Auth;

  $scope.state = $state.current.name;

  $scope.filterUser = undefined;

  $scope.getUsers = function (fuzz) {
    return Auth.getFuzzy(fuzz);
  }

  $scope.getCustomer = function (val, current) {
        // Remove everything but orgName from current if *val* doesn't match.
        if (current && current.orgName != val) {
          delete current.customerId;
          delete current.orgNr;
          delete current.customerNumber;
        }

        // If there's text in the query, don't bother with checking all
        return /[a-ö]/gi.test(val)
          ? Customer.getFuzzyBy(val, 'orgName')
          : Customer.getFuzzy(val);
      }

  $scope.formatUser = function (user) {
    if (!user) { return ''; }

    return '{name} ({email})'
      .replace('{name}', user.name)
      .replace('{email}', user.email);
  }

  $scope.updateFilters = function (options) {



    var opts = CallBack.setOptions({
      userId: _.get(options, 'user.userId'),
      groupingCountry: _.get(options, 'country.shortcode'),
      customerId: !!_.get(options, 'customer.orgName')
        ? _.get(options, 'customer.customerId')
        : undefined,
    });
  }

  $scope.set = function (name, value) {
    if (!$scope.filterOptions) { $scope.filterOptions = {}; }

    $scope.filterOptions[name] = value;
  }

  $scope.matched = function (item, itemName, options) {

        if (!options) { options =  {}; }
        if (_.isUndefined(itemName)) { itemName = ''; }

        if (_.isString(item)) { return item; } // Early

        return _.chain(item)
          .filter(function (v, key) { return _.isBoolean(v) ? false : (key != itemName + 'Id') || !!~_.indexOf(options.skip, key); })
          .map(function (value) { return value; })
          .filter() // Remove empty posts
          .value()
          .join(', ');
      }

  $scope.countries = [
    { name: 'Sweden', shortcode: 'SE' },
    { name: 'Denmark', shortcode: 'DK' },
    { name: 'Norway', shortcode: 'NO' },
    { name: 'Finland', shortcode: 'FI' },
  ]

  $scope.$watch(function () {
    return $state.current;
  }, function (currentState, oldState) {

    $scope.state = currentState.name;

  });

  // Reset filters
  $scope.updateFilters();

}]);

})();