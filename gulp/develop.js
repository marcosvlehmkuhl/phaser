var gulp = require('gulp');
var sequence = require('run-sequence');

gulp.task('dev', function(){
	sequence('clean', ['build','browser-sync', 'watch']);
});