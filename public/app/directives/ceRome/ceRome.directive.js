/* global moment */
/* global rome */
(function () {
'use strict'

angular.module('customerEngineApp')
.directive('ceRome', ['$timeout', function ($timeout) {
  return {
    restrict : 'EA',
    scope: {
      options: '=',
      romeModel: '='
    },
    link: function (scope, element, attrs) {
      
      var romeInstance = rome(_.first(element), _.assign({
        weekStart: 1,
        weekdayFormat: 'short',
        timeInterval: 900,
        initialValue: moment(scope.romeModel).format('YYYY-MM-DD HH:mm')
      }, scope.options));
      
      function syncModel() {
        // Wrap value change to trigger the update as it happens.
        // Angular will wait until something else happens otherwise.
        $timeout(function () {
          scope.romeModel = romeInstance.getDate();
        });
      }
      
      // Subscribe to changes of the value for syncing the model with Rome.
      romeInstance.on('data', function (params) {
        syncModel();
      });
      
    }
  }
}]);

})();