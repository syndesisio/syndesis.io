'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('css', function () {
  return gulp.src('./themes/syndesis/scss/**/*.scss')
    .pipe(plugins.sass())
    .pipe(plugins.postcss())
    .pipe(gulp.dest('./themes/syndesis/static/css'));
});
gulp.task('css:watch', gulp.series('css', function () {
  gulp.watch('./themes/syndesis/scss/**/*.scss', gulp.series('css'));
}));

gulp.task('watch', gulp.parallel('css:watch'));

gulp.task('hugo:serve', function () {
  var exec = require('child_process').exec;

  exec('hugo serve', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});
gulp.task('hugo', function (cb) {
  var exec = require('child_process').exec;

  exec('hugo', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('serve', gulp.parallel('watch', 'hugo:serve'));
gulp.task('build', gulp.series('css', 'hugo'));
gulp.task('default', gulp.series('build', 'serve'))