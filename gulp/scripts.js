var gulp = require('gulp');
var browserify = require('gulp-browserify');
var gutil = require('gulp-util');

var files = ['main2', 'phaser.min'];

gulp.task('scripts', function(){
		files.forEach(function(file){
			var stream = gulp.src('./src/js/' + file + '.js');
				if(file == 'main2') {
					stream = stream.pipe(browserify())
				}
				stream.pipe(gulp.dest('./dist/assets/js'));
		});			
});