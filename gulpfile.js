'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var jscsStylish = require('gulp-jscs-stylish');
var paths = require('./gulp.config.json');

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
