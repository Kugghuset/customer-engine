'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var sql = require('seriate');
var fs = require('fs');
var path = require('path');
var iconv = require('iconv-lite');
var chalk = require('chalk');
var os = require('os');

var util = require('./../../utils/utils');

var npsFilePath = path.resolve('./server/assets/nps/total_nps_score.csv');

var npsFolderpath = path.resolve('./server/assets/nps');

function bulkImport(files, readFiles) {

  // First time check
  if (!files) {

    var statObj = fs.existsSync(npsFolderpath)
      ? fs.statSync(npsFolderpath)
      : undefined;

    // The folder either doesn't exist, or it's not a folder
    // Early return if either is true
    if (!statObj || statObj.isFile()) { return; }

    // Get all files
    files = _.chain(fs.readdirSync(npsFolderpath))
      .filter(function (filename) {
        return fs.statSync(path.resolve(npsFolderpath, filename)).isFile();
      })
      .map(function (filename) { return path.resolve(npsFolderpath, filename); })
      .orderBy(function (filename) { return filename; })
      .value();

    readFiles = [];
  }


  // Return early if there are no files
  if (!files || !files.length) {
    return util.log('No NPS score files found, no bulk import.');
  }

  // We're all set here
  if (readFiles.length === files.length) {
    return util.log('Bulk import of NPS data finished.');
  }

  // The file to perform the bulk import on.
  var currentFile = files[readFiles.length];

  var isOld;

  var _file = fs.readFileSync(currentFile, 'utf8');
  if (_.isString(_file)) {
    // The old files are have four fields, thus three semicolons.
    isOld = _file.split('\r\n')[0].replace(/[^;]/gi, '').length === 3;
  } else {
    isOld = false;
  }

  var bulkFile = isOld
    ? './sql/nps.dep.bulkImport_old.sql'
    : './sql/nps.dep.bulkImport.sql';

  sql.execute({
    query: sql
      .fromFile(bulkFile)
      .replace('{ filepath }', currentFile)
  }).then(function () {
    // continue recursively
    return bulkImport(files, readFiles.concat([currentFile]));
  }).catch(function (err) {

    util.log(currentFile);
    util.log(err);

    // Assumme the file simply shouldn't be imported, continue recursively
    return bulkImport(files, readFiles.concat([currentFile]));
  });
}

module.exports = {
  bulkImport: bulkImport
}