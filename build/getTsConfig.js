
const paths = require('./paths');
// const fs = require('fs');
const tsConfig = require(paths.tsConfig());

module.exports = function getTsConfig() {
    return Object.assign(
        {
            noUnusedParameters: true,
            noUnusedLocals: true,
            strictNullChecks: true,
            target: 'es6',
            jsx: 'preserve',
            moduleResolution: 'node',
            declaration: true,
            allowSyntheticDefaultImports: true,
        },
        tsConfig.compilerOptions
    );
};