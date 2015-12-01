'use strict'

angular.module('customerEngineApp')
.factory('Ticket', ['$q', '$http', '$localForage', function ($q, $http, $localForage) {
  
  var lastUpdate = {
    dateTime: undefined
  };
  
  /**
   * Saves or updates the ticket.
   * 
   * @param {Object} ticket
   * @return {Promise} -> {Object} (Ticket)
   */
  function createOrUpdate(ticket) {
    return $q(function (resolve, reject) {
      $http.put('api/tickets/', ticket)
      .success(resolve)
      .error(reject);
    });
  }
  
  /**
   * @param {Object} ticket (Ticket)
   * @return {Promise} -> *ticket*
   */
  function setLocal(ticket) {
    return $localForage.setItem('ticketId' + ticket.ticketId, ticket);
  }
  
  /**
   * @param {Object|Number} ticket
   * @return {Promise} -> {Object} ticket
   */
  function getLocal(ticket) {
    var key;
    if (_.isString(ticket) && /ticketId/.test(ticket)) { key = ticket; }
    else if (_.isObject(ticket)) { key = 'ticketId' +  ticket.ticketId; }
    else { key = 'ticketId' +  ticket; }
    
    return $localForage.getItem(key);
  }
  
  /**
   * @param {Array} keys - array of keys
   * @return {Promise} -> {Array} (Tickets)
   */
  function getManyLocal(keys) {
    
    return $q(function (resolve, reject) {
      $q.all(_.map(keys, function (key) { return getLocal(key); }))
      .then(function (obj) {
        resolve(obj);
      })
      ['catch'](reject);
      
      
    });
  }
  
  /**
   * @param {Object|Number} ticket
   * @return {Promise}
   */
  function removeLocal(ticket) {
    var id;
    if (_.isObject(ticket)) { id = ticket.ticketId; }
    else { id = ticket; }
    
    return $localForage.removeItem('ticketId' + id);
  }
  
  return {
    /**
     * @param {Object} ticket
     * @return {Promise} -> {Objecet} (Ticket)
     */
    create: function (ticket) {
      return $q(function (resolve, reject) {
        $http.post('/api/tickets/', ticket)
        .success(function (_ticket) {
          removeLocal(_ticket);
          resolve(_ticket);
        })
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
        $http.get('/api/tickets/customer/' + customerId)
        .success(resolve)
        .error(reject);
      });
    },
    
    /**
     * Saves or updates the ticket.
     * 
     * @param {Object} ticket
     * @return {Promise} -> {Object} (Ticket)
     */
    createOrUpdate: createOrUpdate,
    
    /**
     * Manages the auto save feature by saving every
     * few secods on change.
     * 
     * @param {Object} ticket
     * @return {Promise} -> {Object} (Ticket)
     */
    autoSave: function (ticket) {
      return $q(function (resolve, reject) {
        
        lastUpdate.dateTime = new Date();
        setTimeout(function () {
          // Return if there's been an update the last two seconds.
          if (new Date() - lastUpdate.dateTime < 2000) { return resolve(undefined); }
          
          // Save to db.
          createOrUpdate(ticket)
          .then(function (_ticket) {
            setLocal(_ticket);
            resolve(_ticket);
          })
          ['catch'](reject);
        }, 2000);
      });
    },
    
    getNonSubmitted: function (userId) {
      return $q(function (resolve, reject) {
        $http.get('/api/tickets/pending/user/' + userId)
        .success(resolve)
        ['catch'](reject);
      });
    },
    
    getByUserId: function (userId) {
      return $q(function (resolve, reject) {
        $http.get('/api/tickets/user/' + userId)
        .success(resolve)
        ['catch'](reject);
      });
    },
    
    /**
    * @return {Promise} -> {Array} (Ticket)
    */
    getAllLocal: function () {
      return $q(function (resolve, reject) {
        $localForage.keys()
        .then(getManyLocal)
        .then(resolve)
        ['catch'](reject);
      });
    },
    
    getLocal: getLocal,
    
    removeAllLocal: function () {
      $localForage.clear();
    }
    
  }
  
}]);