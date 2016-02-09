(function () {
'use strict'

angular.module('ticketyApp')
.factory('Category', ['$q', '$http', function ($q, $http) {
  
  /**
   * Left join *input* on *other* on *attrName* and/or *alias*.
   * If *alias* is undefined, it's set to *attrName*.
   * 
   * @param {Array} input
   * @param {Array} other
   * @param {String} attrName
   * @param {String} alias defaults to *attrName*
   * @returm {Array}
   */
  function joinOn(input, other, attrName, alias) {
    
    alias = !_.isUndefined(alias)
      ? alias
      : attrName;
    
    var output = _.chain(input)
      .map(function (item) {
      
        // If there's nothing to join on, return *item* as is
        if (!item || !item[attrName]) { return input; }
        
        var joined = _.chain(other)
          .filter(function (_item) { return !!_item && _item[alias] === item[attrName]; })
          .map(function (_item) { return _.assign({}, item, _item); })
          .value();
        
        return !!joined.length
          ? joined
          : [ item ];
      })
      .flatten()
      .value();
    
    return output;
  }
  
  return {
    getAllCategories: function () {
      return $q(function (resolve, reject) {
        $http.get('/api/categories/combined')
        .success(resolve)
        .error(reject);
      });
    },
    
    /**
     * Returns all categories and their levels joined on each other.
     * 
     * @param {Object} data { categories: {Object}, subcategories: {Object}, descriptors }
     * @return {Array}
     */
    queryCategories: function (data) {
      
      // Return an empty array if there's no data.
      if (!data) { return []; }
      
      // Needs to be flattened, as they per default are objects on their parent key
      var subcategories = _.chain(data.subcategories).map().flatten().value();
      var joinedSubcategories = joinOn(subcategories, data.categories, 'categoryId');
      
      // Needs to be flattened, as they per default are objects on their parent key
      var descriptors = _.chain(data.descriptors).map().flatten().value();
      var joinedDescriptors = joinOn(descriptors, joinedSubcategories, 'subcategoryId');
      
      return _.chain([
          _.map(data.categories, function (item) {
              return _.assign({}, item, {
                main: item.categoryName,
                text: item.categoryName
              });
            }),
          _.map(joinedSubcategories, function (item) {
              return _.assign({}, item, {
                main: item.subcategoryName,
                text: [ item.categoryName, item.subcategoryName ].join(' > ')
              });
            }),
          _.map(joinedDescriptors, function (item) {
              return _.assign({}, item, {
                main: item.descriptorName,
                text: [ item.categoryName, item.subcategoryName, item.descriptorName ].join(' > ')
              });
            })
        ])
        .flatten()
        .value();
    },
    
    findById: function (items, attrName, id) {
      var arr = _.isObject(items)
        ? _.chain(items).map().flatten().value()
        : items;
      
      return !!id
        ? _.find(arr, function (item) { return !!item && item[attrName] === id; })
        : undefined;
    }
    
  };
  
}]);

})();

