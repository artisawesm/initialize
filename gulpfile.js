'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var beautify = require('gulp-beautify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var inject = require('gulp-inject');

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
	html: 'app/index.html'
};

// var bower = {
// 	jquery: './bower_components/jquery/dist/jquery.min.js',
// 	bootstrap: './bower_components/bootstrap/dist/css/bootstrap.min.css',
// 	bootstrapJs: './bower_components/bootstrap/dist/js/bootstrap.min.js',
// 	bootstrapFonts: './bower_components/bootstrap/dist/fonts/*.*'
// };

// == INJECT ==
// var sources = gulp.src([appPath.jquery + '/*.js', appPath.bootstrap + '/js/*.js', appPath.bootstrap + '/css/*css'],{read:false});
// gulp.task('inject', function() {
//     return gulp.src(appPath.html)
//     	.pipe(inject(sources))
//     	.pipe(gulp.dest('./app'));
// });

// == TRANSFER ==
// gulp.task('jquery', function() {
//     return gulp.src(bower.jquery)
//     	.pipe(gulp.dest(appPath.jquery));
// });

// gulp.task('bootstrap', function() {
//     return gulp.src(bower.bootstrap)
//     	.pipe(gulp.dest(appPath.bootstrap + '/css'));
// });

// gulp.task('bootstrapJs', function() {
//     return gulp.src(bower.bootstrapJs)
//     	.pipe(gulp.dest(appPath.bootstrap + '/js'));
// });

// gulp.task('bootstrapFonts', function() {
//     return gulp.src(bower.bootstrapFonts)
//     	.pipe(gulp.dest(appPath.bootstrap + '/fonts'));
// });

// gulp.task('transfer',['jquery', 'bootstrap', 'bootstrapJs', 'bootstrapFonts']);


// == COMPILE ==
// minification/concatination of lib files
gulp.task('style',function(){
    return gulp.src(srcPath.libCss)
		.pipe(plumber({
				handleError: function (err) {
            	console.log(err);
            	this.emit('end');
        	}
        }))
	    .pipe(concat('lib.min.css'))
	    .pipe(uglifycss())
	    .pipe(gulp.dest(appPath.libCss));
});

gulp.task('script',function(){
    return gulp.src(srcPath.libJs)
		.pipe(plumber({
				handleError: function (err) {
            	console.log(err);
            	this.emit('end');
        	}
        }))
	    .pipe(concat('lib.min.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest(appPath.libJs))
	    .pipe(notify('Libraries Compiled!'))
});

gulp.task('compile', ['style', 'script']);

// == COMPRESS ==
// image optimization
gulp.task('compress', function() {
	return gulp.src(srcPath.img)
		.pipe(plumber({
				handleError: function (err) {
            	console.log(err);
            	this.emit('end');
        	}
        }))
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5
		}))
		.pipe(clean())
		.pipe(gulp.dest(appPath.img))
		.pipe(notify('Images Optimized!'))
});

// == SCSS ==
// scss compiler
gulp.task('scss-minified', function() {
    return gulp.src(srcPath.scss)
		.pipe(plumber({
				handleError: function (err) {
            	console.log(err);
            	this.emit('end');
        	}
        }))
    	.pipe(sourcemaps.init())
      	.pipe(sass().on("error", notify.onError(function (error) {
               return "Error: " + error.message;
      	})))
    	.pipe(autoprefixer())
      	.pipe(uglifycss())
    	.pipe(rename('app.min.css'))
    	.pipe(sourcemaps.write('.'))
    	.pipe(gulp.dest(appPath.css))
    	.pipe(browserSync.stream())
});

gulp.task('scss-unminified', function() {
    return gulp.src(srcPath.scss)
      	.pipe(sass().on("error", notify.onError(function (error) {
           return "Error: " + error.message;
      	})))
      	.pipe(rename('app.css'))
    	.pipe(gulp.dest(appPath.css))
    	.pipe(browserSync.stream())
    	.pipe(notify({message: 'SCSS Compiled!', onlast: true}));
});

gulp.task('scss',['scss-minified', 'scss-unminified']);

// == JS ==
// js minification
gulp.task('js-minified', function() {
	return gulp.src(srcPath.js)
		.pipe(plumber({
				handleError: function (err) {
            	console.log(err);
            	this.emit('end');
        	}
        }))
		.pipe(uglify())
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest(appPath.js))
		.pipe(browserSync.stream());
});

gulp.task('js-unminified', function() {
	return gulp.src(srcPath.js)
		.pipe(rename('app.js'))
		.pipe(gulp.dest(appPath.js))
		.pipe(browserSync.stream())
    	.pipe(notify({message: 'Js Compiled!', onlast: true}));
});

gulp.task('js',['js-minified', 'js-unminified']);

gulp.task('initialize', function() {

	browserSync.init({
		server: "./app"
	});

    gulp.watch(srcPath.scss, ['scss']);
    gulp.watch(srcPath.js, ['js']);
    gulp.watch('./app/*').on('change', browserSync.reload);
});

gulp.task('default', ['initialize']);