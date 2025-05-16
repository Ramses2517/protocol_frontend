const webpack = require('webpack');

module.exports = function override(config) {
    // Add polyfills for Node.js API
    config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert/'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        process: require.resolve('process/browser.js'),
    };

    // Add plugins for defining global variables
    config.plugins.push(
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser.js',
        })
    );

    // Solution for issues with ESM modules
    config.module.rules.push({
        test: /\.m?js/,
        resolve: {
            fullySpecified: false
        }
    });

    // Отключаем предупреждения source-map-loader
    config.ignoreWarnings = [
        {
            module: /@tonconnect\/sdk/,
        },
        /Failed to parse source map/
    ];

    return config;
}; 