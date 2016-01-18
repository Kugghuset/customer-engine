(function () {

angular.module('ticketyApp')
.directive('ceCustomerCard',[function () {
  return {
    templateUrl: 'directives/ceCustomerCard/ceCustomerCard.html',
    restrict: 'EA',
    scope: {
      customer: '='
    },
    link: function (scope, element, attrs) {
      
      
      
    }
  };
}]);

})();