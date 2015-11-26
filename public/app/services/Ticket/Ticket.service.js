'use strict'

angular.module('customerEngineApp')
.factory('Ticket', ['$q', '$http', function ($q, $http) {
  
  return {
    /**
     * @param {Object} ticket
     * @return {Promise} -> {Objecet} (Ticket)
     */
    create: function (ticket) {
      return $q(function (resolve, reject) {
        $http.post('/api/tickets/', ticket)
        .success(resolve)
        .error(reject);
      });
    },
    /**
     * @param {String|Number} ticketId
     * @returm {Promise} -> {Object} (Ticket)
     */
    getById: function (ticketId) {
      return $q(function (resolve, reject) {
        $http.get('/api/tickets/' + ticketId)
        .success(resolve)
        .error(reject);
      });
    },
    getByCustomerId: function (customerId) {
      return $q(function (resolve, reject) {
        $http.get('api/tickets/customer/' + customerId)
        .success(resolve)
        .error(reject);
      });
    }
  }
  
}]);