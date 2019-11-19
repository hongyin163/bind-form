const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const paths = require('./paths');
// const path = require('path');
// const through2 = require('through2');
const rimraf = require('rimraf');
const ts = require('gulp-typescript');
const tsConfig = require('./getTsConfig')();
const babelConfig = require('./getBabelConfig');
// console.log(tsConfig)
const tsDefaultReporter = ts.reporter.defaultReporter();
// const nullReporter = ts.reporter.nullReporter();
const esDir = paths.es();
const libDir = paths.lib();
const tmpDir = paths.tmp();

function clear(es) {
    const distDir = es === true ? esDir : libDir;
    return function (cb) {
        rimraf.sync(distDir);
        cb();
    };
}

function compileLess(es) {
    const distDir = es === true ? esDir : libDir;
    return function () {
        // rimraf.sync(distDir);
        return gulp.src([
            paths.src('*/style/index.less'),
            paths.src('style/index.less'),
            `!${paths.src('style/*/**/*')}`
        ])
            .pipe(less({
                relativeUrls: true,
                // paths: [path.resolve(__dirname,'../src/components/style/')],
                javascriptEnabled: true,
                ieCompat: true
            }))
            .pipe(gulp.dest(distDir));
    };
}

function compileTsToEs(es) {
    const distDir = es === true ? esDir : libDir;
    // const modules = es === true ? false : 'commonjs';
    return function () {
        return gulp.src([
            // paths.src('button/*.ts'),
            // paths.src('button/*.tsx'),
            paths.src('**/*.ts'),
            paths.src('**/*.tsx'),
            paths.src('**/*.js'),
            paths.src('**/*.jsx'),
            `!${paths.src('*/__test__')}`,
            `!${paths.src('style/**/*')}`,
            `!${paths.src('*/demo/**/*')}`,
            `!${paths.src('node_modules/**/*')}`,
        ]).pipe(ts(tsConfig, {
            error(e) {
                tsDefaultReporter.error(e);
                // error = 1;
            },
            finish: tsDefaultReporter.finish,
        }))
            .pipe(gulp.dest(distDir))
    };
}

function compileEsToJs(es) {
    const distDir = es === true ? esDir : libDir;
    const modules = es === true ? false : 'commonjs';
    return function () {
        return gulp.src([
            paths.base(`${distDir}/**/*.js`),
        ])
            .pipe(babel(babelConfig(modules)))
            .pipe(gulp.dest(distDir));
    }
}


function syncLess(es) {
    const distDir = es === true ? esDir : libDir;
    return function(){
        return gulp.src([
            paths.src('**/*.less'),
        ]).pipe(gulp.dest(distDir));
    }
}

function syncStaticFile(es) {
    const distDir = es === true ? esDir : libDir;
    return function () {
        return gulp.src([
            paths.src('**/*.@(png|jpg|jpeg|gif|svg)'),
            paths.src('**/fonts/*'),
        ])
            .pipe(gulp.dest(distDir));
    }
}


gulp.task('compileEs', gulp.series([clear(true), compileLess(true),syncLess(true), compileTsToEs(true), compileEsToJs(true), syncStaticFile(true)]));

gulp.task('compileLib', gulp.series([clear(false), compileLess(false),syncLess(false), compileTsToEs(false), compileEsToJs(false), syncStaticFile(false)]));


gulp.task('default', gulp.series(['compileEs', 'compileLib']));


// gulp.task('default', gulp.series([compileTsToEs(true), compileEsToJs(true)]));
