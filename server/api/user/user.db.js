'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');

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
    sql.execute({
      query: sql.fromFile('./sql/user.findById.sql'),
      params: {
        id: {
          type: sql.BIGINT,
          val: id
        }
      }
    })
    .then(function (users) {
      resolve(users[0]);
    })
    .catch(reject);
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
exports.create = function (_user) {
  return new Promise(function (resolve, reject) {
      // Ensure _user is an object
    if (!_.isObject(_user)) { _user = {}; }
    
    return sql.execute({
      query: sql.fromFile('./sql/user.insert.sql'),
      params: {
        email: {
          type: sql.VARCHAR(256),
          val: _user.email
        },
        password: {
          type: sql.VARCHAR(256),
          val: bcrypt.hashSync(_user.password, bcrypt.genSaltSync(10)) //Hash user submitted password
        },
        name: {
          type: sql.VARCHAR(256),
          val: _user.name
        }
      }
    })
    .then(function (user) {
      resolve(user[0] || user);
    })
    .catch(reject);
  });
}

exports.auth = function(email, password) {
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
        if (users && bcrypt.compareSync(password, users[0]['password'])) {
          resolve(users[0]);
        } else {
          reject(new Error('Email or username was incorrect'));
        }
      })
      .catch(reject);
  });
}



// Initialize the table
intialize();