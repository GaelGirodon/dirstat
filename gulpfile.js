/*
 * gulpfile.js
 */

var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

sass.compiler = require('node-sass');

// Paths
var src = './assets/';
var dest = './web/';

// Styles
gulp.task('sass', function () {
    return gulp.src(src + 'sass/dirstat.scss')
        .pipe(concat('dirstat.min.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({level: {1: {specialComments: false}}}))
        .pipe(gulp.dest(dest));
});

// Scripts
gulp.task('js', function () {
    var scripts = [
        './node_modules/vue/dist/vue.min.js',
        './node_modules/vue-resource/dist/vue-resource.min.js',
        src + 'js/lib/*.js',
        src + 'js/*.js'
    ];
    return gulp.src(scripts)
        .pipe(concat('dirstat.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dest))
});

// Default task
gulp.task('default', ['sass', 'js']);
