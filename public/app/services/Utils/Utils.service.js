(function () {
'use strict'

angular.module('customerEngineApp')
.factory('Utils', ['$q', '$http', function ($q, $http) {
  
  
  /**
  * Escapes characters which need escaping in a RegExp.
  * This allows for passing in any string into a RegExp constructor
  * and have it seen as literal
  * 
  * @param {String} text
  * @return {String}
  */
  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s\/]/g, "\\$&");
  };
  
  /**
  * Returns an escaped RegExp object as the literal string *text*.
  * Flags are optional, but can be provided.
  * 
  * @param {String} text
  * @param {String} flags - optional
  * @return {Object} - RegExp object
  */
  function literalRegExp(text, flags) {
    return new RegExp(escapeRegex(text), flags);
  }
  
  var autoSaveState = [];
  
  return {
    autoSave: function (obj) {
      return $q(function (resolve, reject) {
        console.log(obj);
      });
    },
    
    literalRegExp: literalRegExp
  };
  
}]);

})();