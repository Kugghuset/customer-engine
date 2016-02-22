'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');
var moment = require('moment');
var XLSX = require('xlsx')
var path = require('path');
var os = require('os');
var fs = require('fs');

var NPS = require('../api/nps/nps.db');
var config = require('../config/config');

var _baseFolder = config.baseFolder || path.resolve('C:\\Users\\drklu\\Dropbox (Personal)\\base');
var _inputFolder = path.resolve(_baseFolder);
var _outputFolder = path.resolve(_baseFolder, 'output');
var _processedFolder = path.resolve(_baseFolder, 'imported');

/**
 * @param {String} _path
 * @param {Object} options
 */
function getOptions(_path, options) {
  return  _.assign({}, {
    delimiter: '\t',
    name: 'NPS_IMPORT_{timestamp} ({original})'
      .replace('{timestamp}', moment().format('YYYY-MM-DDTHHmm'))
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
 */
function writeProcessedFile(_data) {
  
  // Return early if the file doesn't exist.
  if (!_data) {
    console.log('Returning early as there is no file to read.');
    
    return false;
  }
  
  if (!fs.existsSync(_outputFolder)) {
    
    console.log('Creating folder: {path}'.replace('{path}', _outputFolder));
    
    fs.mkdirSync(_outputFolder);
  }
  
  // Write the created file
  fs.writeFileSync(_data.outputName, _data.output);
  console.log('Processed file is moved to {filename}'.replace('{filename}', _data.outputName));
  
  return true;
  
}

/**
 * @param {String} _path
 * @param {Object} options
 */
function moveProcessedFile(_path, options) {
  
  if (!fs.existsSync(_path)) {
    
    console.log('Returning early as there is no file at {path}.'.replace('{path}', _path));
    
    return false;
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
  
  return true;
  
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
  
  var _data = readXlsFile(_path,_options);
  
  // Write the file according to *_data*
  writeProcessedFile(_data);
  
  // Move the processed file.
  moveProcessedFile(_path, _options);
  
}

xlsToTab('realtime_dashboard.xls')

module.exports = {
  xlsToCsv: xlsToTab
}
