'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var jsLibs = [
  './node_modules/scrollpos-styler/scrollPosStyler.js',
  './themes/syndesis/js/connectingDots.js'
];

function sriTransformer(tHash) {
  var res = {};
  for (var key in tHash){
    res[key.substr(key.lastIndexOf('/') + 1)] = tHash[key];
  }
  return res;
}

gulp.task('css', function () {
  return gulp.src('./themes/syndesis/scss/**/*.scss')
    .pipe(plugins.sass())
    .pipe(plugins.postcss())
    .pipe(gulp.dest('./themes/syndesis/static/css'))
    .pipe(plugins.sri({fileName: 'css.json', algorithms: ['sha384'], transform: sriTransformer}))
    .pipe(gulp.dest('./data/sri/'));
});
gulp.task('css:watch', gulp.series('css', function () {
  gulp.watch('./themes/syndesis/scss/**/*.scss', gulp.series('css'));
}));

gulp.task('js', function () {
  return gulp.src(jsLibs)
    .pipe(plugins.concat('syndesis.js'))
    .pipe(plugins.uglifyjs())
    .pipe(gulp.dest('./themes/syndesis/static/js'))
    .pipe(plugins.sri({fileName: 'js.json', algorithms: ['sha384'], transform: sriTransformer}))
    .pipe(gulp.dest('./data/sri/'));
});
gulp.task('js:watch', gulp.series('js', function () {
    gulp.watch(jsLibs, gulp.series('js'));
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

gulp.task('optimize', function() {
  return gulp.src(['./public/**/*.html'])
    .pipe(plugins.cacheBust())
    .pipe(gulp.dest('./public'));
});

gulp.task('serve', gulp.parallel('watch', 'hugo:serve'));
gulp.task('build', gulp.series('css', 'js', 'hugo', 'optimize'));
gulp.task('default', gulp.series('build', 'serve'));
