var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');

gulp.task("less", function () {
  console.log('Rebuilding styles');

  return gulp.src('src/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('static/css'));
});

gulp.task("watch", ["less"], function () {
  gulp.watch("src/less/**/*.less", ["less"]);
});
