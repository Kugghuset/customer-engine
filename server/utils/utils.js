'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');
var DataObjectParser = require('dataobject-parser')
var request = require('request');

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

function regexModules(filename, utils) {
  return new RegExp([
      utils.escapeRegex('<!--file:{filename}-->'.replace('{filename}', filename)),
      '[^]*',
      utils.escapeRegex('<!--end-file:{filename}-->'.replace('{filename}', filename))
    ].join(''), 'gi');
}

/**
 * Returns a RegExp object which matches all href's tags;
 * @param {String} flags
 * @return {RegExp}
 */
function regexSrcHref(flags) {
  return new RegExp(
      '(<(?:script src|link .* href)=")' +
      '(.*)' +
      '(">(</script>)?)'
    , flags ? flags : '');
}

/**
 * Returns the filenames of scripts and/or css files included between
 * a <!--file:{filename}--> and <!--end-file:{filename}--> as an array.
 * 
 * If there either is none or *filename* cannot be found, an empty array is returned.
 * 
 * @param {String} fileContents
 * @param {String} filename
 * @return {Array}
 */
function getModulesFromIndex(fileContents, filename) {
  var utils = this;
  
  try {
    return _.chain(
      _.first(fileContents.match(
          regexModules(filename, utils)
      , '')).split('\n'))
      .map(function (line) {
        return line.replace(regexSrcHref(), '$2').replace(/\s/g, '');
      })
      .filter(function (line) {
        // Filter out lines 
        return !/<!--(end-)?file:/gi.test(line);
      })
      .filter() // Filter out potentially empty lines
      .value()
  } catch (error) {
    return [];
  }
}

/**
 * Removes all modules inside a <!--file:*filename*--> block
 * in the fileContents and returns the cleaned version.
 * 
 * @param {String} fileContents
 * @param {String} filename
 * @return {String}
 */
function removeModules(fileContents, filename) {
  var utils = this;
  return fileContents
    .replace(regexModules(filename, utils), '');
}

/**
 * Cachebusts the files by appending
 * a query to the filenames lik ?cachebuster={Date.now()}
 * 
 * @param {String} fileContents
 * @param {Array|String} urls
 * @return {String}
 */
function cacheBustFiles(fileContent, urls) {
  
  if (!_.isArray(urls)) { urls = [ urls ]; }
  
  var fc = fileContent;
  
  _.forEach(urls, function (url) {
    fc = fc.replace(url, url + '?cachebuster=' + Date.now())
  });
  
  return fc;
}

/**
 * Returns an array of all filenames linked in *fileContent*.
 * 
 * @param {String} fileContent
 * @return {Array}
 */
function getAllModuleNames(fileContent) {
  return _.map(fileContent.match(regexSrcHref('gi')), function (line) {
    return line.replace(regexSrcHref(), '$2').replace(/\s/g, '');
  });
}

/**
 * Makes a GET request to *url*
 * and returns a promise of the body as a string.
 * 
 * @param {String} url - URI to request
 * @param {Object} options - optional, options object
 */
function getPage(url, options) {
  return new Promise(function (resolve, reject) {
    // *options* must be an object
    if (!_.isObject(options)) { options = {}; }
    
    request.get({
      uri: url,
      encoding: options.encoding || null,
      headers: _.assign({}, {
        'Connection': 'keep-alive'
      }, options.headers)
    }, function (err, res, body) {
      if (err) { reject(err); }
      else { console.log(res.statusCode); console.log(body.toString('utf8')); resolve(body.toString('utf8')); }
    })
  });
}

module.exports = {
  objectify: objectify,
  handleError: handleError,
  escapeRegex: escapeRegex,
  literalRegExp: literalRegExp,
  getModulesFromIndex: getModulesFromIndex,
  removeModules: removeModules,
  cacheBustFiles: cacheBustFiles,
  getAllModuleNames: getAllModuleNames,
  getPage: getPage
};