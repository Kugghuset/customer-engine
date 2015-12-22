'use strict'

var p_json = require('./package.json');

var gulp = require('gulp');
var shell = require('shelljs');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var gexec = require('gulp-exec');
var livereload = require('gulp-livereload');
var chalk = require('chalk');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var fs = require('fs');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var _ = require('lodash');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate')
var uglify = require('gulp-uglify')

var utils = require('./server/utils/utils');


var node;

// The server task
gulp.task('server', function () {
  // Restarts node if it's running
  if (node) { node.kill(); }
  
  // Run the node command on the main (given in package.json) or app.js
  node = spawn('node', [(p_json.main || 'app.js')], { stdio: 'inherit' });
  
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
    .pipe(sourcemaps.init())
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(minifyCss({ compatibility: 'ie8' }))
    .pipe(rename(function (path) {
      path.basename += '.min';
      path.extname = '.css';
      return path;
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/css'))
    .on('unpipe', function (src) {
      
      // Reloads if livereload is running
      livereload.changed('./public/css/global.css');
    });
});

gulp.task('minify', function () {
  // Get the file contents of index.html
  
  
  var indexFile = fs.readFileSync(path.resolve('./public/index.html'), 'utf8');
  
  var filenames = [
    'vendor.min.css',
    'vendor.min.js',
    'app.min.js'
  ];
  
  // Iterate over the filenames to which the write should occur.
  _.forEach(filenames, function (filename) {
    
    // Itereate over the result of getModulesFromIndex
    var files = _.map(utils.getModulesFromIndex(indexFile, filename), function (item) {
      return ['./public/', item].join('');
    });
    
    indexFile = utils.removeModules(indexFile, filename);
    
    if (/\.js$/i.test(filename)) {
      gulp.src(files)
        .pipe(sourcemaps.init())
          .pipe(concat(filename))
          // .pipe(ngAnnotate())
          .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/dist'))
    } else if (/\.css/i.test(filename)) {
      gulp.src(files)
        .pipe(sourcemaps.init())
          .pipe(concat(filename))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/css'))
    }
    
  });
  
  console.log();
  
  // fs.writeFileSync('./dist/index.html', indexFile);
});

gulp.task('livereload-listen', function () {
  livereload.listen();
});

// Watches the server and public folders and does stuff
gulp.task('watch', function () {
  gulp.watch(['./server/**', './userConfig.js'], ['server']);
  gulp.watch(['./public/app/**', './public/index.html'], ['reload']);
  gulp.watch(['./public/style/**/*.scss', './public/app/**/*.scss'], ['sass']);
});

// Builds the application
gulp.task('build', ['sass', 'minify']);

gulp.task('default', ['livereload-listen', 'build', 'server', 'watch']);

process.on('exit', function () {
  if (node) { node.kill(); }
});