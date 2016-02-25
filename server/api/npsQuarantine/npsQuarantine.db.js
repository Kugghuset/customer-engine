'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var fs = require('fs');
var path = require('path');
var iconv = require('iconv-lite');
var chalk = require('chalk');
var os = require('os');

/**
 * @return {Promise}
 */
function initialize() {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/npsQuarantine.initialize.sql')
    })
    .then(function (result) {
      console.log('NpsQuarantine table all set up.');
      resolve(result);
    })
    .catch(function (err) {
      console.log('Couldn\'t set up NpsQuarantine table.');
      console.error(err);
      reject(err);
    });
  });
}

/**
 * Inserts a record into the db.
 * 
 * @param {Object} npsQuarantine NpsQuarantine or Ticket object from DB
 * @return {Promise} -> {Object} NpsQuarantine object
 */
function insert(npsQuarantine) {
  
  var _npsQuarantine = !('ticketId' in npsQuarantine)
    ? npsQuarantine
    : {
      npsTel: npsQuarantine.person.tel.replace(/(^[^+])/, '+$1'),
      npsDate: new Date(),
      isLocal: true
    };
  
  return sql.execute({
    query: sql.fromFile('./sql/npsQuarantine.insert.sql'),
    params: {
      npsTel: {
        type: sql.VARCHAR(256),
        val: _npsQuarantine.npsTel
      },
      npsDate: {
        type: sql.DATETIME2,
        val: _npsQuarantine.npsDate
      },
      npsScore: {
        type: sql.SMALLINT,
        val: _npsQuarantine.npsScore
      },
      npsComment: {
        type: sql.VARCHAR,
        val: _npsQuarantine.npsComment
      },
      doNotContact: {
        type: sql.BIT,
        val: _npsQuarantine.doNotContact
      },
      isLocal: {
        type: sql.BIT,
        val: _.isUndefined(_npsQuarantine.isLocal) ? true : _npsQuarantine.isLocal
      }
    }
  });
}

initialize();

module.exports = {
  initialize: initialize,
  insert: insert
};