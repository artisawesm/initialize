const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const beautify = require('gulp-beautify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');

const srcPath = {
	// sources
	scss: './src/assets/scss/**/*.scss',
	js: './src/assets/js/*.js',
	image: './src/assets/images/*',
	libCss: './src/lib/css/*.css',
	libJs: './src/lib/js/*.js'
};

const distPath = {
	// app
	libCss: './app/assets/css/lib',
	libJs: './app/assets/js/lib'
};

// == COMPILE ==
// minification and concatination of lib files
gulp.task('style', function() {
	return gulp.src(srcPath.libCss)
		.pipe(uglifycss())
		.pipe(concat('lib.min.css'))
		.pipe(gulp.dest(distPath.libCss));
});

gulp.task('script', function() {
	return gulp.src(srcPath.libJs)
		.pipe(uglify())
		.pipe(concat('lib.min.js'))
		.pipe(gulp.dest(distPath.libJs));
});

gulp.task('compile', ['style'], ['script']);

