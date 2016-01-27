'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var fs = require('fs');
var path = require('path');
var iconv = require('iconv-lite');
var chalk = require('chalk');

var npsFilePath = path.resolve('./server/assets/nps/total_nps_score.csv');

var npsFolderpath = path.resolve('./server/assets/nps');

function initialize() {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/nps.initialize.sql')
    })
    .then(function (result) {
      console.log('NPS table all set up.');
      resolve(result);
    })
    .catch(function (err) {
      console.log('Couldn\'t set up NPS table.');
      console.error(err);
      reject(err);
    });
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/nps.getAll.sql')
  });
};

function bulkImport(files, readFiles) {
  
  // First time check
  if (!files) {
    
    var statObj = fs.existsSync(npsFolderpath)
      ? fs.statSync(npsFolderpath)
      : undefined;
      
    // The folder either doesn't exist, or it's not a folder
    // Early return if either is true
    if (!statObj || statObj.isFile()) { return; }
    
    // Get all files
    files = _.chain(fs.readdirSync(npsFolderpath))
      .filter(function (filename) {
        return fs.statSync(path.resolve(npsFolderpath, filename)).isFile();
      })
      .map(function (filename) { return path.resolve(npsFolderpath, filename); })
      .value();
    
    readFiles = [];
  }
  
  // Return early if there are no files
  if (!files || !files.length) {
    return console.log('No NPS score files found, no bulk import.');
  }
  
  // We're all set here
  if (readFiles.length === files.length) {
    return console.log('Bulk import of NPS data finished.');
  }
  
  // The file to perform the bulk import on.
  var currentFile = files[readFiles.length];
  
  sql.execute({
    query: sql
      .fromFile('./sql/nps.bulkImport.sql')
      .replace('{ filepath }', currentFile)
  }).then(function () {
    // continue recursively
    return bulkImport(files, readFiles.concat([currentFile]));
  }).catch(function (err) {
    // Assumme the file simply shouldn't be imported, continue recursively
    return bulkImport(files, readFiles.concat([currentFile]));
  });
}

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
      isLocal: {
        type: sql.BIT,
        val: _.isUndefined(nps.isLocal) ? true : nps.isLocal
      }
    }
  })
  
}

initialize()
.then(bulkImport);
