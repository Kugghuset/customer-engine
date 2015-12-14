'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

var util = require('../../utils/utils');

function intialize() {
  return sql.execute({
    query: sql.fromFile('./sql/person.initialize.sql')
  })
  .then(function (result) {
    console.log('Person table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up Person table.');
    console.error(err);
  });
}


/**
 * Fuzzy searches for values matching *query*.
 * (name, email, tel, altTel)
 * 
 * @param {String} query
 * @return {Promise} -> {Array} (Person)
 */
exports.getFuzzy = function (query) {
  return sql.execute({
    query: sql.fromFile('./sql/person.getFuzzy.sql'),
    params: {
      query: {
        type: sql.VARCHAR(256),
        val: query
      }
    }
  });
}

/**
 * Fuzzy searches the column at *colName* for values matching *query*.
 * 
 * @param {String} query
 * @param {String} colName
 * @return {Promise} -> {Array} (Person)
 */
exports.getFuzzyBy = function (query, colName) {
  return new Promise(function (resolve, reject) {
    return sql.execute({
      query: sql.fromFile('./sql/person.getFuzzyBy.sql').replace(util.literalRegExp('{ colName }', 'gi'), colName),
      params: {
        query: {
          type: sql.VARCHAR(256),
          val: query
        }
      }
    })
    .then(function (persons) {
      resolve(persons || []);
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

exports.create = function (_person) {
  return new Promise(function (resolve, reject) {
    
    sql.execute({
      query: sql.fromFile('./sql/person.create.sql'),
      params: {
        orgNr: {
          type: sql.VARCHAR(256),
          val: _person.orgNr
        },
        orgName: {
          type: sql.VARCHAR(256),
          val: _person.orgName
        },
        personNumber: {
          type: sql.VARCHAR(256),
          val: _person.personNumber
        },
      }
    })
    .then(function (persons) {
      // Get only the first one
      resolve(_.first(persons));
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

exports.getById = function (personId) {
  return new Promise(function (resolve, reject) {
    
    sql.execute({
      query: sql.fromFile('./sql/person.getById.sql'),
      params: {
        personId: {
          type: sql.BIGINT,
          val: personId
        }
      }
    })
    .then(function (persons) {
      resolve(_.first(util.objectify(persons)));
    })
    .catch(function (err) {
      reject(err);
    });
  });
}

intialize();
