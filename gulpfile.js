'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
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

var srcPath = {
	// sources
	scss: './src/assets/scss/**/*.scss',
	js: './src/assets/js/*.js',
	img: './src/assets/images/*',
	libCss: './src/lib/css/*.css',
	libJs: './src/lib/js/*.js'
};

var appPath = {
	// app
	css: './app/assets/css/',
	js: './app/assets/js/',
	img: './app/assets/images/',
	libCss: './app/lib/css/',
	libJs: './app/lib/js/'
};

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
	    .pipe(uglifycss())
	    .pipe(concat('lib.min.css'))
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
	    .pipe(uglify())
	    .pipe(concat('lib.min.js'))
	    .pipe(gulp.dest(appPath.libJs));
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
		.pipe(gulp.dest(appPath.img));
});

// == SCSS ==
// scss compiler
gulp.task('scss', function() {
    return gulp.src(srcPath.scss)
		.pipe(plumber({
				handleError: function (err) {
            	console.log(err);
            	this.emit('end');
        	}
        }))
    	.pipe(sourcemaps.init())
    	.pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    	.pipe(rename('app.min.css'))
    	.pipe(sourcemaps.write('.'))
    	.pipe(gulp.dest(appPath.css))
    	.pipe(browserSync.stream());
});

// == JS ==
// js minification
gulp.task('js', function() {
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

gulp.task('initialize', function() {

	browserSync.init({
		server: "./app"
	});

    gulp.watch(srcPath.scss, ['scss']);
    gulp.watch(srcPath.js, ['js']);
    gulp.watch('./app/*').on('change', browserSync.reload);
});

gulp.task('default', ['initialize']);