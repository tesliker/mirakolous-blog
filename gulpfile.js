var gulp = require('gulp')

gulp.task('movepublic', function() {
  gulp.src('./public/**/*')
    .pipe(gulp.dest('./docs'));
});
