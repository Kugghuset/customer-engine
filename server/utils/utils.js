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

function handleError(res, err) {
  console.log(chalk.red(err));
  
  res.status(500).send('Internal Error');
}

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
module.exports = {
  objectify: objectify,
  handleError: handleError,
  escapeRegex: escapeRegex,
  literalRegExp: literalRegExp
};