(function () {
'use strict'

angular.module('customerEngineApp')
.factory('Department', ['$q', '$http', function ($q, $http) {
  
  return {
    /**
     * @return {Promise} -> {Array} (Department)
     */
    getAll: function (query) {
      return $q(function (resolve, reject) {
        $http.get('api/departments/')
        .success(resolve)
        .error(reject);
      });
    }
  };
  
}]);

})();