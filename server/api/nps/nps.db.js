'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var fs = require('fs');
var path = require('path');

var npsFilePath = path.resolve('./server/assets/nps/total_nps_score.csv');

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

function bulkImport() {
  
  if (!fs.existsSync(npsFilePath)) {
    // No file to import.
    return;
  }
  
  sql.execute({
    query: sql
      .fromFile('./sql/nps.bulkImport.sql')
      .replace('{ filepath }', npsFilePath)
  }).then(function (result) {
    // Do something?
    
  }).catch(function (err) {
    // Handle error
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
