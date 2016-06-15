'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var fs = require('fs');
var path = require('path');
var iconv = require('iconv-lite');
var chalk = require('chalk');
var os = require('os');

var util = require('./../../utils/utils');
var deprecated = require('./nps.db.deprecated');
var npsBulkImport = require('./nps.bulkImport');

var npsFilePath = path.resolve('./server/assets/nps/total_nps_score.csv');

var npsFolderpath = path.resolve('./server/assets/nps');

function initialize() {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/nps.initialize.sql')
    })
    .then(function (result) {
      util.log('NPS table all set up.');
      resolve(result);
    })
    .catch(function (err) {
      util.log('Couldn\'t set up NPS table.');
      util.log(err);
      reject(err);
    });
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/nps.getAll.sql')
  });
};

/**
 * Inserts the *nps* object into the db.
 *
 * @param {Object} nps
 * @return {Promise} -> {Object}
 */
exports.insert = function (_nps) {

  var nps;

  if ('ticketId' in _nps) {
    nps = {
      npsTel: _nps.person.tel.replace(/(^[^+])/, '+$1'),
      npsDate: new Date(),
      isLocal: true
    }
  } else {
    nps = _nps;
  }

  return sql.execute({
    query: sql.fromFile('./sql/nps.insert.sql'),
    params: {
      npsTel: {
        type: sql.VARCHAR(256),
        val: nps.npsTel
      },
      npsDate: {
        type: sql.DATETIME2,
        val: nps.npsDate
      },
      npsScore: {
        type: sql.SMALLINT,
        val: nps.npsScore
      },
      npsComment: {
        type: sql.VARCHAR,
        val: nps.npsComment
      },
      doNotContact: {
        type: sql.BIT,
        val: nps.doNotContact
      },
      isLocal: {
        type: sql.BIT,
        val: _.isUndefined(nps.isLocal) ? true : nps.isLocal
      }
    }
  })

}

/**
 * Imports all files into DB.
 *
 * @param {String} basePath
 * @param {Array} files Do not set, set recursively!
 * @param {Array} readFiles Do not set, set recursively!
 * @return {Promise}
 */
function bulkImport(basePath, files, readFiles) {

  return npsBulkImport.import(basePath);

  // First time check
  if (!files) {

    var statObj = fs.existsSync(basePath)
      ? fs.statSync(basePath)
      : undefined;

    // The folder either doesn't exist, or it's not a folder
    // Early return if either is true
    if (!statObj || statObj.isFile()) {
      return new Promise(function (resolve) { resolve(); });
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

  // Return early if there are no files
  if (!files || !files.length) {
    util.log('No NPS score files found, no bulk import.');
    return new Promise(function (resolve) { resolve(); });
  }

  // We're all set here
  if (readFiles.length === files.length) {
    util.log('Bulk import of NPS data finished.');
    return new Promise(function (resolve) { resolve(readFiles); });
  }

  // The file to perform the bulk import on.
  var currentFile = files[readFiles.length];

  var _file = fs.readFileSync(currentFile, 'utf8');

  var bulkFile;

  if (_.isString(_file)) {

    if (/\t/.test(_file)) {
      // Use the new file type
      bulkFile = './sql/nps.bulkImport.sql'
    } else if (_file.split('\r\n')[0].replace(/[^;]/gi, '').length === 3) {
      // Use the oldest file type
      bulkFile = './sql/nps.dep.bulkImport_old.sql'
    } else {
      // Use the semi old file type
      bulkFile = './sql/nps.dep.bulkImport.sql';
    }

  } else {
    // Return early as _file cannot be used
    return bulkImport(basePath, files, readFiles.concat([currentFile]));
  }

  var query = !/\.dep\./i.test(bulkFile)
    ? sql
      .fromFile(bulkFile)
      .replace('{ filepath }', currentFile)
    : sql
      .fromFile(bulkFile)
      .replace("';'", "'\t'")
      .replace('{ filepath }', currentFile);

  return sql.execute({
    query: query
  })
  .then(function () {
    // continue recursively
    return bulkImport(basePath, files, readFiles.concat([currentFile]));
  })
  .catch(function (err) {

    util.log(currentFile);
    util.log(err);

    // Assumme the file simply shouldn't be imported, continue recursively
    return bulkImport(basePath, files, readFiles.concat([currentFile]));
  });
}

exports.bulkImport = bulkImport;

// Temporary outcommenting of bulkimport
initialize()
// .then(deprecated.bulkImport);
