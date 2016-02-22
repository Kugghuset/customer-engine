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
 * @param {Array} files
 */
function convertAllFiles(files) {
  return new Promise(function (resolve, reject) {
    
    if (!files) {
      
      var statObj = fs.existsSync(_baseFolder)
        ? fs.statSync(_baseFolder)
        : undefined;
      
      // Either the folder doesn't exist, or it's not a folder
      if (!statObj || statObj.isFile()) {
        return new Promise(function (resolve, reject) { resolve(); });
      }

      // Get all files in the folder
      files = _.chain(fs.readdirSync(_baseFolder))
        .map(function (file) { return file; })
        .filter(function (file) {
          
          //  Only .xls files are allowed
          if (!/\.xls$/i.test(file)) {
            return false;
          }
          
          // Try get the lstat object
          var lstat = fs.statSync(path.resolve(_baseFolder, file));
          
          // If lstat is defined, return whether it's a file or not, otherwise return false
          return !!lstat
            ? lstat.isFile()
            : false;
        })
        .value();
    }
    
    // Iterate and over and move all files.
    var tabFiles = _.map(files, function (file) {
      return xlsToTab(file);
    });
    
    NPS.bulkImport(_baseFolder, tabFiles, [])
    .then(function (res) {
      
      moveImported(tabFiles);
      
      if (tabFiles && tabFiles.length) {
        console.log('{length} NPS result files imported!'.replace('{length}', tabFiles.length));
      }
      
    })
    .catch(function (err) {
      console.log(err);
    });
    
  });
}

module.exports = {
  xlsToCsv: xlsToTab,
  convertAllFiles: convertAllFiles
}
