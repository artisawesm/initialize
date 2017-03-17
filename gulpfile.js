var gulp = require('gulp');
var concat = require('gulp-concat');

var path = {
	jsLib: './src/assets/script/lib/*.js'
};

gulp.task('initialize', function() {

	return gulp.src(path.jsLib)
	.pipe(concat('lib.min.js'))
	.pipe(gulp.dest('./dist/assets/script/lib'));

});