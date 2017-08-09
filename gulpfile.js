'use strict';

var gulp 		= require('gulp'),
	browserSync = require('browser-sync').create();
	
var $ = require('gulp-load-plugins')({
		camelize: true,
		pattern: [
			'gulp-*',
			'gulp.*',
			'main-bower-files'
		],
		replaceString: /\bgulp[\-.]/
	});

var srcPath = { // sources
	img: 'resources/assets/images/**/*.{jpg,png,svg,gif}',
	js: 'resources/assets/js/*.js',
	scss: 'resources/assets/scss/**/*.scss',
	libCss: 'resources/assets/vendor/css/*.css',
	libJs: 'resources/assets/vendor/js/*.js',
	fonts: './resources/assets/fonts/*.*'
};

var appPath = { // app destination
	css: 'app/assets/css/',
	fonts: 'app/assets/fonts/',
	img: 'app/assets/images',
	js: 'app/assets/js',
	libCss: 'app/assets/vendor/css/',
	libJs: 'app/assets/vendor/js/',
	html: 'app/*.html'
};

//==========================================================================
// EXTERNAL TASKS -> Optional tasks, tasks that doesn't need to be automated
//==========================================================================
// == FTP ==
//This task will transfer your local files to your live site via FTP
var ftpHost = ''; //set your site's url
var ftpUser = ''; //ftp username access
var ftpPassword = ''; //ftp password access
var ftpDestination = ''; //set the destination
gulp.task('ftp', function () {
	var conn = ftp.create( {
		host:     ftpHost, 
		user:     ftpUser,
		password: ftpPassword,
		parallel: 10
	});

	var files = [ //files to upload
		'app/assets/css/**',
		'app/assets/js/**',
		'app/*.html'
	];

	return gulp.src(files, { base: '.', buffer: false })
		.pipe(conn.newer(ftpDestination))
		.pipe(conn.dest(ftpDestination))
		.pipe(notify({
    		title: 'Deployment',
    		message: 'Files were successfully uploaded to FTP',
    		onLast: true
    	}));
});

// == UNMINIFIED ==
gulp.task('unminified',['scss-unminified', 'js-unminified']);
gulp.task('scss-unminified', function() {
    return gulp.src(srcPath.scss)
      	.pipe($.sass({
      		outputStyle: 'expanded', 
      		errLogToConsole: true
      	}).on('error', $.notify.onError(function (error) {
      		return 'Error in SASS!: ' + error.message;
      	})))
		.pipe($.autoprefixer({
			browsers: [
				'last 2 versions',
				'ie >= 10',
				'ie_mob >= 10',
				'ff >= 30',
				'chrome >= 34',
				'safari >= 7',
				'opera >= 23',
				'ios >= 7',
				'android >= 4.4',
				'bb >= 10'
			]
		}))
      	.pipe($.rename('app.css'))
    	.pipe(gulp.dest(appPath.css))
    	.pipe(browserSync.stream())
});
gulp.task('js-unminified', function() {
	return gulp.src(srcPath.js)
		.pipe($.rename('app.js'))
		.pipe(gulp.dest(appPath.js))
		.pipe(browserSync.stream())
    	.pipe($.notify({
    		title: 'JS|CSS',
    		message: 'You\'ve successfully generated unminified JS and CSS files.',
    		onLast: true
    	}));
});

// == OPTIMIZE ==
gulp.task('optimize', function() {
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
		.pipe($.clean())
		.pipe(gulp.dest(appPath.img))
		.pipe($.notify({
    		title: 'Images',
    		message: 'Images optimized!',
    		onLast: true
    	}));
});

// == COMPILE ==
gulp.task('compile', ['style', 'script']);
gulp.task('style',function(){
    return gulp.src(srcPath.libCss)
		.pipe($.plumber())
	    .pipe($.concat('lib.min.css'))
	    .pipe($.uglifycss())
	    .pipe(gulp.dest(appPath.libCss));
});
gulp.task('script',function(){
    return gulp.src(srcPath.libJs)
		.pipe($.plumber())
	    .pipe($.concat('lib.min.js'))
	    .pipe($.uglify())
	    .pipe(gulp.dest(appPath.libJs))
	    .pipe($.notify({
    		title: 'CSS|JS Libraries',
    		message: 'Vendor libraries compiled!',
    		onLast: true
    	}));
});
//==========================================================================
//==========================================================================

// == SCSS ==
// scss compiler/uglifier
gulp.task('scss', function() {
    return gulp.src(srcPath.scss)
    	.pipe($.sourcemaps.init())
      	.pipe($.sass({
      		outputStyle: 'compressed', 
      		errLogToConsole: true
      	}).on('error', $.notify.onError(function (error) {
      		return 'Error in SASS!: ' + error.message;
      	})))
    	.pipe($.autoprefixer({
			browsers: [
				'last 2 versions',
				'ie >= 10',
				'ie_mob >= 10',
				'ff >= 30',
				'chrome >= 34',
				'safari >= 7',
				'opera >= 23',
				'ios >= 7',
				'android >= 4.4',
				'bb >= 10'
			]
		}))
    	.pipe($.rename('app.min.css'))
    	.pipe($.sourcemaps.write('.'))
    	.pipe(gulp.dest(appPath.css))
    	.pipe(browserSync.stream())
    	.pipe($.notify({
    		title: 'CSS',
    		message: 'SCSS files compiled!',
    		onLast: true
    	}));
});

// == JS ==
// js minification
gulp.task('js', function() {
	return gulp.src(srcPath.js)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.uglify())
		.pipe($.rename('app.min.js'))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(appPath.js))
		.pipe(browserSync.stream())
		.pipe($.notify({
    		title: 'JS',
    		message: 'JS files compiled!',
    		onLast: true
    	}));
});

// == FONTS ==
// transfering fonts from source to app folder
gulp.task('fonts', function(){
	return gulp.src(srcPath.fonts)
		.pipe(gulp.dest(appPath.fonts));
});

gulp.task('initialize', function() {
	browserSync.init({
		server: 'app/'
	});

    gulp.watch(srcPath.scss, ['scss']);
	gulp.watch(srcPath.js, ['js']);
	gulp.watch(srcPath.fonts, ['fonts']);
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['initialize']);