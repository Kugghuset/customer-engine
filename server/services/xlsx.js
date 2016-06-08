'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');
var moment = require('moment');
var XLSX = require('xlsx')
var iconv = require('iconv-lite');
var path = require('path');
var os = require('os');
var fs = require('fs');

var NPS = require('../api/nps/nps.db');
var config = require('../config/config');

var _baseFolder = config.baseFolder || path.resolve('C:\\Users\\drklu\\Dropbox (Personal)\\base');
var _inputFolder = path.resolve(_baseFolder);
var _outputFolder = path.resolve(_baseFolder, 'output');
var _finishedFolder = path.resolve(_baseFolder, 'imported_processed');
var _processedFolder = path.resolve(_baseFolder, 'imported_originals');

var tempDisableWatch = false;

/**
 * @param {String} _path
 * @param {Object} options
 */
function getOptions(_path, options) {
  return  _.assign({}, {
    delimiter: '\t',
    name: 'NPS_IMPORT_{timestamp} ({original})'
      .replace('{timestamp}', moment().format('YYYY-MM-DD_HHmm'))
      .replace('{original}', path.basename(_path, path.extname(_path))),
    ext: '.txt'
  }, options);
}

/**
 * @param {String} _path
 * @param {Object} options
 */
function readXlsFile(_path, options) {

  // Check if the file exists. and return early if it doesn't.
  if (!fs.existsSync(_path)) {

    console.log('No workbook at {filepath} found.'.replace('{filepath}', _path));

    return undefined;
  }

  // Assign *_options* to the base info, and possibly the *options* parameter.

  var _options = getOptions(_path, options);

  // Try assign the workbook to the file at *_path*
  var _workbook = _.attempt(function () { return XLSX.readFile(_path); });

  // workbook will be an error if the file wasn't found.
  if (_.isError(_workbook)) {

    console.log('No workbook at {filepath} found.'.replace('{filepath}', _path));

    // Return early
    return;
  }

  // Get the name of the work sheet
  var sheetName = _workbook.SheetNames[0];

  // Convert the .xls file to string
  var _output = XLSX.utils.sheet_to_csv(_workbook.Sheets[sheetName], { FS: _options.delimiter, RS: '\r\n' });

  // Create the output name
  var _outputName = path.resolve(_outputFolder, _options.name + _options.ext);

  return {
    output: _output,
    outputName: _outputName
  }
}

/**
 * Writes the processed file.
 *
 * @param {String} _path
 * @param {Object} _data
 * @return {String} The name of the written file
 */
function writeProcessedFile(_data) {

  // Return early if the file doesn't exist.
  if (!_data) {
    console.log('Returning early as there is no file to read.');

    return;
  }

  if (!fs.existsSync(_outputFolder)) {

    console.log('Creating folder: {path}'.replace('{path}', _outputFolder));

    fs.mkdirSync(_outputFolder);
  }

  // Encode to iso-8859-1 as SQL Server cannot handle UTF8
  var encodedData = iconv.encode(_data.output, 'iso-8859-1');
  // Write the created file
  fs.writeFileSync(_data.outputName, encodedData);
  console.log('Processed file is moved to {filename}'.replace('{filename}', _data.outputName));

  return _data.outputName;

}

/**
 * @param {String} _path
 * @param {Object} options
 * @return {String}
 */
function moveProcessedFile(_path, options) {

  if (!fs.existsSync(_path)) {

    console.log('Returning early as there is no file at {path}.'.replace('{path}', _path));

    return;
  }

  // Create the folder if it doesn't exist
  if (!fs.existsSync(_processedFolder)) {

    console.log('Creating folder: {path}'.replace('{path}', _processedFolder));

    fs.mkdirSync(_processedFolder);
  }

  // Assign *_options* to the base info, and possibly the *options* parameter.
  var _options = getOptions(_path, options);

  // Move the read file to the _processedFolder.
  var _processedName = path.resolve(_processedFolder, _options.name + path.extname(_path));
  fs.renameSync(_path, _processedName);
  console.log('{filename} saved!'.replace('{filename}', _processedName));

  return _processedName;

}

/**
 * Reads the file in *_inputFolder*, converts it to a tab separated file format,
 * and moves the processed file to *_processedFolder*.
 *
 * @param {String} filename Name of file to convert
 * @param {Object} options Not required
 */
function xlsToTab(filename, options) {

  // Ensure *_path* works.
  var _path = path.resolve(_inputFolder, filename);

  // Assign *_options* to the base info, and possibly the *options* parameter.
  var _options = getOptions(_path, options);

  // Get the data and path from the file.
  var _data = readXlsFile(_path,_options);

  // Write the file according to *_data*
  var processedFile = writeProcessedFile(_data);

  // Move the files
  moveProcessedFile(_path, options);

  return processedFile;

}

/**
 * @param {Array} files Array of filenames
 * @return {Array} The new file names
 */
function moveImported(files) {

  // If there are no files to move, do nothing.
  if (!files) { return; }


  // Create the folder if it doesn't exist
  if (!fs.existsSync(_finishedFolder)) {

    console.log('Creating folder: {path}'.replace('{path}', _finishedFolder));

    fs.mkdirSync(_finishedFolder);
  }

  // Return the filenames of the folder
  return _.map(files, function (originalFile) {

    // Join the filename and the path of _finishedFolder together
    var outputFilename = path.resolve(_finishedFolder, path.basename(originalFile));

    fs.renameSync(originalFile, outputFilename);

    console.log(
      'Sucessfully moved {original} to {output}'
      .replace('{original}', originalFile)
      .replace('{output}', outputFilename)
    );

    return outputFilename;
  });

}

/**
 * Returns an array of all files in the folder.
 *
 * @param {String} folder Name of the folder
 * @return {Array}
 */
function getFilesIn(folder) {

  var statObj = fs.existsSync(folder)
      ? fs.statSync(folder)
      : undefined;

    // Either the folder doesn't exist, or it's not a folder
    if (!statObj || statObj.isFile()) {
      return undefined;
    }

    // Get all files in the folder
    return _.chain(fs.readdirSync(folder))
      .map(function (file) { return file; })
      .filter(function (file) {

        //  Only .xls files are allowed
        if (!/\.xls(x)?$/i.test(file)) {
          return false;
        }

        // Try get the lstat object
        var lstat = _.attempt(function () { return fs.statSync(path.resolve(folder, file)); });

        // Catch potential errors
        if (_.isError(lstat)) {
          return;
        }

        // If lstat is defined, return whether it's a file or not, otherwise return false
        return !!lstat
          ? lstat.isFile()
          : false;
      })
      .value();
}

/**
 * @param {Array} files
 */
function convertAllFiles(files) {
  return new Promise(function (resolve, reject) {

    if (!files) {

      files = getFilesIn(_baseFolder)

      if (!files) {
        return new Promise(function (resolve, reject) { resolve(); });
      }

    }

    // Iterate and over and move all files.
    var tabFiles = _.map(files, function (file) {
      return xlsToTab(file);
    });

    NPS.bulkImport(_outputFolder, tabFiles, [])
    .then(function (res) {

      moveImported(tabFiles);

      if (tabFiles && tabFiles.length) {
        console.log('{length} NPS result files imported!'.replace('{length}', tabFiles.length));
      }

      return resolve();

    })
    .catch(function (err) {
      console.log(err);
      return reject(err);
    });

  });
}

/**
 * @param {String|Array} files Either the foldername or the array of filenames
 * @return {Promise}
 */
function manualConvert(files) {

  return new Promise(function (resolve, reject) {

    var _files;

    // It's probably a folder name
    if (_.isString(files)) {
      _files = getFilesIn(files);
    } else if (_.isArray(files)) {
      _files = files;
    }

    // No files
    if (!_files) {
      return resolve()
    }

    convertAllFiles(_files)
    .then(resolve)
    .catch(reject);

  });
}

// Used in poolChanges(...)
var filePool = {};

/**
 * Wait's for *ms* ms, and then, if nothing has changed, runs convertAllFiles(...).
 *
 * @param {String} folder
 * @param {Number} ms Defaults to 500
 */
function poolChanges(folder, ms) {

  var changed = { path: folder };

  ms = (!_.isUndefined(ms))
    ? ms
    : 500;

  filePool[folder] = changed;

  setTimeout(function () {

    if (!filePool[folder]) {
     // Something might've gone wrong.
      return poolChanges(folder);
    }

    if (filePool[folder] === changed) {

      console.log(
        'Running convertAllFiles(...) at {time}'
        .replace('{time}', moment().format('YYYY-MM-DD HH:mm'))
      );

      convertAllFiles();

    }
  }, ms);

}

/**
 * Watches a folder, and when changed, runs poolChanges(...)
 *
 * @param {String} folder The folder to watch, defaults to *_baseFolder*
 */
function watchFolder(folder) {

  folder = !_.isUndefined(folder)
    ? folder
    : _baseFolder;

  if (!folder || !fs.existsSync(folder)) {
    console.log(
      chalk.red(
        'Could not start filer watcher for {folder} as it does not exist.'
          .replace('{folder}', folder)
      )
    );
    return;
  }

  console.log(
    chalk.green(
      'Watching folder {folder} for changes.'
        .replace('{folder}', folder)
    )
  );

  fs.watch(folder, function (event, filename) {

    if (tempDisableWatch);

    // Return if the filename is falsy
    if (!filename) { return; }

    // Get an lstat object to check whether it actually was a file
    var lstat = _.attempt(function () { return fs.statSync(path.resolve(folder, filename)); })

    // Something went wrong when watchin, return early
    if (_.isError(lstat)) {
      return;
    }

    // If it's a file, run pool changes
    if (lstat && lstat.isFile()) {
      poolChanges(folder);
    }
  });

}

/**
 * Returns the name of the original file
 *
 * @param {String} filename The now modified file
 * @return {String}
 */
function getOriginalFilename(filename) {

  // Try get the original filename
  var original = _.attempt(function () { return filename.match(/ \((.+)\)\.[a-z]+$/i)[1] + path.extname(filename); });

  return (!!original && !_.isError(original))
    ? original
    : filename;

}

/**
 * Sets tempDisableWatch to *isDisabled*.
 *
 * @param {Boolean} isDisabled
 */
function setWatchIsDisabled(isDisabled) {
  tempDisableWatch = isDisabled;
  console.log(
    isDisabled
      ? 'Watcher temporarily disabled'
      : 'Watcher running again.'
  );
}

module.exports = {
  xlsToCsv: xlsToTab,
  convertAllFiles: convertAllFiles,
  watchFolder: watchFolder,
  getOriginalFilename: getOriginalFilename,
  getFilesIn: getFilesIn,
  manualConvert: manualConvert,
  setWatchIsDisabled: setWatchIsDisabled,
  folders: {
    /** The base folder. */
    base: _baseFolder,
    /** The folder being watched for changes, same as .base. */
    input: _inputFolder,
    /** The folder from which files which are just to be imported. */
    output: _outputFolder,
    /** The folder from which files have been imported. */
    finished: _finishedFolder,
    /** The folder with the original files.*/
    processed: _processedFolder
  }
}
