(function () {

angular.module('ticketyApp')
.filter('alphaSort', function () {

  return function (input, keys, reverse) {

    /**
     * Sorts after numbers and/or letters or by dates and returs a mapped version of *input*.
     * Keys are tested from first to last until a value is found, with which the sort will be made.
     * If none of the values of the keys are defined (= all returns falsy) the element itself is used for comparison.
     *
     * If *input* isn't iterable (I.E. an object or an array), *input* is returned as-is.
     *
     * @param {Array|Object} input
     * @param {Array} keys
     * @param {Boolean} reverse
     * @return {Array}
     */


    // Return as-is if it's non-iterable
    if (!isIterable(input)) { return input; }

    return _.map(input).sort(function (a, b) {
      var compareA = (_.first(_.map(keys, function (key) { return deepFind(a, key); })) || a + '' || '');
      var compareB = (_.first(_.map(keys, function (key) { return deepFind(b, key); })) || b + '' || '');

      // Check for dates and order by them if any is valid
      if (moment(compareA, moment.ISO_8601).isValid() || moment(compareB, moment.ISO_8601).isValid()) {
        return moment(compareB).diff(moment(compareA));
      }

      return compareTwo(compareA, compareB, reverse);
    });


    /**
     *
     * HELPER METHODS BELOW
     *
     */

    /**
     * Checks whether *el* is iterable,
     * meaning it can be iterated over using lodash's .map function.
     *
     * @param {Object|Array} el
     * @return {Boolean}
     */
    function isIterable(el) {
      return _.isObject(el) || _.isArray(el);
    }

    /**
     * Compares two strings alphanumerically
     *
     * @param {String} a
     * @param {String} b
     * @param {Boolean} reverse
     * @return {Number}
     */
    function compareTwo(a, b, reverse) {
      // Ensure existance
      a = !!a ? a : '';
      b = !!b ? b : '';

      var rMultiplier;

      if (_.isUndefined(reverse)) {
        // Don't reverse if undefined
        rMultiplier = 1;
      } else if (reverse === true) {
        // To reverse, multiply by -1
        rMultiplier = -1;
      } else if (reverse === false) {
        // To not reverse, multiply by 1
        rMultiplier = 1;
      } else if (!isFinite(reverse)) {
        // If it's NaN or Infinity, multiply by 1
        rMultiplier = 1;
      } else {
        rMultiplier = 1;
      }

      return rMultiplier * a.localeCompare(b, 'sv', {
        numeric: true,
        sensitivity: 'base'
      });
    }

    /**
     * Returns the value at the dot-separated path.
     *
     * @param {Object} obj
     * @param {String} path
     * @return {Any}
     */
    function deepFind(obj, path) {
      // Return *obj* as-is if it's not an object
      if (!_.isObject(obj)) { return obj; }

      // If there's no path, return *obj* as-is
      if (!path) { return obj; }
      var arr = path.split('.');

      arr.forEach(function(key) { if (obj) { obj = obj[key]; } }, this);

      return obj;
    }

  };

});

})();
