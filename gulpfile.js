'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var jsLibs = [
  './node_modules/scrollpos-styler/scrollPosStyler.js',
  './node_modules/jquery/dist/jquery.slim.min.js',
  './node_modules/tether/dist/js/tether.min.js',
  './node_modules/bootstrap/dist/js/bootstrap.min.js',
  './themes/syndesis/js/**/*.js'
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
    .pipe(gulp.dest('./themes/syndesis/static/css'));
});
gulp.task('css:watch', gulp.series('css', function () {
  gulp.watch('./themes/syndesis/scss/**/*.scss', gulp.series('css'));
}));

gulp.task('js', function () {
  return gulp.src(jsLibs)
    .pipe(plugins.concat('syndesis.js'))
    .pipe(gulp.dest('./themes/syndesis/static/js'));
});
gulp.task('js:watch', gulp.series('js', function () {
  gulp.watch(jsLibs, gulp.series('js'));
}));
gulp.task('fonts', function() {
  return gulp.src('./node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('./themes/syndesis/static/fonts'))
});
gulp.task('fonts:watch', gulp.series('fonts', function () {
  gulp.watch(['./node_modules/font-awesome/fonts/*'], gulp.series('fonts'));
}));

gulp.task('watch', gulp.parallel(gulp.series('fonts', 'fonts:watch'), gulp.series('css', 'css:watch'), gulp.series('js', 'js:watch')));

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

  var githubProject = process.env['CIRCLE_PROJECT_USERNAME'];
  var baseURLArg = '';
  if (githubProject && githubProject !== "syndesisio" && process.env['CIRCLE_PROJECT_REPONAME']) {
    baseURLArg = ' --baseURL https://' + githubProject + '.github.io/' + process.env['CIRCLE_PROJECT_REPONAME'] + '/';
  }

  exec('hugo' + baseURLArg, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('optimize-html', function() {
  return gulp.src(['./public/**/*.html'])
    .pipe(plugins.cacheBust({
      type: 'timestamp'
    }))
    .pipe(plugins.htmlmin({
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./public'));
});
gulp.task('optimize-css', function() {
  return gulp.src(['./public/**/*.css'])
    .pipe(plugins.uncss({
      html: ['./public/**/*.html'],
      ignore: [/^\.sps.*/, /.collapse.show$/, /^.collapsing$/, /.sidenav.active$/]
    }))
    .pipe(gulp.dest('./public'));
});
gulp.task('optimize-js', function() {
  return gulp.src(['./public/**/*.js'])
    .pipe(plugins.uglify())
    .pipe(gulp.dest('./public'));
});
gulp.task('optimize', gulp.series('optimize-html', 'optimize-css', 'optimize-js'));

gulp.task('serve', gulp.parallel('watch', 'hugo:serve'));
gulp.task('build', gulp.series('fonts', 'css', 'js', 'hugo', 'optimize'));
gulp.task('default', gulp.series('serve'));
