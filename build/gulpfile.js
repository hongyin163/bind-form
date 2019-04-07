const gulp = require('gulp');
const less = require('gulp-less');
const paths = require('./paths');
const path = require('path');
// const through2 = require('through2');
// const ts = require('gulp-typescript');

const esDir = paths.es();
const libDir = paths.lib();


function compile(es) {
    const distDir = es === true ? esDir : libDir;
    console.log(distDir);
    return gulp.src([paths.src('components/*/**.less')])
        .pipe(less({
            paths: [path.resolve(__dirname,'../src/components/')]
        }))
        .pipe(gulp.dest(paths.lib()));

}


gulp.task('compile', (cb) => {
    compile(true);
    cb();
});