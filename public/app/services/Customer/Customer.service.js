(function () {
'use strict'

angular.module('ticketyApp')
.factory('Customer', ['$q', '$http', function ($q, $http) {
  
  return {
    /**
     * @param {String} query
     * @return {Promise} -> {Array} (Customer)
     */
    getFuzzy: function (query) {
      return $q(function (resolve, reject) {
        $http.put('api/customers/fuzzy', { query: query })
        .success(resolve)
        .error(reject);
      });
    },
    
    getFuzzyBy: function (query, colName) {
      
      if (!colName) { return this.getFuzzy(query); }
      
      return $q(function (resolve, reject) {
        $http.put('api/customers/fuzzy/' + colName, { query: query })
        .success(resolve)
        .error(reject);
      });
    },
    
    /**
     * Creates a local customer in the DB
     * 
     * @param {Object} _customer (Customer)
     * @return {Promise} -> {Object} (Customer)
     */
    create: function (_customer) {
      return $q(function (resolve, reject) {
        $http.post('api/customers', _customer)
        .success(resolve)
        .error(reject);
      });
    }
  };
  
}]);

})();