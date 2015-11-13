var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('scripts', function(){
	return gulp.src('./src/js/main.js')
		.pipe(browserify())
		.pipe(gulp.dest('./dist/assets/js'));
});