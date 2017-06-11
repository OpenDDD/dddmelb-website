var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var path = require('path');

gulp.task("less", function () {
  console.log('Rebuilding Styles');
  return gulp.src('src/less/screen.less')
    .pipe(less())
    .pipe(concat('screen.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('static/css'));
});

gulp.task("js", function () {
  console.log('Rebuilding JS');
  return gulp.src('src/js/**/*.js')
    .pipe(uglify({ie8: true}))
    .pipe(concat('site.js'))
    .pipe(gulp.dest('static/js'));
});

gulp.task("watch", ["less", "js"], function () {
  gulp.watch("src/less/**/*.less", ["less"]);
  gulp.watch("src/js/**/*.js", ["js"]);
});

gulp.task("build", ["less", "js"]);
