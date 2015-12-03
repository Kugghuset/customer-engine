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
      
      var romeInstance;
      
      function setupRome(initVal) {
        romeInstance = rome(_.first(element), _.assign({
          weekStart: 1,
          weekdayFormat: 'short',
          timeInterval: 900,
          initialValue: moment(initVal).format('YYYY-MM-DD HH:mm')
        }, scope.options));
        
        // Subscribe to changes of the value for syncing the model with Rome.
        romeInstance.on('data', function () {
          syncModel();
        });
      }
      
      function syncModel() {
        // Wrap value change to trigger the update as it happens.
        // Angular will wait until something else happens otherwise.
        $timeout(function () {
          scope.romeModel = romeInstance.getDate();
        });
      }
      
      /**
       * Watch for changes in model
       * and run setup if model exists and romeInstance does not.
       * This is needed to ensure rome uses the actual value and not just now :(
       */
      scope.$watch('romeModel', function (model) {
        if (model && !romeInstance) {
          setupRome(model);
        }
      });
    }
  }
}]);

})();