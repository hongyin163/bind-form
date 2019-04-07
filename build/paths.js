const path = require('path');
const dirname = __dirname;

function resolve(...args) {
    console.log(args);
    return path.resolve(dirname, '..', ...args);
}

module.exports = {
    src(dir = '') {
        return resolve('src', dir);
    },
    lib(dir = '') {
        return resolve('lib', dir);
    },
    dist(dir = '') {
        return resolve('dist', dir);
    },
    es(dir = '') {
        return resolve('es', dir);
    },
};
