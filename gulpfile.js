const { src, dest, series, parallel, watch } = require('gulp');
const plugins = require('gulp-load-plugins')();

const jsLibs = [
  './node_modules/scrollpos-styler/scrollPosStyler.js',
  './node_modules/jquery/dist/jquery.slim.min.js',
  './node_modules/tether/dist/js/tether.min.js',
  './node_modules/bootstrap/dist/js/bootstrap.min.js',
  './node_modules/anchor-js/anchor.js',
  './themes/syndesis/js/**/*.js'
];

const port = 7000;

function css() {
  return src('./themes/syndesis/scss/**/*.scss')
    .pipe(plugins.sass())
    .pipe(plugins.postcss())
    .pipe(dest('./themes/syndesis/static/css'));
}

function js() {
  return src(jsLibs)
    .pipe(plugins.concat('syndesis.js'))
    .pipe(dest('./themes/syndesis/static/js'));
}

function fonts() {
  return src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(dest('./themes/syndesis/static/fonts'));
}

function hugo(cb) {
  const exec = require('child_process').exec;

  const githubProject = process.env['CIRCLE_PROJECT_USERNAME'];
  let baseURLArg = '';
  if (githubProject && githubProject !== "syndesisio" && process.env['CIRCLE_PROJECT_REPONAME']) {
    baseURLArg = ' --baseURL https://' + githubProject + '.github.io/' + process.env['CIRCLE_PROJECT_REPONAME'] + '/';
  }

  exec('hugo' + baseURLArg, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

function hugo_serve(cb) {
  const exec = require('child_process').exec;

  console.log('\n' +
    '     _______.____    ____ .__   __.  _______   _______     _______. __       _______.\n' +
    '    /       |\\   \\  /   / |  \\ |  | |       \\ |   ____|   /       ||  |     /       |\n' +
    '   |   (----` \\   \\/   /  |   \\|  | |  .--.  ||  |__     |   (----`|  |    |   (----`\n' +
    '    \\   \\      \\_    _/   |  . `  | |  |  |  ||   __|     \\   \\    |  |     \\   \\    \n' +
    '.----)   |       |  |     |  |\\   | |  \'--\'  ||  |____.----)   |   |  | .----)   |   \n' +
    '|_______/        |__|     |__| \\__| |_______/ |_______|_______/    |__| |_______/    \n' +
    '                                                                                     \n' +
    '');

  console.log('SYNDESIS is now running on port ' + port);
  exec('hugo serve --port ' + port + ' --bind 0.0.0.0', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

function optimize_css() {
  return src(['./public/**/*.css'])
    .pipe(plugins.uncss({
      html: ['./public/**/*.html'],
      ignore: [/^\.sps.*/, /\.collapse\.show$/, /\.collapsing$/, '.sidenav.active', '.anchorjs-icon']
    }))
    .pipe(dest('./public'));
}

function optimize_html() {
  return src(['./public/**/*.html'])
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
    .pipe(dest('./public'));
}

function optimize_js() {
  return src(['./public/**/*.js'])
    .pipe(plugins.uglify())
    .pipe(dest('./public'));
}

const optimize = series(optimize_html, optimize_css, optimize_js);

function live() {
  console.log('Watching for changes...');

  watch('./themes/syndesis/scss/**/*.scss', css),
  watch(jsLibs, js)
  watch('asciidoc-processor.js', manual_render)
}

function manual_export(cb) {
  const svn  = require('node-svn-ultimate');
  return svn.commands.export('https://github.com/syndesisio/syndesis/trunk/doc', 'build/documentation', {
    quiet: true,
    force: true
  }, cb)
}

function manual_render(cb) {
  const Asciidoctor = require('asciidoctor.js');
  const asciidoctor = Asciidoctor();

  const logger = asciidoctor.MemoryLogger.$new();
  asciidoctor.LoggerManager.setLogger(logger);

  const registry = asciidoctor.Extensions.create();
  require('./asciidoc-processor.js')(registry);
  delete require.cache[require.resolve('./asciidoc-processor.js')];

  const sections = ['tutorials', 'integrating-applications', 'connecting', 'developing_extensions', 'managing_environments'];

  for (const section of sections) {
    asciidoctor.convertFile(`build/documentation/${section}/master.adoc`, {
      'doctype': 'book',
      'safe': 'safe',
      'mkdirs': true,
      'to_file': `documentation/manual/${section}/index.html`,
      'attributes': {
        'linkcss': true,
        'stylesheet': '/css/syndesis.css'
      },
      'extension_registry': registry
    });

    const messages = logger.getMessages();
    const hasErrors = messages.find(m => m.severity === 'ERROR');

    if (hasErrors) {
      const text = messages
        .map(m => `${m.severity}: ${m.message['text']}`)
        .join('\n');
      cb(new Error(text));
    }
    src(`build/documentation/${section}/images/**/*.png`, {
      base: `build/documentation/${section}`
    }).pipe(dest(`documentation/manual/${section}`));
  }
  src('build/documentation/images/**/*.png').pipe(dest('documentation/manual'));

  cb();
}

const manual = series(manual_export, manual_render);
const serve = parallel(live, hugo_serve);
exports.build = series(parallel(manual, fonts, css, js), hugo, optimize);
exports.default = series(parallel(manual, js, css), parallel(hugo_serve, live));
