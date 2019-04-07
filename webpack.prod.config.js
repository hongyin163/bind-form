let webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let webpackBase = require('./webpack.base.config');
let webpackMerge = require('webpack-merge');
let options = {
    cdn: '',
    dist: 'dist',
    root: __dirname,
    src: './src'
}
var config = webpackMerge(webpackBase(options), {
    // mode: 'production',
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             styles: {
    //                 name: 'styles',
    //                 test: /\.less$|\.css$/,
    //                 chunks: 'all',
    //                 enforce: true
    //             }
    //         }
    //     }
    // },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new BundleAnalyzerPlugin({
            analyzerPort: 9999
        })
    ],
    devtool: 'none'
});

module.exports = config;