'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var fs = require('fs');
var path = require('path');
var iconv = require('iconv-lite');
var chalk = require('chalk');
var os = require('os');

var utils = require('./../../utils/utils');
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
      utils.log('NPS table all set up.');

      return initView();
    })
    .then(function (data) {
      resolve(data);
    })
    .catch(function (err) {
      utils.log('Couldn\'t set up NPS table.');
      utils.log(err);
      reject(err);
    });
  });
}

function initView() {
  return utils.initializeView({
    name: 'vi_CallBackView',
    query: sql.fromFile('./sql/nps.vi_CallBackView.sql'),
  })
  .then(function (data) {
    utils.log('vi_CallBackView is all set up.');

    return Promise.resolve();
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
}

exports.bulkImport = bulkImport;

// Temporary outcommenting of bulkimport
initialize()
// .then(deprecated.bulkImport);
