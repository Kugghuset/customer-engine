(function () {
'use strict'

angular.module('customerEngineApp')
.directive('ceModalPerson', ['$uibModal', 'Notification', 'Person', '$timeout', function ($uibModal, Notification, Person, $timeout) {
  return {
    template: '<div></div>',
    restrict : 'EA',
    scope: {
      openModal: '=',
      person: '='
    },
    link: function (scope, element, attrs, ctrl) {
      var modalInstance;
      scope.openModal = function (ticket) {

         modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/directives/ceModalPerson/ceModalPerson.html',
          controller: 'PersonModalInstanceCtrl',
          resolve: {
            Person: function () {
              return Person;
            },
            Notification: function () {
              return Notification;
            },
            ticket: function () {
              return ticket;
            }
          }
        });
        
        modalInstance.result.then(function (person) {
          $timeout(function () {
            scope.person = person;
          });
        }, function () {
          // Cancelled
        });
      };
      
      scope.$on('$destroy', function (event) {
        if(modalInstance) {
          modalInstance.close();
        }
      });
  }
}}])
.controller('PersonModalInstanceCtrl', ['$scope', '$uibModalInstance', 'Person', 'Department', 'Notification', 'ticket',
   function ($scope, $uibModalInstance, Person, Department, Notification, ticket) {
  
  var existingPerson = undefined;
  $scope.person = {};
  $scope.ticket = ticket;
  
  /**
   * Compares the similarities of *source* and *target*
   * and returns a boolean value for whether they are similar or not.
   * 
   * @param {Object} source
   * @param {Object} target
   * @return {Boolean}
   */
  function personsMatch(source, target) {
    if (!(_.isObject(source) && _.isObject(target))) {
      // Either one or both are falsy, I.E. aren't similar enough.
      return false;
    }
    
    return _.every([
      source.name === target.name,
      source.email === target.email,
      source.tel === target.tel,
      source.altTel === target.altTel
    ]);
  }
  
  /**
   * If $scope.person has a personId, clean all other values
   * to allow for creating new persons.
   * 
   * @param {String} colName
   */
  function cleanOther(colName) {
    
    // If an existing person already is chosen but there's been an edit to it,
    // empty the other fields.
    if (!!$scope.person && !!$scope.person.personId) {
      // Empty fields which aren't the one being edited.
      _.chain(['orgNr', 'orgName', 'personNumber', 'personId'])
        .filter(function (col) { return col != colName; })
        .map(function (col) { $scope.person[col] = undefined; })
        .value();
    }
  }
  
  /**
   * Fuzzy searches the person database.
   * 
   * @param {String} query
   * @param {String} colName
   * @return {Promise} -> {Array}
   */
  $scope.getContacts = function (query, colName) {
    
    // Clean if not saved person
    cleanOther(colName);
    
    // Actually get persons
    return Person.getFuzzyBy(query, colName);
  }
  
  /**
   * @param {Object} person
   * @return {Boolean}
   */
  $scope.allowSubmit = function (person) {
    
    // No person :(
    if (!person) { return false; }
    
    return _.some([
      !!person.name,
      !!person.email,
      !!person.tel,
      !!person.altTel
    ]);
  }
  
  $scope.onSelected = function ($item, $model, $label) {
    // When an existing person is found, copy it to $scope.person
    $scope.person = angular.copy($item);
    
    existingPerson = $item;
  }
  
  $scope.isNew = function (person) {
    // No person means "It's new", same if it lacks personId
    return !person || (person && !person.personId);
  }
  
  $scope.ok = function () {
    
    if (!$scope.allowSubmit($scope.person)) {
      return; // Early
    }
    
    if (!$scope.isNew($scope.person)) {
      // Existing person, close and return it!
      $uibModalInstance.close($scope.person);
    } else {
      // Person is new, create it then close and return it!
      Person.create($scope.person)
      .then(function (person) {
        Notification.success('Added new person ' + person.orgName + ' to database.');
        $uibModalInstance.close(person);
      })
      ['catch'](function (err) {
        Notification.error('Something went wrong when trying to create the person.')
      })
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  
}]);

})();