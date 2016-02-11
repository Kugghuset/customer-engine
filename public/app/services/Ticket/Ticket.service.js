'use strict'

angular.module('ticketyApp')
.factory('Ticket', ['$q', '$http', '$localForage', function ($q, $http, $localForage) {
  
  var lastUpdate = {
    dateTime: undefined,
    queue: []
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
        // .success(resolve)
        .success(resolve)
        .error(reject);
      });
    },
    
    getByCustomerId: function (customerId, top, page) {
      return $q(function (resolve, reject) {
        
        $http.get( _.isUndefined(top)
          ? '/api/tickets/customer/:id'
            .replace(':id', customerId)
            
          : '/api/tickets/customer/:id/:top/:page'
            .replace(':id', customerId)
            .replace(':top', top)
            .replace(':page', page)
          )
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
     * @param {Number} waitingTime - defaults to 10000 ms
     * @return {Promise} -> {Object} (Ticket)
     */
    autoSave: function (ticket, waitingTime) {
      return $q(function (resolve, reject) {
        
        waitingTime = _.isNumber(waitingTime) ? waitingTime : 10000;
        
        lastUpdate.dateTime = new Date();
        lastUpdate.queue = [ ticket ];
        setTimeout(function () {
          // Return "early" if there's been an update the last 15 seconds.
          if (new Date() - lastUpdate.dateTime < waitingTime || !lastUpdate.queue.length) { return resolve(undefined); }
          
          lastUpdate.dateTime = undefined;
          lastUpdate.queue.pop();
          // Save to db.
          createOrUpdate(ticket)
          .then(function (_ticket) {
            setLocal(_ticket);
            resolve(_ticket);
          })
          ['catch'](reject);
        }, waitingTime);
      });
    },
    
    emptyQueue: function (_ticket) {
      lastUpdate.dateTime = undefined;
      lastUpdate.queue = [];
    },
    
    updateStatus: function (ticket) {
      return $q(function (resolve, reject) {
        $http.put('/api/tickets/status/', ticket)
        .success(resolve)
        .error(reject);
      });
    },
    
    /**
     * @param {String} userId
     * @param {Number} top - defaults to 0, length number of items to get
     * @param {Number} page - defaults to 0, the relative page num to the number of items to get
     */
    getByUserId: function (userId, top, page) {
      return $q(function (resolve, reject) {
        
        if (!top) {
          // it doesn't matter, as the query will contain all tickets
          top = 0;
          page = 0;
        }
        
        $http.get(
          '/api/tickets/user/:id/:top/:page'
          .replace(':id', userId)
          .replace(':top', top)
          .replace(':page', page)
        )
        .success(resolve)
        .error(reject);
      });
    },
    
    remove: function (ticketId) {
      return $q(function (resolve, reject) {
        $http.delete('/api/tickets/' + ticketId)
        .success(resolve)
        .error(reject);
      });
    },
    
    getFresh: function (userId) {
      
      return $q(function (resolve, reject) {
        $http.get('/api/tickets/user/' + userId + '/fresh')
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
    },
    
    /**
     * @param {String} userId
     * @return {Promise} -> {Object}
     */
    getStatusTickets: function (userId) {
      return $q(function (resolve, reject) {
        $http.get('/api/tickets/user/:id/status'.replace(':id', userId))
        .success(resolve)
        .error(reject);
      });
    },
    
    /**
     * @param {Array} existing
     * @param {Array} tickets
     * @return {Array}
     */
    merge: function (existing, tickets) {
      
      // Ensure existance
      if (!existing) { existing = []; }
      if (!tickets) { tickets = []; }
      
      existing = _.map(existing, function (ticket) {
        var _t;
          _t = _.find(tickets, function (t) { return t.ticketId == ticket.ticketId; });
          
          return (_t)
            ? _t
            : ticket;
      });
      
      // Get any new tickets
      var newTickets = _.filter(tickets, function (ticket) {
        return !_.find(existing, function (t) { return t.ticketId === ticket.ticketId; });
      });
      
      existing = existing.concat(newTickets);
      
      return existing;
    },
    
    /**
     * Returns a promise of all nps tickets based on *filter* and *value*
     * if both are defined, otherswise gets all nps tickets.
     * 
     * @param {String} filter
     * @param {String} value
     * @return {Promise} -> {Array}
     */
    getNpsTickets: function (top, page, filter, value) {
      return $q(function (resolve, reject) {
        
        // Check both filter and value are defined
        if (!_.every([ filter, value ])) {
          // If either one or none is defined, set both to undefined
          filter = undefined;
          value = undefined;
        }
        var _url = _.filter([ '/api/tickets/nps', filter, value, top, page ]).join('/')
        
        $http.get(_url)
        .success(resolve)
        .error(reject);
        
      });
    }
    
  }
  
}]);