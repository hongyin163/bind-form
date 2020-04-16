module.exports = function (api) {
    api.cache(true);

    const presets = [
        ["@babel/preset-env",{
            targets:{
                browsers:'last 2 versions,ie >= 9'
            },
            modules:false,
        }],
        "@babel/preset-react",
        "@babel/preset-typescript"
    ];
    const plugins = [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-async-to-generator",
        "@babel/plugin-transform-object-assign",
        [
            "babel-plugin-import",
            {
                "libraryName": "biz-ux",
                "style": true
            },
            "biz-ux"
        ]
    ];

    return {
        presets,
        plugins
    };
}
