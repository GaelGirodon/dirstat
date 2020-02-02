/*
 * gulpfile.js
 */

const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

sass.compiler = require('node-sass');

// Paths
const src = './assets/';
const dest = './web/';

// Styles
function styles() {
    return gulp.src(src + 'sass/dirstat.scss')
        .pipe(concat('dirstat.min.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({level: {1: {specialComments: false}}}))
        .pipe(gulp.dest(dest));
}

// Scripts
function scripts() {
    const scripts = [
        './node_modules/vue/dist/vue.min.js',
        './node_modules/vue-resource/dist/vue-resource.min.js',
        src + 'js/lib/*.js',
        src + 'js/*.js'
    ];
    return gulp.src(scripts)
        .pipe(concat('dirstat.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dest))
}

// Tasks
exports.default = gulp.series(styles, scripts);
exports.styles = styles;
exports.scripts = scripts;
