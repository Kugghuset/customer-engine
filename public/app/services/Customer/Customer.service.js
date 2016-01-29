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
    },
    
    /**
     * Gets all customers with the flag isLocal == 1
     * @param {Number} top - defaults to 0, length number of items to get
     * @param {Number} page - defaults to 0, the relative page num to the number of items to get
     * @return {Promise} -> {Array}
     */
    getLocal: function (top, page) {
      return $q(function (resolve, reject) {
        $http.get(
          _.isUndefined(top)
          ? 'api/customers/local'
          : 'api/customers/local/:top/:page'
            .replace(':top', top)
            .replace(':page', page)
        )
        .success(resolve)
        .error(reject);
      });
    },
    
    /**
     * Creates or updates a local customer.
     * 
     * @param {Object} customer - (Customer)
     * @return {Promise} -> {Object} (Customer)
     */
    createOrUpdate: function (customer) {
      return $q(function (resolve, reject) {
        $http.put('api/customers/', customer)
        .success(resolve)
        .error(reject);
      });
    },
    
    /**
     * @param {Objecet} customer
     * @return {Promsise} -> {Object}
     */
    delete: function (customer) {
      return $q(function (resolve, reject) {
        $http.delete('api/customers/' + customer.customerId)
        .success(resolve)
        .error(reject);
      });
    }
  };
  
}]);

})();