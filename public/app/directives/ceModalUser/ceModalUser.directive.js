(function () {
'use strict'

angular.module('customerEngineApp')
.directive('ceModalUser', ['$uibModal', 'Auth', 'Department', 'Notification', function ($uibModal, Auth, Department, Notification) {
  return {
    template: '<div></div>',
    restrict : 'EA',
    scope: {
      openModal: '='
    },
    link: function (scope, element, attrs, ctrl) {
      
      scope.openModal = function (user) {

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/directives/ceModalUser/ceModalUser.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            user: function () {
              return user;
            },
            Auth: function () {
              return Auth;
            },
            Department: function () {
              return Department;
            },
            Notification: function () {
              return Notification;
            }
          }
        });
        
        modalInstance.result.then(function (user) {
          Notification.success('Operator updated.')
          Auth.setCurrentUser(user);
        }, function () {
          // Cancelled
        });
      };
  }
}}])
.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, user, Auth, Department, Notification) {
  
  // assign $scope to a copy of user, as it's regarded as a service and we don't want to by mistake modify it.
  $scope.user = angular.copy(user);
  
  /**
    * Gets all departments and attaches them to scope.
    */
  function getDepartments() {
    Department.getAll()
    .then(function (departments) {
      $scope.departments = departments;
    })
    ['catch'](function (err) {
      console.log('Something went wrong with fetching the departments, please refresh the page.')
    });
  }
  
  $scope.ok = function () {
    Auth.update($scope.user)
    .then($uibModalInstance.close)
    ['catch'](function (err) {
      Notification.error('Something went wrong.')
      console.log(err);
    })
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
  getDepartments();
  
});

})();