'use strict'

// Various gulp dependencies
var gulp = require('gulp');
var gexec = require('gulp-exec');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate')
var uglify = require('gulp-uglify')
var templateCache = require('gulp-angular-templatecache');
var open = require('gulp-open');

// Various dependencies
var shell = require('shelljs');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var sql = require('seriate');
var os = require('os');

// Set the browser for the current operating system.
var browser = os.platform() === 'linux' ? 'google-chrome' : (
  os.platform() === 'darwin' ? 'google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));

// package.json
var p_json = require('./package.json');

// Project files
var utils = require('./server/utils/utils');
var config = require('./server/config/config');

// Used for running the node instance
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
gulp.task('reload', ['build'], function () {
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

gulp.task('templates', function () {
  return gulp.src('./public/app/{routes,directives}/**/*.html')
    .pipe(templateCache({standalone: true}))
    .pipe(gulp.dest('./public/dist'));
})

gulp.task('minify', function (cb) {
  
  /**
   * TODO: BOWER CSS DEPS
   * 
   * CURRENTLY DOES NOT WORK AS EXPECTED DUE TO BOWER DEPENDENCIES
   * TRYING TO ACCESS FILES WHICH AREN'T LOCATED WHERE THEY SHOULD BE.
   * 
   */
  
  // Get the file contents of index.html
  var indexFile = fs.readFileSync(path.resolve('./public/app.html'), 'utf8');
  
  var filenames = [
    // 'vendor.min.css', // outcommented as there are issues with file paths in the css
    'vendor.min.js',
    'app.min.js'
  ];
  
  /**
   * Recursively iterates over items in *_files*
   * and calls *cb* when the iteration is finished.
   * 
   * @param {Array} _files
   * @param {Function} cb
   * @param {Array} finishedFiles - set recursively, do not set.
   */
  function _forEvery(_files, cb, finishedFiles) {
    
    if (!finishedFiles) { finishedFiles = []; }
    if (finishedFiles.length === _files.length || !_files) {
      // Call the callback
      if (cb) { cb(); }
      return;
    }
    
    var filename = _files[finishedFiles.length];
    finishedFiles.push(filename);
    
    // Itereate over the result of getModulesFromIndex
    var files = _.map(utils.getModulesFromIndex(indexFile, filename), function (item) {
      return ['./public/', item].join('');
    });
    
    if (/vendor\.min\.js/.test(filename)) {
      
      indexFile = utils.removeModules(indexFile, filename);
      
      gulp.src(files)
        .pipe(sourcemaps.init())
          .pipe(concat(filename))
          .pipe(ngAnnotate())
          // .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/dist'))
        .on('unpipe', function (src) {
          
          // Recursion!!
          return _forEvery(_files, cb, finishedFiles);
        });
      
    } else if (/\.js$/i.test(filename)) {
      
      indexFile = utils.removeModules(indexFile, filename);
      
      gulp.src(files)
        .pipe(sourcemaps.init())
          .pipe(concat(filename))
          .pipe(ngAnnotate())
          .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/dist'))
        .on('unpipe', function (src) {
          
          // Recursion!!
          return _forEvery(_files, cb, finishedFiles);
        });
      
    } else if (/\.css/i.test(filename)) {

      indexFile = utils.removeModules(indexFile, filename);
      // indexFile = utils.cacheBustFiles(indexFile, filename);
      
      gulp.src(files)
        .pipe(sourcemaps.init())
          .pipe(concat(filename))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/css'))
        .on('unpipe', function (src) {
        // indexFile = utils.cacheBustFiles(indexFile, _.map(files, function (file) {
        //     return file.replace('./public/', '');
        //   }));
          
          // Recursion!!
          return _forEvery(_files, cb, finishedFiles);
        });
    }
  }
  
  // Asynchronous foreach loop
  _forEvery(filenames, function () {
    fs.writeFileSync('./public/index.html', indexFile);
    if (cb) { cb(); }
  });

});

// Sets the DB up
gulp.task('db-setup', function (cb) {
  // Setup the database.
  sql.setDefaultConfig(config.db);
  
  // Require all API files
  
  var apiPath = path.resolve('./server/api');
  _.forEach(fs.readdirSync(apiPath), function (folderName) {
    
    if (!fs.statSync(path.resolve(apiPath, folderName)).isFile()) {
      
      var _module = path.resolve(apiPath, folderName)
        .replace(__dirname, '.')
        .replace(/[\/\\]/g, '/');
      
      _.attempt(function () { require(_module); /* required only for for the initialize functions to run. */ })
    }
  });
  if (cb) { cb(); }
})

gulp.task('livereload-listen', function () {
  livereload.listen();
});

// Watches the server and public folders and does stuff
gulp.task('watch', function () {
  gulp.watch(['./server/**', './userConfig.js'], ['server']);
  gulp.watch(['./public/app/**', './public/app.html'], ['build', 'reload']);
  gulp.watch(['./public/style/**/*.scss', './public/app/**/*.scss'], ['sass']);
});

// Cachebusts all files
gulp.task('cachebust', ['minify'], function () {
  
  var fileName = fs.existsSync(path.resolve('./public/index.html'))
    ? path.resolve('./public/index.html')
    : path.resolve('./public/app.html');
  
  var indexFile = fs.readFileSync(fileName, 'utf8');
  
  indexFile = utils.cacheBustFiles(
    indexFile,
    utils.getAllModuleNames(indexFile)
  );
  
  // Create the index file
  fs.writeFileSync('./public/index.html', indexFile);
});

gulp.task('open', ['build'], function () {
  gulp.src(__filename)
    .pipe(open({ uri: 'http://localhost:5000', app: browser }))
});

// Builds the application
gulp.task('build', ['sass', 'templates', 'minify', 'cachebust', 'db-setup']);

gulp.task('default', ['livereload-listen', 'build', 'server', 'watch', 'open']);

process.on('exit', function () {
  if (node) { node.kill(); }
});