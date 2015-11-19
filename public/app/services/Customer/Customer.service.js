(function () {
'use strict'

angular.module('customerEngineApp')
.factory('Customer', ['$q', '$http', function ($q, $http) {
  
  return {
    /**
     * @param {String} query
     * @return {Promise} -> {Array} (Customer)
     */
    getFuzzy: function (query) {
      console.log(query);
      return $q(function (resolve, reject) {
        $http.put('api/customers/fuzzy', { query: query })
        .success(resolve)
        .error(reject);
      });
    }
  };
  
}]);

})();