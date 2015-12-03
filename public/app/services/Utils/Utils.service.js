(function () {
'use strict'

angular.module('customerEngineApp')
.factory('Utils', ['$q', '$http', function ($q, $http) {
  
  var autoSaveState = [];
  
  return {
    autoSave: function (obj) {
      return $q(function (resolve, reject) {
        console.log(obj);
      });
    }
  };
  
}]);

})();