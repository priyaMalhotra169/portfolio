var gulp = require('gulp');

var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');


gulp.task('css', function () {
    gulp.src('raw-css/style.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('css'))
});