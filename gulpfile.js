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

gulp.task('js', function () {
  return gulp.src(['./node_modules/scrollpos-styler/scrollPosStyler.js'])
    .pipe(plugins.concat('syndesis.js'))
    .pipe(plugins.uglifyjs())
    .pipe(gulp.dest('./themes/syndesis/static/js'));
});
gulp.task('js:watch', gulp.series('js', function () {
  gulp.watch(['./node_modules/scrollpos-styler/scrollPosStyler.js'], gulp.series('js'));
}));

gulp.task('watch', gulp.parallel('css:watch', 'js:watch'));

gulp.task('hugo:serve', function (cb) {
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
gulp.task('build', gulp.series('css', 'js', 'hugo'));
gulp.task('default', gulp.series('build', 'serve'));