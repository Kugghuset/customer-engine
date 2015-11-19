(function () {
'use strict'

angular.module('customerEngineApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main', {
    templateUrl: 'app/routes/main.html',
    controller: 'MainCtrl'
  });
}])
.controller('MainCtrl', ['$scope', function ($scope) {
  console.log('lol');
  
}]);

})();