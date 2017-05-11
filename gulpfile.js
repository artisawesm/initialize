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
var notify = require('gulp-notify');
var inject = require('gulp-inject');

var srcPath = {
	// sources
	scss: './resources/assets/scss/**/*.scss',
	js: './resources/assets/js/*.js',
	img: './resources/assets/images/*',
	libCss: './resources/lib/css/*.css',
	libJs: './resources/lib/js/*.js'
};

var appPath = {
	// app
	css: './app/assets/css',
	js: './app/assets/js',
	img: './app/assets/images',
	fonts: './app/assets/fonts',
	libCss: './app/lib/vendor/css',
	libJs: './app/lib/vendor/js/',
	html: './app/index.html',
	//lib
	bootstrap: './app/lib/bootstrap',
	jquery: './app/lib/jquery'
};

var bower = {
	jquery: './bower_components/jquery/dist/jquery.min.js',
	bootstrap: './bower_components/bootstrap/dist/css/bootstrap.min.css',
	bootstrapJs: './bower_components/bootstrap/dist/js/bootstrap.min.js',
	bootstrapFonts: './bower_components/bootstrap/dist/fonts/*.*'
};

// == TRANSFER ==
gulp.task('jquery', function() {
    return gulp.src(bower.jquery)
    	.pipe(gulp.dest(appPath.jquery));
});

gulp.task('bootstrap', function() {
    return gulp.src(bower.bootstrap)
    	.pipe(gulp.dest(appPath.bootstrap + '/css'));
});

gulp.task('bootstrapJs', function() {
    return gulp.src(bower.bootstrapJs)
    	.pipe(gulp.dest(appPath.bootstrap + '/js'));
});

gulp.task('bootstrapFonts', function() {
    return gulp.src(bower.bootstrapFonts)
    	.pipe(gulp.dest(appPath.bootstrap + '/fonts'));
});

gulp.task('transfer',['jquery', 'bootstrap', 'bootstrapJs', 'bootstrapFonts']);

// == INJECT ==
// var sources = gulp.src([appPath.jquery + '/*.js', appPath.bootstrap + '/js/*.js', appPath.bootstrap + '/css/*css'],{read:false});
// gulp.task('inject', function() {
//     return gulp.src(appPath.html)
//     	.pipe(inject(sources))
//     	.pipe(gulp.dest('./app'));
// });

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
	    .pipe(notify('Compiled!'))
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
		.pipe(gulp.dest(appPath.img))
		.pipe(notify('Optimized!'))
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
      	.pipe(sass({
      		outputStyle: 'compressed'
        })
        .on("error", notify.onError(function (error) {
               return "Error: " + error.message;
      	})))
    	.pipe(rename('app.min.css'))
    	.pipe(sourcemaps.write('.'))
    	.pipe(gulp.dest(appPath.css))
    	.pipe(browserSync.stream())
    	.pipe(notify('SCSS compiled!'));
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
		.pipe(notify('JS files minified!'))
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