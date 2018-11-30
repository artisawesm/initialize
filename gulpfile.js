const { gulp, series, parallel, watch, src, dest } = require('gulp'),
  chalk = require('chalk'),
  log = require('fancy-log'),
  group = require('gulp-group-css-media-queries'),
  clean = require('gulp-clean-css'),
  webpack = require('webpack'),
  wpstream = require('webpack-stream'),
  wpconfig = require('./webpack.config.js'),
  browserSync = require('browser-sync').create();

// ===========
// gulp load
const $ = require('gulp-load-plugins')({
  camelize: true,
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/,
});

// sass config
$.sass.compiler = require('node-sass');

// autoprefix config
const browsers = ['last 2 version', 'ie >= 11', 'safari >= 9.1'];

// default messages
const msg = {
  wait:
    chalk.bgGreen.black('\n\n Wait ') +
    chalk.bold.green(' Almost there...\n\n'),
  error:
    chalk.bgRed.black('\n\n OOPS! ') +
    chalk.bold.red(" I don't feel so good...\n\n"),
  success:
    chalk.bgCyan.black('\n\n SUCCESS! ') +
    chalk.bold.cyan(' Initializr build complete!\n\n'),
  js:
    chalk.bgYellow.black('\n\n SCRIPT ') +
    chalk.yellow(' JS Build successfully! \n\n'),
  css:
    chalk.bgMagenta.black('\n\n STYLE ') +
    chalk.magenta(' CSS Compiled successfully! \n\n'),
};

// default paths
const path = {
  src: {
    css: 'src/sass/**/*.scss',
    js: 'src/js/**/*',
  },
  dist: {
    css: 'dist/assets/css/',
    js: 'dist/assets/js/',
  },
};

// browsersync config
const config = {
  server: {
    baseDir: 'dist',
  },
  online: true,
  tunnel: true,
};
// ===========

// development
function ES() {
  return src(path.src.js)
    .pipe($.plumber())
    .pipe(
      wpstream(wpconfig),
      webpack,
    )
    .pipe(dest(path.dist.js))
    .pipe(browserSync.stream())
    .on('end', () => {
      log(msg.js);
    });
}

function SCSS() {
  return src(path.src.css)
    .pipe($.sourcemaps.init({ loadMaps: true, largeFile: true }))
    .pipe($.plumber())
    .pipe(
      $.sass
        .sync({ outputStyle: 'expanded', errLogToConsole: true })
        .on('error', function(error) {
          log(msg.error + error.message);
        }),
    )
    .pipe($.autoprefixer({ browsers: browsers }))
    .pipe($.rename({ basename: 'app', suffix: '.min' }))
    .pipe(group())
    .pipe($.sourcemaps.write('./'))
    .pipe(dest(path.dist.css))
    .pipe(browserSync.stream())
    .on('end', () => {
      log(msg.css);
    });
}

// production
function ESPROD() {
  return src(path.dist.js + '*.js')
    .pipe($.uglify())
    .pipe(dest(path.dist.js))
    .pipe(browserSync.stream())
    .on('end', () => {
      log(msg.js);
    });
}

function SCSSPROD() {
  return src(path.dist.css + '*.css')
    .pipe(clean())
    .pipe(dest(path.dist.css))
    .pipe(browserSync.stream())
    .on('end', () => {
      log(msg.css);
    });
}

// run initializr
function INI() {
  browserSync.init(config);
  watch('dist/*.html').on('change', browserSync.reload);
  watch(path.src.css, SCSS);
  watch(path.src.js, ES);
}

// tasks exports
INI.description = 'Run initializr in Development mode';
exports.ini = INI;

const PROD = parallel(ESPROD, SCSSPROD);
PROD.description = 'Run initializr in Production mode';
exports.prod = PROD;
