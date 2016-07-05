'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var Ticket = require('../ticket/ticket.db');

var utils = require('../../utils/utils');

function initialize() {
  return sql.execute({
    query: sql.fromFile('./sql/callBack.initialize.sql')
  })
  .then(function (result) {
    utils.log('CallBack table all set up.');

    return migrateData();
  })
  .then(function (result) {
    utils.log('CallBack table migrated');
  })
  .catch(function (err) {
    utils.log('Couldn\'t set up CallBack table.');
    utils.log(err);
  });
}

function migrateData() {
  return sql.execute({
    query: sql.fromFile('./sql/callBack.migrate.sql'),
  });
}

exports.getAll = function () {
  return sql.execute({
    query: sql.fromFile('./sql/callBack.getAll.sql')
  });
};

exports.set = function (id, callBackObj) {
  return new Promise(function (resolve, reject) {

    var query = sql.fromFile('./sql/callBack.set.sql')
      .concat(Ticket.rawSqlFile('ticket.findNpsById.sql'));

    sql.execute({
      query: query,
      params: {
        callBackId: {
          type: sql.BIGINT,
          val: id || callBackObj.callBackId || null
        },
        ticketId: {
          type: sql.BIGINT,
          val: callBackObj.ticketId
        },
        npsId: {
          type: sql.BIGINT,
          val: callBackObj.npsId
        },
        userId: {
          type: sql.BIGINT,
          val: (!!callBackObj.user)
            ? callBackObj.user.userId
            : callBackObj.userId
        },
        agentName: {
          type: sql.VARCHAR(255),
          val: callBackObj.agentName
        },
        callBackDate: {
          type: sql.DATETIME2,
          val: callBackObj.callBackdate
        },
        callBackStatus: {
          type: sql.VARCHAR(255),
          val: callBackObj.callBackStatus
        },
        reasonToPromote1: {
          type: sql.VARCHAR(255),
          val: callBackObj.reasonToPromote1
        },
        reasonToPromote2: {
          type: sql.VARCHAR(255),
          val: callBackObj.reasonToPromote2
        },
        reasonToDetract1: {
          type: sql.VARCHAR(255),
          val: callBackObj.reasonToDetract1
        },
        reasonToDetract2: {
          type: sql.VARCHAR(255),
          val: callBackObj.reasonToDetract2
        },
        callBackFollowUpAction: {
          type: sql.VARCHAR,
          val: callBackObj.callBackFollowUpAction
        },
        callBackComment: {
          type: sql.VARCHAR,
          val: callBackObj.callBackComment
        },
        dateClosed: {
          type: sql.DATETIME2,
          val: callBackObj.dateClosed
        },
        isClosed: {
          type: sql.BIT,
          val: callBackObj.isClosed || 0
        }
      }
    })
    .then(function (tickets) {
      resolve(utils.objectify(_.first(tickets)));
    })
    .catch(function (err) {
      utils.log(err);
      reject(err);
    });
  });
}

initialize();
