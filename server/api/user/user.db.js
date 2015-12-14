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
    
    if (!_user.email) {
      return reject(new Error('Email is requried'));
    } else if (!_user.password) {
      reject(new Error('Password is required'));
    }
    
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
        },
        departmentId: {
          type: sql.BIGINT,
          val: _user.department ? _user.department.departmentId : _user.departmentId
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
        
        if (!users || !users.length) {
          // No users matching the email address.
          return resolve(undefined);
        } else if (!password && !first.password) {
          // No passwords at all - none input and none stored, so it's fine! (for now)
          return resolve(first);
        }
        
        if (first && bcrypt.compareSync(password, first.password)) {
          resolve(first);
        } else {
          // If there is no password, that's the problem, otherwise the actual pass is the issue.
          reject(password ? new Error('Incorrect password') : new Error('Password is required'));
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
          val: user.department ? user.department.departmentId : user.departmentId
        },
        userId: {
          type: sql.BIGINT,
          val: userId
        }
      }
    })
    .then(function (_users) {
      resolve(util.objectify(_.first(_users)));
    })
    .catch(reject);
  });
}

exports.updateLastLoggedIn = function (_user) {
  return new Promise(function (resolve, reject) {
    
    if (!_user) { return reject(new Error('No provided user')); }
    
    sql.execute({
      query: sql.fromFile('./sql/user.updateLastLoggedIn.sql'),
      params: {
        userId: {
          type: sql.BIGINT,
          val: _user.userId
        }
      }
    })
    .then(function (users) {
      // Really only returns one, but whatever.
      resolve(_.first(util.objectify(users)));
    })
    .catch(reject);
    
  });
}

// Initialize the table
intialize();