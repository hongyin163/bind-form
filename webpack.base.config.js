let path = require('path');
let webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = function (options) {
    let {
        cdn,
        dist,
        root,
        src
    } = options;
    let publicPath = `${cdn}`;
    let distPath = path.resolve(root, dist);
    let def = {
        mode: 'development',
        entry: {
            'props-editor': path.resolve(root, src, 'props-editor', 'index.js'),
        },
        output: {
            path: distPath,
            filename: '[name].js',
            chunkFilename: '[name].chunk.js',
            publicPath: publicPath,
            library: 'PropsEditor',
            libraryTarget: 'commonjs2'
        },
        module: {
            rules: [
                // or any other compile-to-css language
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                // you can specify a publicPath here
                                // by default it use publicPath in webpackOptions.output
                                publicPath
                            }
                        },
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        }, {
                            loader: 'less-loader',
                            options: {
                                modifyVars: {
                                    '@primary-color': '#FB7055',
                                    '@border-radius-base': 0,
                                    '@border-radius-sm ': 0
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                // you can specify a publicPath here
                                // by default it use publicPath in webpackOptions.output
                                publicPath
                            }
                        },
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader'
                        }
                    ]
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                            name: 'img/[path][name].[ext]'
                        }
                    }]
                },
                {
                    test: /\.(eot|svg|ttf|woff)\??.*$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                            name: 'iconfont/[name].[ext]'
                        }
                    }]
                }
            ]

        },
        node: {
            // Mock Node.js modules that Babel require()s but that we don't
            // particularly care about.
            fs: 'empty',
            module: 'empty',
            net: 'empty'
        },
        // postcss: [autoprefixer({ browsers: ['> 1%', 'IE >= 7'] })],
        externals: [
            {
                'react': 'React',
                'react-dom': 'ReactDOM',
                'react-redux': 'ReactRedux',
                'redux': 'Redux',
                'immutable': 'Immutable',
                'jquery': 'jQuery',
                'esprima-fb': 'esprima',
                'draft-js': 'Draft',
                'lodash': {
                    commonjs: 'lodash',
                    amd: 'lodash',
                    root: '_' // indicates global variable
                },
                'bondjs': 'bondjs',
                'react-router-dom': {
                    commonjs: 'react-router-dom',
                    amd: 'react-router-dom',
                    root: 'ReactRouterDOM' // indicates global variable
                },
                'prop-types': {
                    commonjs: 'prop-types',
                    amd: 'prop-types',
                    root: 'PropTypes' // indicates global variable
                },
                'tinycolor2': {
                    commonjs: 'tinycolor2',
                    amd: 'tinycolor2',
                    root: 'tinycolor2' // indicates global variable
                },
                'SketchPicker': {
                    commonjs: 'SketchPicker',
                    amd: 'SketchPicker',
                    root: 'ReactRouterDOM' // indicates global variable
                },
                'react-color': {
                    commonjs: 'react-color',
                    amd: 'react-color',
                    root: 'reactColor' // indicates global variable
                },
                'axios': {
                    commonjs: 'axios'
                },
                'add-dom-event-listener': {
                    commonjs: 'add-dom-event-listener'
                },
                'glamor': {
                    commonjs: 'glamor'
                }
            },
            // /^antd/,
            /^jssha/,
            function (context, request, callback) {
                if (/antd/.test(request)) {
                    return callback(null, 'commonjs ' + request);
                }
                callback();
            }
        ],
        cache: true,
        resolve: {
            modules: [
                'node_modules',
                path.resolve(root, 'src')
            ],
            alias: {
                '@': path.resolve(root, './src'),
            },
            extensions: ['.json', '.js', '.jsx']
        },
        plugins: [
            // new webpack.IgnorePlugin({
            //     resourceRegExp: /^\.\/locale$/,
            //     contextRegExp: /moment$/
            // }),

        ]
    };
    return def;
};