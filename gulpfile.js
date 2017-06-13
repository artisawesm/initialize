'use strict';

var gulp 			= require('gulp');
var browserSync 	= require('browser-sync').create();
var clean 			= require('gulp-clean');
var autoprefixer 	= require('gulp-autoprefixer');
var sourcemaps 		= require('gulp-sourcemaps');
var beautify 		= require('gulp-beautify');
var concat 			= require('gulp-concat');
var imagemin 		= require('gulp-imagemin');
var rename 			= require('gulp-rename');
var sass 			= require('gulp-sass');
var uglify 			= require('gulp-uglify');
var uglifycss 		= require('gulp-uglifycss');
var plumber 		= require('gulp-plumber');
var notify 			= require('gulp-notify');
var ftp 			= require('vinyl-ftp');

var srcPath = {
	// sources
	img: 'resources/assets/images/*.*',
	js: 'resources/assets/js/*.js',
	scss: 'resources/assets/scss/**/*.scss',
	libCss: 'resources/assets/vendor/css/*.css',
	libJs: 'resources/assets/vendor/js/*.js'
};

var appPath = {
	// app
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
var ftpHost = 'kestrel.ph'; //set your site's url
var ftpUser = 'user@kestrel.ph'; //ftp username access
var ftpPassword = 'Y3llowb3ll@'; //ftp password access
var ftpDestination = '/staging/insular2016/assets/'; //set the destination *you can add multiple destination if you want*
var ftpSource = 'app/sample.txt'; //assets that you will upload to the live site
gulp.task('ftp', function () {
	var conn = ftp.create( {
		host:     ftpHost, 
		user:     ftpUser,
		password: ftpPassword
	});
	return gulp.src(ftpSource)
		.pipe(conn.newer(ftpDestination))
		.pipe(conn.dest(ftpDestination));
});

// == UNMINIFIED ==
gulp.task('unminified',['scss-unminified', 'js-unminified']);
gulp.task('scss-unminified', function() {
    return gulp.src(srcPath.scss)
      	.pipe(sass({
      		outputStyle: 'expanded', 
      		errLogToConsole: true
      	}).on('error', notify.onError(function (error) {
      		return 'Error in SASS!: ' + error.message;
      	})))
      	.pipe(autoprefixer({
			browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
		}))
      	.pipe(rename('app.css'))
    	.pipe(gulp.dest(appPath.css))
    	.pipe(browserSync.stream())
});
gulp.task('js-unminified', function() {
	return gulp.src(srcPath.js)
		.pipe(rename('app.js'))
		.pipe(gulp.dest(appPath.js))
		.pipe(browserSync.stream())
    	.pipe(notify({
    		title: 'JS|CSS',
    		message: 'You\'ve successfully generated unminified JS and CSS files.',
    		onLast: true
    	}));
});

// == OPTIMIZE ==
gulp.task('optimize', function() {
	return gulp.src(srcPath.img)
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5
		}))
		.pipe(clean())
		.pipe(gulp.dest(appPath.img))
		.pipe(notify({
    		title: 'Images',
    		message: 'Images optimized!',
    		onLast: true
    	}));
});

// == COMPILE ==
gulp.task('compile', ['style', 'script']);
gulp.task('style',function(){
    return gulp.src(srcPath.libCss)
		.pipe(plumber())
	    .pipe(concat('lib.min.css'))
	    .pipe(uglifycss())
	    .pipe(gulp.dest(appPath.libCss));
});
gulp.task('script',function(){
    return gulp.src(srcPath.libJs)
		.pipe(plumber())
	    .pipe(concat('lib.min.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest(appPath.libJs))
	    .pipe(notify({
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
    	.pipe(sourcemaps.init())
      	.pipe(sass({
      		outputStyle: 'compressed', 
      		errLogToConsole: true
      	}).on('error', notify.onError(function (error) {
      		return 'Error in SASS!: ' + error.message;
      	})))
    	.pipe(autoprefixer({
			browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
		}))
    	.pipe(rename('app.min.css'))
    	.pipe(sourcemaps.write('.'))
    	.pipe(gulp.dest(appPath.css))
    	.pipe(browserSync.stream())
    	.pipe(notify({
    		title: 'CSS',
    		message: 'SCSS files compiled!',
    		onLast: true
    	}));
});

// == JS ==
// js minification
gulp.task('js', function() {
	return gulp.src(srcPath.js)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename('app.min.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(appPath.js))
		.pipe(browserSync.stream())
		.pipe(notify({
    		title: 'JS',
    		message: 'JS files compiled!',
    		onLast: true
    	}));
});

gulp.task('initialize', function() {
	browserSync.init({
		server: 'app/'
	});

    gulp.watch(srcPath.scss, ['scss']);
    gulp.watch(srcPath.js, ['js']);
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['initialize']);