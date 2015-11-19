'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

function intialize() {
  return sql.execute({
    query: sql.fromFile('./sql/user.initialize.sql')
  });
}

/**
 * @param {Number} id
 * @return {Promise} -> {Object} (User)
 */
exports.findById = function (id) {
  return new Promise(function (resolve, reject) {
    return sql.execute({
      query: sql.fromFile('./sql/user.findById.sql'),
      params: {
        id: {
          type: sql.BIGINT,
          val: id
        }
      }
    })
  });
}

/**
 * @param {String} email
 * @return {Promise} -> {Object} (User)
 */
exports.findByEmail = function (email) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/user.findByEmail.sql'),
      params: {
        email: {
          type: sql.VARCHAR(256),
          val: email
        }
      }
    })
    .then(function (users) {
      if (users) {
        resolve(users[0]);
      } else {
        reject(new Error('No could be found with the email ' + email));
      }
    })
    .catch(reject);
  });
}

/**
 * @param {Object} user
 * @return {Promise} -> {Object} (User)
 */
exports.create = function (user) {
  // Ensure user is an object
  if (!_.isObject(user)) { user = {}; }
  
  return sql.execute({
    query: sql.fromFile('./sql/user.insert.sql'),
    params: {
      email: {
        type: sql.VARCHAR(256),
        val: user.email
      },
      name: {
        type: sql.VARCHAR(256),
        val: user.name
      }
    }
  });
}

// Initialize the table
intialize();