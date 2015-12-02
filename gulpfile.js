'use strict'

var pjson = require('./package.json');

var gulp = require('gulp');
var shell = require('shelljs');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var gexec = require('gulp-exec');
var livereload = require('gulp-livereload');
var chalk = require('chalk');
var sass = require('gulp-sass');
var Promise = require('bluebird');

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

// Runs --assume-unchagned on userConfig.js 
gulp.task('assume-unchanged', function () {
  if (shell.which('git')) {
    console.log(
      'Running ' +
      chalk.inverse('git update-index --assume-unchanged userConfig.js')
    );
    shell.exit('git update-index --assume-unchanged userConfig.js', function (code) { });
  } else {
    gulp.log('Git does not seems to be a command.');
  }
});

// Runs compiles the sass
gulp.task('sass', function () {
  gulp.src('./public/style/global.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
    .on('unpipe', function (src) {
      livereload.changed('./public/css/global.css');
    })
    
    
});

// Watches the server and public folders and does stuff
gulp.task('watch', function () {
  gulp.watch('./server/**', ['server']);
  gulp.watch(['./public/app/**', './public/index.html'], ['reload']);
  gulp.watch(['./public/style/**/*.scss', './public/app/**/*.scss'], ['sass']);
});

livereload.listen()
gulp.task('default', ['sass', 'server', 'watch']);

process.on('exit', function () {
  if (node) { node.kill(); }
});