'use strict';

let gulp          = require('gulp'),
    browserSync   = require('browser-sync').create(),
    webpack       = require('webpack'),
    webpackStream = require('webpack-stream'),
    webpackConfig = require('./webpack.config.js');
    gcmq          = require('gulp-group-css-media-queries');
	
let $ = require('gulp-load-plugins')({
		camelize: true,
		pattern: [
			'gulp-*',
			'gulp.*'
		],
		replaceString: /\bgulp[\-.]/
	});

const srcPath = { // sources
	scss: 'resources/assets/scss/**/*.scss',
	js: 'resources/assets/js/*.js',
	// vendorCss: 'resources/assets/vendor/css/*.css',
	// vendorJs: 'resources/assets/vendor/js/*.js',
	img: 'resources/assets/images/**/*.{jpg,png,svg,gif}'
};

const appPath = { // app destination
	css: 'app/assets/css/',
	img: 'app/assets/images',
	js: 'app/assets/js',
	libCss: 'app/assets/vendor/css/',
	libJs: 'app/assets/vendor/js/',
	html: 'app/*.html',
	php: 'app/*.php'
};

// For development with XAMPP
const curDir = 'localhost/'+__dirname.split('\\').pop('\\');

// Autoprefixer browsers
const compBrowsers = [
  'last 5 version',
  'ie >= 11'
];

const projName = '';

//==========================================================================
// EXTERNAL TASKS -> Tasks that doesn't need to be automated
//==========================================================================

// == TEST ==
gulp.task('test', ()=> {
  console.log('Put your test task here');
});

// == PROD ==
gulp.task('scss-prod', ()=> {
  return gulp.src(srcPath.scss)
  .pipe($.sass({
    outputStyle: 'compressed', 
    errLogToConsole: true
  }).on('error', $.notify.onError(function (error) {
    return 'Oops: Error in Production!: ' + error.message;
  })))
  .pipe($.autoprefixer({
    browsers: compBrowsers
  }))
  .pipe($.rename('app.min.css'))
  .pipe(gulp.dest(appPath.css))
  .pipe(browserSync.stream());
});
gulp.task('js-prod', ()=> {
	return gulp.src(srcPath.js)
  .pipe($.plumber())
  .pipe($.sourcemaps.init())
  .pipe(webpackStream(webpackConfig), webpack)
  .pipe($.uglify())
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest(appPath.js))
  .pipe(browserSync.stream())
  .pipe($.notify({
    title: "JS | CSS Minification",
    message: "JS and CSS is ready for production.",
    onLast: true
  }));
});
gulp.task("production", ["scss-prod", "js-prod"]);

// == OPTIMIZE ==
// Optmization of images
gulp.task('optimize', ()=> {
	return gulp.src(srcPath.img)
  .pipe($.imagemin([
    $.imagemin.gifsicle({
      interlaced: true
    }),
    $.imagemin.jpegtran({
      progressive: true,
      quality: 80
    }),
    $.imagemin.optipng({
      optimizationLevel: 7
    }),
    $.imagemin.svgo({
      plugins: [{
        removeViewBox: true,
        removeEmptyAttrs: true,
        removeMetadata: true,
        removeUselessStrokeAndFill: true
      }]
    })
  ]))
  .pipe(gulp.dest(appPath.img))
  .pipe($.notify({
    title: 'Image Optimization',
    message: 'Images optimized!',
    onLast: true
  }))
  .pipe($.clean());
});
//==========================================================================
//==========================================================================

//==========================================================================
// AUTOMATED TASKS 
//==========================================================================
// == GROUP ==
gulp.task('group', () => {
  gulp.src(appPath.css + '*.css')
    .pipe(gcmq())
    .pipe(gulp.dest(appPath.css));
});

// == SCSS ==
// scss compiler - Unminified by default
gulp.task('scss', ()=> {
  return gulp.src(srcPath.scss)
  .pipe($.sourcemaps.init())
  .pipe($.sass({
    outputStyle: 'expanded', 
    errLogToConsole: true
  }).on('error', $.notify.onError(function (error) {
    return 'Oops: Error in SASS!: ' + error.message;
  })))
  .pipe($.autoprefixer({
    browsers: compBrowsers
  }))
  .pipe($.rename('app.min.css'))
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest(appPath.css))
  .pipe(browserSync.stream())
  .pipe($.notify({
    title: 'SCSS',
    message: 'SCSS compiled!',
    onLast: true
  }));
});

// == JS ==
// JS generation with webpack - Unminified by default
gulp.task('js', ()=> {
	return gulp.src(srcPath.js)
  .pipe($.plumber())
  .pipe($.sourcemaps.init())
  .pipe(webpackStream(webpackConfig), webpack)
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest(appPath.js))
  .pipe(browserSync.stream())
  .pipe($.notify({
    title: 'JS',
    message: 'JS compiled!',
    onLast: true
  }));
});

// For development with server (XAMPP/PHP)
gulp.task("serve", ()=> {
	browserSync.init({
		proxy: curDir+'/app/'
	});
	gulp.watch(srcPath.scss, ["scss"]); //Unminified by default
	gulp.watch(srcPath.js, ["js"]); //Unminified by default
	gulp.watch('./'+appPath.php).on("change", browserSync.reload);
});

gulp.task("serve", () => {
  browserSync.init({
    proxy: 'localhost/' + projName
  });
  gulp.watch(appPath.css + '*.css', ['group']); //Media Queries Grouping
  gulp.watch(srcPath.scss, ["scss"]); //Unminified by default
  gulp.watch(srcPath.js, ["js"]); //Unminified by default
  gulp.watch('*.php').on("change", browserSync.reload);
});

// For static HTML front end development (HTML)
gulp.task('initialize', ()=> {
	browserSync.init({
		server: {
			baseDir: './app',
		},
  });
  gulp.watch(appPath.css + '*.css', ['group']); //Media Queries Grouping
  gulp.watch(srcPath.scss, ['scss']); //Unminified by default
	gulp.watch(srcPath.js, ['js']); //Unminified by default
  gulp.watch('app/*.html').on('change', browserSync.reload);
});

// For development
gulp.task('development', ['initialize']);
