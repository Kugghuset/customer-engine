(function () {
'use strict'

angular.module('ticketyApp')
.factory('CallBack', ['$q', '$http', function ($q, $http) {
  
  
  return {
    
    /**
     * Updates the callBack object at *callBackId* with *calBackObj*.
     * 
     * @param {Number} callBackId
     * @param {Object} callBackObj
     * @return {Promise} -> {Object}
     */
    set: function (callBackId, callBackObj) {
      return $q(function (resolve, reject) {
        $http.put('/api/callBacks/:id'.replace(':id', (!!callBackId ? callBackId : '')), callBackObj)
        .success(resolve)
        .error(reject);
      });
    },
    
    /**
     * Returns an array of 
     * 
     * @return {Array}
     */
    getStatuses: function () {
      return [
        'Not called',
        'Call completed',
        'Call back later',
        'No reply - called several times',
        'Customer don\'t want to talk'
      ];
    },
    
    /**
     * Returns an array of reasons to promote.
     * 
     * @return {Array}
     */
    getPromoteReasons: function () {
      return [
        'Problem resolved instantly',
        'Problem solved within reasonable time',
        'Problem was resolved permanently',
        'Few problems - things generally works well',
        'Few/no transfers',
        'Feedback when problem was resolved',
        'Easy to get through / Short waiting time',
        'Friendly & professional agent',
        'High knowledge level of agent',
        'Good language capabability of agent',
        'Agent understood my problem',
        'No specific reason given',
        'Customer don\'t want to talk',
        'NPS score based on contact with someone else than Bambora Support',
        'Product or system related reason (e.g. HW/SW, reports)'
      ];
    },
    
    /**
     * Returns an array of reasons to detract
     * 
     * @return {Array}
     */
    getDetractReasons: function () {
      return [
        'No / Poor solution to problem',
        'Long time to solve the problem',
        'The same problem keeps on coming back / Customer had to call back multiple times on the same issue',
        'Many problems overall - things don\'t work well',
        'Customer was transferred around multiple times',
        'No feedback when/if problem was resolved',
        'Hard to get through / Long waiting time',
        'Unfriendly / Unprofessional agent',
        'Low knowledge level of agent',
        'Poor language capabability of agent',
        'Agent did not understand my problem',
        'No specific reason given',
        'Customer don\'t want to talk',
        'NPS score based on contact with someone else than Bambora Support',
        'Product or system related reason (e.g. HW/SW, reports, server downtime)'
      ];
    }
    
  };
  
}]);

})();

