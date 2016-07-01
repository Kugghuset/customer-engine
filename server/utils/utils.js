'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');
var DataObjectParser = require('dataobject-parser')
var request = require('request');
var sql = require('seriate');

var config = require('./../config/config');
var logger = require('./logger.util');

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
  log(chalk.red(err));

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

    log('Making a GET request to ' + url);

    request.get({
      uri: url,
      encoding: options.encoding || null,
      headers: _.assign({}, {
        'Connection': 'keep-alive'
      }, options.headers)
    }, function (err, res, body) {
      if (err) { reject(err); }
      else { log(res.statusCode); log(body.toString('utf8')); resolve(body.toString('utf8')); }
    })
  });
}

/**
 * Converts somewhat boolean values and strings such as 'false'.
 *
 * @param {Any} input
 * @return {Boolean}
 */
function parseBool(input) {
  if (_.isUndefined(input)) { return undefined; }
  if (_.isBoolean(input)) { return input; }
  if (_.isString(input)) { return input != 'false'; }

  return !!input;
}

function post(url, data, headers) {
  return new Promise(function (resolve, reject) {
    request.post({
      uri: url,
      body: data,
      json: true,
      headers: _.assign({}, {
        'Connection': 'keep-alive'
      }, headers)
    }, function (err, res, body) {
      // Handle errors
      if (err) { return reject(err); }

      resolve(body);
    });
  });
}

function put(url, data, headers) {
  return new Promise(function (resolve, reject) {
    request.put({
      uri: url,
      body: data,
      json: true,
      headers: _.assign({}, {
        'Connection': 'keep-alive'
      }, headers)
    }, function (err, res, body) {
      // Handle errors
      if (err) { return reject(err); }

      resolve(body);
    });
  });
}

/**
 * @param {String} message String to loG
 */
function log(message) {
  logger.stream.write(message);
}

/**
 * @param {Any} message The message to print
 * @param {Number} verticalPadding Vertical padding as number of '\n', if 0 then none.
 * @param {Boolean} asIs Should *message* be printed as is? Defaults to false
 */
function print (message, verticalPadding, asIs) {
  if (_.isUndefined(verticalPadding)) { verticalPadding = 0; }
  if (_.isUndefined(asIs)) { asIs = false; }

  if (!!verticalPadding) { log(_.times(verticalPadding, function () { return '\n'; }).join('')); }
  if (_.some([
    _.isError(message),
    _.isString(message),
    _.isNumber(message),
    _.isUndefined(message),
  ])) { asIs = true; }
  log(
    !!asIs ? message : JSON.stringify(message, null, 4)
  );
  if (!!verticalPadding) { log(_.times(verticalPadding, function () { return '\n'; }).join('')); }
}

/**
 * Returns the url for which to make a
 * GET request to send the text message.
 *
 * @param {String} receiver Defaults to config.tel
 * @param {String} message
 * @param {String} sender Defaults to 'HomePlease'
 * @return {String}
 */
function cellsyntUrl(receiver, message, sender) {
  // Ensure there's a receiver
  var _receiver = !!receiver
    ? receiver
    : config.tel;

  // Ensure there's a sender
  var _sender = !!sender
    ? sender
    : 'Tickety';

  return [
    'https://se-1.cellsynt.net/sms.php',
    '?username=' + config.cellsynt.username,
    '&password=' + config.cellsynt.password,
    '&destination=' + _receiver,
    '&originatortype=alpha',
    '&originator=' + encodeURIComponent(_sender),
    '&charset=UTF-8',
    '&text=' + encodeURIComponent(message)
  ].join('');
}

function cellsyntSMS(message) {
  return new Promise(function (resolve, reject) {
    if (!_.every([config.cellsynt.destination, config.cellsynt.password, config.cellsynt.username])) {
      log('Cannot send Cellsynt message, missing config data.');
      return resolve();
    }

    request.get({
      uri: cellsyntUrl(config.cellsynt.destination, message),
      encoding: null,
      headers: {
        'Connection': 'keep-alive'
      },
    }, function (err, res, body) {
      if (err) {
        log('An error occurred when sending an SMS via Cellsynt:')
        log(err);
        return reject(err);
      }

      resolve(body.toString('utf8'));
    });
  });
}


/**
 * Returns a promise of whether the view called *name* exists or not.
 *
 * @param {String} name Name of the view to check existance of
 * @return {Promise} -> {Boolean}
 */
function viewExists(name) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/utils.viewExists.sql'),
      params: {
        name: {
          type: sql.VarChar(255),
          val: name,
        },
      },
    })
    .then(function (res) { return resolve(!!res.length); })
    .catch(reject);
  });
}

/**
 * @param {String} _path Path to check whethet it's absolute or relative
 * @return {Boolean}
 */
function isAbsolutePath(_path) {
  return path.resolve(_path) === path.normalize(_path).replace(/(.+)([\/|\\])$/, '$1');
}

function initializeView(options) {
  return new Promise(function (resolve, reject) {
    var name = options.name;
    var query = options.query;
    var filepath = options.filepath;
    var basedir = options.basedir;

    if (_.isEmpty(query) && !_.isEmpty(filepath)) {
      query = isAbsolutePath(createPath)
        ? fs.readFileSync(filepath, { encoding: 'utf8' })
        : fs.readdirSync(path.resolve(basedir, filepath), { encoding: 'utf8' });
    }

    viewExists(name)
    .then(function (doesExist) {
      if (doesExist && /CREATE VIEW/i.test(query)) {
        query = query.replace(/CREATE VIEW/i, 'ALTER VIEW');
      } else if (!doesExist && /ALTER VIEW/i.test(query)) {
        query = query.replace(/ALTER VIEW/i, 'CREATE VIEW');
      } else if (!/CREATE VIEW|ALTER VIEW/i.test(query)) {
        query = '${doesExist} AS ${query}'
          .replace('${doesExist}', doesExist ? 'ALTER VIEW ' : 'CREATE VIEW')
          .replace('${query}', query);
      }

      return sql.execute({ query: query });
    })
    .then(resolve)
    .catch(reject);
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
  getPage: getPage,
  parseBool: parseBool,
  post: post,
  put: put,
  log: log,
  print: print,
  cellsyntSMS: cellsyntSMS,
};