const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const paths = require('./paths');
const path = require('path');
// const through2 = require('through2');
const rimraf = require('rimraf');
const ts = require('gulp-typescript');
const tsConfig = require('./getTsConfig')();
const babelConfig = require('./getBabelConfig');
// console.log(tsConfig)
const tsDefaultReporter = ts.reporter.defaultReporter();
const esDir = paths.es();
const libDir = paths.lib();

function clear(es) {
    const distDir = es === true ? esDir : libDir;
    return function (cb) {
        rimraf.sync(distDir);
        cb();
    }
}

function compileLess(es) {
    const distDir = es === true ? esDir : libDir;
    return function () {
        // rimraf.sync(distDir);
        return gulp.src([
            paths.src('components/**/*.less'),
            `!${paths.src('components/style/*/**/*')}`
        ])
            .pipe(less({
                relativeUrls: true,
                // paths: [path.resolve(__dirname,'../src/components/style/')],
                javascriptEnabled: true,
                ieCompat: true
            }))
            .pipe(gulp.dest(distDir));
    }
}

function compileTs(es) {
    const distDir = es === true ? esDir : libDir;
    return function () {
        return gulp.src([
            paths.src('components/**/*.ts'),
            paths.src('components/**/*.tsx'),
            paths.src('components/**/*.js'),
            paths.src('components/**/*.jsx'),
        ]).pipe(ts(tsConfig, {
            error(e) {
                tsDefaultReporter.error(e);
                error = 1;
            },
            finish: tsDefaultReporter.finish,
        })).pipe(gulp.dest(distDir));
    }
}

function compileEsToJs() {
    return gulp.src([
        paths.es('**/*.js'),
    ])
        .pipe(babel(babelConfig('commonjs')))
        .pipe(gulp.dest(libDir));
}

function syncCssFromEs(){
    return gulp.src([
        paths.es('**/*.css'),
    ])
        .pipe(gulp.dest(libDir));
}

gulp.task('compileLess', () => {
    return compileLess()
});

gulp.task('compileTs', () => {
    return compileTs()
});

gulp.task('compileEs', gulp.series([clear(true), compileLess(true), compileTs(true)]))

gulp.task('compileLib', gulp.series([clear(false), compileEsToJs,syncCssFromEs]))

gulp.task('defaultTask',gulp.series(['compileEs']));
// gulp.task('defaultTask',gulp.series(['compileEs','compileLib']));

// gulp.task('defaultTask', gulp.series(['compileLib']));

const defaulTask = gulp.task('defaultTask');
defaulTask();

