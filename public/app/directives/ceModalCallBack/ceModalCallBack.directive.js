(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceModalCallBack', ['$uibModal', '$timeout', 'Auth', 'Notification', function ($uibModal, $timeout, Auth, Notification) {
  return {
    template: '<div></div>',
    restrict : 'EA',
    scope: {
      openModal: '=',
      modalIsOpen: '=',
      npsTicket: '=',
      users: '='
    },
    link: function (scope, element, attrs, ctrl) {
      
      var modalInstance;
      
      scope.openModal = function (ticket) {
        
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
            },
            users: function () {
              if (scope.users && scope.users.length) {
                return scope.users;
              } else {
                return Auth.getAll();
              }
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
.controller('ConfirmModalInstanceCtrl', ['$scope', '$uibModalInstance', 'CallBack', 'ticket', 'users',
  function ($scope, $uibModalInstance, CallBack, ticket, users) {
  
  $scope.ticket = ticket;
  $scope.users = users;
  
  $scope.save = function () {
    
    if (!ticket || !ticket.callBack) { return $uibModalInstance.close({}); }
    
    var callBackObj = _.assign({}, ticket.callBack, {
      ticketId: ticket.ticketId,
      userId: ticket.callBack.userId
    });
    
    CallBack.set(callBackObj.callBackId, callBackObj)
    .then(function (ticket) {
      $uibModalInstance.close(ticket);
    })
    ['catch'](function (err) {
      $uibModalInstance.dismiss(false);
    });
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
