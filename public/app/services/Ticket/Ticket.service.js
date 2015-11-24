'use strict'

angular.module('customerEngineApp')
.factory('Ticket', ['$q', '$http', function ($q, $http) {
  
  return {
    /**
     * @param {Object} ticket
     * @return {Promise} -> {Objecet} (Ticket)
     */
    create: function (ticket) {
      return new Promise(function (resolve, reject) {
        $http.post('/api/tickets/', ticket)
        .success(resolve)
        .error(reject);
      });
    }
  }
  
}]);