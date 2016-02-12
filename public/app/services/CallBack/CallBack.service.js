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
        
        console.log(callBackObj);
        
        $http.put('/api/callBacks/:id'.replace(':id', (!!callBackId ? callBackId : '')), callBackObj)
        .success(resolve)
        .error(reject);
      });
    }
    
  };
  
}]);

})();

