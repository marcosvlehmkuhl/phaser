var gulp = require('gulp');

gulp.task('watch', ['scripts'], function(){
	gulp.watch('src/js/**/*.js', ['scripts']);
});