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
.controller('AdminCtrl', ['$scope', '$state', 'Auth', 'CallBack', function ($scope, $state, Auth, CallBack) {

  $scope.auth = Auth;

  $scope.state = $state.current.name;

  $scope.filterUser = undefined;

  $scope.getUsers = function (fuzz) {
    return Auth.getFuzzy(fuzz);
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
      groupingCountry: _.get(options, 'groupingCountry'),
    });
  }

  $scope.$watch(function () {
    return $state.current;
  }, function (currentState, oldState) {

    $scope.state = currentState.name;

  });

}]);

})();