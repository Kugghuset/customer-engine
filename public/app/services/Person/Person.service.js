(function () {
'use strict'

angular.module('customerEngineApp')
.factory('Person', ['$q', '$http', function ($q, $http) {
  
  return {
    /**
     * @param {String} query
     * @return {Promise} -> {Array} (Person)
     */
    getFuzzy: function (query) {
      return $q(function (resolve, reject) {
        $http.put('api/persons/fuzzy', { query: query })
        .success(resolve)
        .error(reject);
      });
    },
    
    getFuzzyBy: function (customerId, query, colName) {
      
      if (!colName) { return this.getFuzzy(query); }
      
      return $q(function (resolve, reject) {
        $http.put('api/persons/fuzzy/' + colName, { query: query, customerId: customerId })
        .success(resolve)
        .error(reject);
      });
    },
    
    /**
     * Creates a local person in the DB
     * 
     * @param {Object} _person (Person)
     * @return {Promise} -> {Object} (Person)
     */
    create: function (_person) {
      return $q(function (resolve, reject) {
        $http.post('api/persons', _person)
        .success(resolve)
        .error(reject);
      });
    }
  };
  
}]);

})();