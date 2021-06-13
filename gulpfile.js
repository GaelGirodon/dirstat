/*
 * gulpfile.js
 */

const gulp = require("gulp");
const gulpIf = require("gulp-if");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

// Paths
const src = "./assets/";
const dest = "./web/";

// Styles
function styles() {
    const styles = [
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        `${src}/css/dirstat.css`
    ];
    return gulp.src(styles)
        .pipe(concat("dirstat.min.css"))
        .pipe(cleanCSS({level: {1: {specialComments: false}}}))
        .pipe(gulp.dest(dest));
}

// Scripts
function scripts() {
    const scripts = [
        "./node_modules/vue/dist/vue.min.js",
        "./node_modules/axios/dist/axios.min.js",
        `${src}/js/lib/*.min.js`,
        `${src}/js/*.js`
    ];
    return gulp.src(scripts)
        .pipe(gulpIf(f => !f.path.includes(".min."), uglify()))
        .pipe(concat("dirstat.min.js"))
        .pipe(gulp.dest(dest))
}

// Tasks
exports.default = gulp.series(styles, scripts);
exports.styles = styles;
exports.scripts = scripts;
