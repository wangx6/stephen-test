(function() {
    'use strict';

    var gulp = require('gulp');
    var sass = require('gulp-sass');
    var indexScssPath = './dev/style/module/index.scss';

    gulp.task('sass', function() {
        return gulp.src(indexScssPath)
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./public/css'));
    });


	gulp.task('sass:watch', function() {
        gulp.watch(indexScssPath, ['sass']);
    });

	gulp.task('default', ['sass:watch', 'sass']);

})();