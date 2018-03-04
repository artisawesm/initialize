'use strict';

let gulp 		= require('gulp'),
	browserSync = require('browser-sync').create(),
	webpack = require('webpack'),
	webpackStream = require('webpack-stream'),
	webpackConfig = require('./webpack.config.js');
	
let $ = require('gulp-load-plugins')({
		camelize: true,
		pattern: [
			'gulp-*',
			'gulp.*'
		],
		replaceString: /\bgulp[\-.]/
	});

let srcPath = { // sources
	img: 'resources/assets/images/**/*.{jpg,png,svg,gif}',
	js: 'resources/assets/js/*.js',
	scss: 'resources/assets/scss/**/*.scss',
	libCss: 'resources/assets/vendor/css/*.css',
	libJs: 'resources/assets/vendor/js/*.js'
};

let appPath = { // app destination
	css: 'app/assets/css/',
	img: 'app/assets/images',
	js: 'app/assets/js',
	libCss: 'app/assets/vendor/css/',
	libJs: 'app/assets/vendor/js/',
	html: 'app/*.html',
	php: 'app/*.php'
};

// For development with XAMPP
let curDir = 'localhost/'+__dirname.split('\\').pop('\\');

//==========================================================================
// EXTERNAL TASKS -> Tasks that doesn't need to be automated
//==========================================================================

// == FTP ==
//This task will transfer your local files to your live site via FTP
// var ftpHost = ''; //set your site's url
// var ftpUser = ''; //ftp username access
// var ftpPassword = ''; //ftp password access
// var ftpDestination = ''; //set the destination
// gulp.task('ftp', function () {
// 	var conn = ftp.create( {
// 		host:     ftpHost, 
// 		user:     ftpUser,
// 		password: ftpPassword,
// 		parallel: 10
// 	});

// 	var files = [ //files to upload
// 		'app/assets/css/**',
// 		'app/assets/js/**',
// 		'app/*.html'
// 	];

// 	return gulp.src(files, { base: '.', buffer: false })
// 		.pipe(conn.newer(ftpDestination))
// 		.pipe(conn.dest(ftpDestination))
// 		.pipe(notify({
//     		title: 'Deployment',
//     		message: 'Files were successfully uploaded to FTP',
//     		onLast: true
//     	}));
// });

// == PRODUCTION ==
gulp.task('scss-prod', ()=> {
    return gulp.src(srcPath.scss)
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
    	.pipe(gulp.dest(appPath.css))
    	.pipe(browserSync.stream())
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
			title: "JS|CSS",
			message: "Minified JS and CSS files are successfully generated.",
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
		.pipe($.clean())
		.pipe(gulp.dest(appPath.img))
		.pipe($.notify({
    		title: 'Images',
    		message: 'Images optimized!',
    		onLast: true
    	}));
});
//==========================================================================
//==========================================================================

//==========================================================================
// AUTOMATED TASKS 
//==========================================================================
// == SCSS ==
// scss compiler - Unminified by default
gulp.task('scss', ()=> {
    return gulp.src(srcPath.scss)
    	.pipe($.sourcemaps.init())
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
    		message: 'JS files compiled!',
    		onLast: true
    	}));
});

// For development with server (XAMPP/PHP)
gulp.task("serve", ()=> {

	// Will dynamically add an index.php file
	gulp.src('./'+appPath.html)
		.pipe($.rename('index.php'))
		.pipe(gulp.dest('./app'));

	browserSync.init({
		proxy: curDir+'/app/'
	});
	gulp.watch(srcPath.scss, ["scss"]); //Unminified by default
	gulp.watch(srcPath.js, ["js"]); //Unminified by default
	gulp.watch('./'+appPath.php).on("change", browserSync.reload);
});

// For static HTML front end development (HTML)
gulp.task('initialize', ()=> {

	browserSync.init({
		server: {
			baseDir: './app',
		},
	});
    gulp.watch(srcPath.scss, ['scss']); //Unminified by default
	gulp.watch(srcPath.js, ['js']); //Unminified by default
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

// For development
gulp.task('development', ['initialize']);