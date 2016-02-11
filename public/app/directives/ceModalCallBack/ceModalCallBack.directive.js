(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceModalCallBack', ['$uibModal', '$timeout', function ($uibModal, $timeout) {
  return {
    template: '<div></div>',
    restrict : 'EA',
    scope: {
      openModal: '=',
      modalIsOpen: '=',
      npsTicket: '='
    },
    link: function (scope, element, attrs, ctrl) {
      
      var modalInstance;
      
      scope.openModal = function (ticket) {
        console.log(ticket);
        
        if (scope.modalIsOpen) {
          // Only one instance can be open.
          return;
        }
        
        $timeout(function () {
          scope.modalIsOpen = true;
        });
        
        modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'directives/ceModalCallBack/ceModalCallBack.html',
          controller: 'ConfirmModalInstanceCtrl',
          resolve: {
            ticket: function () {
              return ticket;
            }
          }
        });
        
        // Set the confirm result
        modalInstance.result.then(function (res) {
          $timeout(function () {
            scope.modalIsOpen = false;
          });
        })
        ['catch'](function (res) {
          $timeout(function () {
            scope.modalIsOpen = false;
          });
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
.controller('ConfirmModalInstanceCtrl', ['$scope', '$uibModalInstance', 'ticket',
  function ($scope, $uibModalInstance, ticket) {
  
  $scope.ticket = ticket;
  
  $scope.save = function () {
    $uibModalInstance.close(true);
  };
  
  $scope.cancel = function () {
    $uibModalInstance.dismiss(false);
  }
  
  /**
   * Splits the comment on new lines after converting \\n to \n.
   * 
   * @param {String} comment
   * @return {Array}
   */
  $scope.splitComments = function (comment, splitter) {
    
    splitter = _.isUndefined(splitter) ? '\n' : splitter;
    
    return !_.isString(comment)
      ? []
      : comment.replace(/\\n/g, '\n').split(new RegExp(splitter));
  };
  
}]);

})();
