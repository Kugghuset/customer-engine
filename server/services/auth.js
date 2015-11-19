'use strict'

var User = require('../api/user/user.db');
var config = require('../config/config');
var compose = require('composable-middleware');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Middleware:
 * Checks whether the user is authenticated or not.
 */
exports.isAuthenticated = function (req, res, next) {
  return compose().use(function (req, res, next) {
    // Allow access_token to be passed through query parameters as well
    if (req.query && req.query.hasOwnProperty('acces_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token
    }
    
    return validateJwt(req, res, next);
  }).use(function (req, res, next) {
    // Find user
    return User.findById(req.user.id)
    .then(function (user) {
      // No user means request is unauthorized
      if (!user) { return res.status(401).send('Unauthorized'); }
      req.user = user;
      next();
    })
    .catch(next);
  });
};

/**'
 * Middleware:
 * Attaches the user to *req* if the token is valid.
 */
exports.bearsToken = function (req, res, next) {
  return compose().use(function (req, res, next) {
    if (req.query && req.query.hasOwnProperty('acces_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token
    }
    
    try {
      return validateJwt(req, res, next);
    } catch (error) {
      console.log('LOL OKEJ');
    }
  }).use(function (req, res, next) {
    // Find user
    return User.findById(req.user.id)
    .then(function (user) {
      req.user = user;
      next();
    })
    .catch(next);
  });
}

/**
 * Decodes the token.
 * 
 * @param {Object} req - express req object
 * @return {String} token
 */
exports.decodeToken = function (req) {
  var token = (req && req.headers) ? req.headers.authorization : req;
  return jwt.decode(token, config.secrets.session);
}

/**
 * Returns a jwt token signed by the app secret
 * 
 * @param {String} id
 * @return {Object} jwt token
 */
exports.signToken = function (id) {
  return jwt.sign({ id: id }, config.secrets.session);
};

/**
 * @param {Object} req - express req object
 * @param {Object} res - express res object
 */
exports.setTokenCookie = function (req, res) {
  if (!req.user) {
    return res.status(404).json({mesasge: 'Something went wrong, please try again.'});
  }
  
  var token = this.signToken(req.user.id);
  
  res.cookie('token', JSON.stringify(token));
}