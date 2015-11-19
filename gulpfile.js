'use strict'

var pjson = require('./package.json');

var gulp = require('gulp');
var shell = require('shelljs');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var livereload = require('gulp-livereload');
var node;

// The server task
gulp.task('server', function () {
  // Restarts node if it's running
  if (node) { node.kill(); }
  
  // Run the node command on the main (given in package.json) or app.js
  node = spawn('node', [(pjson.main || 'app.js')], { stdio: 'inherit' });
  
  // An error occured
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

// Reloads the page
gulp.task('reload', function () {
  livereload.reload();
});

// Watches the server and public folders and does stuff
gulp.task('watch', function () {
  gulp.watch('./server/**', ['server']);
  gulp.watch(['./public/app/**', './public/index.html'], ['reload']);
});

livereload.listen()
gulp.task('default', ['server', 'watch']);

process.on('exit', function () {
  if (node) { node.kill(); }
});