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

	gulp.watch(indexScssPath, ['sass']);

})();