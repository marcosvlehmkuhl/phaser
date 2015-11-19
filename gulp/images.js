var gulp = require('gulp');

gulp.task('images', function(){
	return gulp.src('./src/images/*')
		.pipe(gulp.dest('./dist/assets/images'));
});