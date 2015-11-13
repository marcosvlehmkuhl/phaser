var gulp = require('gulp');
var browserSync = require('browser-sync');
var sequence = require('run-sequence');

gulp.task('dev', function(){
	sequence('clean', ['scripts']);
});