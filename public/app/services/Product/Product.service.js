(function () {
'use strict'

angular.module('customerEngineApp')
.factory('Product', ['$q', '$http', function ($q, $http) {
  
  return {
    /**
     * @return {Promise} -> {Array} (Product)
     */
    getAll: function (query) {
      return $q(function (resolve, reject) {
        $http.get('api/products/')
        .success(resolve)
        .error(reject);
      });
    }
  };
  
}]);

})();