'use strict'

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');
var bcrypt = require('bcryptjs');

var util = require('../../utils/utils');

function intialize() {
  return sql.execute({
    query: sql.fromFile('./sql/user.initialize.sql')
  })
  .then(function (result) {
    console.log('User table all set up.');
  })
  .catch(function (err) {
    console.log('Couldn\'t set up User table.');
    console.error(err);
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
        userId: {
          type: sql.BIGINT,
          val: id
        }
      }
    })
    .then(function (users) {
      resolve(util.objectify(users[0]));
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
        resolve(util.objectify(users[0]));
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
        
        // Get first item and create objects by dot notation
        var first = util.objectify(_.first(users));
        
        if (!first) {
          // No users matching the email address.
          return resolve(undefined);
        } else if (!password && !first.password) {
          // No passwords at all - none input and none stored, so it's fine! (for now)
          return resolve(first);
        }
        
        if (first && bcrypt.compareSync(password, first.password)) {
          resolve(first);
        } else {
          reject(new Error('Email or username was incorrect'));
        }
      })
      .catch(reject);
  });
}

exports.update = function (user, userId) {
  return new Promise(function (resolve, reject) {
    
    // No user to update :(
    if (!user) { return reject(new Error('No data provided')); }
    
    if (!userId) { userId = user.userId; }
    
    sql.execute({
      query: [
        sql.fromFile('./sql/user.update.sql'),
        sql.fromFile('./sql/user.findById.sql')
      ].join(' '),
      params: {
        email: {
          type: sql.VARCHAR(256),
          val: user.email
        },
        name: {
          type: sql.VARCHAR(256),
          val: user.name
        },
        departmentId: {
          type: sql.BIGINT,
          val: user.departmentId
        },
        userId: {
          type: sql.BIGINT,
          val: user.userId
        }
      }
    })
    .then(function (_users) {
      return util.objectify(_.first(_users));
    })
    .catch(reject);
  });
}

// Initialize the table
intialize();