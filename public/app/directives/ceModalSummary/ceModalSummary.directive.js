(function () {
'use strict'

angular.module('customerEngineApp')
.directive('ceModalSummary', ['$uibModal', '$timeout', function ($uibModal, $timeout) {
  return {
    template: '<div></div>',
    restrict : 'EA',
    scope: {
      openModal: '='
    },
    link: function (scope, element, attrs, ctrl) {
      
      var modalInstance;
      
      scope.openModal = function (summary, ticket) {
        
        modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/directives/ceModalSummary/ceModalSummary.html',
          controller: 'SummaryModalInstanceCtrl',
          resolve: {
            summary: function () {
              return summary;
            }
          }
        });
        
          // Both outcomes are of interest
        modalInstance.result.then(function (res) {
          ticket.summary = res;
          modalInstance = undefined;
        })
        ['catch'](function (res) {
          ticket.summary = res;
          modalInstance = undefined;
        });
        
      };
      
      scope.$on('$destroy', function (event) {
        if (modalInstance) {
          modalInstance.close();
        }
      });
      
    }
  }
}])
.controller('SummaryModalInstanceCtrl',['$scope', '$uibModalInstance', 'summary', function ($scope, $uibModalInstance, summary) {
  var allowClose = false;
  
  $scope.summary = summary;
  
  $scope.ok = function () {
    allowClose = true;
    $uibModalInstance.close($scope.summary);
  };
  $scope.cancel = function () {
    
    $uibModalInstance.dismiss($scope.summary);
  }
  
  $scope.$on('modal.closing', function (event) {
    if (!allowClose) {
      event.preventDefault();
      $scope.ok();
    }
  });
  
}]);

})();
