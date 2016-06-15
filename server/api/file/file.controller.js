'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');

var utils = require('../../utils/utils');
var xlsx = require('../../services/xlsx');

/**
 * Returns all managed files.
 *
 * ROUTE: GET 'api/files/'
 *
 * @param {Object} req Express request object, not needed
 * @param {Object} res Express response object, not needed
 * @return {Object|Array} if res is defined then res.status(200).json(files), otherwise an array of the files.
 */
function get(req, res) {

  if (!fs.existsSync(xlsx.folders.processed)) {
    return !!res
      ? res.status(200).json([])
      : [];
  }

  // Filter out files only and return their base names.
  var files = _.chain(fs.readdirSync(xlsx.folders.processed))
    .filter(function (filename) {
      var lstat = fs.statSync(path.resolve(xlsx.folders.processed, filename))
      return !!lstat
        ? lstat.isFile()
        : false;
    })
    .map(function (filename) {
      return xlsx.getOriginalFilename(filename);
    })
    .value()

  // If there are no files, return either via res.status(...)
  // or an empty array.
  if (!files) {
    return !!res
      ? res.status(200).json([])
      : [];
  }

  return !!res
    ? res.status(200).json(files)
    : files;
}

/**
 * ROUTE: POST 'api/files/'
 */
function post(req, res) {

  var files = req.files;

  xlsx.setWatchIsDisabled(true);

  var _files = _.map(files, function (file) {
    // var filename = path.resolve(xlsx.folders.input, file.originalname.match(/\w|[^a-ö]/gi).join(''));
    var filename = path.resolve(xlsx.folders.input, file.originalname);
    fs.renameSync(file.path, filename);
    return filename
  });

  xlsx.manualConvert(_files)
  .then(function () {
    xlsx.setWatchIsDisabled(false);

    return res.status(200).json(get());
  })
  .catch(function (err) {
    utils.log(err);
    xlsx.setWatchIsDisabled(false);
    return utils.handleError(res, err);
  })


}

module.exports = {
  get: get,
  post: post
};
