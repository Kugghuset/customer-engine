(function () {
'use strict'

angular.module('ticketyApp')
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
    },
    
    personMatch: function (source, target) {
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
    },
    
    cleanOther: function (person, colName) {
      // If an existing person already is chosen but there's been an edit to it,
      // empty the other fields.
      if (!!person && !!person.personId) {
        // Empty fields which aren't the one being edited.
        _.chain(['name', 'email', 'tel', 'altTel', 'personId'])
          .filter(function (col) { return col != colName; })
          .map(function (col) { person[col] = undefined; })
          .value();
      }
    }
  };
  
}]);

})();