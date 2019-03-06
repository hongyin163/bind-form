import es6Promise from 'es6-promise';
es6Promise.polyfill();
// require('isomorphic-fetch');
// var fetchJsonp = require('fetch-jsonp')
// import fetchJsonp from 'fetch-jsonp';
import http from './http';

/**
 * ie下使用jsonp方案
 */
// var oldFetch = window.fetch;
// window.fetch = function (url, option) {
//     if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
//         return fetchJsonp(url, option);
//     }
//     return oldFetch(url, option);
// }

if (!window.jQuery) {
    window.jQuery = {};
}

window.http = http;