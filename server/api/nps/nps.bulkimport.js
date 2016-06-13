'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var mssql = require('mssql');
var sql = require('seriate');
var moment = require('moment');
var path = require('path');
var fs = require('fs');

var utils = require('./../../utils/utils');
var config = require('./../../config/config');

var Connection = mssql.Connection;

// Connection to db
var __connection = {
  context: new Connection(config.db),
  conn: undefined,
  lastError: undefined,
};

/**
 * Array of columns of which to be used when bulk importing
 * to the NPSSurveyResult table
 *
 * @type {Array}
 */
var __columns = [
  { name: 'npsDate', type: mssql.DateTime2, nullable: true, default: null },
  { name: 'npsTel', type: mssql.VarChar(256), nullable: true, default: null },
  { name: 'ticketId', type: mssql.BigInt, nullable: true, default: null },
  { name: 'queue', type: mssql.VarChar(256), nullable: true, default: null },
  { name: 'team', type: mssql.VarChar(256), nullable: true, default: null },
  { name: 'npsScore', type: mssql.SmallInt, nullable: true, default: null },
  { name: 'npsComment', type: mssql.VarChar(mssql.MAX), nullable: true, default: null },
  { name: 'npsFollowUp', type: mssql.VarChar(mssql.MAX), nullable: true, default: null },
  { name: 'zendeskId', type: mssql.VarChar(255), nullable: true, default: null },
];

/**
 * Listens for the closed event and sets __connection.conn to undefined.
 */
__connection.context.on('close', function () {
  __connection.conn = undefined;
});

__connection.context.on('error', function (err) {
  utils.log('The following error occured with the SQL connection:\n{err}'.replace('{err}', err));

  if (__connection.context.connected) {
    utils.log('Closing the SQL connection for now.')
    __connection.context.close();
  }
});

/**
 * Gets the SQL connection used by mssql either by creating a new connection
 * or by resuing an old connection.
 *
 * @return {Promise} -> {Object} Connection
 */
function getSqlConnection() {
  if (__connection.context.connected) {
    // There is already a connection.
    return Promise.resolve(__connection.conn);
  }

  // Create a new Connection
  return new Promise(function (resolve, reject) {
    utils.log('Connceting to the SQL server.');

    __connection.context.connect()
    .then(function (connection) {
      utils.log('Successfully connected to the SQL server.');
      // Set the stored connection
      __connection.conn = connection;
      // Resolve it
      resolve(__connection.conn);
    })
    .catch(function (err) {
      utils.log('An error occured when connecting to the SQL server.');
      reject(err);
    });
  });
}

/**
 * @param {String} tableName Name of the temp table to use
 * @param {{}[]} columns Array of column objects to use
 * @param {[][]} collection Array of arrays containing
 * @param {String[]} skippables Array of column names to skip, (for the columns field)
 * @return {Object} new mssql.Table
 */
function generateTable(tableName, columns, collection, skippables) {
  var _table = new mssql.Table(tableName);
  // Set table creation to true, to ensure the table is created if it doesn't exist,
  // which it shouldn't do
  _table.create = true;

  // Add all the columns to the table
  _.forEach(columns, function (col, i) {
      _table.columns.add(col.name, col.type, _.omit(col, ['name', 'type']));
  });

  // Get the index of the ticketId and zendeskId to use for eigther assigning the ticketId or zendeskId
  var _indexOfTicketId = _.findIndex(columns, function (col) { return col.name === 'ticketId'; });
  var _indexOfZendeskId = _.findIndex(columns, function (col) { return col.name === 'zendeskId'; });

  // Add all rows
  _.forEach(collection, function (item) {
    var _data = _.map(columns, function (col, i) {
      // Get the value
      var _value;

      if (col.name === 'ticketId') {
        _value = /^[0-9]+$/.test(item[i])
          ? item[i]
          : null;
      } else if (col.name === 'zendeskId') {
        return null;
      } else {
      _value = item[i];
      }

      // Get the type from the array
      var _type = col.type.type || col.type;

      // If any of thse are true, a null value will be returned
      var _criteria = [
        (_value || '').toString() === 'NaN',
        _value === 'NaN',
        _.isUndefined(_value),
        /Int/.test(_type) && isNaN(_value),
        /\@sip3\.uni\-tel\.dk$/.test(_value),
        _.isEmpty(_value),
      ];

      // Tedious doesn't seem to like undefined values when parsing Integers
      if (_.some(_criteria)) {
        // The value is eitehr NaN or undefined,
        // which is better handled as null
        return null;
      } else if (col.name === 'npsTel') {
        // npsTels should start with a plus
        return /^\+/.test(_value)
          ? _value
          : '+' + _value;
      } else if (/Int/.test(_type)) {
        return parseInt(_value);
      } else if (/Date/.test(_type)) {
        return new Date(_value);
      } else {
        return _value;
      }
    });

    // Only actually add rows with data, though this seems to never really happeN
    if (_.some(_data)) {
      // var skippableIndexes = _.map(skippables, function (name) { return _.findIndex(columns, { name: name }) });
      _table.rows.add.apply(_table.rows, _data);
    }
  });

  // Filter out the empty rows
  _table.rows = _.filter(_table.rows, function (row) { return _.some(row) && row[0]; })

  return _table;
}

/**
 * Merges the table at *tableName* into NPSSurveyResult.
 *
 * @param {String} tableName Name of the table to merge from
 * @return {Promise}
 */
function mergeAndDropTempTable(tableName) {
  return new Promise(function (resolve, reject) {
      sql.execute({
        query: sql.fromFile('./sql/nps.mergeAndDropTempTable.sql').replace(/\{tablename\}/ig, tableName),
      })
      .then(resolve)
      .catch(reject);
  });
}

/*****************
 * EXPORTS BELOW:
 *****************/

/**
 * Bulk imports a single file
 *
 * @param {String} filename Name of the file, should be complete
 * @return {Promise}
 */
function singleImport(filename) {
  return new Promise(function (resolve, reject) {
    // Check the file contents
    var _file = fs.readFileSync(filename, 'utf8');

    // If the file isn't a string, I.E. wasn't read, skip it and carry on.
    if (!_.isString(_file)) {
      return reject(new Error('File missing'));
    }

    // Get the collection
    var _collection = _.chain(_file.split(/\r\n/))
      // Slice out the header row
      .thru(function (rows) { return rows.slice(1); })
      // Split all rows by tabs
      .map(function (row) { return row.split('\t'); })
      .filter(_.some)
      .value();

    var skippables = ['queue', 'team'];

    var _tableName = 'Temp_NPSSurveyResult';

    // Generate the table
    var _table = generateTable(_tableName, __columns, _collection);

    // Get the SQL connection to the DB
    return getSqlConnection()
    .then(function (connection) {
      var _request = new mssql.Request(connection);

      return _request.bulk(_table);
    })
    // After bulk import, merge the two tables and drop  the temp table
    .then(function () { return mergeAndDropTempTable(_tableName); })
    .then(resolve)
    .catch(reject);
  });
}

/**
 * Bulk imports a complete folder of files.
 *
 * @param {String} basePath The path from where to read the files
 * @param {String[]} files Array of filenames to bulk import. Do not set, set recursively!
 * @param {String[]} readFiles Do not set, set recursively!
 * @return {Promise}
 */
function bulkImport(basePath, files, readFiles) {
  // First time setup
  if (_.isUndefined(files)) {
    var statObj = fs.existsSync(basePath)
      ? fs.statSync(basePath)
      : undefined;

    // The folder either doesn't exist, or it's not a folder.
    // Early return if either is true
    if (!statObj || statObj.isFile()) {
      return Promise.resolve();
    }

    // Get all files
    files = _.chain(fs.readdirSync(basePath))
      .filter(function (filename) {
        var lstat = fs.statSync(path.resolve(basePath, filename))
        return !!lstat
          ? lstat.isFile()
          : false;
      })
      .map(function (filename) { return path.resolve(basePath, filename); })
      .orderBy(function (filename) { return filename; })
      .value();

    readFiles = [];
  }

  // Return early if there's nothing to do
  if (!files || !files.length) {
    utils.log('No NPS score files found, no bulk import.');
    return Promise.resolve();
  }

  // We're all set here
  if (readFiles.length === files.length) {
    utils.log('Bulk import of NPS data finished. {num} files imported.'.replace('{num}', readFiles.length));
    return Promise.resolve();
  }

    // Get the filename to perform bulk import on.
  var currentFile = files[readFiles.length];


  return singleImport(currentFile)
  .then(function (data) {
    utils.log('Bulk import successful of file: {file}'.replace('{file}', currentFile));
    // Continue recursively
    return bulkImport(basePath, files, readFiles.concat([currentFile]));
  })
  .catch(function (err) {
    utils.log('An error occured with the following file: {file}'.replace('{file}', currentFile));
    utils.log(err);

    // Assumme the file simply shouldn't be imported, continue recursively
    return bulkImport(basePath, files, readFiles.concat([currentFile]));
  })
}

module.exports = {
  import: bulkImport,
  importOne: singleImport,
}
