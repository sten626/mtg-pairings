'use strict';
var gulp = require('gulp');
var karma = require('karma').server;
var paths = require('./gulp.config.json');
var plug = require('gulp-load-plugins')();

var env = plug.util.env;
var log = plug.util.log;
var port = process.env.PORT || 7203;

gulp.task('lint', function() {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jscs', function() {
  return gulp.src(paths.js)
    .pipe(jscs())
    .pipe(jscsStylish());
});

gulp.task('test', function(done) {
  startTests(true, done);
});

//////////

/**
 * Start the tests.
 *
 * @param {Boolean}  singleRun True to run once, false to keep running.
 * @param {Function} done      Callback to call when done.
 */
function startTests(singleRun, done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    //exclude: excludeFiles,
    singleRun: !!singleRun
  }, function() {
    done();
  });
}
