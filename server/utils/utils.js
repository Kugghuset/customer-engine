'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');
var DataObjectParser = require('dataobject-parser')

/**
 * Returns a new object where property names
 * with dots are converted into nested objects and arrays.
 * 
 * Example: { 'prop.sub': 'value' } -> { prop: { sub: value } }
 * 
 * @param {Array|Object} sqlArray
 * @return {Array|Object}
 */
function objectify(sqlArray) {
  // Ensure it's an array
  var isObj;
  if (!_.isArray(sqlArray)) {
    sqlArray = [ sqlArray ];
    isObj = true;
  }
  
  var arr = _.map(sqlArray, function (sqlObj) {
    var d = new DataObjectParser();
    
    // Get all values
    _.map(sqlObj, function (value, key) {
      d.set(key, value);
    });
    
    return d.data();
  });
  
  return isObj ? _.first(arr) : arr;
}

module.exports = {
  objectify: objectify
};